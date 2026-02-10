# WarrantyWise Development Flow & Roadmap

## Current Status ✅
- ✅ Firebase Authentication (Email/Password + Google)
- ✅ User registration & login with MongoDB sync
- ✅ User model in MongoDB (`users` collection)
- ✅ Dashboard layout with sidebar navigation
- ✅ Basic routing structure
- ✅ Image upload to ImgBB
- ✅ Password reset functionality
- ✅ Toast notifications system
- ✅ Backend API structure (Express + MongoDB)

---

## Phase 1: Core Warranty Management (Priority: HIGH)

### 1.1 Backend - Warranty API
**Estimated Time**: 2-3 hours

**Tasks**:
- [ ] Create `warranties` collection model/helper in `backend/db.js`
- [ ] Create `backend/routes/warrantyRoutes.js` with CRUD endpoints:
  - `POST /api/warranties` - Create warranty
  - `GET /api/warranties` - Get user's warranties (with filters)
  - `GET /api/warranties/:id` - Get single warranty
  - `PUT /api/warranties/:id` - Update warranty
  - `DELETE /api/warranties/:id` - Soft delete warranty
- [ ] Add warranty status calculation logic (Active/Expiring Soon/Expired)
- [ ] Add validation middleware for warranty data
- [ ] Mount routes in `backend/index.js`

**Key Functions**:
```javascript
// Auto-calculate expiry date
expiryDate = purchaseDate + warrantyDuration (months)

// Auto-update status
if (expiryDate < today) → "Expired"
else if (expiryDate <= today + 30 days) → "Expiring Soon"
else → "Active"
```

---

### 1.2 Frontend - Warranty List & Create Form
**Estimated Time**: 3-4 hours

**Tasks**:
- [ ] Create `frontend/src/Pages/Dashboard/Warranties.jsx` page
- [ ] Create warranty list component with:
  - Status badges (color-coded)
  - Filter by status, category, brand
  - Search functionality
  - Sort by expiry date
- [ ] Create `frontend/src/Components/WarrantyForm.jsx` modal/form:
  - Product name, brand, category
  - Purchase date picker
  - Warranty duration input
  - Warranty type selector
  - Notes field
  - Service center info (optional)
- [ ] Integrate with backend API using `useAxios`
- [ ] Add success/error toasts
- [ ] Add route in `Router.jsx`

---

### 1.3 Frontend - Warranty Detail & Edit
**Estimated Time**: 2-3 hours

**Tasks**:
- [ ] Create `frontend/src/Pages/Dashboard/WarrantyDetail.jsx`
- [ ] Show full warranty information
- [ ] Edit warranty functionality
- [ ] Delete warranty with confirmation
- [ ] Show expiry countdown/progress
- [ ] Display claim readiness section

---

## Phase 2: Invoice Management (Priority: HIGH)

### 2.1 Backend - Invoice API
**Estimated Time**: 2 hours

**Tasks**:
- [ ] Create `invoices` collection helper in `backend/db.js`
- [ ] Create `backend/routes/invoiceRoutes.js`:
  - `POST /api/invoices` - Upload invoice (receives ImgBB URL)
  - `GET /api/invoices/:id` - Get invoice metadata
  - `GET /api/invoices/warranty/:warrantyId` - Get invoices for warranty
  - `DELETE /api/invoices/:id` - Delete invoice
- [ ] Link invoices to warranties
- [ ] Add file size/type validation

---

### 2.2 Frontend - Invoice Upload & View
**Estimated Time**: 3-4 hours

**Tasks**:
- [ ] Add invoice upload to warranty form/detail page
- [ ] Use existing `uploadImageToImgBB` utility
- [ ] Show invoice preview (thumbnail)
- [ ] Add "View Full Invoice" modal with image viewer
- [ ] Add download functionality
- [ ] Support PDF preview (if using PDF viewer library)

---

## Phase 3: Dashboard Analytics (Priority: MEDIUM)

### 3.1 Backend - Dashboard Stats API
**Estimated Time**: 1-2 hours

**Tasks**:
- [ ] Create `GET /api/dashboard/stats` endpoint
- [ ] Return aggregated data:
  - Total warranties
  - Active count
  - Expiring soon count
  - Expired count
  - By category breakdown
- [ ] Use MongoDB aggregation pipeline

---

### 3.2 Frontend - Dashboard Statistics
**Estimated Time**: 2-3 hours

**Tasks**:
- [ ] Update `frontend/src/Pages/Dashboard.jsx`
- [ ] Create stat cards component
- [ ] Add progress bars for warranty status
- [ ] Add category breakdown chart (optional: use Chart.js or Recharts)
- [ ] Add "Expiring Soon" list widget
- [ ] Fetch stats on page load

---

## Phase 4: Reminder System (Priority: HIGH)

### 4.1 Backend - Reminder Engine Setup
**Estimated Time**: 3-4 hours

**Tasks**:
- [ ] Create `reminders` collection helper
- [ ] Create `reminder_logs` collection helper
- [ ] Create `backend/routes/reminderRoutes.js` (for admin monitoring)
- [ ] Create `backend/services/reminderService.js`:
  - Function to create reminders when warranty is created/updated
  - Function to check and send pending reminders (daily job)
  - Function to update reminder status
- [ ] Create `backend/jobs/dailyReminderCheck.js`:
  - Query pending reminders due today
  - Send email notifications (using Nodemailer or SendGrid)
  - Create in-app notifications
  - Log all actions
- [ ] Set up cron job (using `node-cron`) to run daily at 9 AM

**Key Logic**:
```javascript
// When warranty created/updated:
- Create 3 reminders: 30 days, 7 days, expiry date
- scheduledDate = expiryDate - reminderOffset

// Daily job:
- Find reminders where scheduledDate <= today AND status = "pending"
- For each: Send email + Create notification + Update status
```

---

### 4.2 Email Service Setup
**Estimated Time**: 2-3 hours

**Tasks**:
- [ ] Install email service (Nodemailer recommended)
- [ ] Create `backend/services/emailService.js`
- [ ] Configure email templates for reminders
- [ ] Add email sending function
- [ ] Test email delivery
- [ ] Add environment variables for email config

---

### 4.3 Frontend - Notifications
**Estimated Time**: 2-3 hours

**Tasks**:
- [ ] Create `notifications` collection helper (backend)
- [ ] Create `GET /api/notifications` endpoint
- [ ] Create `PUT /api/notifications/:id/read` endpoint
- [ ] Create notification bell icon in DashboardLayout
- [ ] Create notifications dropdown/modal
- [ ] Mark as read functionality
- [ ] Real-time updates (optional: WebSocket or polling)

---

## Phase 5: Admin Features (Priority: MEDIUM)

### 5.1 Backend - Admin Routes & Middleware
**Estimated Time**: 2-3 hours

**Tasks**:
- [ ] Create `backend/middleware/authMiddleware.js`:
  - Verify Firebase token
  - Check user role from MongoDB
  - Protect admin routes
- [ ] Create `backend/routes/adminRoutes.js`:
  - `GET /api/admin/stats` - Platform statistics
  - `GET /api/admin/users` - List all users (paginated)
  - `PUT /api/admin/users/:id/status` - Update user status
  - `DELETE /api/admin/users/:id` - Delete user
  - `GET /api/admin/reminders/logs` - Reminder activity logs
- [ ] Add admin role check middleware

---

### 5.2 Frontend - Admin Dashboard
**Estimated Time**: 4-5 hours

**Tasks**:
- [ ] Create `frontend/src/Layouts/AdminLayout.jsx` (similar to DashboardLayout)
- [ ] Create `frontend/src/Pages/Admin/Dashboard.jsx`:
  - Total users stat
  - Active users stat
  - Total warranties stat
  - Expiring soon count
- [ ] Create `frontend/src/Pages/Admin/Users.jsx`:
  - User list table
  - Status filter
  - Activate/Suspend buttons
  - Delete user (with confirmation)
- [ ] Create `frontend/src/Pages/Admin/ReminderLogs.jsx`:
  - Reminder activity table
  - Filter by date, status
  - Error logs display
- [ ] Add admin route protection (redirect if not admin)
- [ ] Add admin navigation in sidebar

---

## Phase 6: Search & Filter (Priority: MEDIUM)

### 6.1 Enhanced Search
**Estimated Time**: 2 hours

**Tasks**:
- [ ] Add search input to warranties page
- [ ] Implement backend search endpoint with MongoDB text search
- [ ] Search by product name, brand
- [ ] Add debouncing for performance

---

### 6.2 Advanced Filters
**Estimated Time**: 2 hours

**Tasks**:
- [ ] Add filter UI components
- [ ] Filter by category, warranty type, status
- [ ] Sort by expiry date, recently added
- [ ] Persist filters in URL query params

---

## Phase 7: UI/UX Polish (Priority: LOW)

### 7.1 Empty States
**Estimated Time**: 1 hour
- [ ] Add empty state for no warranties
- [ ] Add empty state for no invoices
- [ ] Add helpful CTAs

---

### 7.2 Loading States
**Estimated Time**: 1 hour
- [ ] Add skeleton loaders
- [ ] Add loading spinners
- [ ] Improve button loading states

---

### 7.3 Responsive Design
**Estimated Time**: 2-3 hours
- [ ] Test mobile responsiveness
- [ ] Fix mobile navigation
- [ ] Optimize forms for mobile
- [ ] Test tablet layouts

---

## Phase 8: Optional Features (Priority: LOW)

### 8.1 OCR Invoice Scanning
**Estimated Time**: 4-6 hours

**Tasks**:
- [ ] Research OCR API (Tesseract.js, Google Vision, or AWS Textract)
- [ ] Create OCR service in backend
- [ ] Add "Scan Invoice" button
- [ ] Show extracted data in form
- [ ] Allow user to edit/correct

---

### 8.2 Export Functionality
**Estimated Time**: 2 hours
- [ ] Export warranties as CSV/PDF
- [ ] Add export button in dashboard

---

## Recommended Development Order

### Week 1: Core Functionality
1. **Day 1-2**: Phase 1.1 + 1.2 (Warranty CRUD)
2. **Day 3**: Phase 1.3 (Warranty Detail/Edit)
3. **Day 4**: Phase 2 (Invoice Management)
4. **Day 5**: Phase 3 (Dashboard Stats)

### Week 2: Automation & Admin
1. **Day 1-2**: Phase 4 (Reminder System)
2. **Day 3**: Phase 5 (Admin Features)
3. **Day 4**: Phase 6 (Search & Filter)
4. **Day 5**: Phase 7 (UI Polish) + Testing

### Week 3: Optional & Polish
1. Phase 8 (Optional features)
2. Final testing
3. Documentation
4. Deployment preparation

---

## Technical Decisions Needed

1. **Email Service**: Choose Nodemailer (free) or SendGrid/Mailgun (paid, more reliable)
2. **Cron Job**: Use `node-cron` (simple) or external service (Heroku Scheduler, AWS EventBridge)
3. **PDF Viewer**: Use `react-pdf` or embed Google Docs viewer
4. **Charts**: Use `recharts` or `chart.js` for dashboard analytics
5. **File Storage**: Continue with ImgBB or migrate to Firebase Storage/AWS S3

---

## Environment Variables Needed

```env
# Backend
MONGODB_URI=...
PORT=5000
DB_NAME=warranty_wise

# Email Service
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@warrantywise.com

# Frontend
VITE_API_BASE_URL=http://localhost:5000
VITE_IMGBB_KEY=...
# Firebase config...
```

---

## Testing Checklist

- [ ] User can create warranty
- [ ] User can edit/delete warranty
- [ ] Status auto-updates correctly
- [ ] Invoice uploads and displays
- [ ] Dashboard shows correct stats
- [ ] Reminders are created automatically
- [ ] Daily reminder job runs correctly
- [ ] Email notifications are sent
- [ ] Admin can view/manage users
- [ ] Search and filters work
- [ ] Mobile responsive
- [ ] Error handling works

---

## Deployment Considerations

1. **Backend**: Deploy to Heroku, Railway, or AWS
2. **Frontend**: Deploy to Vercel, Netlify, or Firebase Hosting
3. **Cron Jobs**: Use Heroku Scheduler, AWS EventBridge, or separate worker process
4. **Database**: MongoDB Atlas (already set up)
5. **File Storage**: Continue ImgBB or migrate to cloud storage

---

## Next Immediate Steps (Start Here)

1. **Create warranty backend routes** (Phase 1.1)
2. **Create warranty form component** (Phase 1.2)
3. **Test warranty CRUD operations**
4. **Add invoice upload to warranty form**
5. **Build dashboard statistics**

Start with Phase 1.1 - it's the foundation for everything else!

