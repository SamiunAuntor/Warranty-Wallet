const admin = require('firebase-admin');

// Prevent re-initialization error (Critical for Vercel/Serverless)
if (!admin.apps.length) {
  try {
    if (process.env.FB_SERVICE_KEY) {
      // 1. Decode and Parse the Base64 Key from Vercel
      const decodedKey = Buffer.from(process.env.FB_SERVICE_KEY, 'base64').toString('utf8');
      const serviceAccount = JSON.parse(decodedKey);

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log("✅ Firebase Admin initialized via Environment Variable");
    } else {
      // 2. Fallback for Local Development (if you still have the JSON file locally)
      // You can remove this else block once production is confirmed
      const serviceAccount = require('./warranty-wallet-firebase-adminsdk.json');
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log("🏠 Firebase Admin initialized via local JSON file");
    }
  } catch (error) {
    console.error("❌ Firebase Initialization Error:", error.message);
  }
}

module.exports = admin;