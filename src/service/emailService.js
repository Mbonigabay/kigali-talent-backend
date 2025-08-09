import nodemailer from 'nodemailer';
import appLogger from '../config/log4js.js';

const email = process.env.EMAIL_ADDRESS;
const port = process.env.EMAIL_PASSWORD;

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, 
    auth: {
        user: 'alayna.lesch@ethereal.email',
        pass: 'xcuUbEdZN6DCUzbcB6'
    }
});

/**
 * Sends an email to a user with a dynamic subject and text body.
 * This makes the email service more reusable for different types of messages.
 * @param {object} email The user object containing the email and name.
 * @param {string} subject The subject line of the email.
 * @param {string} text The text content of the email.
 */
export const sendEmail = async (email, subject, text) => {
    try {
        const mailOptions = {
            from: '"My Node App" <info@mynodeapp.com>',
            to: email,
            subject: subject,
            text: text
        };

        const info = await transporter.sendMail(mailOptions);
        appLogger.info(`Email sent to ${email} with subject "${subject}": ${info.messageId}`);
    } catch (error) {
        appLogger.error(`Failed to send email to ${email}:`, error);
    }
};
