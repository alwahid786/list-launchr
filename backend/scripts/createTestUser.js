const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Import User model
const User = require('../models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB Connected');
    
    try {
      // Check if the test user already exists
      let user = await User.findOne({ email: 'testuser@example.com' });
      
      if (user) {
        console.log('Test user already exists');
      } else {
        // Create a new test user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('Test123!', salt);
        
        user = await User.create({
          name: 'Test User',
          email: 'testuser@example.com',
          password: hashedPassword,
          emailVerified: true, // Skip email verification for test user
          accountType: 'pro'   // Give pro access for testing all features
        });
        
        console.log('Test user created successfully:');
        console.log({
          name: user.name,
          email: user.email,
          id: user._id,
          accountType: user.accountType
        });
      }
    } catch (error) {
      console.error('Error creating test user:', error);
    }
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('MongoDB Disconnected');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });