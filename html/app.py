from flask import Flask, request, jsonify, send_from_directory, redirect, make_response
from pymongo import MongoClient
from bcrypt import hashpw, gensalt, checkpw
import os
import datetime
import jwt
from dotenv import load_dotenv
from bson import ObjectId
from flask_cors import CORS
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
import google.generativeai as genai

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__,
           template_folder='.',
           static_folder='.',
           static_url_path='')

# Set secret key for JWT management
app.config['JWT_SECRET_KEY'] = os.getenv("SECRET_KEY", "super-secret-jwt-key-123")

# Pydantic Models for Data Validation (Suggestion 4)
class UserSchema(BaseModel):
    first_name: str = Field(min_length=2, max_length=50)
    second_name: str = Field(min_length=2, max_length=50)
    username: str = Field(min_length=3, max_length=30)
    password: str = Field(min_length=6)

# JWT Authentication Decorator
from functools import wraps

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.cookies.get('pawpal_jwt')
        if not token:
            return jsonify({'error': 'Token is missing!'}), 401
        try:
            data = jwt.decode(token, app.config['JWT_SECRET_KEY'], algorithms=["HS256"])
            current_user = users_collection.find_one({'_id': ObjectId(data['user_id'])})
        except Exception as e:
            return jsonify({'error': 'Token is invalid!', 'details': str(e)}), 401
        return f(current_user, *args, **kwargs)
    return decorated

# CORS configuration
CORS(app, supports_credentials=True, resources={r"/api/*": {"origins": "*"}})

# MongoDB configuration
client = MongoClient(os.getenv("MONGO_URI", "mongodb://localhost:27017/"))
db = client[os.getenv("DB_NAME", "pawpal_db")]
users_collection = db['users']

# Routes
@app.route('/')
def home():
    return redirect('/login.html')

@app.route('/<path:filename>')
def serve_file(filename):
    if filename.endswith('.html'):
        return send_from_directory('.', filename)
    return send_from_directory('.', filename)

# API Endpoints
@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.json
        user = users_collection.find_one({'username': data['username']})

        if not user:
            return jsonify({"success": False, "message": "Invalid credentials"}), 401

        # Convert stored string to bytes
        stored_hash = user['password'].encode('utf-8')  # 👈 Encode to bytes
        input_password = data['password'].encode('utf-8')

        if not checkpw(input_password, stored_hash):
            return jsonify({"success": False, "message": "Invalid credentials"}), 401

        # Generate JWT Token (Suggestion 4)
        token = jwt.encode({
            'user_id': str(user['_id']),
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, app.config['JWT_SECRET_KEY'], algorithm="HS256")

        resp = make_response(jsonify({
            "success": True,
            "redirect": "/pet.html",
            "user": {
                "first_name": user['first_name'],
                "second_name": user['second_name'],
                "username": user['username']
            }
        }))
        # Set JWT in HttpOnly Cookie for Secure auth
        resp.set_cookie('pawpal_jwt', token, httponly=True, samesite='Lax')
        return resp

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/api/signup', methods=['POST'])
def signup():
    try:
        data = request.json
        # Validate using Pydantic (Suggestion 4)
        try:
            user_data = UserSchema(
                first_name=data.get('firstName', ''),
                second_name=data.get('secondName', ''),
                username=data.get('username', ''),
                password=data.get('password', '')
            )
        except Exception as ve:
            return jsonify({"success": False, "message": str(ve)}), 400

        # Check if username already exists
        if users_collection.find_one({'username': user_data.username}):
            return jsonify({"success": False, "message": "Username already exists"}), 409

        # Hash the password and store it as a string
        hashed_pw = hashpw(user_data.password.encode('utf-8'), gensalt()).decode('utf-8')

        # Insert the new user into MongoDB
        users_collection.insert_one({
            'first_name': user_data.first_name,
            'second_name': user_data.second_name,
            'username': user_data.username,
            'password': hashed_pw
        })

        return jsonify({"success": True, "redirect": "/login1.html"})

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/api/user')
@token_required
def get_user(current_user):
    if not current_user:
        return jsonify({"error": "User not found"}), 404
    
    return jsonify({
        "first_name": current_user['first_name'],
        "second_name": current_user['second_name'],
        "username": current_user['username']
    })

@app.route('/logout', methods=['POST'])
def logout():
    resp = make_response(jsonify({"success": True, "redirect": "/login.html"}))
    resp.set_cookie('pawpal_jwt', '', expires=0)
    return resp

# Suggestion 3: AI-Powered Pet Matchmaker
@app.route('/api/matchmaker', methods=['POST'])
def matchmaker():
    try:
        data = request.json
        answers = data.get('answers', [])
        
        api_key = os.getenv('GEMINI_API_KEY')
        if not api_key:
            return jsonify({'success': False, 'message': 'Matchmaker logic requires an active Gemini API Key.'}), 503
            
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
        
        prompt = f"{system_prompt}\n\nUser's Questionnaire Answers:\n{answers}"
        response = model.generate_content(prompt)
        
        # Clean response text to extract valid JSON
        import json
        clean_text = response.text.replace("```json", "").replace("```", "").strip()
        result = json.loads(clean_text)
        
        return jsonify({'success': True, 'data': result})
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message', '').lower()
    
    # Check if we have an API key for Google Gemini
    api_key = os.getenv('GEMINI_API_KEY')
    if api_key:
        try:
            genai.configure(api_key=api_key)
            model = genai.GenerativeModel('gemini-pro')
            system_prompt = "You are a friendly and helpful AI assistant for PawPal, a premium pet shop. Keep responses concise, warm, and helpful."
            response = model.generate_content(f"{system_prompt}\n\nUser: {user_message}", safety_settings=[
                {
                    "category": "HARM_CATEGORY_HARASSMENT",
                    "threshold": "BLOCK_NONE"
                }
            ])
            return jsonify({'reply': response.text})
        except Exception as e:
            pass # Fall back to default responses if Gemini fails

    # Fallback pattern matching for immediate results
    default_responses = {
        "hello": "Hello! Welcome to PawPal, how can I help you today?",
        "hi": "Hi there! Welcome to PawPal! Are you looking for a new pet or supplies?",
        "dog": "We have an amazing selection of friendly dogs looking for a good home. Check out our 'Dogs' section!",
        "cat": "Looking for a feline friend? We have adorable kittens and cats waiting for you in our 'Cats' section.",
        "food": "We stock premium pet food for dogs, cats, and small pets. You can find our top sellers in the 'Products' page.",
        "care": "We offer 24/7 expert veterinary care. Need to book a checkup?",
        "price": "Our prices vary, but we pride ourselves on offering the best value for premium pet care.",
        "thank": "You're very welcome! Let me know if you need anything else.",
        "bye": "Goodbye! Have a pawsome day!"
    }

    # Find matching keyword
    for key, response in default_responses.items():
        if key in user_message:
            return jsonify({'reply': response})
            
    # Default fallback
    return jsonify({'reply': "That's a great question! While my brain is partly offline without my API key, you can find lots of great information in our 'Care' and 'Products' sections."})

# Run the app
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)