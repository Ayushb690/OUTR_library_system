import { User } from "../models/userModel.js";

export function generateVerificationOtpEmailTemplate(otpCode) {
    return ` <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #000; color:#fff;">
<h2 style="color: #fff; text-align: center;">Verify Your Email Address</h2>
<p style="font-size: 16px; color: #ccc;">Dear User, </p>
<p style="font-size: 16px; color: #ccc;">To complete your registration or login, please use the following verification code :< /p>
<div style="text-align: center; margin: 20px 0;">
<span style="display: inline-block; font-size: 24px; font-weight: bold; color: #000; padding: 10px 20px; border: 1px solid #fff; border-radius: 5px; background-color:#fff;">

${otpCode}
</span>
</div>
<p style="font-size: 16px; color: #ccc;">This code is valid for 15 minutes. Please do not share this code with anyone .< /p>
<p style="font-size: 16px; color: #ccc;">If you did not request this email, please ignore it .< /p>
<footer style="margin-top: 20px; text-align: center; font-size: 14px; color: #666;">
<p>Thank you, <br>BookWorm Team</p>
<p style="font-size: 12px; color: #444;">This is an automated message. Please do not reply to this email .< /p>
</footer>
</div>`;
}
export function generateForgotPasswordEmailTemplate(name, resetPasswordUrl) {
    return `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #1a1a1a; border-radius: 12px; background-color: #000; color: #fff; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
        <h2 style="color: #fff; text-align: center; font-size: 26px; margin-bottom: 25px;">Reset Your Password</h2>
        
        <p style="font-size: 16px; color: #ccc;">Dear ${name},</p>
        
        <p style="font-size: 16px; color: #ccc; line-height: 1.6;">
            We received a request to reset your password for your <strong>BookWorm</strong> account. Please click the button below to choose a new one:
        </p>

        <div style="text-align: center; margin: 35px 0;">
            <a href="${resetPasswordUrl}" 
               style="display: inline-block; font-size: 18px; font-weight: bold; color: #000; text-decoration: none; padding: 15px 35px; border-radius: 6px; background-color: #fff; transition: background-color 0.3s ease;">
               Reset Password
            </a>
        </div>

        <p style="font-size: 14px; color: #888;">
            If the button above doesn't work, copy and paste the following link into your browser:
        </p>
        
        <p style="font-size: 12px; color: #555; word-break: break-all; background-color: #0a0a0a; padding: 10px; border-radius: 5px; border: 1px solid #222;">
            ${resetPasswordUrl}
        </p>

        <p style="font-size: 15px; color: #aaa; margin-top: 25px;">
            If you did not request this change, you can safely ignore this email. Your password will remain unchanged.
        </p>

        <footer style="margin-top: 40px; text-align: center; border-top: 1px solid #222; padding-top: 20px;">
            <p style="font-size: 14px; color: #666; margin-bottom: 4px;">Thank you, <br><strong>BookWorm Team</strong></p>
            <p style="font-size: 11px; color: #444; letter-spacing: 1px;">&copy; 2026 BOOKWORM INC. ALL RIGHTS RESERVED.</p>
        </footer>
    </div>`;
}