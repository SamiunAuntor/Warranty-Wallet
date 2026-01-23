# Warranty Wallet

A smart warranty and claim reminder system built with MERN stack (MongoDB, Express, React, Node.js) and Firebase Authentication.

## Features

- 🔐 **Authentication System**
  - Email/Password registration and login
  - Google Sign-In
  - Password reset functionality
  - Protected routes

- 📱 **User Interface**
  - Responsive design with Tailwind CSS
  - Clean and modern UI
  - Homepage with feature highlights
  - Login and Registration pages

## Tech Stack

### Frontend
- React 18
- Vite
- React Router DOM
- Firebase (Authentication)
- Tailwind CSS
- React Hot Toast
- TanStack React Query

### Backend
- Node.js
- Express.js
- MongoDB (Native Driver)
- Firebase Admin SDK
- CORS
- dotenv

## Project Structure

```
Warrenty-Wallet/
├── frontend/
│   ├── src/
│   │   ├── Components/
│   │   │   ├── Navbar.jsx
│   │   │   └── PrivateRoute.jsx
│   │   ├── Firebase/
│   │   │   ├── firebase.config.js
│   │   │   └── AuthProvider.jsx
│   │   ├── Pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Registration.jsx
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── Router.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env
│   └── package.json
├── backend/
│   ├── config/
│   │   ├── database.js
│   │   └── firebase.admin.js
│   ├── routes/
│   │   └── auth.routes.js
│   ├── index.js
│   ├── .env
│   └── package.json
└── .gitignore
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (or local MongoDB)
- Firebase project

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in backend directory:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.zofgmor.mongodb.net/?appName=Cluster0
DB_NAME=Warrenty-Wallet
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

4. Start the backend server:
```bash
npm start
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in frontend directory:
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Environment Variables

### Backend (.env)
- `MONGODB_URI`: MongoDB connection string
- `DB_NAME`: Database name (default: Warrenty-Wallet)
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (development/production)
- `FRONTEND_URL`: Frontend URL for CORS

### Frontend (.env)
- `VITE_FIREBASE_API_KEY`: Firebase API key
- `VITE_FIREBASE_AUTH_DOMAIN`: Firebase auth domain
- `VITE_FIREBASE_PROJECT_ID`: Firebase project ID
- `VITE_FIREBASE_STORAGE_BUCKET`: Firebase storage bucket
- `VITE_FIREBASE_MESSAGING_SENDER_ID`: Firebase messaging sender ID
- `VITE_FIREBASE_APP_ID`: Firebase app ID
- `VITE_API_URL`: Backend API URL

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user in MongoDB
- `GET /api/auth/profile` - Get user profile (requires authentication)
- `PUT /api/auth/profile` - Update user profile (requires authentication)

## Database Schema

### Users Collection
```javascript
{
  uid: String,           // Firebase UID
  email: String,          // User email
  displayName: String,   // User display name
  photoURL: String,      // User photo URL
  createdAt: Date,       // Account creation date
  updatedAt: Date,       // Last update date
  role: String,          // User role (default: "user")
  status: String         // Account status (default: "active")
}
```

## Development

### Running Both Servers

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## Future Features

- Warranty management module
- Smart reminder system
- Invoice/document storage
- Admin dashboard
- Search and filter functionality
- AI-assisted invoice scanning

## License

ISC

