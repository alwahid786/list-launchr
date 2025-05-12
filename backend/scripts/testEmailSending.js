const dotenv = require('dotenv');
const path = require('path');
const sendEmail = require('../utils/sendEmail');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Test function to send an email
const testEmailSending = async () => {
  try {
    console.log('Attempting to send test email...');
    console.log('Using email configuration:');
    console.log(`- Service: ${process.env.EMAIL_SERVICE}`);
    console.log(`- Host: ${process.env.EMAIL_HOST}`);
    console.log(`- Port: ${process.env.EMAIL_PORT}`);
    console.log(`- Username: ${process.env.EMAIL_USERNAME.substring(0, 3)}...`);
    
    // Send a test email
    const result = await sendEmail({
      to: 'test@example.com',
      subject: 'ListLaunchr Test Email',
      html: `
        <h1>Test Email from ListLaunchr</h1>
        <p>This is a test email to confirm that the email sending functionality is working correctly.</p>
        <p>If you're seeing this, it means everything is set up properly!</p>
        <p>Time sent: ${new Date().toLocaleString()}</p>
      `
    });
    
    console.log('Email sent successfully!');
    console.log(`Message ID: ${result.messageId}`);
    console.log('Check your email service (e.g., Mailtrap inbox) to see the test email.');
  } catch (error) {
    console.error('Failed to send test email:');
    console.error(error);
  }
};

// Run the test
testEmailSending();