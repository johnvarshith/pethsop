# 🐾 PawPal AI — Full Stack Pet Adoption & Care Platform

A modern AI-powered full-stack web application designed to simplify pet adoption, pet care, and pet product discovery through an interactive and scalable platform.

PawPal AI combines a modern React frontend, FastAPI backend, MongoDB database, and Gemini AI integration to deliver a production-style user experience with secure authentication, dynamic APIs, intelligent chatbot assistance, and responsive UI design.

---

# 🚀 Features

## ✅ Authentication & Security

* JWT-based authentication
* Secure password hashing with Bcrypt
* Protected routes
* Persistent login sessions
* Role-based admin access

---

## ✅ AI-Powered Pet Assistant

* Gemini AI chatbot integration
* Pet care guidance
* Product suggestions
* Platform assistance
* Real-time conversational UI with offline fallback support

---

## ✅ Pet Adoption System

* Browse pets dynamically from database
* Search & filter pets
* Adoption request flow
* Matchmaker recommendation system

---

## ✅ Admin Dashboard

* Protected admin routes
* Analytics visualization
* Real-time statistics
* User/order management structure

---

## ✅ Appointment Booking

* Multi-step booking workflow
* Vet & grooming scheduling
* Dynamic form handling

---

## ✅ E-Commerce Features (New!)

* Shopping Cart persistence
* Order creation and cancellation
* Toast notifications for live feedback
* Dedicated profile order dashboard
* Live Deals and Filtering

---

## ✅ Modern UI/UX

* Responsive design
* Tailwind CSS styling
* Framer Motion animations
* Skeleton loading states
* Toast notifications
* Smooth page transitions

---

# 🏗️ Tech Stack

## Frontend

* React 18
* Vite
* Tailwind CSS
* Framer Motion
* React Router DOM
* Axios
* React Hot Toast

---

## Backend

* FastAPI
* Uvicorn
* PyJWT
* Bcrypt
* Pydantic

---

## Database

* MongoDB
* PyMongo

---

## AI Integration

* Google Gemini API
* Conversational AI workflows

---

# 📁 Project Structure

```bash
pawpal-ai/
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   └── App.jsx
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── app.py
│   ├── routes/
│   ├── models/
│   ├── utils/
│   ├── middleware/
│   ├── seed_db.py
│   ├── requirements.txt
│   └── .env.example
│
├── README.md
└── .gitignore
```

---

# ⚙️ Installation & Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/yourusername/pawpal-ai.git
```

---

## 2️⃣ Navigate to Project

```bash
cd pawpal-ai
```

---

# 🔧 Backend Setup

## Navigate to backend

```bash
cd backend
```

## Install dependencies

```bash
pip install -r requirements.txt
```

## Create `.env`

Create a `.env` file inside the `backend` folder.

Example:

```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_gemini_api_key
```

## Start backend server

```bash
python app.py
```

Backend runs on:

```txt
http://localhost:5000
```
*(Interactive API documentation automatically available at `http://localhost:5000/docs`)*

---

# 🎨 Frontend Setup

## Open second terminal

```bash
cd frontend
```

## Install dependencies

```bash
npm install
```

## Start development server

```bash
npm run dev
```

Frontend runs on:

```txt
http://localhost:5173
```

---

# 🔄 Application Architecture

```txt
React Frontend (Vite)
        ↓
FastAPI Backend APIs
        ↓
MongoDB Database
        ↓
Gemini AI Integration
```

---

# 🧠 AI Features

The integrated AI assistant helps users with:

* Pet care recommendations
* Product suggestions
* Adoption guidance
* Navigation support
* User interaction assistance

Powered using:

* Google Gemini API

*(Note: Features gracefully fallback to deterministic paths if API Key is omitted)*

---

# 📊 Core Functionalities

| Feature             | Status |
| ------------------- | ------ |
| JWT Authentication  | ✅      |
| Protected Routes    | ✅      |
| Admin Dashboard     | ✅      |
| AI Chatbot          | ✅      |
| Dynamic APIs        | ✅      |
| MongoDB Integration | ✅      |
| Responsive UI       | ✅      |
| Search & Filtering  | ✅      |
| Appointment Booking | ✅      |
| Toast Notifications | ✅      |
| E-Commerce Checkout | ✅      |

---

# 🛡️ Security Features

* JWT authentication
* Password hashing using Bcrypt
* Protected API routes
* Environment variable protection
* Backend validation using Pydantic

---

# 🌟 Future Improvements

* TypeScript migration
* Real-time notifications
* Docker support
* Payment integration
* AI-powered recommendations
* File upload system
* Automated testing
* CI/CD workflows

---

# 👨‍💻 Author

**Janjarapu Varshithkar**

Full Stack & AI Enthusiast

GitHub: [johnvarshith GitHub Profile](https://github.com/johnvarshith)

---

# 📄 License

This project is developed for educational, portfolio, and demonstration purposes.
