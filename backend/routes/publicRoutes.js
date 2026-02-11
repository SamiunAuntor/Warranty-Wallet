const express = require('express');
const { getUsersCollection, getProductsCollection, getReminderLogsCollection } = require('../db');

const router = express.Router();

// Public stats for landing page (no auth required)
router.get('/stats', async (req, res) => {
  try {
    const users = await getUsersCollection();
    const products = await getProductsCollection();
    const reminderLogs = await getReminderLogsCollection();

    const baseProductMatch = { isDeleted: { $ne: true } };

    const [
      totalUsers,
      totalProducts,
      expiringSoonProducts,
      expiredProducts,
      remindersSent,
      topCategories,
    ] = await Promise.all([
      users.countDocuments({}),
      products.countDocuments(baseProductMatch),
      products.countDocuments({ ...baseProductMatch, status: 'Expiring Soon' }),
      products.countDocuments({ ...baseProductMatch, status: 'Expired' }),
      reminderLogs.countDocuments({ action: 'sent', channel: 'email' }),
      products
        .aggregate([
          { $match: baseProductMatch },
          {
            $group: {
              _id: '$category',
              count: { $sum: 1 },
            },
          },
          { $sort: { count: -1 } },
          { $limit: 3 },
        ])
        .toArray(),
    ]);

    return res.json({
      totalUsers,
      totalProducts,
      expiringSoonProducts,
      expiredProducts,
      remindersSent,
      topCategories: topCategories.map((c) => ({
        category: c._id || 'Uncategorized',
        count: c.count,
      })),
    });
  } catch (error) {
    console.error('Error fetching public stats:', error);
    return res.status(500).json({ message: 'Failed to fetch public stats.' });
  }
});

module.exports = router;


