const express = require('express');
const { ObjectId } = require('mongodb');
const { getUsersCollection, getProductsCollection, getReminderLogsCollection, getInvoicesCollection } = require('../db');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use((req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required.' });
  }
  next();
});

// Get admin dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const users = await getUsersCollection();
    const products = await getProductsCollection();
    const reminderLogs = await getReminderLogsCollection();
    const invoices = await getInvoicesCollection();

    const baseProductMatch = { isDeleted: { $ne: true } };
    const baseUserMatch = { isDeleted: { $ne: true } };

    const [
      totalUsers,
      activeUsers,
      suspendedUsers,
      totalProducts,
      activeProducts,
      expiringSoonProducts,
      expiredProducts,
      remindersSent,
      totalInvoices,
      recentUsers,
      topCategories,
    ] = await Promise.all([
      users.countDocuments(baseUserMatch),
      users.countDocuments({ ...baseUserMatch, status: 'active' }),
      users.countDocuments({ ...baseUserMatch, status: 'suspended' }),
      products.countDocuments(baseProductMatch),
      products.countDocuments({ ...baseProductMatch, status: 'Active' }),
      products.countDocuments({ ...baseProductMatch, status: 'Expiring Soon' }),
      products.countDocuments({ ...baseProductMatch, status: 'Expired' }),
      reminderLogs.countDocuments({ action: 'sent', channel: 'email' }),
      invoices.countDocuments({ isDeleted: { $ne: true } }),
      users
        .find(baseUserMatch)
        .sort({ createdAt: -1 })
        .limit(5)
        .toArray(),
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
          { $limit: 5 },
        ])
        .toArray(),
    ]);

    // Get user registration trend (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const userRegistrationTrend = await users
      .aggregate([
        {
          $match: {
            ...baseUserMatch,
            createdAt: { $gte: sevenDaysAgo },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ])
      .toArray();

    return res.json({
      totalUsers,
      activeUsers,
      suspendedUsers,
      totalProducts,
      activeProducts,
      expiringSoonProducts,
      expiredProducts,
      remindersSent,
      totalInvoices,
      recentUsers: recentUsers.map((u) => ({
        _id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        status: u.status,
        createdAt: u.createdAt,
      })),
      topCategories: topCategories.map((c) => ({
        category: c._id || 'Uncategorized',
        count: c.count,
      })),
      userRegistrationTrend,
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return res.status(500).json({ message: 'Failed to fetch admin stats.' });
  }
});

// Get all users (for user management)
router.get('/users', async (req, res) => {
  try {
    const users = await getUsersCollection();
    const userList = await users
      .find({ isDeleted: { $ne: true } })
      .sort({ createdAt: -1 })
      .toArray();

    return res.json(userList);
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ message: 'Failed to fetch users.' });
  }
});

// Update user status
router.put('/users/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user id.' });
    }

    if (!['active', 'suspended', 'deleted'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be active, suspended, or deleted.' });
    }

    const users = await getUsersCollection();
    const user = await users.findOne({ _id: new ObjectId(id) });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Prevent admin from deleting themselves
    if (user.email === req.user.email && status === 'deleted') {
      return res.status(400).json({ message: 'You cannot delete your own account.' });
    }

    const updateData = {
      status,
      updatedAt: new Date(),
    };

    if (status === 'deleted') {
      updateData.isDeleted = true;
    } else {
      updateData.isDeleted = false;
    }

    await users.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    return res.json({ message: 'User status updated successfully.' });
  } catch (error) {
    console.error('Error updating user status:', error);
    return res.status(500).json({ message: 'Failed to update user status.' });
  }
});

module.exports = router;

