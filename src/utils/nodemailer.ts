const nodemailer = require("nodemailer");
interface MailOptions {
    to: string;
    subject: string;
    text: string;
    html: string;
}

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.NODE_MAILER_EMAIL,
        pass: process.env.NODE_MAILER_PASSWORD,
    },
});

// Wrap in an async IIFE so we can use await.
export async function sendMail({ to, subject, text, html }: MailOptions) {
    const info = await transporter.sendMail({
        from: `"SnippetShare" <${process.env.NODE_MAILER_EMAIL}>`,
        to,
        subject,
        text,
        html,
    });
    return info;
}