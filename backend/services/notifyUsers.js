
import cron from "node-cron";
import { sendEmail } from "../utils/sendEmail.js";
import { Borrow } from "../models/borrowModel.js";
import { User } from "../models/userModel.js";



export const notifyUsers = () => {
    cron.schedule("*/30 * * * *", async () => {
        try {
            // Find books that are past their due date
            const borrowers = await Borrow.find({
                dueDate: { $lt: new Date() }, // Changed to check for anything past due
                returnDate: null,
                notified: false,
            });

            console.log(`Found ${borrowers.length} users to notify.`);

            for (const element of borrowers) {
                if (element.user && element.user.email) {
                    await sendEmail({ // Added await to ensure email sends before updating DB
                        email: element.user.email, // FIXED: Corrected reference
                        subject: "Book Return Reminder",
                        message: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <p>Hello <b>${element.user.name}</b>,</p>
            
            <p style="color: #d9534f; font-weight: bold; font-size: 1.2em;">
                ⚠️ WARNING: OVERDUE NOTICE
            </p>
            
            <p>This is a formal reminder that the book you borrowed is past its due date.</p>
            
            <p>Please return it to the library <span style="color: red; font-weight: bold;">IMMEDIATELY</span> to avoid further penalties.</p>
            
            <p>Thank you for your prompt cooperation.</p>
            
            <hr />
            <p style="font-size: 0.8em; color: #777;">Odisha University of Technology and Research (OUTR) Library System</p>
        </div>`
                    });

                    element.notified = true;
                    await element.save();
                    console.log(`Email sent successfully to: ${element.user.email}`);
                }
            }
        } catch (error) {
            console.error("Some error occurred while notifying users.", error);
        }
    });
};