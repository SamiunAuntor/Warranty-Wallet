import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectToDatabase } from "./config/database.js";
import authRoutes from "./routes/auth.routes.js";

// Load environment variables
dotenv.config();

// Debug: Check if environment variables are loaded
console.log("Environment check:");
console.log("MONGODB_URI:", process.env.MONGODB_URI ? "✓ Loaded" : "✗ Missing");
console.log("DB_NAME:", process.env.DB_NAME || "Warrenty-Wallet (default)");
console.log("PORT:", process.env.PORT || "5000 (default)");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Warranty Wallet API is running" });
});

// Connect to database and start server
connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`\n✅ Server is running on port ${PORT}`);
      console.log(`🌐 Open in browser: http://localhost:${PORT}\n`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
  });

export default app;

