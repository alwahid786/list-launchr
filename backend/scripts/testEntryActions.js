const mongoose = require('mongoose');
const Campaign = require('../models/Campaign');
const Entry = require('../models/Entry');
const User = require('../models/User');
require('dotenv').config();

async function testEntryActions() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find a test campaign or create one
    let campaign = await Campaign.findOne({ status: 'active' });
    
    if (!campaign) {
      console.log('No active campaign found. Please create one through the UI first.');
      return;
    }

    console.log('Found campaign:', campaign.title);
    console.log('Entry options:', JSON.stringify(campaign.entryOptions, null, 2));

    // Find an entry for this campaign
    const entry = await Entry.findOne({ campaign: campaign._id });
    
    if (!entry) {
      console.log('No entries found for this campaign. Please create an entry through the UI first.');
      return;
    }

    console.log('Found entry:', entry.email);
    console.log('Current points:', entry.points);
    console.log('Current actions:', entry.actions);

    // Test adding a social follow action
    if (campaign.entryOptions.socialFollow?.instagram?.enabled) {
      const actionData = {
        type: 'social_follow',
        platform: 'instagram',
        completed: true,
        points: 1,
        timestamp: new Date()
      };

      entry.actions.push(actionData);
      entry.points += 1;
      await entry.save();

      console.log('Added Instagram follow action');
      console.log('New points:', entry.points);
    }

    // Test adding a URL visit action
    if (campaign.entryOptions.visitUrl?.enabled) {
      const actionData = {
        type: 'visit_url',
        completed: true,
        points: 1,
        timestamp: new Date()
      };

      entry.actions.push(actionData);
      entry.points += 1;
      await entry.save();

      console.log('Added URL visit action');
      console.log('New points:', entry.points);
    }

    console.log('Final entry state:', {
      email: entry.email,
      points: entry.points,
      actions: entry.actions.length
    });

  } catch (error) {
    console.error('Test error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

testEntryActions();