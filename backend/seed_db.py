from pymongo import MongoClient
import os
from dotenv import load_dotenv
from bcrypt import hashpw, gensalt

load_dotenv()
client = MongoClient(os.getenv("MONGO_URI", "mongodb://localhost:27017/"))
db = client[os.getenv("DB_NAME", "pawpal_db")]

print("Seeding database...")

# --- Seed Products ---
products = [
  { 'name': 'Premium Dry Dog Food', 'price': 49.99, 'rating': 4.2, 'category': 'Food', 'img': 'https://images.pexels.com/photos/12928244/pexels-photo-12928244.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { 'name': 'Grain-Free Wet Cat Food', 'price': 24.99, 'rating': 4.5, 'category': 'Food', 'badge': 'Deal!', 'img': 'https://images.pexels.com/photos/20635786/pexels-photo-20635786/free-photo-of-cats-with-food.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { 'name': 'Interactive Dog Toy', 'price': 15.99, 'rating': 4.7, 'category': 'Toys', 'img': 'https://images.pexels.com/photos/30276535/pexels-photo-30276535/free-photo-of-adorable-bunny-with-fresh-lettuce-in-cage.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { 'name': 'Reflective Dog Leash Set', 'price': 24.99, 'rating': 4.9, 'category': 'Accessories', 'img': 'https://images.pexels.com/photos/11512215/pexels-photo-11512215.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { 'name': 'Orthopedic Dog Bed', 'price': 89.99, 'rating': 4.8, 'category': 'Accessories', 'badge': 'Deal!', 'img': 'https://images.pexels.com/photos/247968/pexels-photo-247968.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { 'name': 'Pet Grooming Kit', 'price': 34.99, 'rating': 4.5, 'category': 'Grooming', 'img': 'https://images.pexels.com/photos/2888319/pexels-photo-2888319.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { 'name': 'Catnip Mouse Toy', 'price': 5.99, 'rating': 4.6, 'category': 'Toys', 'img': 'https://images.pexels.com/photos/104827/cat-pet-animal-domestic-104827.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { 'name': 'Multivitamin Chews', 'price': 19.99, 'rating': 4.4, 'category': 'Health', 'badge': 'Deal!', 'img': 'https://images.pexels.com/photos/333083/pexels-photo-333083.jpeg?auto=compress&cs=tinysrgb&w=800' }
]
db['products'].delete_many({})
db['products'].insert_many(products)
print(f"Inserted {len(products)} products.")


# --- Seed Pets ---
pets = [
  { 'name': 'Buddy', 'species': 'Dog', 'breed': 'Golden Retriever', 'age': 2, 'gender': 'Male', 'location': 'Kavali', 'status': 'available', 'images': ['https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=800'] },
  { 'name': 'Luna', 'species': 'Cat', 'breed': 'Persian', 'age': 1, 'gender': 'Female', 'location': 'Nellore', 'status': 'available', 'images': ['https://images.pexels.com/photos/1543793/pexels-photo-1543793.jpeg?auto=compress&cs=tinysrgb&w=800'] },
  { 'name': 'Max', 'species': 'Dog', 'breed': 'Labrador', 'age': 3, 'gender': 'Male', 'location': 'Kavali', 'status': 'available', 'images': ['https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg?auto=compress&cs=tinysrgb&w=800'] },
  { 'name': 'Milo', 'species': 'Rabbit', 'breed': 'Holland Lop', 'age': 1, 'gender': 'Male', 'location': 'Gudur', 'status': 'available', 'images': ['https://images.pexels.com/photos/1359241/pexels-photo-1359241.jpeg?auto=compress&cs=tinysrgb&w=800'] },
  { 'name': 'Nala', 'species': 'Cat', 'breed': 'Siamese', 'age': 2, 'gender': 'Female', 'location': 'Nellore', 'status': 'available', 'images': ['https://images.pexels.com/photos/104827/cat-pet-animal-domestic-104827.jpeg?auto=compress&cs=tinysrgb&w=800'] }
]
db['pets'].delete_many({})
db['pets'].insert_many(pets)
print(f"Inserted {len(pets)} pets.")

# --- Seed Admin User ---
if not db['users'].find_one({'username': 'admin'}):
    hashed_pw = hashpw('admin123'.encode('utf-8'), gensalt()).decode('utf-8')
    db['users'].insert_one({
        'first_name': 'Super',
        'second_name': 'Admin',
        'username': 'admin',
        'password': hashed_pw,
        'role': 'admin'
    })
    print("Created default admin user (admin / admin123)")

print("Database seeding complete! ✅")
