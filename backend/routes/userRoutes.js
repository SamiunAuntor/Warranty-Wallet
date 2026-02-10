const express = require('express');
const { getUsersCollection } = require('../db');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

// Create or update user document based on email (used during auth sync)
router.post('/', async (req, res) => {
  try {
    const { name, email, photoURL } = req.body;

    console.log('📥 Received user sync request:', { name, email, photoURL: photoURL ? 'provided' : 'not provided' });

    if (!name || !email) {
      console.error('❌ Validation failed: name and email are required');
      return res.status(400).json({ message: 'Name and email are required' });
    }

    const users = await getUsersCollection();
    console.log('✅ Got users collection');

    const now = new Date();

    const updateDoc = {
      $set: {
        name,
        email,
        updatedAt: now,
      },
      $setOnInsert: {
        role: 'user',
        status: 'active',
        createdAt: now,
      },
    };

    if (photoURL) {
      updateDoc.$set.photoURL = photoURL;
    }

    console.log('🔄 Attempting to upsert user with email:', email);
    const result = await users.findOneAndUpdate(
      { email },
      updateDoc,
      {
        upsert: true,
        returnDocument: 'after',
      }
    );

    if (result.value) {
      console.log('✅ User successfully saved/updated in database:', result.value._id);
      return res.status(200).json(result.value);
    } else {
      console.error('❌ No document returned from findOneAndUpdate');
      return res.status(500).json({ message: 'Failed to save user' });
    }
  } catch (err) {
    console.error('❌ Error syncing user:', err);
    console.error('Error stack:', err.stack);
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});

// Get current authenticated user profile
router.get('/me', authenticate, async (req, res) => {
  try {
    return res.json(req.user);
  } catch (err) {
    console.error('Error fetching current user profile:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
