const admin = require('../firebaseAdmin');
const { getUsersCollection } = require('../db');

async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const [, token] = authHeader.split(' ');

    if (!token) {
      return res.status(401).json({ message: 'Authorization token missing.' });
    }

    const decoded = await admin.auth().verifyIdToken(token);
    const email = decoded.email;

    if (!email) {
      return res.status(400).json({ message: 'Email is missing from token.' });
    }

    const users = await getUsersCollection();
    const now = new Date();

    const updateDoc = {
      $set: {
        email,
        lastLoginAt: now,
      },
      $setOnInsert: {
        name: decoded.name || email.split('@')[0],
        role: 'user',
        status: 'active',
        createdAt: now,
      },
    };

    if (decoded.picture) {
      updateDoc.$set.photoURL = decoded.picture;
    }

    // Use updateOne + findOne instead of findOneAndUpdate to avoid driver edge cases
    await users.updateOne({ email }, updateDoc, { upsert: true });

    const userDoc = await users.findOne({ email });

    if (!userDoc) {
      console.error('Auth error: user document not found after upsert for email', email);
      return res.status(500).json({ message: 'Failed to persist user profile.' });
    }

    req.user = {
      id: userDoc._id,
      email: userDoc.email,
      name: userDoc.name,
      role: userDoc.role,
      status: userDoc.status,
      photoURL: userDoc.photoURL,
      firebaseUID: decoded.uid,
    };

    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
}

function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Not authorized.' });
    }

    next();
  };
}

module.exports = {
  authenticate,
  requireRole,
};


