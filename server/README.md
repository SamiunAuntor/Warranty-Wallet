# Warranty-Wallet Backend Server

A robust Node.js/Express backend service for managing warranty information with automated reminders and admin analytics. The server provides RESTful APIs for warranty management, user authentication, and administrative features.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Configuration](#configuration)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Database Models](#database-models)
- [Middleware](#middleware)
- [Services](#services)
- [Scheduled Jobs](#scheduled-jobs)
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Development](#development)
- [Deployment](#deployment)

## 📖 Overview

Warranty-Wallet is a warranty management platform that helps users track and manage their product warranties. The backend server handles:

- **User Management**: Registration and authentication via Firebase
- **Warranty CRUD Operations**: Create, read, update, and delete warranty records
- **File Management**: Upload and store warranty invoices via Cloudinary
- **Automated Reminders**: Send email notifications for expiring warranties
- **Admin Dashboard**: Platform statistics and user management
- **Database**: MongoDB for persistent storage

## ✨ Features

### Core Features
- 🔐 **Authentication**: JWT-based authentication with Firebase integration
- 📋 **Warranty Management**: Full CRUD operations for warranty records
- 🖼️ **Invoice Uploads**: Cloudinary integration for secure file storage
- 📧 **Email Notifications**: Automated warranty expiry reminder emails
- ⏰ **Scheduled Jobs**: Daily cron jobs for sending reminders
- 📊 **Admin Dashboard**: Analytics and user management capabilities
- 🛡️ **Authorization**: Role-based access control (USER/ADMIN)

### Warranty Features
- Track product warranties with detailed information
- Automatic expiry date calculation
- Warranty status tracking (ACTIVE, EXPIRING_SOON, EXPIRED)
- Invoice document storage and retrieval
- Warranty notes and additional information

## 🛠️ Tech Stack

### Core Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| **express** | ^5.2.1 | Web framework |
| **mongoose** | ^9.1.5 | MongoDB ODM |
| **jsonwebtoken** | ^9.0.3 | JWT authentication |
| **bcryptjs** | ^3.0.3 | Password hashing |
| **cloudinary** | ^1.41.3 | Cloud file storage |
| **nodemailer** | ^7.0.12 | Email service |
| **node-cron** | ^4.2.1 | Job scheduling |
| **multer** | ^2.0.2 | File upload handling |
| **cors** | ^2.8.5 | Cross-origin resource sharing |
| **dotenv** | ^17.2.3 | Environment variables |

### Development Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| **nodemon** | ^3.1.11 | Auto-reload during development |

## 🚀 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB database
- Cloudinary account
- Email service credentials (SMTP)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Warranty-Wallet/server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables** (see [Configuration](#configuration))
   ```bash
   # Create a .env file in the server directory
   cp .env.example .env
   ```

4. **Start the server**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on the port specified in your `.env` file (default: 5000).

## ⚙️ Configuration

Create a `.env` file in the server directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/

# Authentication
JWT_SECRET=your-secret-key-here
FIREBASE_PRIVATE_KEY=your-firebase-key
FIREBASE_CLIENT_EMAIL=your-firebase-email

# Email Service (SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Environment Variables Explained

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/warrantywise` |
| `JWT_SECRET` | Secret key for signing JWT tokens | Any secure random string |
| `EMAIL_HOST` | SMTP host for sending emails | `smtp.gmail.com` |
| `EMAIL_USER` | Email address for sending notifications | `noreply@example.com` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud identifier | From Cloudinary dashboard |

## 📁 Project Structure

```
server/
├── src/
│   ├── app.js                      # Express app configuration
│   ├── server.js                   # Server entry point
│   ├── config/
│   │   ├── db.js                   # MongoDB connection
│   │   └── cloudinary.js           # Cloudinary setup
│   ├── controllers/
│   │   ├── warrantyController.js   # Warranty operations
│   │   └── adminController.js      # Admin operations
│   ├── models/
│   │   ├── User.js                 # User schema
│   │   ├── Warranty.js             # Warranty schema
│   │   └── ReminderLog.js          # Reminder tracking
│   ├── routes/
│   │   ├── warrantyRoutes.js       # Warranty endpoints
│   │   ├── adminRoutes.js          # Admin endpoints
│   │   └── testRoutes.js           # Testing endpoints
│   ├── middleware/
│   │   ├── authMiddleware.js       # JWT verification
│   │   ├── adminMiddleware.js      # Admin authorization
│   │   └── uploadMiddleware.js     # File upload handling
│   ├── services/
│   │   ├── emailService.js         # Email sending logic
│   │   └── reminderService.js      # Reminder processing
│   ├── jobs/
│   │   └── reminderJob.js          # Scheduled cron job
│   └── utils/
│       └── generateToken.js        # JWT token generation
├── package.json
├── nodemon.json                    # Nodemon configuration
└── README.md
```

## 🔌 API Endpoints

### Health Check
```
GET /api/health
```
Returns server status.

### Warranty Endpoints

All warranty endpoints require authentication (`authMiddleware`).

#### Create Warranty
```
POST /api/warranties
Content-Type: application/json

Body:
{
  "productName": "iPhone 14",
  "brand": "Apple",
  "category": "Electronics",
  "purchaseDate": "2023-01-15",
  "warrantyDurationMonths": 12,
  "notes": "Optional notes about the warranty"
}

Response: 201 Created
{
  "success": true,
  "data": { warranty object }
}
```

#### Get All User's Warranties
```
GET /api/warranties

Response: 200 OK
{
  "success": true,
  "count": 5,
  "data": [{ warranty objects }]
}
```

#### Get Warranty by ID
```
GET /api/warranties/:id

Response: 200 OK
{
  "success": true,
  "data": { warranty object }
}
```

#### Update Warranty
```
PUT /api/warranties/:id
Content-Type: application/json

Body:
{
  "productName": "iPhone 14 Pro",
  "brand": "Apple",
  "status": "EXPIRING_SOON"
}

Response: 200 OK
{
  "success": true,
  "data": { updated warranty object }
}
```

#### Delete Warranty
```
DELETE /api/warranties/:id

Response: 200 OK
{
  "success": true,
  "message": "Warranty deleted"
}
```

#### Upload Invoice
```
POST /api/warranties/:id/invoice
Content-Type: multipart/form-data

Body:
{
  "invoice": [PDF/Image file]
}

Response: 200 OK
{
  "success": true,
  "data": { warranty object with invoice URL }
}
```

### Admin Endpoints

All admin endpoints require authentication and admin role.

#### Get Platform Statistics
```
GET /api/admin/stats

Response: 200 OK
{
  "success": true,
  "data": {
    "totalUsers": 150,
    "totalWarranties": 500,
    "expiringWarranties": 25,
    "expiredWarranties": 10
  }
}
```

#### Get All Users
```
GET /api/admin/users

Response: 200 OK
{
  "success": true,
  "data": [{ user objects }]
}
```

#### Update User Status
```
PATCH /api/admin/users/:id/status
Content-Type: application/json

Body:
{
  "isActive": false
}

Response: 200 OK
{
  "success": true,
  "data": { updated user object }
}
```

#### Delete User
```
DELETE /api/admin/users/:id

Response: 200 OK
{
  "success": true,
  "message": "User deleted"
}
```

#### Get Reminder Statistics
```
GET /api/admin/reminders

Response: 200 OK
{
  "success": true,
  "data": {
    "totalReminders": 1000,
    "sentToday": 25,
    "failedReminders": 2
  }
}
```

## 💾 Database Models

### User Schema
```javascript
{
  name: String,                    // User's full name
  email: String (unique),          // User's email
  role: String (USER/ADMIN),       // User role
  isActive: Boolean,               // Account status
  authProvider: String (firebase/local), // Auth method
  timestamps: true                 // Created/Updated dates
}
```

### Warranty Schema
```javascript
{
  user: ObjectId (ref: User),      // Warranty owner
  productName: String,             // Product name
  brand: String,                   // Brand name
  category: String,                // Product category
  purchaseDate: Date,              // Purchase date
  warrantyDurationMonths: Number,  // Duration in months
  expiryDate: Date,                // Auto-calculated expiry date
  status: String,                  // ACTIVE/EXPIRING_SOON/EXPIRED
  invoiceUrl: String,              // Cloudinary file URL
  notes: String,                   // Additional notes
  timestamps: true                 // Created/Updated dates
}
```

### ReminderLog Schema
```javascript
{
  user: ObjectId (ref: User),      // User receiving reminder
  warranty: ObjectId (ref: Warranty), // Associated warranty
  emailSent: Date,                 // When reminder was sent
  status: String,                  // SUCCESS/FAILED
  errorMessage: String,            // Error details if failed
  timestamps: true                 // Created/Updated dates
}
```

## 🔐 Middleware

### Authentication Middleware (`authMiddleware.js`)
- Verifies JWT tokens from request headers
- Extracts user information and attaches to `req.user`
- Required for: warranty endpoints, admin endpoints
- Returns 401 if token is invalid or missing

### Admin Middleware (`adminMiddleware.js`)
- Checks if user has ADMIN role
- Must be used after `authMiddleware`
- Returns 403 if user is not an admin
- Applied to all `/api/admin/*` routes

### Upload Middleware (`uploadMiddleware.js`)
- Configures Multer for file uploads
- Integrates with Cloudinary for cloud storage
- Accepts PDF and image files
- Stores invoices in `warranties/invoices/` folder
- Used by invoice upload endpoint

## 🔧 Services

### Email Service (`emailService.js`)
Handles all email communications using Nodemailer.

**Key Function:**
```javascript
sendEmail({ to, subject, html })
```

**Used for:**
- Warranty expiry reminders
- Welcome emails
- Account notifications

### Reminder Service (`reminderService.js`)
Processes warranty reminders and identifies expiring warranties.

**Key Function:**
```javascript
processWarrantyReminders()
```

**Logic:**
- Finds warranties expiring within 30 days
- Checks reminder logs to prevent duplicates
- Sends email notifications via Email Service
- Logs reminder status in ReminderLog collection

## ⏰ Scheduled Jobs

### Warranty Reminder Job (`reminderJob.js`)
- **Frequency**: Daily at 9:00 AM
- **Trigger**: `0 9 * * *` (cron expression)
- **Function**: Executes `processWarrantyReminders()`
- **Purpose**: Sends warranty expiry notifications

## 🔑 Authentication

### JWT Authentication Flow
1. User authenticates via Firebase
2. Server generates JWT token using `generateToken.js`
3. Client stores token in localStorage
4. Client sends token in `Authorization: Bearer <token>` header
5. `authMiddleware` verifies token on protected routes

### Token Structure
```javascript
const token = jwt.sign(
  { _id: user._id, email: user.email },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);
```

## ❌ Error Handling

The server implements consistent error handling:

```javascript
{
  "success": false,
  "message": "Error description",
  "status": 400
}
```

### Common Status Codes
| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Server Error |

## 🔨 Development

### Running in Development Mode
```bash
npm run dev
```

Nodemon watches the `src` directory and automatically restarts the server on file changes.

### Testing
```bash
npm test
```

Currently, test framework is not configured. You can add Jest or Mocha:
```bash
npm install --save-dev jest
```

### Code Style
- Use ES6 modules
- Follow async/await patterns
- Use consistent error handling
- Add comments for complex logic

## 🚢 Deployment

### Production Build
```bash
npm start
```

### Deployment Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Configure all `.env` variables
- [ ] Set strong `JWT_SECRET`
- [ ] Configure production database
- [ ] Set up email service credentials
- [ ] Configure Cloudinary credentials
- [ ] Enable CORS for frontend domain
- [ ] Test all API endpoints
- [ ] Set up error logging/monitoring
- [ ] Configure backup strategy for MongoDB

### Recommended Hosting Platforms
- **Heroku** - Easy deployment with free tier
- **Railway** - Modern alternative to Heroku
- **AWS EC2** - Scalable with full control
- **DigitalOcean** - Cost-effective VPS
- **Render** - Free tier with auto-deploy from Git

### Environment Setup for Production
```env
NODE_ENV=production
PORT=8000
MONGO_URI=<production-mongodb-uri>
JWT_SECRET=<very-secure-secret>
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=<production-email>
EMAIL_PASS=<production-app-password>
CLOUDINARY_CLOUD_NAME=<your-cloud-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>
```

## 📝 Notes

- All dates are stored in ISO 8601 format
- User warranties are filtered by user ID for privacy
- Admin operations require explicit admin role
- Files are stored on Cloudinary with secure URLs
- Reminder emails include warranty details and expiry information
- MongoDB uses the database name `warrantywise`

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit changes (`git commit -m 'Add AmazingFeature'`)
3. Push to branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

## 📄 License

ISC License - feel free to use and modify.

## 📞 Support

For issues or questions, please open an issue on the repository or contact the development team.

---

**Last Updated**: January 2026
