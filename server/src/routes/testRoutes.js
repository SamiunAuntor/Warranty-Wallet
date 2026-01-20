import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

// User protected route
router.get("/protected", authMiddleware, (req, res) => {
    res.json({
        success: true,
        message: "User authenticated",
        user: req.user
    });
});

// Admin protected route
router.get("/admin", authMiddleware, adminMiddleware, (req, res) => {
    res.json({
        success: true,
        message: "Admin authenticated"
    });
});

export default router;
