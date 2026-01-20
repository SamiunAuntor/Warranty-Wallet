import User from "../models/User.js";
import Warranty from "../models/Warranty.js";
import ReminderLog from "../models/ReminderLog.js";

/**
 * @desc    Get platform statistics
 * @route   GET /api/admin/stats
 * @access  Admin
 */
export const getPlatformStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: "USER" });
        const activeUsers = await User.countDocuments({
            role: "USER",
            isActive: true
        });

        const totalWarranties = await Warranty.countDocuments();
        const expiringSoon = await Warranty.countDocuments({
            status: "EXPIRING_SOON"
        });

        const expired = await Warranty.countDocuments({
            status: "EXPIRED"
        });

        res.json({
            success: true,
            data: {
                totalUsers,
                activeUsers,
                totalWarranties,
                expiringSoon,
                expired
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch platform stats"
        });
    }
};

/**
 * @desc    Get all users
 * @route   GET /api/admin/users
 * @access  Admin
 */
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: "USER" })
            .select("-__v")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch users"
        });
    }
};

/**
 * @desc    Suspend or activate user
 * @route   PATCH /api/admin/users/:id/status
 * @access  Admin
 */
export const updateUserStatus = async (req, res) => {
    try {
        const { isActive } = req.body;

        const user = await User.findById(req.params.id);

        if (!user || user.role === "ADMIN") {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        user.isActive = isActive;
        await user.save();

        res.json({
            success: true,
            message: `User ${isActive ? "activated" : "suspended"} successfully`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update user status"
        });
    }
};

/**
 * @desc    Delete user and cleanup data
 * @route   DELETE /api/admin/users/:id
 * @access  Admin
 */
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user || user.role === "ADMIN") {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        await Warranty.deleteMany({ user: user._id });
        await ReminderLog.deleteMany({ user: user._id });
        await user.deleteOne();

        res.json({
            success: true,
            message: "User and related data deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete user"
        });
    }
};

/**
 * @desc    Reminder system stats
 * @route   GET /api/admin/reminders
 * @access  Admin
 */
export const getReminderStats = async (req, res) => {
    try {
        const totalReminders = await ReminderLog.countDocuments();

        const breakdown = await ReminderLog.aggregate([
            {
                $group: {
                    _id: "$reminderType",
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json({
            success: true,
            data: {
                totalReminders,
                breakdown
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch reminder stats"
        });
    }
};
