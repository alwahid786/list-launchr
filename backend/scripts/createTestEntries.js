const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Import models
const Campaign = require('../models/Campaign');
const Entry = require('../models/Entry');
const User = require('../models/User');

// Function to generate a random email
const generateRandomEmail = () => {
  const names = ['john', 'jane', 'mike', 'sara', 'alex', 'emma', 'james', 'lisa', 'david', 'olivia'];
  const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com'];
  
  const name = names[Math.floor(Math.random() * names.length)];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  const randomNum = Math.floor(Math.random() * 1000);
  
  return `${name}${randomNum}@${domain}`;
};

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB Connected');
    
    try {
      // Find the test user
      const user = await User.findOne({ email: 'testuser@example.com' });
      
      if (!user) {
        console.error('Test user not found. Please run createTestUser.js first.');
        process.exit(1);
      }
      
      // Find the test campaign
      const campaign = await Campaign.findOne({ 
        user: user._id,
        title: 'Test Giveaway Campaign'
      });
      
      if (!campaign) {
        console.error('Test campaign not found. Please run createTestCampaign.js first.');
        process.exit(1);
      }
      
      console.log(`Creating test entries for campaign: ${campaign.title} (${campaign._id})`);
      
      // Create 10 sample entries
      const entryCount = 10;
      let createdCount = 0;
      
      // First create a primary entry that will refer others
      const primaryEntry = await Entry.create({
        campaign: campaign._id,
        email: 'primary.entry@example.com',
        name: 'Primary Tester',
        newsletterOptIn: true,
        ipAddress: '192.168.1.1',
        actions: [
          {
            type: 'email_signup',
            completed: true,
            points: 1,
            timestamp: new Date()
          }
        ]
      });
      
      console.log('Created primary entry:', primaryEntry.email);
      createdCount++;
      
      // Create additional entries
      for (let i = 1; i < entryCount; i++) {
        const email = generateRandomEmail();
        const isReferral = i % 3 === 0; // Every third entry is a referral
        
        const entry = await Entry.create({
          campaign: campaign._id,
          email,
          name: `Test User ${i}`,
          newsletterOptIn: i % 2 === 0, // Alternate newsletter opt-ins
          ipAddress: `192.168.1.${i + 1}`,
          entryMethod: isReferral ? 'referral' : 'email',
          referredBy: isReferral ? primaryEntry._id : undefined,
          actions: [
            {
              type: 'email_signup',
              completed: true,
              points: 1,
              timestamp: new Date()
            }
          ]
        });
        
        // Add some additional actions to the entry
        if (i % 2 === 0) {
          entry.actions.push({
            type: 'visit_url',
            completed: true,
            points: 1,
            timestamp: new Date()
          });
          entry.points += 1;
        }
        
        if (i % 4 === 0) {
          entry.actions.push({
            type: 'social_follow',
            platform: 'instagram',
            completed: true,
            points: 1,
            timestamp: new Date()
          });
          entry.points += 1;
        }
        
        await entry.save();
        
        // If this was a referral, add points to the primary entry
        if (isReferral && campaign.entryOptions.referral.enabled) {
          primaryEntry.points += campaign.entryOptions.referral.pointsPerReferral;
          primaryEntry.actions.push({
            type: 'referral',
            completed: true,
            points: campaign.entryOptions.referral.pointsPerReferral,
            timestamp: new Date()
          });
        }
        
        console.log(`Created entry ${i}: ${email}${isReferral ? ' (referral)' : ''}`);
        createdCount++;
      }
      
      // Save the updated primary entry
      await primaryEntry.save();
      
      // Update campaign stats
      campaign.stats.entries = await Entry.countDocuments({ campaign: campaign._id });
      campaign.stats.referrals = await Entry.countDocuments({ 
        campaign: campaign._id,
        entryMethod: 'referral'
      });
      
      // Calculate conversion rate (fake some views)
      campaign.stats.views = campaign.stats.entries * 3; // 33% conversion rate
      campaign.stats.conversionRate = (campaign.stats.entries / campaign.stats.views * 100).toFixed(2);
      
      await campaign.save();
      
      console.log(`Successfully created ${createdCount} test entries`);
      console.log('Updated campaign stats:', {
        entries: campaign.stats.entries,
        referrals: campaign.stats.referrals,
        views: campaign.stats.views,
        conversionRate: campaign.stats.conversionRate
      });
      
    } catch (error) {
      console.error('Error creating test entries:', error);
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