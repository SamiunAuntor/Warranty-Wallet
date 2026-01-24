import express from "express";
import admin from "../config/firebase.admin.js";
import { getDatabase } from "../config/database.js";

const router = express.Router();

// Middleware to verify Firebase token
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).json({ error: "Invalid token" });
  }
};

// Register user in MongoDB
router.post("/register", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(token);
    } catch (error) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const uid = decodedToken.uid;
    const email = decodedToken.email;
    
    // Get additional user info from Firebase Admin
    let displayName = null;
    let photoURL = null;
    let providerId = "password"; // default
    
    try {
      const userRecord = await admin.auth().getUser(uid);
      displayName = userRecord.displayName || null;
      photoURL = userRecord.photoURL || null;
      
      // Get provider ID (google.com, password, etc.)
      if (userRecord.providerData && userRecord.providerData.length > 0) {
        providerId = userRecord.providerData[0].providerId;
      }
    } catch (error) {
      console.log("Could not fetch user details from Firebase Admin:", error);
    }

    // Override with request body values if provided (for image uploads, etc.)
    if (req.body.displayName !== undefined) displayName = req.body.displayName;
    if (req.body.photoURL !== undefined) photoURL = req.body.photoURL;
    if (req.body.providerId !== undefined) providerId = req.body.providerId;
    if (req.body.email !== undefined) email = req.body.email;

    if (!uid || !email) {
      return res.status(400).json({ error: "UID and email are required" });
    }

    const db = getDatabase();
    const usersCollection = db.collection("users");

    // Prepare user data with all credentials
    const userData = {
      uid,
      email,
      displayName: displayName,
      photoURL: photoURL,
      providerId: providerId,
      updatedAt: new Date(),
      role: "user",
      status: "active",
    };

    // Use upsert to prevent duplication - creates if doesn't exist, updates if exists
    const result = await usersCollection.findOneAndUpdate(
      { uid: uid }, // Find by uid
      {
        $set: userData,
        $setOnInsert: {
          createdAt: new Date(), // Only set on insert, not on update
        },
      },
      {
        upsert: true, // Create if doesn't exist
        returnDocument: "after", // Return the updated/created document
      }
    );

    const user = result.value;

    // Determine if this was a new user or existing user
    const isNewUser = !result.lastErrorObject?.updatedExisting;

    res.status(isNewUser ? 201 : 200).json({
      message: isNewUser ? "User registered successfully" : "User already exists, profile updated",
      user: user,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get user profile
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const db = getDatabase();
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ uid: req.user.uid });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update user profile
router.put("/profile", verifyToken, async (req, res) => {
  try {
    const db = getDatabase();
    const usersCollection = db.collection("users");

    const { displayName, photoURL } = req.body;

    const updateData = {
      updatedAt: new Date(),
    };

    if (displayName !== undefined) updateData.displayName = displayName;
    if (photoURL !== undefined) updateData.photoURL = photoURL;

    const result = await usersCollection.findOneAndUpdate(
      { uid: req.user.uid },
      { $set: updateData },
      { returnDocument: "after" }
    );

    if (!result.value) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: "Profile updated successfully",
      user: result.value,
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

