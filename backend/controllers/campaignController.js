const Campaign = require('../models/Campaign');
const Entry = require('../models/Entry');
const User = require('../models/User');

// @desc    Create a new campaign
// @route   POST /api/campaigns
// @access  Private
exports.createCampaign = async (req, res) => {
  try {
    // Check user's campaign limits based on account type
    const user = await User.findById(req.user.id);
    
    if (user.accountType === 'free') {
      // For free accounts, check if they already have an active campaign
      const activeCampaigns = await Campaign.countDocuments({
        user: req.user.id,
        status: { $in: ['active', 'scheduled'] }
      });
      
      if (activeCampaigns >= 1) {
        return res.status(403).json({
          success: false,
          message: 'Free accounts are limited to 1 active campaign. Please upgrade to Pro or end your current campaign.'
        });
      }
    }
    
    // Create campaign with user ID
    const campaignData = {
      ...req.body,
      user: req.user.id
    };
    
    const campaign = await Campaign.create(campaignData);
    
    res.status(201).json({
      success: true,
      data: campaign
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all campaigns for a user
// @route   GET /api/campaigns
// @access  Private
exports.getCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find({ user: req.user.id }).sort('-createdAt');
    
    res.status(200).json({
      success: true,
      count: campaigns.length,
      data: campaigns
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get a specific campaign
// @route   GET /api/campaigns/:id
// @access  Private
exports.getCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    
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
        message: 'Not authorized to access this campaign'
      });
    }
    
    res.status(200).json({
      success: true,
      data: campaign
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update a campaign
// @route   PUT /api/campaigns/:id
// @access  Private
exports.updateCampaign = async (req, res) => {
  try {
    let campaign = await Campaign.findById(req.params.id);
    
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
        message: 'Not authorized to update this campaign'
      });
    }
    
    // Check if campaign is already active and restrict certain updates
    if (campaign.status === 'active' || campaign.status === 'completed') {
      // List of fields that cannot be updated once campaign is active
      const restrictedFields = ['startDate', 'endDate'];
      
      for (const field of restrictedFields) {
        if (req.body[field]) {
          delete req.body[field];
        }
      }
    }
    
    // Update campaign
    campaign = await Campaign.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: campaign
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete a campaign
// @route   DELETE /api/campaigns/:id
// @access  Private
exports.deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    
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
        message: 'Not authorized to delete this campaign'
      });
    }
    
    // Check if campaign is active or completed
    if (campaign.status === 'active' || campaign.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Active or completed campaigns cannot be deleted. You can cancel the campaign instead.'
      });
    }
    
    // Delete campaign
    await Campaign.findByIdAndDelete(req.params.id);
    
    // Delete associated entries
    await Entry.deleteMany({ campaign: req.params.id });
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Duplicate a campaign
// @route   POST /api/campaigns/:id/duplicate
// @access  Private
exports.duplicateCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    
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
        message: 'Not authorized to duplicate this campaign'
      });
    }
    
    // Check user's campaign limits based on account type
    const user = await User.findById(req.user.id);
    
    if (user.accountType === 'free') {
      // For free accounts, check if they already have an active campaign
      const activeCampaigns = await Campaign.countDocuments({
        user: req.user.id,
        status: { $in: ['active', 'scheduled'] }
      });
      
      if (activeCampaigns >= 1) {
        return res.status(403).json({
          success: false,
          message: 'Free accounts are limited to 1 active campaign. Please upgrade to Pro or end your current campaign.'
        });
      }
    }
    
    // Create a duplicate campaign
    const campaignData = campaign.toObject();
    
    // Remove fields that should be unique or reset
    delete campaignData._id;
    delete campaignData.slug;
    delete campaignData.stats;
    delete campaignData.createdAt;
    
    // Set status to draft
    campaignData.status = 'draft';
    
    // Add "Copy of" to title
    campaignData.title = `Copy of ${campaignData.title}`;
    
    // Create new campaign
    const newCampaign = await Campaign.create(campaignData);
    
    res.status(201).json({
      success: true,
      data: newCampaign
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get public campaign by slug
// @route   GET /api/campaigns/public/:slug
// @access  Public
exports.getPublicCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findOne({ 
      slug: req.params.slug,
      status: 'active'
    });
    
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found or not active'
      });
    }
    
    // Increment views count
    campaign.stats.views += 1;
    await campaign.save();
    
    // Return limited public data
    const publicData = {
      id: campaign._id,
      title: campaign.title,
      prizeTitle: campaign.prizeTitle,
      description: campaign.description,
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      numWinners: campaign.numWinners,
      emailHeadline: campaign.emailHeadline,
      emailSubheadline: campaign.emailSubheadline,
      termsConsent: campaign.termsConsent,
      newsletterOptIn: campaign.newsletterOptIn,
      entryOptions: campaign.entryOptions,
      design: campaign.design,
      couponReveal: {
        enabled: campaign.couponReveal.enabled
      },
      slug: campaign.slug,
      stats: {
        entries: campaign.stats.entries
      }
    };
    
    res.status(200).json({
      success: true,
      data: publicData
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update campaign status
// @route   PUT /api/campaigns/:id/status
// @access  Private
exports.updateCampaignStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a status'
      });
    }
    
    // Validate status
    const validStatuses = ['draft', 'scheduled', 'active', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }
    
    let campaign = await Campaign.findById(req.params.id);
    
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
        message: 'Not authorized to update this campaign'
      });
    }
    
    // Additional checks for status transitions
    if (status === 'active') {
      // Check if user has reached their campaign limit (for free accounts)
      if (req.user.accountType === 'free') {
        const activeCampaigns = await Campaign.countDocuments({
          user: req.user.id,
          status: 'active',
          _id: { $ne: req.params.id } // Exclude current campaign
        });
        
        if (activeCampaigns >= 1) {
          return res.status(403).json({
            success: false,
            message: 'Free accounts are limited to 1 active campaign. Please upgrade to Pro or end your current campaign.'
          });
        }
      }
    }
    
    // Update campaign status
    campaign.status = status;
    await campaign.save();
    
    res.status(200).json({
      success: true,
      data: campaign
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};