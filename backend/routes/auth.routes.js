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
    try {
      const userRecord = await admin.auth().getUser(uid);
      displayName = userRecord.displayName || null;
      photoURL = userRecord.photoURL || null;
    } catch (error) {
      console.log("Could not fetch user details from Firebase Admin:", error);
    }

    // Also check request body for displayName and photoURL (in case of updates)
    if (req.body.displayName) displayName = req.body.displayName;
    if (req.body.photoURL) photoURL = req.body.photoURL;

    if (!uid || !email) {
      return res.status(400).json({ error: "UID and email are required" });
    }

    const db = getDatabase();
    const usersCollection = db.collection("users");

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ uid });

    if (existingUser) {
      return res.status(200).json({
        message: "User already exists",
        user: existingUser,
      });
    }

    // Create new user
    const newUser = {
      uid,
      email,
      displayName: displayName,
      photoURL: photoURL,
      createdAt: new Date(),
      updatedAt: new Date(),
      role: "user",
      status: "active",
    };

    await usersCollection.insertOne(newUser);

    res.status(201).json({
      message: "User registered successfully",
      user: newUser,
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

