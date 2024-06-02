
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Configure the transporter
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Verify connection configuration
transporter.verify((error, success) => {
    if (error) {
        console.log('Verification error:', error);
    } else {
        console.log('Server is ready to take our messages');
    }
});

// Define the email options
const mailOptions = {
    from: 'trytobekumar@gmail.com',
    to: 'vididvidid@gmail.com', // Replace with your email address for testing
    subject: 'Hello from Nodemailer',
    text: 'This is a test email sent using Nodemailer.'
};

// Send the email
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.error('Error sending email:', error);
    } else {
        console.log('Email sent:', info.response);
    }
});
