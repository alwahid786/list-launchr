const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Import models
const User = require('../models/User');
const Campaign = require('../models/Campaign');

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
      
      // Check if a test campaign already exists
      let campaign = await Campaign.findOne({ 
        user: user._id,
        title: 'Test Giveaway Campaign'
      });
      
      if (campaign) {
        console.log('Test campaign already exists');
        console.log({
          id: campaign._id,
          title: campaign.title,
          status: campaign.status,
          slug: campaign.slug
        });
      } else {
        // Create a new test campaign
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 14); // 2 weeks from now
        
        campaign = await Campaign.create({
          user: user._id,
          title: 'Test Giveaway Campaign',
          prizeTitle: 'Premium Software License',
          description: 'Enter for a chance to win one of 3 premium software licenses. Share with friends to increase your chances!',
          startDate,
          endDate,
          numWinners: 3,
          status: 'active',
          emailHeadline: 'Win a Premium Software License!',
          emailSubheadline: 'Enter your email below for a chance to win.',
          termsConsent: true,
          newsletterOptIn: true,
          // Entry options
          entryOptions: {
            visitUrl: {
              enabled: true,
              url: 'https://example.com/product'
            },
            socialFollow: {
              instagram: {
                enabled: true,
                username: 'examplecompany'
              },
              facebook: {
                enabled: true,
                pageUrl: 'https://facebook.com/examplecompany'
              }
            },
            socialShare: {
              facebook: {
                enabled: true
              },
              twitter: {
                enabled: true
              }
            },
            referral: {
              enabled: true,
              pointsPerReferral: 3
            }
          },
          // Design customization
          design: {
            colorScheme: 'blue',
            ctaText: 'Enter to Win',
            headlineText: 'Win Amazing Software Prizes!'
          },
          // Coupon reveal (bonus for all entrants)
          couponReveal: {
            enabled: true,
            code: 'WINNER25',
            description: '25% off any purchase'
          }
        });
        
        console.log('Test campaign created successfully:');
        console.log({
          id: campaign._id,
          title: campaign.title,
          status: campaign.status,
          slug: campaign.slug
        });
      }
    } catch (error) {
      console.error('Error creating test campaign:', error);
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