const { getRemindersCollection } = require('../db');

const REMINDER_OFFSETS_DAYS = {
  '30_days': 30,
  '7_days': 7,
  expiry_date: 0,
};

function subtractDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() - days);
  return d;
}

async function scheduleRemindersForProduct(product) {
  if (!product.expiryDate || !product.userId || !product._id) return;

  const reminders = await getRemindersCollection();

  const expiryDate = new Date(product.expiryDate);

  const ops = Object.entries(REMINDER_OFFSETS_DAYS).map(([type, days]) => {
    const scheduledDate = subtractDays(expiryDate, days);

    return reminders.updateOne(
      {
        productId: product._id,
        userId: product.userId,
        reminderType: type,
      },
      {
        $set: {
          productId: product._id,
          userId: product.userId,
          reminderType: type,
          scheduledDate,
          status: 'pending',
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
          emailSent: false,
          inAppSent: false,
        },
      },
      { upsert: true }
    );
  });

  await Promise.all(ops);
}

module.exports = {
  scheduleRemindersForProduct,
};



