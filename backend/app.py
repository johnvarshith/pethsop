from fastapi import FastAPI, Request, Response, Depends, HTTPException, status, Cookie
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pymongo import MongoClient
from bcrypt import hashpw, gensalt, checkpw
import os
import datetime
import jwt
import math
from dotenv import load_dotenv
from bson import ObjectId
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
import google.generativeai as genai

load_dotenv()

app = FastAPI(title="PawPal API")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

JWT_SECRET_KEY = os.getenv("SECRET_KEY", "super-secret-jwt-key-123")
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
client = MongoClient(MONGO_URI)
db = client[os.getenv("DB_NAME", "pawpal_db")]
users_collection = db['users']
pets_collection = db['pets']
products_collection = db['products']
appointments_collection = db['appointments']
orders_collection = db['orders']

# Models
class UserSignup(BaseModel):
    firstName: str = Field(min_length=2, max_length=50)
    secondName: str = Field(min_length=2, max_length=50)
    username: str = Field(min_length=3, max_length=30)
    password: str = Field(min_length=6)

class UserLogin(BaseModel):
    username: str
    password: str

class MatchmakerAnswers(BaseModel):
    answers: str

class ChatMessage(BaseModel):
    message: str

class AppointmentReq(BaseModel):
    serviceType: str
    date: str
    time: str
    petName: str
    petType: str
    notes: Optional[str] = None

# Helpers
def serialize(doc):
    if not doc: return None
    doc['id'] = str(doc.pop('_id'))
    return doc

def serialize_list(docs):
    return [serialize(doc) for doc in docs]

async def get_current_user(pawpal_jwt: Optional[str] = Cookie(None)):
    if not pawpal_jwt:
        raise HTTPException(status_code=401, detail="Token is missing!")
    try:
        data = jwt.decode(pawpal_jwt, JWT_SECRET_KEY, algorithms=["HS256"])
        user = users_collection.find_one({'_id': ObjectId(data['user_id'])})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Token is invalid! {str(e)}")

async def get_admin_user(current_user: dict = Depends(get_current_user)):
    if current_user.get('role') != 'admin':
        raise HTTPException(status_code=403, detail="Admin access required!")
    return current_user

# Auth
@app.post('/api/login')
def login(user_data: UserLogin, response: Response):
    user = users_collection.find_one({'username': user_data.username})
    if not user:
        return JSONResponse(status_code=401, content={"success": False, "message": "Invalid credentials"})
        
    stored_hash = user['password'].encode('utf-8')
    input_password = user_data.password.encode('utf-8')
    
    if not checkpw(input_password, stored_hash):
        return JSONResponse(status_code=401, content={"success": False, "message": "Invalid credentials"})
        
    token = jwt.encode({
        'user_id': str(user['_id']),
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }, JWT_SECRET_KEY, algorithm="HS256")
    
    response.set_cookie('pawpal_jwt', token, httponly=True, samesite='lax')
    return {
        "success": True,
        "user": {
            "first_name": user.get('first_name'),
            "second_name": user.get('second_name'),
            "username": user.get('username'),
            "role": user.get('role', 'customer')
        }
    }

@app.post('/api/signup')
def signup(user_data: UserSignup):
    if users_collection.find_one({'username': user_data.username}):
        return JSONResponse(status_code=409, content={"success": False, "message": "Username already exists"})
        
    hashed_pw = hashpw(user_data.password.encode('utf-8'), gensalt()).decode('utf-8')
    
    users_collection.insert_one({
        'first_name': user_data.firstName,
        'second_name': user_data.secondName,
        'username': user_data.username,
        'password': hashed_pw,
        'role': 'customer'
    })
    return {"success": True}

@app.get('/api/user')
def get_user(current_user: dict = Depends(get_current_user)):
    return {
        "first_name": current_user.get('first_name'),
        "second_name": current_user.get('second_name'),
        "username": current_user.get('username'),
        "role": current_user.get('role', 'customer')
    }

@app.post('/logout') 
@app.post('/api/logout')
def logout(response: Response):
    response.delete_cookie('pawpal_jwt')
    return {"success": True}

# Products
@app.get('/api/products')
def get_products(page: int = 1, limit: int = 12, search: str = '', category: str = ''):
    query = {}
    if search:
        query['name'] = {'$regex': search, '$options': 'i'}
    if category and category != 'All':
        query['category'] = category
        
    total = products_collection.count_documents(query)
    products = list(products_collection.find(query).skip((page-1)*limit).limit(limit))
    
    return {
        'products': serialize_list(products),
        'total': total,
        'page': page,
        'pages': math.ceil(total / limit) if limit else 1
    }

# Pets
@app.get('/api/pets')
def get_pets(page: int = 1, limit: int = 12, search: str = '', species: str = ''):
    query = {}
    if search:
        query['$or'] = [
            {'name': {'$regex': search, '$options': 'i'}},
            {'breed': {'$regex': search, '$options': 'i'}}
        ]
    if species and species != 'All':
        query['species'] = species
        
    total = pets_collection.count_documents(query)
    pets = list(pets_collection.find(query).skip((page-1)*limit).limit(limit))
    
    return {
        'pets': serialize_list(pets),
        'total': total,
        'page': page,
        'pages': math.ceil(total / limit) if limit else 1
    }

@app.post('/api/pets/{pet_id}/favorite')
def favorite_pet(pet_id: str, current_user: dict = Depends(get_current_user)):
    return {"success": True}

# Appointments
@app.get('/api/appointments')
def get_appointments(current_user: dict = Depends(get_current_user)):
    user_appointments = list(appointments_collection.find({'user_id': str(current_user['_id'])}).sort('date', 1))
    return serialize_list(user_appointments)

@app.post('/api/appointments')
def create_appointment(data: AppointmentReq, current_user: dict = Depends(get_current_user)):
    new_appointment = {
        'user_id': str(current_user['_id']),
        'serviceType': data.serviceType,
        'date': data.date,
        'time': data.time,
        'petName': data.petName,
        'petType': data.petType,
        'notes': data.notes,
        'status': 'Upcoming',
        'created_at': datetime.datetime.utcnow()
    }
    appointments_collection.insert_one(new_appointment)
    return {"success": True}

# Admin
@app.get('/api/admin/stats')
def admin_stats(admin_user: dict = Depends(get_admin_user)):
    return {
        "revenue": 45231,
        "users": users_collection.count_documents({}),
        "orders": orders_collection.count_documents({}),
        "pets": pets_collection.count_documents({})
    }

# AI
@app.post('/api/matchmaker')
def matchmaker(data: MatchmakerAnswers):
    try:
        api_key = os.getenv('GEMINI_API_KEY')
        if not api_key:
            return JSONResponse(status_code=503, content={'success': False, 'message': 'Matchmaker logic requires an active Gemini API Key.'})
            
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-pro')
        
        system_prompt = """
        You are PawPal's expert pet matchmaker AI. 
        The user has filled out a lifestyle questionnaire. 
        Based on their answers, recommend exactly 1 pet breed/type that fits them best. 
        Then, write a customized, highly engaging, empathetic 3-sentence paragraph explaining *why* they match perfectly and giving a premium care tip.
        Format your response EXACTLY as a JSON string with the keys:
        - "recommendation": "The specific breed/pet name"
        - "description": "Your customized 3-sentence paragraph"
        """
        
        prompt = f"{system_prompt}\n\nUser's Questionnaire Answers:\n{data.answers}"
        response = model.generate_content(prompt)
        
        import json
        clean_text = response.text.replace("```json", "").replace("```", "").strip()
        result = json.loads(clean_text)
        
        return {'success': True, 'data': result}
    except Exception as e:
        # Smart Fallback if API fails
        fallback_pet = "Golden Retriever" if "Dog" in data.answers else "Persian Cat" if "Cat" in data.answers else "Holland Lop Rabbit"
        fallback_desc = f"Based on your answers, a {fallback_pet} seems like a wonderful match for your lifestyle! They are incredibly affectionate and adaptable. Premium Care Tip: Always ensure they have a comfortable, dedicated resting space to feel secure in their new home."
        return {'success': True, 'data': {'recommendation': fallback_pet, 'description': fallback_desc}, 'error': str(e)}

@app.post('/api/chat')
def chat(data: ChatMessage):
    user_message = data.message.lower()
    api_key = os.getenv('GEMINI_API_KEY')
    if api_key:
        try:
            genai.configure(api_key=api_key)
            model = genai.GenerativeModel('gemini-pro')
            system_prompt = "You are a friendly and helpful AI assistant for PawPal, a premium pet shop. Keep responses concise, warm, and helpful."
            response = model.generate_content(f"{system_prompt}\n\nUser: {user_message}", safety_settings=[
                {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_NONE"}
            ])
            return {'reply': response.text}
        except Exception:
            pass

    return {'reply': "That's a great question! I'm here to help, but please ensure my API is fully connected."}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 5000))
    uvicorn.run("app:app", host="0.0.0.0", port=port, reload=True)