// config/email.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', // Or use another service like SendGrid
    auth: {
        user: "gratomstrade@gmail.com", // Set in .env (e.g., your Gmail address)
        pass: "rfrw hvmq gzgn eahu", // Set in .env (e.g., Gmail App Password)
        // user: process.env.EMAIL_USER || "gratomstrade@gmail.com", // Set in .env (e.g., your Gmail address)
        // pass: process.env.EMAIL_PASS || "rfrw hvmq gzgn eahu", // Set in .env (e.g., Gmail App Password)
    },
});

module.exports = transporter;


