import express from "express";
import cors from "cors";
import testRoutes from "./routes/testRoutes.js";
import warrantyRoutes from "./routes/warrantyRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/warranties", warrantyRoutes);
app.use("/api/admin", adminRoutes);

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "WarrantyWise backend is running"
    });
});

// Test routes
app.use("/api/test", testRoutes);

export default app;
