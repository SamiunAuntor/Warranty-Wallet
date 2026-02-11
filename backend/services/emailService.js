const nodemailer = require('nodemailer');

let cachedTransporter = null;

function getTransporter() {
  if (cachedTransporter) return cachedTransporter;

  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    // Don't crash the server: throw only when attempting to send.
    throw new Error('Email is not configured. Missing EMAIL_USER or EMAIL_PASS.');
  }

  cachedTransporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
    auth: { user, pass },
  });

  return cachedTransporter;
}

// Verify email service on module load (non-blocking)
(function verifyEmailService() {
  setTimeout(() => {
    try {
      const transporter = getTransporter();
      transporter.verify(function (error, success) {
        if (error) {
          console.error('❌ Email service error:', error.message);
        } else {
          console.log('✅ Email service is ready to send messages');
        }
      });
    } catch (error) {
      console.warn('⚠️ Email service not configured:', error.message);
    }
  }, 1000); // Wait 1 second for env to be fully loaded
})();

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
          
          <p>Thank you for using WarrantyWise!</p>
        </div>
        <div class="footer">
          <p>This is an automated reminder from WarrantyWise.</p>
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

Thank you for using WarrantyWise!
  `;

  const mailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME || 'WarrantyWise'}" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: subject,
    text: textContent,
    html: htmlContent,
  };

  try {
    const transporter = getTransporter();
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
    from: `"${process.env.EMAIL_FROM_NAME || 'WarrantyWise'}" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
    to: testEmail,
    subject: 'Test Email from WarrantyWise',
    text: 'This is a test email from WarrantyWise email service.',
    html: '<p>This is a <strong>test email</strong> from WarrantyWise email service.</p>',
  };

  try {
    const transporter = getTransporter();
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

