import { initializeApp, getApps } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";

// Firebase configuration from environment variables with fallbacks
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDltVjn8QC10pzHFNyFk83toTsVU4qKZHI",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "warranty-wallet-ad400.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "warranty-wallet-ad400",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "warranty-wallet-ad400.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "130946036572",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:130946036572:web:5ff62ab961742e79bd0799"
};

// Debug: Log configuration status (only in development)
if (import.meta.env.DEV) {
  console.log("Firebase Config Status:", {
    apiKey: firebaseConfig.apiKey ? "✓ Set" : "✗ Missing",
    authDomain: firebaseConfig.authDomain ? "✓ Set" : "✗ Missing",
    projectId: firebaseConfig.projectId ? "✓ Set" : "✗ Missing",
    usingEnvVars: !!import.meta.env.VITE_FIREBASE_API_KEY
  });
}

// Validate configuration
if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
  console.error("Firebase configuration is incomplete:", firebaseConfig);
  throw new Error("Firebase configuration error: Missing required configuration values");
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
  console.error("Config used:", { ...firebaseConfig, apiKey: firebaseConfig.apiKey?.substring(0, 20) + "..." });
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
    console.log("Auth domain:", auth.config?.authDomain || firebaseConfig.authDomain);
  }
} catch (error) {
  console.error("❌ Error initializing Firebase Auth:", error);
  throw new Error("Failed to initialize Firebase Auth: " + error.message);
}

export { auth };
export default app;

