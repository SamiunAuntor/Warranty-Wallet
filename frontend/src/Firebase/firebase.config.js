import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

// Firebase configuration from environment variables ONLY
// Never hardcode secrets in source code!
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Debug: Log configuration status (only in development)
if (import.meta.env.DEV) {
  console.log("Firebase Config Status:", {
    apiKey: firebaseConfig.apiKey ? "✓ Set" : "✗ Missing",
    authDomain: firebaseConfig.authDomain ? "✓ Set" : "✗ Missing",
    projectId: firebaseConfig.projectId ? "✓ Set" : "✗ Missing",
  });
}

// Validate configuration - throw error if missing (don't use fallbacks)
if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
  const missing = [];
  if (!firebaseConfig.apiKey) missing.push("VITE_FIREBASE_API_KEY");
  if (!firebaseConfig.authDomain) missing.push("VITE_FIREBASE_AUTH_DOMAIN");
  if (!firebaseConfig.projectId) missing.push("VITE_FIREBASE_PROJECT_ID");
  
  console.error("❌ Firebase configuration error: Missing environment variables:", missing);
  console.error("Please create a .env file in the frontend directory with all required Firebase variables.");
  throw new Error(`Firebase configuration error: Missing required environment variables: ${missing.join(", ")}`);
}

// Initialize Firebase - check if already initialized
let app;
try {
  // Check if Firebase app already exists
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
    if (import.meta.env.DEV) {
      console.log("✅ Firebase initialized successfully");
    }
  } else {
    app = getApps()[0];
    if (import.meta.env.DEV) {
      console.log("✅ Using existing Firebase app");
    }
  }
} catch (error) {
  console.error("❌ Error initializing Firebase:", error);
  throw error;
}

// Initialize Auth - ensure it's properly configured
let auth;
try {
  auth = getAuth(app);
  
  // Verify auth is properly initialized
  if (!auth) {
    throw new Error("Firebase Auth instance is null");
  }
  
  if (import.meta.env.DEV) {
    console.log("✅ Firebase Auth initialized successfully");
  }
} catch (error) {
  console.error("❌ Error initializing Firebase Auth:", error);
  throw new Error("Failed to initialize Firebase Auth: " + error.message);
}

export { auth };
export default app;

