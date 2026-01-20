import express from "express";
import cors from "cors";
import testRoutes from "./routes/testRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "WarrantyWise backend is running"
    });
});

// Test routes
app.use("/api/test", testRoutes);

export default app;
