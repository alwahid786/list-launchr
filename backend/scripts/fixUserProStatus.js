const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function fixUserProStatus() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find users where accountType doesn't match isPro
    const inconsistentUsers = await User.find({
      $or: [
        { accountType: 'pro', isPro: false },
        { accountType: 'free', isPro: true }
      ]
    });

    console.log(`Found ${inconsistentUsers.length} users with inconsistent Pro status`);

    for (const user of inconsistentUsers) {
      console.log(`\nFixing user: ${user.name} (${user.email})`);
      console.log(`Before: accountType=${user.accountType}, isPro=${user.isPro}`);
      
      // Set isPro to match accountType
      user.isPro = user.accountType === 'pro';
      
      // If setting to Pro, also update subscription status
      if (user.isPro) {
        user.subscriptionStatus = 'active';
      }
      
      await user.save();
      
      console.log(`After: accountType=${user.accountType}, isPro=${user.isPro}, subscriptionStatus=${user.subscriptionStatus}`);
    }

    console.log('\n=== Updated User Status ===');
    const allUsers = await User.find().select('name email accountType isPro subscriptionStatus');
    
    for (const user of allUsers) {
      console.log(`${user.name}: accountType=${user.accountType}, isPro=${user.isPro}, hasProAccess=${user.hasProAccess()}`);
    }

  } catch (error) {
    console.error('Fix error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

fixUserProStatus();