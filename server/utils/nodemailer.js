const nodemailer = require('nodemailer');
require('dotenv').config({ path: './.env' });

const transporter = nodemailer.createTransport({
  service: 'gmail', // Use Gmail service for simplicity
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: true // Enforce strict TLS validation
  }
});

module.exports = transporter;