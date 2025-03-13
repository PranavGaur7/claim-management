# Claims Management Platform

A full-stack web application for managing insurance claims, featuring separate interfaces for patients and insurers.

## Features

### Patient Portal
- 🔐 Secure authentication system
- 📄 Claim submission with document upload
- 📊 Dashboard for tracking claim status
- 📅 View submission history
- 💬 See insurer comments/feedback

### Insurer Portal
- 🕵️‍♂️ Advanced claim filtering (status, date, amount)
- 📑 Document review system
- ✅/❌ Claim approval/rejection workflow
- 💵 Partial approval with custom amounts
- 📝 Add decision comments

## Technologies

### Frontend
- React 18 with TypeScript
- Tailwind CSS + Headless UI
- React Router 6
- Axios for API calls
- File handling with Base64

### Backend
- Node.js + Express.js
- MongoDB + Mongoose ODM
- JWT Authentication
- REST API Design
- TypeScript

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account or local instance
- Git

### Installation

1. **Clone Repository**
   ```sh
   git clone https://github.com/yourusername/claims-management-platform.git
   cd claims-management-platform
   ```

2. **Backend Setup**
   ```sh
   cd backend
   npm install
   ```

3. **Frontend Setup**
   ```sh
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start Backend**
   ```sh
   cd backend
   nodemon server.js
   ```

2. **Start Frontend**
   ```sh
   cd frontend
   npm start
   ```

The application will be available at:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

## API Documentation

### Authentication
| Endpoint       | Method | Description           |
|---------------|--------|-----------------------|
| /api/auth/login | POST  | User login            |
| /api/auth/register | POST | User registration    |

### Claims
| Endpoint              | Method | Description                |
|-----------------------|--------|----------------------------|
| /api/claims           | POST   | Submit new claim           |
| /api/claims/patient   | GET    | Get patient's claims       |
| /api/claims/insurer   | GET    | Get all claims (insurer)   |
| /api/claims/:id       | PUT    | Update claim status        |

## Project Structure

```
claims-management-platform/
├── backend/
│   ├── models/       # MongoDB schemas
│   ├── routes/       # API endpoints
│   ├── middleware/   # Auth middleware
│   └── server.ts     # Express server
├── frontend/
│   ├── public/       # Static assets
│   └── src/
│       ├── components/ # Reusable UI components
│       ├── pages/      # Route components
│       └──  context/    # Auth context
└── README.md
```

## Screenshots

| Patient Dashboard | Insurer Dashboard |
|-------------------|-------------------|
| ![image](https://github.com/user-attachments/assets/4e45645e-6af1-40ea-812b-25c6a9619b63) | ![image](https://github.com/user-attachments/assets/8d2cab96-1847-4988-a66d-4d99c4e60aec) |

| Claim Submission | Document Review |
|------------------|-----------------|
| ![image](https://github.com/user-attachments/assets/147f4354-84e0-446a-b6cd-7025770c2031) | ![image](https://github.com/user-attachments/assets/dcd57598-e05e-41ea-b85e-a452b8040ba8) |

## Environment Variables

**Backend** (`.env`)
```
MONGODB_URI=mongodb+srv://:@cluster.mongodb.net/dbname
JWT_SECRET=your_jwt_secret_key
PORT=5000
```
