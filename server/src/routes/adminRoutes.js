import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

import {
    getPlatformStats,
    getAllUsers,
    updateUserStatus,
    deleteUser,
    getReminderStats
} from "../controllers/adminController.js";

const router = express.Router();

// Protect all admin routes
router.use(authMiddleware, adminMiddleware);

router.get("/stats", getPlatformStats);
router.get("/users", getAllUsers);
router.patch("/users/:id/status", updateUserStatus);
router.delete("/users/:id", deleteUser);
router.get("/reminders", getReminderStats);

export default router;
