const Entry = require('../models/Entry');
const Campaign = require('../models/Campaign');
const User = require('../models/User');
const { AdapterFactory } = require('../utils/integrations');

// @desc    Create a new entry
// @route   POST /api/entries
// @access  Public
exports.createEntry = async (req, res) => {
  try {
    const { email, name, newsletterOptIn, campaignId, referralCode } = req.body;
    
    if (!email || !campaignId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and campaign ID'
      });
    }
    
    // Find the campaign
    const campaign = await Campaign.findById(campaignId);
    
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }
    
    // Check if campaign is active
    if (campaign.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'This campaign is not currently active'
      });
    }
    
    // Check if user has already entered this campaign
    const existingEntry = await Entry.findOne({ email, campaign: campaignId });
    
    if (existingEntry) {
      return res.status(400).json({
        success: false,
        message: 'You have already entered this giveaway'
      });
    }
    
    // Check entry limits for free accounts
    const campaignOwner = await User.findById(campaign.user);
    
    if (campaignOwner.accountType === 'free') {
      const entryCount = campaign.stats.entries;
      
      if (entryCount >= 500) {
        return res.status(403).json({
          success: false,
          message: 'This campaign has reached its entry limit for free accounts'
        });
      }
    }
    
    // Determine if this is a referral
    let referredBy = null;
    let entryMethod = 'email';
    
    if (referralCode) {
      const referringEntry = await Entry.findOne({ referralCode });
      
      if (referringEntry && referringEntry.campaign.toString() === campaignId) {
        referredBy = referringEntry._id;
        entryMethod = 'referral';
        
        // Increment the referring entry's points if referrals are enabled
        if (campaign.entryOptions.referral.enabled) {
          referringEntry.points += campaign.entryOptions.referral.pointsPerReferral;
          
          // Add referral action
          referringEntry.actions.push({
            type: 'referral',
            completed: true,
            points: campaign.entryOptions.referral.pointsPerReferral,
            timestamp: Date.now()
          });
          
          await referringEntry.save();
          
          // Update campaign stats
          campaign.stats.referrals += 1;
        }
      }
    }
    
    // Set IP address if available
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    
    // Create the new entry
    const newEntry = await Entry.create({
      campaign: campaignId,
      email,
      name,
      newsletterOptIn,
      ipAddress,
      entryMethod,
      referredBy,
      actions: [
        {
          type: 'email_signup',
          completed: true,
          points: 1,
          timestamp: Date.now()
        }
      ]
    });
    
    // Update campaign stats
    campaign.stats.entries += 1;
    
    // Calculate conversion rate (entries / views * 100)
    if (campaign.stats.views > 0) {
      campaign.stats.conversionRate = (campaign.stats.entries / campaign.stats.views * 100).toFixed(2);
    }
    
    await campaign.save();

    // Auto-sync to email service if configured
    if (campaign.integrations && campaign.integrations.provider !== 'none' && campaign.integrations.isVerified) {
      try {
        // Get the campaign owner's email service configuration
        const campaignOwnerWithServices = await User.findById(campaign.user).select('+emailServices');
        
        if (campaignOwnerWithServices.emailServices && 
            campaignOwnerWithServices.emailServices.get(campaign.integrations.provider)?.connected) {
          
          const serviceConfig = campaignOwnerWithServices.emailServices.get(campaign.integrations.provider);
          
          // Create adapter for the provider
          const adapter = AdapterFactory.createAdapter(campaign.integrations.provider, {
            apiKey: serviceConfig.apiKey,
            listId: campaign.integrations.listId,
            formId: campaign.integrations.formId,
            tagId: campaign.integrations.tagId,
            webhookUrl: campaign.integrations.webhookUrl,
            secretKey: campaign.integrations.secretKey
          });
          
          // Prepare subscriber data
          const subscriberData = {
            email: newEntry.email,
            firstName: newEntry.name ? newEntry.name.split(' ')[0] : '',
            lastName: newEntry.name ? newEntry.name.split(' ').slice(1).join(' ') : '',
            source: `ListLaunchr: ${campaign.title}`,
            campaignId: campaign._id.toString()
          };
          
          // Add subscriber to email service
          const result = await adapter.addSubscriber(subscriberData);
          
          if (result.success) {
            // Update campaign integration stats
            if (!campaign.integrations.stats) {
              campaign.integrations.stats = {
                totalSynced: 0,
                successCount: 0,
                failureCount: 0
              };
            }
            
            campaign.integrations.stats.totalSynced += 1;
            campaign.integrations.stats.successCount += 1;
            campaign.integrations.lastSynced = new Date();
            
            await campaign.save();
            
            console.log(`Successfully synced entry ${newEntry.email} to ${campaign.integrations.provider}`);
          } else {
            // Update failure stats
            if (!campaign.integrations.stats) {
              campaign.integrations.stats = {
                totalSynced: 0,
                successCount: 0,
                failureCount: 0
              };
            }
            
            campaign.integrations.stats.totalSynced += 1;
            campaign.integrations.stats.failureCount += 1;
            
            await campaign.save();
            
            console.error(`Failed to sync entry ${newEntry.email} to ${campaign.integrations.provider}:`, result.message);
          }
        }
      } catch (error) {
        console.error(`Error syncing entry to email service:`, error);
        
        // Update failure stats
        if (!campaign.integrations.stats) {
          campaign.integrations.stats = {
            totalSynced: 0,
            successCount: 0,
            failureCount: 0
          };
        }
        
        campaign.integrations.stats.totalSynced += 1;
        campaign.integrations.stats.failureCount += 1;
        
        await campaign.save();
      }
    }
    
    // Return entry data
    const returnData = {
      id: newEntry._id,
      referralCode: newEntry.referralCode
    };
    
    // Include coupon data if coupon reveal is enabled
    if (campaign.couponReveal.enabled) {
      returnData.coupon = {
        code: campaign.couponReveal.code,
        description: campaign.couponReveal.description
      };
      
      // Mark coupon as revealed
      newEntry.couponRevealed = true;
      await newEntry.save();
    }
    
    res.status(201).json({
      success: true,
      data: returnData
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get entries for a campaign
// @route   GET /api/entries/:campaignId
// @access  Private
exports.getEntries = async (req, res) => {
  try {
    const { campaignId } = req.params;
    
    // Find the campaign to verify ownership
    const campaign = await Campaign.findById(campaignId);
    
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }
    
    // Check campaign ownership
    if (campaign.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access entries for this campaign'
      });
    }
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    
    // Query for entries
    const entries = await Entry.find({ campaign: campaignId })
      .sort('-createdAt')
      .skip(startIndex)
      .limit(limit);
    
    // Get total count for pagination
    const totalEntries = await Entry.countDocuments({ campaign: campaignId });
    
    // Pagination result
    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(totalEntries / limit),
      totalEntries
    };
    
    res.status(200).json({
      success: true,
      pagination,
      data: entries
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Complete an action for an entry
// @route   POST /api/entries/:id/actions
// @access  Public
exports.completeAction = async (req, res) => {
  try {
    const { id } = req.params;
    const { actionType, platform, referralCode } = req.body;
    
    if (!actionType) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an action type'
      });
    }
    
    // Find the entry
    const entry = await Entry.findById(id);
    
    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Entry not found'
      });
    }
    
    // Verify referral code to authenticate the request
    if (entry.referralCode !== referralCode) {
      return res.status(401).json({
        success: false,
        message: 'Invalid referral code'
      });
    }
    
    // Find the campaign to check if action is enabled
    const campaign = await Campaign.findById(entry.campaign);
    
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }
    
    // Check if action is already completed
    const existingAction = entry.actions.find(
      action => action.type === actionType && action.platform === platform
    );
    
    if (existingAction && existingAction.completed) {
      return res.status(400).json({
        success: false,
        message: 'This action has already been completed'
      });
    }
    
    // Validate and add action based on type
    let actionPoints = 1;
    let isValidAction = false;
    
    switch (actionType) {
      case 'visit_url':
        isValidAction = campaign.entryOptions.visitUrl.enabled;
        break;
      case 'social_follow':
        if (!platform) {
          return res.status(400).json({
            success: false,
            message: 'Please provide a platform for social follow'
          });
        }
        isValidAction = campaign.entryOptions.socialFollow[platform]?.enabled;
        break;
      case 'social_share':
        if (!platform) {
          return res.status(400).json({
            success: false,
            message: 'Please provide a platform for social share'
          });
        }
        isValidAction = campaign.entryOptions.socialShare[platform]?.enabled;
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid action type'
        });
    }
    
    if (!isValidAction) {
      return res.status(400).json({
        success: false,
        message: 'This action is not enabled for this campaign'
      });
    }
    
    // Add the action
    if (existingAction) {
      // Update existing action
      existingAction.completed = true;
      existingAction.timestamp = Date.now();
    } else {
      // Add new action
      entry.actions.push({
        type: actionType,
        platform,
        completed: true,
        points: actionPoints,
        timestamp: Date.now()
      });
    }
    
    // Update total points
    entry.points += actionPoints;
    
    await entry.save();
    
    res.status(200).json({
      success: true,
      data: {
        message: 'Action completed successfully',
        points: entry.points
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Export entries as CSV
// @route   GET /api/entries/:campaignId/export
// @access  Private
exports.exportEntries = async (req, res) => {
  try {
    const { campaignId } = req.params;
    
    // Find the campaign to verify ownership
    const campaign = await Campaign.findById(campaignId);
    
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }
    
    // Check campaign ownership
    if (campaign.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to export entries for this campaign'
      });
    }
    
    // Get all entries for the campaign
    const entries = await Entry.find({ campaign: campaignId }).sort('-createdAt');
    
    // Generate CSV header
    let csv = 'Email,Name,Newsletter Opt-in,Entry Method,Points,Entry Date\n';
    
    // Add entry data
    entries.forEach(entry => {
      const row = [
        `"${entry.email}"`,
        `"${entry.name || ''}"`,
        entry.newsletterOptIn ? 'Yes' : 'No',
        entry.entryMethod,
        entry.points,
        new Date(entry.createdAt).toLocaleString()
      ];
      
      csv += row.join(',') + '\n';
    });
    
    // Set headers for file download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=campaign_entries_${campaignId}.csv`);
    
    // Send the CSV file
    res.status(200).send(csv);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Export all user entries as CSV
// @route   GET /api/entries/export/csv
// @access  Private
exports.exportAllEntries = async (req, res) => {
  try {
    // Get all user's campaigns
    const campaigns = await Campaign.find({ user: req.user.id }).select('_id title');
    
    if (!campaigns || campaigns.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No campaigns found'
      });
    }
    
    const campaignIds = campaigns.map(c => c._id);
    
    // Get all entries for user's campaigns
    const entries = await Entry.find({ campaign: { $in: campaignIds } })
      .populate('campaign', 'title')
      .sort('-createdAt');
    
    if (!entries || entries.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No entries found'
      });
    }
    
    // Generate CSV header
    let csv = 'Campaign,Email,Name,Newsletter Opt-in,Entry Method,Points,Entry Date\n';
    
    // Add entry data
    entries.forEach(entry => {
      const row = [
        `"${entry.campaign?.title || 'Unknown Campaign'}"`,
        `"${entry.email}"`,
        `"${entry.name || ''}"`,
        entry.newsletterOptIn ? 'Yes' : 'No',
        entry.entryMethod || 'email',
        entry.points || 1,
        new Date(entry.createdAt).toLocaleString()
      ];
      
      csv += row.join(',') + '\n';
    });
    
    // Set headers for file download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=all_entries_${new Date().toISOString().split('T')[0]}.csv`);
    
    // Send the CSV file
    res.status(200).send(csv);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};