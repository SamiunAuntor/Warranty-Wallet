import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },

        role: {
            type: String,
            enum: ["USER", "ADMIN"],
            default: "USER"
        },

        isActive: {
            type: Boolean,
            default: true
        },

        authProvider: {
            type: String,
            enum: ["firebase", "local"],
            default: "firebase"
        }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User", userSchema);

export default User;
