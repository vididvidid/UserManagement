
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
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
    console.error(error);
  } else {
    console.log('Server is ready to take our messages');
  }
});

export default transporter;
