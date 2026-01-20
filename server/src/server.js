import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";
import startReminderJob from "./jobs/reminderJob.js";

dotenv.config();

// Connect to MongoDB
connectDB();
startReminderJob();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
