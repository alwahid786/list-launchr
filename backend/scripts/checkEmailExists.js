const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Import User model
const User = require('../models/User');

// Get email from command line arguments
const emailToCheck = process.argv[2];

if (!emailToCheck) {
  console.error('Please provide an email to check. Usage: node checkEmailExists.js email@example.com');
  process.exit(1);
}

console.log(`Checking if email exists: ${emailToCheck}`);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB Connected Successfully');
    
    try {
      // Check if user exists
      const user = await User.findOne({ email: emailToCheck });
      
      if (user) {
        console.log('✅ User found:');
        console.log({
          id: user._id,
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
          accountType: user.accountType,
          createdAt: user.createdAt
        });
      } else {
        console.log('❌ User with this email does not exist in the database.');
      }
    } catch (error) {
      console.error('Error querying database:', error);
    }
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('MongoDB Disconnected');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error connecting to MongoDB:', err);
    process.exit(1);
  });