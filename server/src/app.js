import express from "express";
import cors from "cors";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "WarrantyWise backend is running"
    });
});

export default app;
