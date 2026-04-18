import { generateVerificationOtpEmailTemplate } from "./emailTemplates.js";
import {sendEmail} from "./sendEmail.js";
export async function sendVerificationCode(verificationCode, email, res) {
    try {
        const message = generateVerificationOtpEmailTemplate(verificationCode);
        sendEmail({
            email,
            subject: "Verification code(OUTR Library management syste)",
            message,
        });
        res.status(200).json({
            success: true,
            message: "Verification code sent successfully.",
        });

    } catch (error) {

        console.log("EMAIL ERROR 👉", error);  // 👈 MUST ADD

        return res.status(500).json({

            success: false,
            message: "Verification code failed to send.",
            error: error.message
        })
    }
}