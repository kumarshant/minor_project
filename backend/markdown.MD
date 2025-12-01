#  Backend Documentation – Personalized AI-based Fashion Assistance

A **Node.js + Express** backend powering the **AI-driven Fashion Assistance** system.  
It handles **user management, image analysis, skin-tone detection, color palette recommendations, and outfit suggestions**.  

---

##  1. System Overview
The backend is designed as a **RESTful API** that integrates with a **React/Next.js frontend**.  

- **Auth Service** → Handles user registration, login, and JWT authentication.  
- **Image Service** → Uploads images and extracts dominant colors.  
- **Analysis Service** → Detects skin tone & undertones using AI/ML (TensorFlow.js / ml5.js).  
- **Recommendation Engine** → Suggests fashion palettes & outfits (event/season-specific).  
- **Database Layer** → Stores users, preferences, and recommendation history.  

---

##  2. Architecture Diagram

```mermaid
flowchart TD
    A[Frontend: React] --> B[Backend API: Express]
    B -->|Auth| C[(Auth Service - JWT)]
    B -->|Image Upload| D[(File Storage - Local Storage)]
    B -->|Color Extraction| E[(Color Analysis Service - OpenCV.js)]
    E --> F[(Skin Tone Classifier - OpenCV.js)]
    F --> G[(Recommendation Engine - GEMINI )]
    G --> H[(Database - MongoDB/Local Storage)]
    H --> B
