# WarrantyWallet

**Live Application:** [https://warranty-wallet-ad400.web.app](https://warranty-wallet-ad400.web.app)

> **Smart Warranty & Claim Reminder System with Admin Management**

WarrantyWallet is a comprehensive web-based platform that helps users digitally manage product warranties, secure purchase documents, and receive intelligent reminders before warranties expire. The system includes an administrative dashboard for managing users and monitoring platform activity while maintaining strict data privacy.

---

## 🎯 Project Overview

WarrantyWallet transforms scattered warranty documents into a secure, intelligent, and actionable system—ensuring you never miss a repair window or warranty benefit you're entitled to.

### Key Value Proposition
- **Never lose a warranty benefit again** - All your warranty information in one secure place
- **Smart automated reminders** - Get notified before warranties expire
- **Claim-ready documentation** - Store invoices and warranty cards digitally
- **Admin management** - Complete platform oversight for administrators

---

## ✨ Current Features

### 🔐 Authentication & Security
- ✅ Firebase Authentication (Email/Password + Google OAuth)
- ✅ Role-based access control (User/Admin)
- ✅ Secure route protection (PrivateRoute, AdminRoute, PublicRoute)
- ✅ Automatic logout on unauthorized access
- ✅ Account status management (Active/Suspended/Deleted)
- ✅ Bearer token authentication
- ✅ Firebase Admin SDK backend verification

### 📦 Product & Warranty Management
- ✅ Complete CRUD operations for products
- ✅ Embedded warranty details within products
- ✅ Automatic warranty status calculation (Active/Expiring Soon/Expired)
- ✅ Auto-calculated expiry dates
- ✅ Product categorization
- ✅ Shop/Seller information tracking
- ✅ Internal notes and documentation
- ✅ Export warranty list to PDF with professional formatting

### 📄 Invoice Management
- ✅ Multiple invoice image upload (up to 4 images per product)
- ✅ ImageBB cloud storage integration
- ✅ Invoice viewing modal with grid layout
- ✅ Individual image download functionality
- ✅ Support for warranty cards and invoice documents
- ✅ Image preview and metadata display

### 📊 Dashboard & Analytics
- ✅ User dashboard with statistics cards
- ✅ Latest 5 products table
- ✅ Admin dashboard with comprehensive platform stats
- ✅ Data visualization charts (Line, Bar, Doughnut charts)
- ✅ User registration trends
- ✅ Product status breakdown
- ✅ Top categories analysis
- ✅ Public homepage statistics

### 🔍 Search & Filter
- ✅ Real-time search across product name, brand, category, status
- ✅ Status filter (Active/Expiring Soon/Expired)
- ✅ Email sent status filter
- ✅ Combined search and filter functionality
- ✅ Results counter display

### 📧 Email Reminder System
- ✅ Automated email notifications (Nodemailer)
- ✅ One-time email per product when entering "Expiring Soon" status
- ✅ Daily cron job for status transitions and email sending
- ✅ Email tracking (expiringSoonEmailSentAt, expiringSoonEmailSentForExpiryDate)
- ✅ Reminder logs for audit trail
- ✅ HTML email templates

### 👥 User Management
- ✅ Complete user profile management
- ✅ Profile image upload (ImageBB)
- ✅ Editable profile information
- ✅ Firebase Auth profile sync
- ✅ MongoDB profile sync

### 🛡️ Admin Features
- ✅ Admin dashboard with platform statistics
- ✅ User management interface
- ✅ User status management (Active/Suspended/Deleted)
- ✅ Hard delete functionality for users
- ✅ Platform-wide analytics
- ✅ User registration trends
- ✅ Admin-only route protection

### 🏠 Homepage
- ✅ Modern landing page with banner
- ✅ Live platform statistics
- ✅ About Us section
- ✅ How It Works (4-step guide)
- ✅ Features showcase
- ✅ Benefits section
- ✅ FAQ section
- ✅ Call-to-action section

### 🎨 UI/UX Features
- ✅ Responsive design (mobile-first)
- ✅ Modern, clean interface with Tailwind CSS
- ✅ SweetAlert2 for user-friendly alerts
- ✅ Toast notifications
- ✅ Loading states
- ✅ Empty states
- ✅ Tooltips (react-tooltip)
- ✅ Collapsible sidebar
- ✅ Smooth transitions and animations

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **React Router DOM 7** - Client-side routing
- **TanStack React Query** - Data fetching and caching
- **Axios** - HTTP client
- **Firebase** - Authentication
- **Tailwind CSS 4** - Utility-first CSS framework
- **Chart.js + React-ChartJS-2** - Data visualization
- **SweetAlert2** - Beautiful alerts and modals
- **Lucide React** - Icon library
- **React Tooltip** - Tooltip component
- **Swiper** - Image carousel
- **Typewriter Effect** - Animated text
- **jsPDF + jsPDF-AutoTable** - PDF document generation
- **DaisyUI** - Tailwind CSS component library

### Backend
- **Node.js** - Runtime environment
- **Express.js 5** - Web framework
- **MongoDB** - Database
- **Firebase Admin SDK** - Backend authentication
- **Nodemailer** - Email service
- **Node-cron** - Scheduled tasks
- **CORS** - Cross-origin resource sharing

### Services & Integrations
- **Firebase Authentication** - User auth
- **MongoDB Atlas** - Cloud database
- **ImageBB** - Image hosting
- **Gmail SMTP** - Email delivery

---

## 📁 Project Structure

```
WarrantyWallet/
├── backend/
│   ├── db.js                    # MongoDB connection & collection helpers
│   ├── firebaseAdmin.js         # Firebase Admin SDK initialization
│   ├── index.js                 # Express server entry point
│   ├── middleware/
│   │   └── authMiddleware.js    # Authentication & authorization
│   ├── routes/
│   │   ├── adminRoutes.js       # Admin API endpoints
│   │   ├── dashboardRoutes.js   # User dashboard stats
│   │   ├── invoiceRoutes.js     # Invoice management
│   │   ├── productRoutes.js     # Product CRUD operations
│   │   ├── publicRoutes.js      # Public stats for homepage
│   │   └── userRoutes.js         # User profile management
│   ├── services/
│   │   ├── emailService.js       # Email sending service
│   │   └── reminderService.js    # Reminder logic
│   └── jobs/
│       └── dailyReminderCheck.js # Daily cron job for reminders
│
├── frontend/
│   ├── src/
│   │   ├── Components/
│   │   │   ├── Auth/             # Route guards (PrivateRoute, AdminRoute, PublicRoute)
│   │   │   ├── Dashboard/        # Product management components
│   │   │   │   ├── InvoiceModal.jsx
│   │   │   │   ├── ProductDetailsModal.jsx
│   │   │   │   ├── WarrantyForm.jsx
│   │   │   │   └── WarrantyList.jsx
│   │   │   └── ...               # Homepage components
│   │   ├── Hooks/
│   │   │   ├── useAuth.jsx       # Firebase auth hook
│   │   │   ├── useAxios.jsx      # Axios instance with auth
│   │   │   └── useRoles.jsx      # Role management hook
│   │   ├── Layouts/
│   │   │   ├── AdminLayout.jsx   # Admin panel layout
│   │   │   ├── DashboardLayout.jsx # User dashboard layout
│   │   │   └── HomeLayout.jsx    # Public pages layout
│   │   ├── Pages/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── UserManagement.jsx
│   │   │   └── ...               # Auth pages
│   │   ├── Router.jsx            # Route configuration
│   │   └── Utils/
│   │       ├── alerts.js         # SweetAlert2 utilities
│   │       ├── authErrorMessages.js
│   │       └── UploadImage.js    # ImageBB upload utility
│   └── package.json
│
├── DATABASE_SCHEMA.md            # Complete database schema documentation
├── DEVELOPMENT_FLOW.md           # Development roadmap
├── SECURITY_IMPLEMENTATION.md    # Security documentation
└── README.md                     # This file
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account (or local MongoDB)
- Firebase project with Authentication enabled
- Gmail account (for email service)
- ImageBB API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd WarrantyWallet
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

4. **Environment Variables**

   **Backend** (`backend/.env`):
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
   DB_NAME=warranty_wallet
   PORT=5000
   
   # Email Configuration
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-gmail-app-password
   EMAIL_FROM=your-email@gmail.com
   EMAIL_FROM_NAME=WarrantyWallet
   FRONTEND_URL=http://localhost:5173
   ```

   **Frontend** (`frontend/.env`):
   ```env
   VITE_API_BASE_URL=http://localhost:5000
   VITE_IMGBB_KEY=your-imgbb-api-key
   
   # Firebase Configuration
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   ```

5. **Firebase Admin SDK**
   - Place your Firebase Admin SDK JSON file in `backend/warranty-wallet-firebase-adminsdk.json`

6. **Run the Application**

   **Backend:**
   ```bash
   cd backend
   npm run dev
   ```

   **Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

7. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

---

## 📚 API Documentation

### Authentication
All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <firebase-id-token>
```

### User Routes
- `POST /api/users` - Sync user data (used during auth)
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update current user profile

### Product Routes
- `GET /api/products` - Get user's products (with optional filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Soft delete product

### Invoice Routes
- `POST /api/invoices` - Upload invoice images (array of images)
- `GET /api/invoices/product/:productId` - Get invoice for product
- `DELETE /api/invoices/:id` - Delete invoice

### Dashboard Routes
- `GET /api/dashboard/user` - Get user dashboard statistics

### Admin Routes (Admin only)
- `GET /api/admin/stats` - Platform-wide statistics
- `GET /api/admin/users` - List all users
- `PUT /api/admin/users/:id/status` - Update user status

### Public Routes
- `GET /api/public/stats` - Public platform statistics

---

## 🔒 Security Features

- **Route Guards**: PrivateRoute, AdminRoute, PublicRoute components
- **Token Verification**: Firebase Admin SDK backend verification
- **Role-Based Access**: Strict admin/user role separation
- **Status Checks**: Account status verification on every access
- **Automatic Logout**: On suspension, deletion, or unauthorized access
- **Hard Delete**: Permanent user deletion for admins
- **Unauthorized Access Logging**: Security event tracking

See `SECURITY_IMPLEMENTATION.md` for detailed security documentation.

---

## 📊 Database Schema

The system uses MongoDB with the following collections:

### 1. `users` Collection

**Purpose**: Store user account information and authentication data

**Fields**:
```javascript
{
  "_id": ObjectId,                    // MongoDB auto-generated primary key
  "name": String,                     // User's full name (required)
  "email": String,                    // User's email (required, unique, indexed)
  "role": String,                     // "user" | "admin" (default: "user")
  "status": String,                   // "active" | "suspended" | "deleted" (default: "active")
  "photoURL": String,                 // Profile photo URL from ImgBB/Firebase (optional)
  "createdAt": Date,                  // Account creation timestamp
  "updatedAt": Date,                  // Last update timestamp
  "lastLoginAt": Date,                // Last login timestamp (optional)
  "firebaseUID": String               // Firebase Auth UID (optional, for reference)
}
```

**Indexes**:
- `email` (unique)

**Notes**:
- Users are hard-deleted when status is set to "deleted" (no soft delete)
- Email is used as the primary lookup key (not `_id`)

---

### 2. `products` Collection

**Purpose**: Store all product records with embedded warranty information

**Fields**:
```javascript
{
  "_id": ObjectId,                    // MongoDB auto-generated primary key
  "userId": ObjectId,                 // Reference to users._id (required, indexed)
  "productName": String,              // Product name (required)
  "brand": String,                    // Brand name (required)
  "category": String,                 // Product category (required)
  "purchaseDate": Date,               // Purchase date (required)
  "warrantyDuration": Number,         // Warranty duration in months (required)
  "warrantyType": String,             // "Manufacturer" | "Extended" (default: "Manufacturer")
  "expiryDate": Date,                 // Auto-calculated: purchaseDate + warrantyDuration
  "status": String,                   // "Active" | "Expiring Soon" | "Expired" (auto-computed)
  "expiringSoonEmailSentAt": Date,    // Timestamp when expiring soon email was sent (null if not sent)
  "expiringSoonEmailSentForExpiryDate": Date, // The expiry date for which email was sent
  "notes": String,                    // Optional user notes
  "shopName": String,                 // Shop/seller name (optional)
  "shopPhone": String,                // Shop phone number (optional)
  "shopAddress": String,              // Shop address (optional)
  "invoiceId": ObjectId,             // Reference to invoices._id (optional, nullable)
  "createdAt": Date,                  // Product creation timestamp
  "updatedAt": Date,                  // Last update timestamp
  "isDeleted": Boolean                // Soft delete flag (default: false)
}
```

**Indexes**:
- `userId` (for user-specific queries)
- `status` (for filtering by warranty status)
- `expiryDate` (for date-based queries)

**Computed Fields**:
- `expiryDate`: Calculated as `purchaseDate + warrantyDuration` months
- `status`: Computed based on `expiryDate`:
  - `"Expired"` if `expiryDate < today`
  - `"Expiring Soon"` if `expiryDate <= today + 30 days`
  - `"Active"` otherwise

---

### 3. `invoices` Collection

**Purpose**: Store invoice metadata with multiple images per product

**Fields**:
```javascript
{
  "_id": ObjectId,                    // MongoDB auto-generated primary key
  "userId": ObjectId,                 // Reference to users._id (required)
  "productId": ObjectId,              // Reference to products._id (required, 1:1 relationship)
  "images": [                         // Array of image objects (max 4)
    {
      "fileName": String,             // Original file name (required)
      "fileType": String,             // File extension (e.g., "jpg", "png") (required)
      "mimeType": String,             // MIME type (e.g., "image/jpeg") (required)
      "fileSize": Number,             // File size in bytes (required)
      "storageUrl": String,            // ImageBB URL (required)
      "storageProvider": String,      // Storage provider (default: "imgbb")
      "uploadedAt": Date              // Upload timestamp
    }
  ],
  "createdAt": Date,                  // Invoice creation timestamp
  "updatedAt": Date,                  // Last update timestamp
  "isDeleted": Boolean                // Soft delete flag (default: false)
}
```

**Indexes**:
- `userId` (for user-specific queries)
- `productId` (unique, for 1:1 relationship with products)

**Notes**:
- Maximum 4 images per invoice
- 1:1 relationship with products (one invoice per product)
- Images are stored on ImageBB, only metadata is stored in MongoDB

---

### 4. `reminder_logs` Collection

**Purpose**: Audit trail for email reminder actions

**Fields**:
```javascript
{
  "_id": ObjectId,                    // MongoDB auto-generated primary key
  "productId": ObjectId,              // Reference to products._id (required)
  "userId": ObjectId,                 // Reference to users._id (required)
  "reminderType": String,             // "expiring_soon_transition_email" (required)
  "action": String,                   // "sent" | "failed" (required)
  "channel": String,                 // "email" (required)
  "errorMessage": String,            // Error message if action is "failed" (optional)
  "timestamp": Date                  // When the action occurred (required)
}
```

**Indexes**:
- `productId` (for product-specific queries)
- `userId` (for user-specific queries)
- `action` (for filtering sent/failed reminders)
- `timestamp` (for date-based queries)

**Notes**:
- Used for tracking email delivery status
- Helps with debugging and analytics
- Records both successful sends and failures

---

### 5. `reminders` Collection

**Purpose**: Store scheduled reminder records (currently used for future enhancements)

**Fields**:
```javascript
{
  "_id": ObjectId,                    // MongoDB auto-generated primary key
  "productId": ObjectId,              // Reference to products._id (required)
  "userId": ObjectId,                 // Reference to users._id (required)
  "scheduledDate": Date,              // When the reminder should be sent (required)
  "reminderType": String,             // "30_days" | "7_days" | "expiry_date"
  "status": String,                   // "pending" | "sent" | "failed"
  "createdAt": Date,                  // Reminder creation timestamp
  "updatedAt": Date                   // Last update timestamp
}
```

**Notes**:
- Currently, the system uses a simpler approach: emails are sent when products transition to "Expiring Soon" status
- This collection is available for future enhancements (e.g., multiple reminder schedules)

---

## Relationships

```
users (1) ──< (many) products
products (1) ──< (1) invoices
products (1) ──< (many) reminder_logs
products (1) ──< (many) reminders
```

**Key Relationships**:
- One user can have many products
- One product can have one invoice (1:1)
- One product can have many reminder logs (for audit trail)
- One product can have many reminders (for future scheduling)

---

## Data Flow

1. **User Registration/Login**: User document is created/updated in `users` collection
2. **Product Creation**: Product document is created in `products` collection with computed `expiryDate` and `status`
3. **Invoice Upload**: Invoice document is created/updated in `invoices` collection, and `product.invoiceId` is set
4. **Daily Reminder Job**: 
   - Scans all products
   - Updates `status` if needed
   - Sends email if product is "Expiring Soon" and email not yet sent
   - Logs action in `reminder_logs`

---

## 🎯 Current Implementation Status

### ✅ Completed Phases

- **Phase 1**: Core Product & Warranty Management ✅
- **Phase 2**: Invoice Management (with multiple images) ✅
- **Phase 3**: Dashboard Analytics ✅
- **Phase 4**: Email Reminder System ✅
- **Phase 5**: Admin Features ✅
- **Phase 6**: Search & Filter ✅
- **Phase 7**: UI/UX Polish ✅

### ⏳ Remaining from Development Flow

- **Phase 4.3**: In-app notifications (email done, in-app pending)
- **Phase 8.1**: OCR Invoice Scanning
- **Phase 8.2**: Export Functionality (CSV/PDF)

---

## 🚀 Future Scope & High-Impact Features

### High Priority - Quick Wins

#### 1. **Export Functionality** ⭐ High Impact
- **Impact**: Users can backup and share their warranty data
- **Features**:
  - Export products as CSV/Excel
  - Generate PDF reports
  - Export with invoice images
  - Scheduled automatic backups
- **Estimated Time**: 3-4 hours
- **Value**: Data portability and peace of mind

#### 2. **In-App Notifications** ⭐ High Impact
- **Impact**: Users see reminders without checking email
- **Features**:
  - Notification bell icon in dashboard
  - Real-time notification dropdown
  - Mark as read functionality
  - Notification preferences
- **Estimated Time**: 4-5 hours
- **Value**: Better user engagement and retention

#### 3. **Bulk Operations** ⭐ High Impact
- **Impact**: Save time for power users
- **Features**:
  - Bulk product import (CSV)
  - Bulk status updates
  - Bulk delete with confirmation
  - Template download
- **Estimated Time**: 4-6 hours
- **Value**: Improved efficiency for users with many products

### Medium Priority - Enhanced Features

#### 4. **OCR Invoice Scanning** ⭐⭐ Very High Impact
- **Impact**: Dramatically reduces data entry time
- **Features**:
  - Automatic data extraction from invoice images
  - Product name, purchase date, warranty duration detection
  - User review and correction interface
  - Support for multiple languages
- **Estimated Time**: 8-12 hours
- **Value**: Game-changing UX improvement, reduces friction significantly

#### 5. **Advanced Analytics & Reports** ⭐ High Impact
- **Impact**: Better insights for users
- **Features**:
  - Warranty expiry calendar view
  - Spending analysis by category
  - Warranty coverage timeline
  - Custom date range reports
  - Category-wise statistics
- **Estimated Time**: 6-8 hours
- **Value**: Data-driven decision making

#### 6. **PWA (Progressive Web App)** ⭐ High Impact
- **Impact**: Mobile app-like experience
- **Features**:
  - Installable on mobile devices
  - Offline functionality
  - Push notifications
  - App-like navigation
- **Estimated Time**: 6-8 hours
- **Value**: Better mobile experience, increased engagement

### Lower Priority - Nice to Have

#### 7. **Multi-Language Support**
- **Impact**: Global reach
- **Features**: i18n implementation, language switcher
- **Estimated Time**: 8-10 hours

#### 8. **Data Backup & Restore**
- **Impact**: Data safety
- **Features**: Automatic cloud backups, restore functionality
- **Estimated Time**: 4-6 hours

#### 9. **Advanced Search with Filters**
- **Impact**: Better product discovery
- **Features**: Date range filters, price filters, advanced sorting
- **Estimated Time**: 3-4 hours

#### 10. **Social Features**
- **Impact**: Community engagement
- **Features**: Share warranty tips, community forum
- **Estimated Time**: 10-15 hours

---

## 🧪 Testing

### Manual Testing Checklist
- [x] User registration and login
- [x] Product CRUD operations
- [x] Invoice upload and viewing
- [x] Dashboard statistics display
- [x] Email reminder system
- [x] Admin user management
- [x] Search and filter functionality
- [x] Route protection and security
- [x] Profile management
- [x] Responsive design

---

## 🐛 Known Issues

- None currently reported

---

## 📝 Development Notes

- Products use soft delete (`isDeleted` flag)
- Users use hard delete (permanent removal)
- Email reminders sent once per product per expiry date
- Daily cron job runs at 9 AM (configurable in `dailyReminderCheck.js`)
- Maximum 4 invoice images per product

---

## 🤝 Contributing

This is a private project. For contributions, please contact the project maintainer.

---

## 📄 License

Private project - All rights reserved

---

## 👤 Author

WarrantyWallet Development Team

---

## 🙏 Acknowledgments

- Firebase for authentication
- MongoDB Atlas for database hosting
- ImageBB for image hosting
- Nodemailer for email service
- All open-source contributors

---

## 📞 Support

For issues or questions, please open an issue in the repository or contact the development team.

---

**Last Updated**: December 2024
**Version**: 1.0.0

