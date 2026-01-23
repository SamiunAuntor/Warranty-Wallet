import { MongoClient } from "mongodb";

let client = null;
let db = null;

export const connectToDatabase = async () => {
  try {
    if (client && db) {
      return { client, db };
    }

    // Read environment variables inside the function to ensure dotenv has loaded them
    const MONGODB_URI = process.env.MONGODB_URI;
    const DB_NAME = process.env.DB_NAME || "Warrenty-Wallet";

    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db(DB_NAME);

    console.log("Connected to MongoDB successfully");
    return { client, db };
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};

export const getDatabase = () => {
  if (!db) {
    throw new Error("Database not connected. Call connectToDatabase first.");
  }
  return db;
};

export const closeDatabase = async () => {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log("MongoDB connection closed");
  }
};

