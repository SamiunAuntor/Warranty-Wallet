import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

// Initialize Firebase Admin SDK
// Note: For development, Firebase Admin can work without explicit credentials
// if using Application Default Credentials or environment variables
try {
  // Check if already initialized
  if (admin.apps.length === 0) {
    // Try to initialize with environment variables if available
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        }),
      });
      console.log("Firebase Admin SDK initialized with environment variables");
    } else {
      // Initialize with default credentials (for development)
      // This will work if GOOGLE_APPLICATION_CREDENTIALS is set or using ADC
      admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID || "warranty-wallet-ad400",
      });
      console.log("Firebase Admin SDK initialized with default credentials");
    }
  }
} catch (error) {
  console.warn("Firebase Admin SDK initialization warning:", error.message);
  console.log("Firebase Admin will attempt to use default credentials");
  // Try minimal initialization
  try {
    if (admin.apps.length === 0) {
      admin.initializeApp({
        projectId: "warranty-wallet-ad400",
      });
    }
  } catch (initError) {
    console.error("Could not initialize Firebase Admin:", initError.message);
  }
}

export default admin;

