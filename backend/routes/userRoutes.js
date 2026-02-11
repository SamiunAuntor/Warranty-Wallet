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
    // Use updateOne + findOne instead of findOneAndUpdate to avoid driver edge cases
    await users.updateOne({ email }, updateDoc, { upsert: true });

    const userDoc = await users.findOne({ email });

    if (!userDoc) {
      console.error('❌ No document returned after upsert for email:', email);
      return res.status(500).json({ message: 'Failed to save user' });
    }

    console.log('✅ User successfully saved/updated in database:', userDoc._id);
    return res.status(200).json(userDoc);
  } catch (err) {
    console.error('❌ Error syncing user:', err);
    console.error('Error stack:', err.stack);
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});

// Get current authenticated user profile (full document)
router.get('/me', authenticate, async (req, res) => {
  try {
    const users = await getUsersCollection();
    const userDoc = await users.findOne({ _id: req.user.id });

    if (!userDoc) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Sanitize response (avoid leaking internal fields if added later)
    const { _id, password, ...rest } = userDoc;

    return res.json({
      id: _id,
      ...rest,
    });
  } catch (err) {
    console.error('Error fetching current user profile:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Update current authenticated user profile (name, photo)
router.put('/me', authenticate, async (req, res) => {
  try {
    const { name, photoURL } = req.body || {};

    if (!name && !photoURL) {
      return res.status(400).json({ message: 'Nothing to update.' });
    }

    const users = await getUsersCollection();
    const now = new Date();

    const updateDoc = {
      $set: {
        updatedAt: now,
      },
    };

    if (name) {
      updateDoc.$set.name = name;
    }
    if (photoURL !== undefined) {
      updateDoc.$set.photoURL = photoURL;
    }

    await users.updateOne(
      { _id: req.user.id },
      updateDoc
    );

    const updated = await users.findOne({ _id: req.user.id });
    if (!updated) {
      return res.status(404).json({ message: 'User not found after update.' });
    }

    const { _id, password, ...rest } = updated;

    return res.json({
      id: _id,
      ...rest,
    });
  } catch (err) {
    console.error('Error updating current user profile:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
