const { SUBSCRIPTION } = require('../config/stripe');

/**
 * Middleware to check if user has Pro access
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 * @returns {void}
 */
const requireProAccess = (req, res, next) => {
  // Check if user exists and has Pro access
  if (!req.user || !req.user.hasProAccess()) {
    return res.status(403).json({
      success: false,
      message: 'Pro subscription required for this feature',
      upgradeUrl: '/dashboard/upgrade'
    });
  }
  
  next();
};

/**
 * Middleware to check campaign limits based on user's subscription
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 * @returns {void}
 */
const checkCampaignLimits = async (req, res, next) => {
  try {
    // Only check on campaign creation
    if (req.method !== 'POST') {
      return next();
    }
    
    const Campaign = require('../models/Campaign');
    
    // Get user subscription tier features
    const tier = req.user.isPro ? 'pro' : 'free';
    const { maxCampaigns } = SUBSCRIPTION.FEATURES[tier];
    
    // Count user's existing campaigns
    const campaignCount = await Campaign.countDocuments({ user: req.user.id });
    
    // Check if user has reached their campaign limit
    if (campaignCount >= maxCampaigns) {
      return res.status(403).json({
        success: false,
        message: `You have reached your limit of ${maxCampaigns} campaign${maxCampaigns === 1 ? '' : 's'}. Upgrade to Pro for unlimited campaigns.`,
        campaignCount,
        maxCampaigns,
        upgradeUrl: '/dashboard/upgrade'
      });
    }
    
    next();
  } catch (error) {
    console.error('Error checking campaign limits:', error);
    next(error);
  }
};

/**
 * Middleware to check entry limits based on user's subscription
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 * @returns {void}
 */
const checkEntryLimits = async (req, res, next) => {
  try {
    // Proceed for non-entry creation routes
    if (req.method !== 'POST') {
      return next();
    }
    
    const Entry = require('../models/Entry');
    const Campaign = require('../models/Campaign');
    
    // Get the campaign ID from the request body
    const { campaign: campaignId } = req.body;
    
    if (!campaignId) {
      return next();
    }
    
    // Get the campaign details
    const campaign = await Campaign.findById(campaignId);
    
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }
    
    // Get the campaign owner
    const User = require('../models/User');
    const campaignOwner = await User.findById(campaign.user);
    
    if (!campaignOwner) {
      return res.status(404).json({
        success: false,
        message: 'Campaign owner not found'
      });
    }
    
    // Get owner's subscription tier features
    const tier = campaignOwner.isPro ? 'pro' : 'free';
    const { maxEntriesPerCampaign } = SUBSCRIPTION.FEATURES[tier];
    
    // Count existing entries for this campaign
    const entryCount = await Entry.countDocuments({ campaign: campaignId });
    
    // Check if the campaign has reached its entry limit
    if (entryCount >= maxEntriesPerCampaign) {
      return res.status(403).json({
        success: false,
        message: `This campaign has reached its limit of ${maxEntriesPerCampaign} entries.`,
        entryCount,
        maxEntriesPerCampaign
      });
    }
    
    next();
  } catch (error) {
    console.error('Error checking entry limits:', error);
    next(error);
  }
};

/**
 * Middleware to check if a feature is allowed based on subscription
 * @param {string} feature - The feature to check
 * @returns {Function} Express middleware
 */
const requireFeature = (feature) => {
  return (req, res, next) => {
    // Get user subscription tier
    const tier = req.user.isPro ? 'pro' : 'free';
    
    // Check if the feature is available for this tier
    if (!SUBSCRIPTION.FEATURES[tier][feature]) {
      return res.status(403).json({
        success: false,
        message: `This feature requires a Pro subscription`,
        feature,
        upgradeUrl: '/dashboard/upgrade'
      });
    }
    
    next();
  };
};

module.exports = {
  requireProAccess,
  checkCampaignLimits,
  checkEntryLimits,
  requireFeature
};