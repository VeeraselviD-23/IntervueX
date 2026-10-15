import nodemailer from "nodemailer";

export async function sendEmail({ to, subject, text }) {
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER) {
    console.log("Email service is not configured.");
    return;
  }
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT || 587),
    secure: Number(process.env.EMAIL_PORT) === 465,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD }
  });
  await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, text });
}
