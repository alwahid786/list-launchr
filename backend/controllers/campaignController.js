const Campaign = require('../models/Campaign');
const Entry = require('../models/Entry');
const slugify = require('slugify');
const mongoose = require('mongoose');

// @desc    Get all campaigns for the logged in user
// @route   GET /api/campaigns
// @access  Private
exports.getCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find({ user: req.user.id });
    res.status(200).json({
      success: true,
      count: campaigns.length,
      data: campaigns
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get single campaign
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

    // Make sure user owns the campaign
    if (campaign.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this campaign'
      });
    }

    res.status(200).json({
      success: true,
      data: campaign
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
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
        message: 'Active campaign not found'
      });
    }

    // Increment view count
    campaign.stats.views += 1;
    await campaign.save();

    // Return only necessary public data
    const publicData = {
      _id: campaign._id,
      title: campaign.title,
      prizeTitle: campaign.prizeTitle,
      description: campaign.description,
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      numWinners: campaign.numWinners,
      slug: campaign.slug,
      design: campaign.design,
      externalUrl: campaign.externalUrl,
      emailHeadline: campaign.emailHeadline,
      emailSubheadline: campaign.emailSubheadline,
      termsConsent: campaign.termsConsent,
      newsletterOptIn: campaign.newsletterOptIn,
      entryOptions: campaign.entryOptions,
      status: campaign.status
    };

    res.status(200).json({
      success: true,
      data: publicData
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Create new campaign
// @route   POST /api/campaigns
// @access  Private
exports.createCampaign = async (req, res) => {
  try {
    // Add user to request body
    req.body.user = req.user.id;
    
    // Create campaign
    const campaign = await Campaign.create(req.body);

    res.status(201).json({
      success: true,
      data: campaign
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Server Error'
      });
    }
  }
};

// @desc    Update campaign
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

    // Make sure user owns the campaign
    if (campaign.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this campaign'
      });
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
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Server Error'
      });
    }
  }
};

// @desc    Delete campaign
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

    // Make sure user owns the campaign
    if (campaign.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this campaign'
      });
    }

    // Make sure campaign is not active
    if (campaign.status === 'active') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete an active campaign'
      });
    }

    await campaign.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Duplicate campaign
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

    // Make sure user owns the campaign
    if (campaign.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to duplicate this campaign'
      });
    }

    // Create a duplicate with some modifications
    const duplicateCampaign = await Campaign.create({
      user: req.user.id,
      title: `Copy of ${campaign.title}`,
      prizeTitle: campaign.prizeTitle,
      description: campaign.description,
      externalUrl: campaign.externalUrl,
      emailHeadline: campaign.emailHeadline,
      emailSubheadline: campaign.emailSubheadline,
      termsConsent: campaign.termsConsent,
      newsletterOptIn: campaign.newsletterOptIn,
      entryOptions: campaign.entryOptions,
      design: campaign.design,
      integrations: campaign.integrations,
      couponReveal: campaign.couponReveal,
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default to 7 days from now
      numWinners: campaign.numWinners,
      status: 'draft',
      // Reset stats
      stats: {
        views: 0,
        entries: 0,
        referrals: 0,
        conversionRate: 0
      }
    });

    res.status(201).json({
      success: true,
      data: duplicateCampaign
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
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

    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    // Make sure user owns the campaign
    if (campaign.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this campaign'
      });
    }

    // Validate status transitions
    if (campaign.status === 'completed' && status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot change status of a completed campaign'
      });
    }

    // Update status
    campaign.status = status;
    await campaign.save();

    res.status(200).json({
      success: true,
      data: campaign
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Select winners for a campaign
// @route   POST /api/campaigns/:id/select-winners
// @access  Private
exports.selectWinners = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    // Make sure user owns the campaign
    if (campaign.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to select winners for this campaign'
      });
    }

    // Check if campaign is completed or past end date
    const now = new Date();
    const endDate = new Date(campaign.endDate);
    
    if (campaign.status !== 'completed' && (campaign.status !== 'active' || endDate > now)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot select winners for a campaign that is not completed or past its end date'
      });
    }

    // Check if winners are already selected
    if (campaign.winners && campaign.winners.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Winners have already been selected for this campaign'
      });
    }

    // Get all eligible entries for this campaign
    const entries = await Entry.find({ campaign: campaign._id });

    if (!entries || entries.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No entries available for winner selection'
      });
    }

    if (entries.length < campaign.numWinners) {
      return res.status(400).json({
        success: false,
        message: `Not enough entries (${entries.length}) to select ${campaign.numWinners} winners`
      });
    }

    // Implement weighted random selection based on entry points
    // Higher points = higher chance of winning
    const winners = selectRandomWinners(entries, campaign.numWinners);

    // Update campaign with winners and set status to completed
    campaign.winners = winners.map(entry => ({
      entryId: entry._id,
      email: entry.email,
      name: entry.name || 'Anonymous',
      points: entry.points
    }));
    
    campaign.status = 'completed';
    await campaign.save();

    // TODO: Send winner notification emails (would be implemented in a separate service)

    res.status(200).json({
      success: true,
      data: {
        winners: campaign.winners,
        message: 'Winners selected successfully'
      }
    });
  } catch (err) {
    console.error('Error selecting winners:', err);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// Helper function to select random winners with weighted probability
function selectRandomWinners(entries, numWinners) {
  // Create a pool of entries based on points
  // Each entry appears in the pool as many times as its points value
  let pool = [];
  for (const entry of entries) {
    // Get total points for this entry (base + actions)
    let totalPoints = entry.points;
    if (entry.actions && entry.actions.length > 0) {
      totalPoints += entry.actions.reduce((sum, action) => 
        action.completed ? sum + action.points : sum, 0);
    }
    
    // Add entry to pool multiple times based on points
    for (let i = 0; i < totalPoints; i++) {
      pool.push({
        _id: entry._id,
        email: entry.email,
        name: entry.name,
        points: totalPoints
      });
    }
  }
  
  // Shuffle the pool using Fisher-Yates algorithm
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  
  // Select winners (ensuring no duplicates)
  const winners = [];
  const selectedIds = new Set();
  
  let poolIndex = 0;
  while (winners.length < numWinners && poolIndex < pool.length) {
    const candidate = pool[poolIndex];
    
    // Check if this entry is already selected
    if (!selectedIds.has(candidate._id.toString())) {
      winners.push(candidate);
      selectedIds.add(candidate._id.toString());
    }
    
    poolIndex++;
  }
  
  return winners;
}

module.exports = exports;