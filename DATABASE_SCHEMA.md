# WarrantyWise Database Schema

## Collections Overview

1. **users** (Already implemented)
2. **warranties**
3. **invoices**
4. **reminders**
5. **reminder_logs**
6. **admin_settings**

---

## 1. users Collection

**Purpose**: Store user account information and authentication data

```javascript
{
  "_id": ObjectId,                    // MongoDB auto-generated
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
- `role`
- `status`

---

## 2. warranties Collection

**Purpose**: Store all warranty records for users

```javascript
{
  "_id": ObjectId,                    // MongoDB auto-generated
  "userId": ObjectId,                // Reference to users._id (required, indexed)
  "productName": String,              // Product name (required)
  "brand": String,                    // Brand name (required)
  "category": String,                 // Product category (required)
                                        // e.g., "Electronics", "Appliances", "Furniture", "Vehicles", "Other"
  "purchaseDate": Date,               // Purchase date (required)
  "warrantyDuration": Number,         // Warranty duration in months (required)
  "warrantyType": String,             // "Manufacturer" | "Extended" (required, default: "Manufacturer")
  "expiryDate": Date,                 // Auto-calculated: purchaseDate + warrantyDuration (required, indexed)
  "status": String,                   // "Active" | "Expiring Soon" | "Expired" (auto-updated, indexed)
  "notes": String,                    // Optional user notes
  "invoiceId": ObjectId,              // Reference to invoices._id (optional)
  "shopName": String,                 // Shop / Seller name (optional)
  "shopPhone": String,                 // Shop / Seller contact phone (optional)
  "shopAddress": String,               // Shop / Seller address (optional)
  "requiredDocuments": [String],      // Array of required document types (optional)
                                        // e.g., ["Invoice", "Warranty Card", "Product Serial Number"]
  "claimSteps": [String],             // Array of claim preparation steps (optional)
  "createdAt": Date,                  // Record creation timestamp
  "updatedAt": Date,                  // Last update timestamp
  "isDeleted": Boolean                // Soft delete flag (default: false)
}
```

**Indexes**:
- `userId` (for user queries)
- `expiryDate` (for reminder queries)
- `status` (for filtering)
- `category` (for filtering)
- `userId + status` (compound, for dashboard queries)
- `expiryDate + status` (compound, for reminder engine)

---

## 3. invoices Collection

**Purpose**: Store invoice/document metadata and storage references

```javascript
{
  "_id": ObjectId,                    // MongoDB auto-generated
  "userId": ObjectId,                // Reference to users._id (required, indexed)
  "warrantyId": ObjectId,             // Reference to warranties._id (optional, for linking)
  "fileName": String,                 // Original file name (required)
  "fileType": String,                 // "image" | "pdf" (required)
  "mimeType": String,                 // e.g., "image/jpeg", "application/pdf" (required)
  "fileSize": Number,                 // File size in bytes (required)
  "storageUrl": String,               // ImgBB or cloud storage URL (required)
  "storageProvider": String,          // "imgbb" | "firebase-storage" | "aws-s3" (required)
  "uploadedAt": Date,                 // Upload timestamp
  "isDeleted": Boolean                // Soft delete flag (default: false)
}
```

**Indexes**:
- `userId` (for user queries)
- `warrantyId` (for warranty linking)
- `userId + isDeleted` (compound, for active documents)

---

## 4. reminders Collection

**Purpose**: Store reminder schedule configuration and tracking

```javascript
{
  "_id": ObjectId,                    // MongoDB auto-generated
  "warrantyId": ObjectId,             // Reference to warranties._id (required, indexed)
  "userId": ObjectId,                 // Reference to users._id (required, indexed)
  "reminderType": String,             // "30_days" | "7_days" | "expiry_date" (required)
  "scheduledDate": Date,               // When reminder should be sent (required, indexed)
  "status": String,                   // "pending" | "sent" | "failed" | "skipped" (default: "pending", indexed)
  "sentAt": Date,                     // When reminder was actually sent (optional)
  "emailSent": Boolean,                // Email notification sent (default: false)
  "inAppSent": Boolean,                // In-app notification sent (default: false)
  "createdAt": Date,                  // Reminder creation timestamp
  "updatedAt": Date                   // Last update timestamp
}
```

**Indexes**:
- `warrantyId` (for warranty queries)
- `userId` (for user queries)
- `scheduledDate` (for reminder engine queries)
- `status` (for pending reminders)
- `scheduledDate + status` (compound, for daily reminder checks)

---

## 5. reminder_logs Collection

**Purpose**: Audit log for reminder system activity

```javascript
{
  "_id": ObjectId,                    // MongoDB auto-generated
  "reminderId": ObjectId,             // Reference to reminders._id (optional)
  "warrantyId": ObjectId,             // Reference to warranties._id (required)
  "userId": ObjectId,                  // Reference to users._id (required)
  "reminderType": String,             // "30_days" | "7_days" | "expiry_date"
  "action": String,                   // "created" | "sent" | "failed" | "skipped"
  "channel": String,                  // "email" | "in_app" | "both"
  "errorMessage": String,             // Error details if action is "failed" (optional)
  "metadata": Object,                  // Additional context (optional)
  "timestamp": Date                   // Log entry timestamp (indexed)
}
```

**Indexes**:
- `timestamp` (for time-based queries)
- `userId` (for user-specific logs)
- `action` (for error tracking)

---

## 6. admin_settings Collection

**Purpose**: Store system-wide admin configuration

```javascript
{
  "_id": ObjectId,                    // MongoDB auto-generated
  "key": String,                      // Setting key (required, unique, indexed)
                                        // e.g., "reminder_enabled", "expiring_soon_days", "email_from_address"
  "value": Mixed,                     // Setting value (can be String, Number, Boolean, Object, Array)
  "description": String,              // Human-readable description (optional)
  "updatedBy": ObjectId,              // Reference to users._id (admin who updated)
  "updatedAt": Date                   // Last update timestamp
}
```

**Example Documents**:
```javascript
{
  "key": "reminder_enabled",
  "value": true,
  "description": "Enable/disable reminder system"
}
{
  "key": "expiring_soon_days",
  "value": 30,
  "description": "Days before expiry to mark as 'Expiring Soon'"
}
{
  "key": "email_from_address",
  "value": "noreply@warrantywise.com",
  "description": "Email sender address for notifications"
}
```

**Indexes**:
- `key` (unique)

---

## 7. notifications Collection (Optional - for in-app notifications)

**Purpose**: Store in-app notification messages for users

```javascript
{
  "_id": ObjectId,                    // MongoDB auto-generated
  "userId": ObjectId,                 // Reference to users._id (required, indexed)
  "type": String,                     // "warranty_reminder" | "system" | "admin" (required)
  "title": String,                    // Notification title (required)
  "message": String,                  // Notification message (required)
  "warrantyId": ObjectId,             // Reference to warranties._id (optional, for warranty-related)
  "isRead": Boolean,                  // Read status (default: false, indexed)
  "readAt": Date,                     // When notification was read (optional)
  "createdAt": Date,                  // Notification creation timestamp (indexed)
  "expiresAt": Date                   // Optional expiration date
}
```

**Indexes**:
- `userId` (for user queries)
- `userId + isRead` (compound, for unread notifications)
- `createdAt` (for sorting)

---

## Relationships Summary

```
users (1) ──< (many) warranties
warranties (1) ──< (many) invoices (optional)
warranties (1) ──< (many) reminders
reminders (1) ──< (many) reminder_logs
users (1) ──< (many) notifications
```

---

## Data Validation Rules

### warranties
- `warrantyDuration` must be > 0
- `expiryDate` must be >= `purchaseDate`
- `status` is auto-calculated based on `expiryDate` vs current date
- `category` must be from predefined list

### reminders
- `scheduledDate` must be <= `warranty.expiryDate`
- Cannot create duplicate reminders for same `warrantyId` + `reminderType`
- Auto-created when warranty is created/updated

### invoices
- `fileSize` must be <= 10MB (configurable)
- `fileType` must be "image" or "pdf"
- `storageUrl` must be valid URL

---

## Query Patterns

### User Dashboard
```javascript
// Get user's warranties with status counts
db.warranties.aggregate([
  { $match: { userId: ObjectId("..."), isDeleted: false } },
  { $group: { _id: "$status", count: { $sum: 1 } } }
])
```

### Reminder Engine (Daily Job)
```javascript
// Get pending reminders due today
db.reminders.find({
  scheduledDate: { $lte: new Date() },
  status: "pending"
})
```

### Admin Dashboard
```javascript
// Get platform statistics
db.users.countDocuments({ status: "active" })
db.warranties.countDocuments({ isDeleted: false })
db.warranties.countDocuments({ status: "Expiring Soon", isDeleted: false })
```



Recommended order
Week 1: Core functionality
Warranty CRUD
Invoice management
Dashboard stats
Week 2: Automation & admin
Reminder system
Admin dashboard
Search & filters
Week 3: Polish & optional
UI improvements
OCR (optional)
Testing & deployment