const express = require('express');
const { getProductsCollection } = require('../db');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authenticate);

// User-level dashboard stats + latest 5 products
router.get('/user', async (req, res) => {
  try {
    const products = await getProductsCollection();

    const baseMatch = { userId: req.user.id, isDeleted: { $ne: true } };

    const [
      totalProducts,
      activeWarranties,
      expiringSoonWarranties,
      expiredWarranties,
      byCategory,
      latestProducts,
    ] = await Promise.all([
      products.countDocuments(baseMatch),
      products.countDocuments({ ...baseMatch, status: 'Active' }),
      products.countDocuments({ ...baseMatch, status: 'Expiring Soon' }),
      products.countDocuments({ ...baseMatch, status: 'Expired' }),
      products.aggregate([
        { $match: baseMatch },
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
      ]).toArray(),
      products
        .find(baseMatch)
        .sort({ createdAt: -1 })
        .limit(5)
        .toArray(),
    ]);

    return res.json({
      totalProducts,
      activeWarranties,
      expiringSoonWarranties,
      expiredWarranties,
      byCategory: byCategory.map((c) => ({
        category: c._id,
        count: c.count,
      })),
      latestProducts,
    });
  } catch (error) {
    console.error('Error fetching user dashboard stats:', error);
    return res.status(500).json({ message: 'Failed to fetch dashboard stats.' });
  }
});

module.exports = router;
