const cron = require('node-cron');
const { getRemindersCollection, getReminderLogsCollection, getProductsCollection } = require('../db');

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
      // In a real system, send email + in-app notification here.
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

function startDailyReminderJob() {
  // Every day at 09:00 server time
  cron.schedule('0 9 * * *', () => {
    console.log('🕘 Running daily reminder check...');
    processDueReminders().catch((err) =>
      console.error('Error in daily reminder job:', err)
    );
  });
}

module.exports = {
  startDailyReminderJob,
};


