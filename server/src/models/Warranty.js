import mongoose from "mongoose";

const warrantySchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        productName: {
            type: String,
            required: true,
            trim: true
        },

        brand: {
            type: String,
            trim: true
        },

        category: {
            type: String,
            trim: true
        },

        purchaseDate: {
            type: Date,
            required: true
        },

        warrantyDurationMonths: {
            type: Number,
            required: true
        },

        expiryDate: {
            type: Date,
            required: true
        },

        status: {
            type: String,
            enum: ["ACTIVE", "EXPIRING_SOON", "EXPIRED"],
            default: "ACTIVE"
        },

        invoiceUrl: {
            type: String
        },

        notes: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

const Warranty = mongoose.model("Warranty", warrantySchema);

export default Warranty;
