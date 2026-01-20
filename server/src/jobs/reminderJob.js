import cron from "node-cron";
import { processWarrantyReminders } from "../services/reminderService.js";

const startReminderJob = () => {
    cron.schedule("0 9 * * *", async () => {
        console.log("Running daily warranty reminder job...");
        await processWarrantyReminders();
    });
};

export default startReminderJob;
