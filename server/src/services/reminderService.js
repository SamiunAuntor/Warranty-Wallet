import Warranty from "../models/Warranty.js";
import User from "../models/User.js";
import ReminderLog from "../models/ReminderLog.js";
import { sendEmail } from "./emailService.js";

const dayDiff = (date1, date2) => {
    const diff = date1.getTime() - date2.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

export const processWarrantyReminders = async () => {
    const warranties = await Warranty.find().populate("user");

    const today = new Date();

    for (const warranty of warranties) {
        const daysLeft = dayDiff(new Date(warranty.expiryDate), today);

        let reminderType = null;
        let subject = "";
        let message = "";

        if (daysLeft === 30) {
            reminderType = "30_DAYS";
            subject = "Warranty expiring in 30 days";
            message = `Your warranty for <b>${warranty.productName}</b> will expire in 30 days.`;
            warranty.status = "EXPIRING_SOON";
        }

        if (daysLeft === 7) {
            reminderType = "7_DAYS";
            subject = "Warranty expiring in 7 days";
            message = `Your warranty for <b>${warranty.productName}</b> will expire in 7 days.`;
            warranty.status = "EXPIRING_SOON";
        }

        if (daysLeft === 0) {
            reminderType = "EXPIRED";
            subject = "Warranty expired today";
            message = `Your warranty for <b>${warranty.productName}</b> has expired today.`;
            warranty.status = "EXPIRED";
        }

        if (!reminderType) continue;

        const alreadySent = await ReminderLog.findOne({
            warranty: warranty._id,
            reminderType
        });

        if (alreadySent) continue;

        await sendEmail({
            to: warranty.user.email,
            subject,
            html: `
        <h3>${subject}</h3>
        <p>${message}</p>
        <p><b>Product:</b> ${warranty.productName}</p>
        <p><b>Expiry Date:</b> ${warranty.expiryDate.toDateString()}</p>
      `
        });

        await ReminderLog.create({
            warranty: warranty._id,
            user: warranty.user._id,
            reminderType
        });

        await warranty.save();
    }
};
