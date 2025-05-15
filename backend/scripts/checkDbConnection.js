const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Import User model
const User = require('../models/User');

console.log('Attempting to connect to MongoDB with connection string:');
console.log(process.env.MONGO_URI);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB Connected Successfully');
    
    try {
      // Check User collection
      const userCount = await User.countDocuments();
      console.log(`Total users in the database: ${userCount}`);
      
      if (userCount > 0) {
        const users = await User.find().select('email name createdAt');
        console.log('Users found:');
        console.log(JSON.stringify(users, null, 2));
      } else {
        console.log('No users found in the database.');
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