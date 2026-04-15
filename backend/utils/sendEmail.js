// import nodeMailer from "nodemailer";

// export const sendEmail = async (email, subject, message) => {
//     const transporter = nodeMailer.createTransport({
//         host: process.env.SMTP_HOST,
//         service: process.env.SMTP_SERVICE,
//         port: process.env.SMTP_PORT,
//         auth: {
//             user: process.env.SMTP_MAIL,
            // pass: process.env.SMTP_PASSWORD,
//         },
//     });
//     const mailOptions = {
//         from: process.env.SMTP_MAIL,
//         to: email,
//         subject,
//         html: message,

//     }
//     console.log("EMAIL SENT INFO 👉", info);
//     await transporter.sendMail(mailOptions);
// };
import nodeMailer from "nodemailer";

export const sendEmail = async ({ email, subject, message }) => {
    try {
        const transporter = nodeMailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // IMPORTANT
            auth: {
                user: process.env.SMTP_MAIL,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        // Verify SMTP connection
        await transporter.verify();
        console.log("SMTP working ✅");

        const info = await transporter.sendMail({
            from: process.env.SMTP_MAIL,
            to: email,
            subject: subject,
            html: message,
        });

        console.log("EMAIL SENT INFO 👉", info);

    } catch (error) {
        console.log("EMAIL ERROR 👉", error);
        throw error; // pass error back
    }
};