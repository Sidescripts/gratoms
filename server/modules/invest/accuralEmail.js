const transporter = require('../../utils/nodemailer');

function EmailTemplate() {
  return {
    roiAccrualEmail: async function({ email, planName, roiAmount, transactionId, date, investmentId }) {
      // Validate email
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error(`Invalid email address: ${email || 'undefined'}`);
      }

      // Validate environment variables
      if (!process.env.EMAIL_USER) {
        throw new Error('EMAIL_USER is not defined in .env');
      }

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Daily ROI Credit - Gratoms',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Daily ROI Credit - Gratoms</title>
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
              .header { background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .logo { color: white; font-size: 28px; font-weight: bold; margin: 0; }
              .content { background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
              .status-badge { 
                background: #10b981; color: white; padding: 8px 16px; border-radius: 20px; 
                font-size: 14px; font-weight: bold; display: inline-block; margin-bottom: 20px;
              }
              .amount { font-size: 32px; font-weight: bold; color: #7c3aed; margin: 10px 0; }
              .investment-details { background: #faf5ff; padding: 20px; border-radius: 8px; margin: 20px 0; }
              .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #ede9fe; }
              .detail-row:last-child { border-bottom: none; }
              .progress-bar { background: #ede9fe; height: 8px; border-radius: 4px; margin: 15px 0; overflow: hidden; }
              .progress-fill { background: linear-gradient(90deg, #8b5cf6 0%, #7c3aed 100%); height: 100%; width: 100%; }
              .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #718096; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1 class="logo">💰 Daily ROI Credited</h1>
            </div>
            
            <div class="content">
              <div class="status-badge">✅ CREDITED</div>
              
              <p>Your daily ROI has been successfully credited to your account.</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <div class="amount">${roiAmount.toFixed(2)} USD</div>
                <p>credited for <strong>${planName}</strong></p>
              </div>
      
              <div class="investment-details">
                <h3 style="margin-top: 0;">Transaction Details</h3>
                <div class="detail-row">
                  <span>Transaction ID:</span>
                  <span><strong>${transactionId}</strong></span>
                </div>
                <div class="detail-row">
                  <span>Investment ID:</span>
                  <span><strong>${investmentId}</strong></span>
                </div>
                <div class="detail-row">
                  <span>Plan Name:</span>
                  <span><strong>${planName}</strong></span>
                </div>
                <div class="detail-row">
                  <span>ROI Amount:</span>
                  <span><strong>${roiAmount.toFixed(2)} USD</strong></span>
                </div>
                <div class="detail-row">
                  <span>Date:</span>
                  <span><strong>${new Date(date).toLocaleDateString()}</strong></span>
                </div>
              </div>
      
              <div class="progress-bar">
                <div class="progress-fill"></div>
              </div>
              <p style="text-align: center; color: #6b7280;">Your investment is growing daily</p>
      
              <p><strong>💡 Tip:</strong> Check your transaction history in your dashboard for more details.</p>
            </div>
            
            <div class="footer">
              <p>© ${new Date().getFullYear()} Gratoms. All rights reserved.</p>
              <p>Happy investing! 📊</p>
            </div>
          </body>
          </html>
        `
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log(`ROI accrual email sent to ${email} for transaction ${transactionId}`);
      } catch (error) {
        console.error('ROI email sending error:', {
          error: error.message,
          stack: error.stack,
          email,
          transactionId
        });
        throw new Error(`Failed to send ROI email: ${error.message}`);
      }
    }
  };
}

module.exports = EmailTemplate();