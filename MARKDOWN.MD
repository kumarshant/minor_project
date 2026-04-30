# 🧠 Backend – AI-Based Fashion Assistance System

This is the backend service for a **Personalized AI Fashion Assistant**, built with **Node.js and Express**.
It powers intelligent features like **skin tone detection, outfit recommendations, and AI chat styling**.

---

## 🌐 Overview

The backend exposes a **RESTful API** that connects with a modern frontend (React/Next.js) and integrates AI services for smart fashion insights.

### 🔑 Core Responsibilities

* User authentication & authorization (JWT)
* Image upload & processing
* Skin tone and undertone detection
* AI-powered outfit recommendations
* Conversation & recommendation history storage

---

## 🏗️ System Architecture

```mermaid
flowchart TD
    A[Frontend: React] --> B[Backend API: Express]
    B --> C[Auth Service (JWT)]
    B --> D[Image Upload Service]
    B --> E[Color Analysis (OpenCV.js)]
    E --> F[Skin Tone Detection]
    F --> G[AI Recommendation Engine (Gemini)]
    G --> H[Database (MongoDB)]
    H --> B
```

---

## ⚙️ User Flow

```mermaid
flowchart TD
    A[User Signup/Login] --> B{User Type}

    B -->|Standard| C[Image Analysis (OpenCV)]
    C --> D[Basic AI Outfit Recommendations]
    D --> E[Save Recommendation]

    B -->|Premium| F[Payment Verification]
    F --> G[Advanced AI Vision Analysis]
    G --> H[Personalized Recommendations]
    H --> I[Shopping Links]
    I --> J[AI Stylist Chat]
    J --> K[Save Conversation History]
```

---

## 🧩 Core Modules

### 🔐 Authentication Service

* User registration & login
* JWT-based authentication
* Secure route protection middleware

---

### 🖼️ Image Processing Service

* Handles user image uploads
* Extracts dominant colors
* Prepares input for analysis

---

### 🎨 Analysis Engine

* Skin tone detection using OpenCV
* Undertone classification (warm, cool, neutral)
* Color palette mapping

---

### 🤖 Recommendation Engine

* Integrates with Gemini AI
* Generates:

  * Outfit suggestions
  * Color combinations
  * Occasion-based styling tips

---

### 💬 Conversation Service

* Stores chat history
* Enables AI stylist interaction
* Maintains user-specific context

---

### 🗄️ Database Layer

* MongoDB-based storage
* Stores:

  * Users
  * Preferences
  * Recommendations
  * Conversations

---

## 🔌 API Highlights

| Method | Endpoint           | Description                |
| ------ | ------------------ | -------------------------- |
| POST   | /api/auth/register | Register new user          |
| POST   | /api/auth/login    | Login user                 |
| POST   | /api/upload        | Upload image               |
| POST   | /api/analyze       | Analyze skin tone          |
| POST   | /api/recommend     | Get outfit recommendations |
| POST   | /api/chat          | AI stylist chat            |

---

## 🔐 Environment Variables

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
GEMINI_API_KEY=your_api_key
```

---

## 🚀 Future Enhancements

* 💳 Payment gateway integration
* 🛍️ Direct e-commerce integration
* 📊 User style analytics dashboard
* 📱 Mobile app support

---

## 📌 Notes

* OpenCV.js is used for lightweight client-side + backend-assisted analysis
* Gemini AI powers recommendation and chat intelligence
* Designed with scalability in mind (service-based architecture)

---
