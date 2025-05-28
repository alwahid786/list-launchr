const mongoose = require('mongoose');
const User = require('../models/User');
const Campaign = require('../models/Campaign');
require('dotenv').config();

// Define subscription features directly to avoid Stripe initialization
const SUBSCRIPTION = {
  FEATURES: {
    free: {
      maxCampaigns: 1,
      maxEntriesPerCampaign: 500,
      customBranding: false,
      emailIntegrations: false,
      fullSocialEntryMethods: false,
      couponReveal: false,
      campaignDuplication: false,
      noBranding: false
    },
    pro: {
      maxCampaigns: Infinity,
      maxEntriesPerCampaign: 10000,
      customBranding: true,
      emailIntegrations: true,
      fullSocialEntryMethods: true,
      couponReveal: true,
      campaignDuplication: true,
      noBranding: true
    }
  }
};

async function debugCampaignLimits() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Get all users
    const users = await User.find().select('name email accountType isPro subscriptionStatus');
    
    console.log('\n=== User Analysis ===');
    for (const user of users) {
      console.log(`\nUser: ${user.name} (${user.email})`);
      console.log(`Account Type: ${user.accountType}`);
      console.log(`Is Pro: ${user.isPro}`);
      console.log(`Subscription Status: ${user.subscriptionStatus}`);
      console.log(`Has Pro Access: ${user.hasProAccess()}`);
      
      // Count campaigns for this user
      const campaignCount = await Campaign.countDocuments({ user: user._id });
      console.log(`Campaign Count: ${campaignCount}`);
      
      // Get tier limits
      const tier = user.isPro ? 'pro' : 'free';
      const { maxCampaigns } = SUBSCRIPTION.FEATURES[tier];
      console.log(`Max Campaigns (${tier}): ${maxCampaigns}`);
      console.log(`Can Create More: ${campaignCount < maxCampaigns}`);
      
      // List campaigns
      const campaigns = await Campaign.find({ user: user._id }).select('title status createdAt');
      if (campaigns.length > 0) {
        console.log('Campaigns:');
        campaigns.forEach((camp, idx) => {
          console.log(`  ${idx + 1}. ${camp.title} (${camp.status}) - ${camp.createdAt.toDateString()}`);
        });
      } else {
        console.log('No campaigns found');
      }
    }

    console.log('\n=== Subscription Features ===');
    console.log('Free tier features:', JSON.stringify(SUBSCRIPTION.FEATURES.free, null, 2));
    console.log('Pro tier features:', JSON.stringify(SUBSCRIPTION.FEATURES.pro, null, 2));

  } catch (error) {
    console.error('Debug error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

debugCampaignLimits();