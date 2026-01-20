import mongoose from "mongoose";

const reminderLogSchema = new mongoose.Schema(
    {
        warranty: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Warranty",
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        reminderType: {
            type: String,
            enum: ["30_DAYS", "7_DAYS", "EXPIRED"],
            required: true
        }
    },
    { timestamps: true }
);

export default mongoose.model("ReminderLog", reminderLogSchema);
