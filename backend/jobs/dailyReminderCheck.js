const cron = require('node-cron');
const { ObjectId } = require('mongodb');
const {
  getRemindersCollection,
  getReminderLogsCollection,
  getProductsCollection,
  getUsersCollection,
} = require('../db');
const { sendExpiringSoonEmail } = require('../services/emailService');

const EXPIRING_SOON_DAYS = 30;

function computeStatus(expiryDate) {
  const now = new Date();
  const endOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59,
    999
  );

  if (expiryDate < endOfToday) return 'Expired';

  const diffMs = new Date(expiryDate).getTime() - now.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  if (diffDays <= EXPIRING_SOON_DAYS) return 'Expiring Soon';

  return 'Active';
}

function daysRemaining(expiryDate) {
  const now = new Date();
  const diffMs = new Date(expiryDate).getTime() - now.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

function normalizeObjectId(value) {
  if (!value) return null;
  if (value instanceof ObjectId) return value;
  if (typeof value === 'string' && ObjectId.isValid(value)) return new ObjectId(value);
  return null;
}

async function processProductStatusTransitionsAndEmails() {
  const products = await getProductsCollection();
  const users = await getUsersCollection();
  const logs = await getReminderLogsCollection();

  const cursor = products.find({ isDeleted: { $ne: true } });

  let scanned = 0;
  let updatedStatuses = 0;
  let emailsSent = 0;
  let emailFailures = 0;

  for await (const product of cursor) {
    scanned += 1;

    const currentStatus = product.status || 'Active';
    const newStatus = computeStatus(product.expiryDate);

    // Keep status in DB in sync daily (important for dashboard aggregation).
    if (newStatus !== currentStatus) {
      updatedStatuses += 1;
      await products.updateOne(
        { _id: product._id },
        { $set: { status: newStatus, updatedAt: new Date() } }
      );
    }

    // Trigger: Send email for "Expiring Soon" products (exactly once per product)
    // Doesn't matter how it got to "Expiring Soon" - send email if not already sent
    const emailAlreadySent = Boolean(product.expiringSoonEmailSentAt);

    // Send email if product is "Expiring Soon" and email hasn't been sent yet
    if (newStatus === 'Expiring Soon' && !emailAlreadySent) {
      const userId = normalizeObjectId(product.userId);
      if (!userId) {
        await logs.insertOne({
          productId: product._id,
          userId: product.userId,
          reminderType: 'expiring_soon_transition_email',
          action: 'failed',
          channel: 'email',
          errorMessage: 'Invalid product.userId; cannot resolve user email',
          timestamp: new Date(),
        });
        emailFailures += 1;
        continue;
      }

      const user = await users.findOne({ _id: userId });
      if (!user?.email) {
        await logs.insertOne({
          productId: product._id,
          userId,
          reminderType: 'expiring_soon_transition_email',
          action: 'failed',
          channel: 'email',
          errorMessage: 'User not found or missing email',
          timestamp: new Date(),
        });
        emailFailures += 1;
        continue;
      }

      try {
        await sendExpiringSoonEmail(user.email, user.name, product, daysRemaining(product.expiryDate));

        emailsSent += 1;
        await products.updateOne(
          { _id: product._id },
          {
            $set: {
              expiringSoonEmailSentAt: new Date(),
              expiringSoonEmailSentForExpiryDate: product.expiryDate,
              updatedAt: new Date(),
            },
          }
        );

        await logs.insertOne({
          productId: product._id,
          userId,
          reminderType: 'expiring_soon_transition_email',
          action: 'sent',
          channel: 'email',
          recipientEmail: user.email,
          timestamp: new Date(),
        });
      } catch (error) {
        emailFailures += 1;
        await logs.insertOne({
          productId: product._id,
          userId,
          reminderType: 'expiring_soon_transition_email',
          action: 'failed',
          channel: 'email',
          errorMessage: error.message,
          timestamp: new Date(),
        });
      }
    }
  }


}

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


  for (const reminder of dueReminders) {
    try {
      // In a real system, send email + in-app notification here.
      const product = await products.findOne({ _id: reminder.productId });

      

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

function startDailyReminderJob() {
  // Every day at 09:00 server time (commented out for testing)
  // cron.schedule('0 9 * * *', () => {
  //   console.log('🕘 Running daily reminder check...');
  //   Promise.all([processProductStatusTransitionsAndEmails(), processDueReminders()]).catch((err) =>
  //     console.error('Error in daily reminder job:', err)
  //   );
  // });

  // Testing: Run every minute
  cron.schedule('* * * * *', () => {
    Promise.all([processProductStatusTransitionsAndEmails(), processDueReminders()]).catch((err) =>
      console.error('Error in daily reminder job:', err)
    );
  });
  
}

module.exports = {
  startDailyReminderJob,
  processProductStatusTransitionsAndEmails, // Export for manual testing
};



