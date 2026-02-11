# Email Reminder System Implementation Guide

## Overview
This guide will help you implement an automated email reminder system that sends emails when products transition from "Active" to "Expiring Soon" status.

---

## Prerequisites

- Node.js backend running
- MongoDB connection working
- Products collection with status tracking
- Daily reminder job skeleton exists (`backend/jobs/dailyReminderCheck.js`)

---

## Step 1: Install Nodemailer

**Location:** `backend/` directory

**Command:**
```bash
cd backend
npm install nodemailer
```

**Verify installation:**
- Check `backend/package.json` should have `nodemailer` in dependencies

---

## Step 2: Set Up Gmail App Password (For Testing)

1. Go to your Google Account: https://myaccount.google.com/
2. Navigate to **Security** → **2-Step Verification** (enable if not already)
3. Scroll down to **App passwords**
4. Select **Mail** and **Other (Custom name)**
5. Name it "WarrantyWallet" or similar
6. Click **Generate**
7. **Copy the 16-character password** (you'll need this for `.env`)

**Important:** This is NOT your regular Gmail password. It's a special app password.

---

## Step 3: Add Email Configuration to `.env`

**Location:** `backend/.env`

**Add these variables:**
```env
# Email Configuration (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password
EMAIL_FROM=noreply@warrantywallet.com
EMAIL_FROM_NAME=WarrantyWallet
```

**Replace:**
- `your-email@gmail.com` with your actual Gmail address
- `your-16-character-app-password` with the app password from Step 2
- `EMAIL_FROM` can be your Gmail address or a custom name

---

## Step 4: Create Email Service

**Location:** `backend/services/emailService.js`

**Create the file with this code:**

```javascript
const nodemailer = require('nodemailer');

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.error('❌ Email service error:', error);
  } else {
    console.log('✅ Email service is ready to send messages');
  }
});

/**
 * Send expiring soon reminder email
 * @param {string} userEmail - Recipient email address
 * @param {string} userName - Recipient name
 * @param {Object} product - Product object with details
 * @param {number} daysRemaining - Days until warranty expires
 * @returns {Promise<Object>} - Email send result
 */
async function sendExpiringSoonEmail(userEmail, userName, product, daysRemaining) {
  const expiryDate = new Date(product.expiryDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const subject = `⚠️ Warranty Expiring Soon: ${product.productName}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
        .product-card { background: #f9fafb; border-left: 4px solid #f59e0b; padding: 20px; margin: 20px 0; border-radius: 5px; }
        .product-name { font-size: 20px; font-weight: bold; color: #111827; margin-bottom: 10px; }
        .detail-row { margin: 10px 0; }
        .label { font-weight: bold; color: #6b7280; }
        .value { color: #111827; }
        .warning { background: #fef3c7; border: 1px solid #fbbf24; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .cta-button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
        .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>⚠️ Warranty Expiring Soon</h1>
        </div>
        <div class="content">
          <p>Hello ${userName || 'there'},</p>
          
          <p>We wanted to remind you that one of your product warranties is expiring soon!</p>
          
          <div class="product-card">
            <div class="product-name">${product.productName}</div>
            <div class="detail-row">
              <span class="label">Brand:</span>
              <span class="value">${product.brand || 'N/A'}</span>
            </div>
            <div class="detail-row">
              <span class="label">Category:</span>
              <span class="value">${product.category || 'N/A'}</span>
            </div>
            <div class="detail-row">
              <span class="label">Expiry Date:</span>
              <span class="value">${expiryDate}</span>
            </div>
            <div class="detail-row">
              <span class="label">Days Remaining:</span>
              <span class="value"><strong>${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}</strong></span>
            </div>
            ${product.serviceCenterName ? `
            <div class="detail-row">
              <span class="label">Service Center:</span>
              <span class="value">${product.serviceCenterName}${product.serviceCenterPhone ? ` (${product.serviceCenterPhone})` : ''}</span>
            </div>
            ` : ''}
          </div>
          
          <div class="warning">
            <strong>⏰ Action Required:</strong> Your warranty will expire in ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}. 
            Make sure to file any claims or schedule service before the expiry date.
          </div>
          
          <div style="text-align: center;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard/products" class="cta-button">
              View Product Details
            </a>
          </div>
          
          <p>Thank you for using WarrantyWallet!</p>
        </div>
        <div class="footer">
          <p>This is an automated reminder from WarrantyWallet.</p>
          <p>You're receiving this because you have a product with an expiring warranty.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const textContent = `
Warranty Expiring Soon: ${product.productName}

Hello ${userName || 'there'},

We wanted to remind you that one of your product warranties is expiring soon!

Product Details:
- Product: ${product.productName}
- Brand: ${product.brand || 'N/A'}
- Category: ${product.category || 'N/A'}
- Expiry Date: ${expiryDate}
- Days Remaining: ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}
${product.serviceCenterName ? `- Service Center: ${product.serviceCenterName}${product.serviceCenterPhone ? ` (${product.serviceCenterPhone})` : ''}` : ''}

⚠️ Action Required: Your warranty will expire in ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}. 
Make sure to file any claims or schedule service before the expiry date.

View your product: ${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard/products

Thank you for using WarrantyWallet!
  `;

  const mailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME || 'WarrantyWallet'}" <${process.env.EMAIL_FROM}>`,
    to: userEmail,
    subject: subject,
    text: textContent,
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${userEmail}:`, info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Error sending email to ${userEmail}:`, error);
    throw error;
  }
}

/**
 * Send test email (for testing purposes)
 * @param {string} testEmail - Email address to send test to
 * @returns {Promise<Object>} - Email send result
 */
async function sendTestEmail(testEmail) {
  const mailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME || 'WarrantyWallet'}" <${process.env.EMAIL_FROM}>`,
    to: testEmail,
    subject: 'Test Email from WarrantyWallet',
    text: 'This is a test email from WarrantyWallet email service.',
    html: '<p>This is a <strong>test email</strong> from WarrantyWallet email service.</p>',
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Test email sent to ${testEmail}:`, info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Error sending test email:`, error);
    throw error;
  }
}

module.exports = {
  sendExpiringSoonEmail,
  sendTestEmail,
};
```

---

## Step 5: Update Products Collection Schema

**Location:** `backend/routes/productRoutes.js` (or wherever products are created/updated)

**Add these fields when creating/updating products:**

```javascript
// When creating a product, add:
reminderEmailSent: false,
lastStatus: null,

// When updating status, save previous status:
lastStatus: product.status, // before updating
```

**Or update existing products migration (run once):**

```javascript
// In a migration script or directly in MongoDB
db.products.updateMany(
  { reminderEmailSent: { $exists: false } },
  { $set: { reminderEmailSent: false, lastStatus: null } }
);
```

---

## Step 6: Update Daily Reminder Job

**Location:** `backend/jobs/dailyReminderCheck.js`

**Replace the entire file with this:**

```javascript
const cron = require('node-cron');
const { getRemindersCollection, getReminderLogsCollection, getProductsCollection, getUsersCollection } = require('../db');
const { sendExpiringSoonEmail } = require('../services/emailService');

/**
 * Calculate days remaining until expiry
 */
function getDaysRemaining(expiryDate) {
  const now = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Process products that have transitioned to "Expiring Soon" status
 */
async function processExpiringSoonReminders() {
  const products = await getProductsCollection();
  const users = await getUsersCollection();
  const logs = await getReminderLogsCollection();

  const now = new Date();

  // Find products that:
  // 1. Have status "Expiring Soon"
  // 2. Haven't had reminder email sent yet
  const expiringProducts = await products
    .find({
      status: 'Expiring Soon',
      reminderEmailSent: { $ne: true },
      isDeleted: { $ne: true },
    })
    .toArray();

  if (!expiringProducts.length) {
    console.log('📧 No expiring products requiring email reminders.');
    return;
  }

  console.log(`📧 Processing ${expiringProducts.length} expiring product(s) for email reminders...`);

  let successCount = 0;
  let errorCount = 0;

  for (const product of expiringProducts) {
    try {
      // Get user details
      const user = await users.findOne({ _id: product.userId });
      
      if (!user || !user.email) {
        console.warn(`⚠️ User not found or no email for product ${product._id}`);
        continue;
      }

      // Calculate days remaining
      const daysRemaining = getDaysRemaining(product.expiryDate);

      // Send email
      await sendExpiringSoonEmail(
        user.email,
        user.name || 'User',
        product,
        daysRemaining
      );

      // Mark as sent
      await products.updateOne(
        { _id: product._id },
        {
          $set: {
            reminderEmailSent: true,
            reminderEmailSentAt: now,
            lastStatus: 'Expiring Soon',
          },
        }
      );

      // Log success
      await logs.insertOne({
        productId: product._id,
        userId: product.userId,
        reminderType: 'expiring_soon_email',
        action: 'sent',
        channel: 'email',
        recipientEmail: user.email,
        daysRemaining: daysRemaining,
        timestamp: now,
      });

      successCount++;
      console.log(`✅ Email sent for product: ${product.productName} (${user.email})`);

      // Rate limiting: wait 1 second between emails to avoid spam filters
      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error) {
      errorCount++;
      console.error(`❌ Error processing reminder for product ${product._id}:`, error);

      // Log error
      await logs.insertOne({
        productId: product._id,
        userId: product.userId,
        reminderType: 'expiring_soon_email',
        action: 'failed',
        channel: 'email',
        errorMessage: error.message,
        timestamp: now,
      });
    }
  }

  console.log(`📊 Email reminder job completed: ${successCount} sent, ${errorCount} failed`);
}

/**
 * Process due reminders (existing functionality - keep if needed)
 */
async function processDueReminders() {
  const reminders = await getRemindersCollection();
  const logs = await getReminderLogsCollection();
  const products = await getProductsCollection();

  const now = new Date();

  const dueReminders = await reminders
    .find({
      scheduledDate: { $lte: now },
      status: 'pending',
    })
    .toArray();

  if (!dueReminders.length) return;

  console.log(`🔔 Processing ${dueReminders.length} due reminders...`);

  for (const reminder of dueReminders) {
    try {
      const product = await products.findOne({ _id: reminder.productId });

      console.log(
        `Reminder for product "${product?.productName || 'Unknown'}" (${reminder.reminderType})`
      );

      await reminders.updateOne(
        { _id: reminder._id },
        {
          $set: {
            status: 'sent',
            sentAt: new Date(),
            emailSent: true,
          },
        }
      );

      await logs.insertOne({
        reminderId: reminder._id,
        productId: reminder.productId,
        userId: reminder.userId,
        reminderType: reminder.reminderType,
        action: 'sent',
        channel: 'email',
        timestamp: new Date(),
      });
    } catch (error) {
      console.error('Error processing reminder', reminder._id, error);

      await reminders.updateOne(
        { _id: reminder._id },
        { $set: { status: 'failed', updatedAt: new Date() } }
      );

      await logs.insertOne({
        reminderId: reminder._id,
        productId: reminder.productId,
        userId: reminder.userId,
        reminderType: reminder.reminderType,
        action: 'failed',
        channel: 'email',
        errorMessage: error.message,
        timestamp: new Date(),
      });
    }
  }
}

/**
 * Start daily reminder job
 */
function startDailyReminderJob() {
  // Every day at 09:00 server time
  cron.schedule('0 9 * * *', () => {
    console.log('🕘 Running daily reminder check...');
    Promise.all([
      processExpiringSoonReminders(),
      processDueReminders(),
    ]).catch((err) => {
      console.error('Error in daily reminder job:', err);
    });
  });

  console.log('✅ Daily reminder job scheduled (runs daily at 9:00 AM)');
}

module.exports = {
  startDailyReminderJob,
  processExpiringSoonReminders, // Export for manual testing
};
```

---

## Step 7: Update Product Status Calculation

**Location:** `backend/routes/productRoutes.js`

**When updating product status, ensure you save `lastStatus` before calculating new status:**

```javascript
// Before calculating new status, save current status
const currentProduct = await products.findOne({ _id: productId });
const lastStatus = currentProduct.status;

// Calculate new status
const newStatus = computeStatus(expiryDate);

// Update product with both status and lastStatus
await products.updateOne(
  { _id: productId },
  {
    $set: {
      status: newStatus,
      lastStatus: lastStatus,
      updatedAt: new Date(),
    },
  }
);
```

---

## Step 8: Add Frontend URL to Environment

**Location:** `backend/.env`

**Add:**
```env
FRONTEND_URL=http://localhost:5173
```

**For production, update to your actual frontend URL:**
```env
FRONTEND_URL=https://your-domain.com
```

---

## Step 9: Test Email Service

**Create a test script:** `backend/scripts/testEmail.js`

```javascript
require('dotenv').config();
const { sendTestEmail } = require('../services/emailService');

async function test() {
  try {
    const result = await sendTestEmail(process.env.EMAIL_USER); // Send to yourself
    console.log('✅ Test email sent successfully!', result);
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
  process.exit(0);
}

test();
```

**Run test:**
```bash
cd backend
node scripts/testEmail.js
```

**Check your inbox** - you should receive a test email.

---

## Step 10: Test the Reminder System

### Option A: Manual Test (Recommended)

1. **Create a test product** with expiry date 29 days from now (to trigger "Expiring Soon")
2. **Manually set status** in MongoDB:
   ```javascript
   db.products.updateOne(
     { productName: "Test Product" },
     { 
       $set: { 
         status: "Expiring Soon",
         reminderEmailSent: false 
       } 
     }
   );
   ```
3. **Manually run the job** (create a test script):

**Create:** `backend/scripts/testReminder.js`
```javascript
require('dotenv').config();
const { processExpiringSoonReminders } = require('../jobs/dailyReminderCheck');
const { connectDB } = require('../db');

async function test() {
  try {
    await connectDB();
    console.log('✅ Connected to database');
    await processExpiringSoonReminders();
    console.log('✅ Test completed');
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
  process.exit(0);
}

test();
```

**Run:**
```bash
cd backend
node scripts/testReminder.js
```

4. **Check your email** - you should receive the reminder email.

### Option B: Wait for Scheduled Job

- Wait until 9:00 AM server time
- The job will run automatically
- Check logs for email sending confirmation

---

## Step 11: Verify Implementation

**Checklist:**
- [ ] Nodemailer installed
- [ ] `.env` file has email configuration
- [ ] Email service file created
- [ ] Daily reminder job updated
- [ ] Test email sent successfully
- [ ] Products have `reminderEmailSent` field
- [ ] Test reminder job runs and sends email
- [ ] Email received in inbox
- [ ] `reminderEmailSent` flag set to `true` after sending

---

## Troubleshooting

### Issue: "Invalid login" error
**Solution:** 
- Verify Gmail App Password is correct (16 characters, no spaces)
- Ensure 2-Step Verification is enabled
- Check `EMAIL_USER` matches your Gmail address exactly

### Issue: Email not sending
**Solution:**
- Check server logs for error messages
- Verify `.env` file is loaded (check `process.env.EMAIL_HOST`)
- Test email service separately using test script
- Check Gmail account for security alerts

### Issue: Duplicate emails
**Solution:**
- Verify `reminderEmailSent` flag is being set correctly
- Check if multiple jobs are running simultaneously
- Ensure `reminderEmailSent` is checked in query

### Issue: Emails going to spam
**Solution:**
- Use a custom domain email (SendGrid/Mailgun) for production
- Add SPF/DKIM records for your domain
- For Gmail, emails may go to spam initially - mark as "Not Spam"

### Issue: Job not running
**Solution:**
- Verify cron syntax: `'0 9 * * *'` (9 AM daily)
- Check server timezone matches expected time
- Ensure job is started in `backend/index.js`:
  ```javascript
  const { startDailyReminderJob } = require('./jobs/dailyReminderCheck');
  // After DB connection
  startDailyReminderJob();
  ```

---

## Production Considerations

1. **Use SendGrid or Mailgun** instead of Gmail for better deliverability
2. **Add retry logic** for failed emails
3. **Implement rate limiting** to avoid spam filters
4. **Add email templates** for different reminder types
5. **Monitor email delivery** rates
6. **Set up email analytics** (open rates, click rates)

---

## Next Steps

After implementation:
1. Monitor email delivery for first few days
2. Check spam folder initially
3. Gather user feedback on email content
4. Consider adding more reminder types (7 days, 1 day before expiry)
5. Add unsubscribe functionality (if needed)

---

## Support

If you encounter issues:
1. Check server logs for detailed error messages
2. Verify all environment variables are set correctly
3. Test email service independently
4. Check MongoDB for correct product status and flags

---

**Implementation Complete! 🎉**

Your email reminder system should now automatically send emails when products enter "Expiring Soon" status.

