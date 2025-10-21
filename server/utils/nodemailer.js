const nodemailer = require('nodemailer');
require('dotenv').config({ path: './.env' });

// Validate that environment variables exist
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error('❌ CRITICAL: Email credentials missing from environment variables');
  console.error('Please check your .env file exists and contains EMAIL_USER and EMAIL_PASS');
  process.exit(1); // Stop the application if credentials are missing
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Use environment variable
    pass: process.env.EMAIL_PASS  // Use environment variable
  },
  tls: {
    rejectUnauthorized: false // MUST be false to fix your TLS certificate error
  }
});

// Verify connection on startup
transporter.verify(function(error, success) {
  if (error) {
    console.error('❌ SMTP connection failed:', error.message);
    console.error('Please check your email credentials and app password');
  } else {
    console.log('✅ SMTP server is ready to take messages');
  }
});

module.exports = transporter;