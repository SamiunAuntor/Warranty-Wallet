const admin = require('firebase-admin');
const path = require('path');

// Service account JSON placed in backend directory by user
const serviceAccountPath = path.join(__dirname, 'warranty-wallet-firebase-adminsdk.json');

admin.initializeApp({
  credential: admin.credential.cert(require(serviceAccountPath)),
});

module.exports = admin;



