const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function fixSpecificUser() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find the user by email
    const user = await User.findOne({ email: 'wahidforjob@gmail.com' });
    
    if (!user) {
      console.log('User not found');
      return;
    }

    console.log('Before fix:');
    console.log(`Name: ${user.name}`);
    console.log(`Email: ${user.email}`);
    console.log(`Account Type: ${user.accountType}`);
    console.log(`Is Pro: ${user.isPro}`);
    console.log(`Subscription Status: ${user.subscriptionStatus}`);
    console.log(`Has Pro Access: ${user.hasProAccess()}`);

    // Fix the user to have proper Pro access
    user.isPro = true;
    user.subscriptionStatus = 'active';
    user.subscriptionEndsAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year from now
    
    await user.save();

    console.log('\nAfter fix:');
    console.log(`Account Type: ${user.accountType}`);
    console.log(`Is Pro: ${user.isPro}`);
    console.log(`Subscription Status: ${user.subscriptionStatus}`);
    console.log(`Subscription Ends At: ${user.subscriptionEndsAt}`);
    console.log(`Has Pro Access: ${user.hasProAccess()}`);

  } catch (error) {
    console.error('Fix error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

fixSpecificUser();