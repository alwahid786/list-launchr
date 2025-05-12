const nodemailer = require('nodemailer');

/**
 * Send email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - Email HTML content
 */
const sendEmail = async (options) => {
  try {
    // Check if we're in development mode with SMTP_DEV_MODE enabled
    if (process.env.NODE_ENV === 'development' && process.env.SMTP_DEV_MODE === 'true') {
      // In development mode with SMTP_DEV_MODE, log the email instead of sending it
      console.log('=========== EMAIL NOT SENT (DEV MODE) ===========');
      console.log(`To: ${options.to}`);
      console.log(`Subject: ${options.subject}`);
      console.log('HTML Content:');
      console.log(options.html);
      console.log('================================================');
      
      return { 
        success: true, 
        messageId: `dev-mode-${Date.now()}`,
        devMode: true 
      };
    }
    
    // Create transporter based on configuration
    let transportConfig;
    
    if (process.env.EMAIL_SERVICE === 'smtp') {
      // SMTP configuration (for Mailtrap, etc.)
      transportConfig = {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD
        }
      };
    } else {
      // Service-based configuration (Gmail, etc.)
      transportConfig = {
        service: process.env.EMAIL_SERVICE,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD
        }
      };
    }
    
    const transporter = nodemailer.createTransport(transportConfig);

    // Email options
    const message = {
      from: `ListLaunchr <${process.env.EMAIL_USERNAME}>`,
      to: options.to,
      subject: options.subject,
      html: options.html
    };

    // Verify transporter configuration
    await transporter.verify();

    // Send email
    const info = await transporter.sendMail(message);
    console.log(`Email sent: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email sending error:', error);
    
    // If in development mode, fall back to logging the email
    if (process.env.NODE_ENV === 'development') {
      console.log('=========== EMAIL FALLBACK (ERROR) ===========');
      console.log(`To: ${options.to}`);
      console.log(`Subject: ${options.subject}`);
      console.log('HTML Content:');
      console.log(options.html);
      console.log('==============================================');
      console.log('Email not sent due to error, but application continues to run');
      
      return {
        success: false,
        error: error.message,
        fallback: true
      };
    }
    
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

module.exports = sendEmail;