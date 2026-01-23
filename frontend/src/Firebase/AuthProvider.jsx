import { createContext, useContext, useEffect, useState } from "react";
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  updateProfile
} from "firebase/auth";
import { auth } from "./firebase.config";
import { registerUserInDB } from "../utils/api";
import toast from "react-hot-toast";

// Create Auth Context
const AuthContext = createContext(null);

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

// Auth Provider Component
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dbUser, setDbUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Monitor auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        
        // Ensure user is registered in MongoDB
        try {
          await registerUserInDB(currentUser);
        } catch (error) {
          console.error("Error syncing user with database:", error);
          // Don't block authentication if DB sync fails
        }
      } else {
        setUser(null);
        setDbUser(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Helper function to get error message
  const getErrorMessage = (error) => {
    const errorCodes = {
      "auth/user-not-found": "No account found with this email",
      "auth/wrong-password": "Incorrect password",
      "auth/invalid-email": "Invalid email address",
      "auth/user-disabled": "This account has been disabled",
      "auth/email-already-in-use": "An account with this email already exists",
      "auth/weak-password": "Password is too weak",
      "auth/popup-closed-by-user": "Sign-in popup was closed",
      "auth/popup-blocked": "Popup was blocked. Please allow popups for this site.",
      "auth/configuration-not-found": "Firebase configuration error. Please check your Firebase setup.",
      "auth/unauthorized-domain": "This domain is not authorized for Firebase authentication.",
    };

    return errorCodes[error.code] || error.message || "An error occurred";
  };

  // Email/Password Login
  const loginWithEmail = async (email, password) => {
    setAuthLoading(true);
    try {
      if (!auth) {
        throw new Error("Authentication service is not available");
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Ensure user is registered in MongoDB
      try {
        await registerUserInDB(userCredential.user);
      } catch (dbError) {
        console.log("User registration check:", dbError);
      }

      toast.success("Logged in successfully");
      return { success: true, user: userCredential.user };
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
      console.error("Login error:", error);
      return { success: false, error: errorMessage };
    } finally {
      setAuthLoading(false);
    }
  };

  // Email/Password Registration
  const registerWithEmail = async (email, password, displayName) => {
    setAuthLoading(true);
    try {
      if (!auth) {
        throw new Error("Authentication service is not available");
      }

      // Validate password
      if (password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return { success: false, error: "Password must be at least 6 characters" };
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with display name
      if (displayName) {
        await updateProfile(userCredential.user, {
          displayName: displayName,
        });
      }

      // Register user in MongoDB
      try {
        await registerUserInDB(userCredential.user);
        toast.success("Account created successfully");
        return { success: true, user: userCredential.user };
      } catch (dbError) {
        console.error("Database registration error:", dbError);
        toast.success("Account created, but database sync failed. Please try logging in.");
        return { success: true, user: userCredential.user };
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
      console.error("Registration error:", error);
      return { success: false, error: errorMessage };
    } finally {
      setAuthLoading(false);
    }
  };

  // Google Sign-In
  const loginWithGoogle = async () => {
    setAuthLoading(true);
    try {
      if (!auth) {
        throw new Error("Authentication service is not available");
      }

      const provider = new GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      provider.setCustomParameters({
        prompt: 'select_account'
      });

      const result = await signInWithPopup(auth, provider);
      
      // Register user in MongoDB if not already registered
      try {
        await registerUserInDB(result.user);
      } catch (dbError) {
        console.log("User registration check:", dbError);
      }

      toast.success("Logged in with Google successfully");
      return { success: true, user: result.user };
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
      console.error("Google login error:", error);
      return { success: false, error: errorMessage };
    } finally {
      setAuthLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
      setDbUser(null);
      toast.success("Logged out successfully");
      return { success: true };
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error("Error logging out: " + errorMessage);
      console.error("Logout error:", error);
      return { success: false, error: errorMessage };
    }
  };

  // Password Reset
  const resetPassword = async (email) => {
    setAuthLoading(true);
    try {
      if (!email) {
        toast.error("Please enter your email");
        return { success: false, error: "Email is required" };
      }

      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent! Check your inbox.");
      return { success: true };
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
      console.error("Password reset error:", error);
      return { success: false, error: errorMessage };
    } finally {
      setAuthLoading(false);
    }
  };

  // Update user profile
  const updateUserProfileInfo = async (updates) => {
    try {
      if (!user) {
        throw new Error("User not authenticated");
      }

      await updateProfile(user, updates);
      toast.success("Profile updated successfully");
      return { success: true };
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
      console.error("Profile update error:", error);
      return { success: false, error: errorMessage };
    }
  };

  // Context value
  const value = {
    // State
    user,
    loading,
    authLoading,
    dbUser,
    
    // Actions
    loginWithEmail,
    registerWithEmail,
    loginWithGoogle,
    logout,
    resetPassword,
    updateUserProfileInfo,
    setDbUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
