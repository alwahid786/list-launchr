const asyncHandler = require('express-async-handler');
const { AdapterFactory } = require('../utils/integrations');
const Campaign = require('../models/Campaign');
const Entry = require('../models/Entry');
const Integration = require('../models/Integration');

/**
 * @desc    Verify integration credentials
 * @route   POST /api/integrations/verify
 * @access  Private
 */
const verifyIntegration = asyncHandler(async (req, res) => {
  const { provider, apiKey, listId, formId, tagId, webhookUrl, secretKey } = req.body;
  
  if (!provider || provider === 'none') {
    return res.status(400).json({
      success: false,
      message: 'Provider is required'
    });
  }
  
  try {
    // Create adapter for the provider
    const adapter = AdapterFactory.createAdapter(provider, {
      apiKey,
      listId,
      formId,
      tagId,
      webhookUrl,
      secretKey
    });
    
    // Verify the integration
    const result = await adapter.verify();
    
    res.json({
      success: result.success,
      message: result.message,
      data: result.data
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @desc    Update campaign integration settings
 * @route   PUT /api/integrations/campaign/:id
 * @access  Private
 */
const updateCampaignIntegration = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findById(req.params.id);
  
  if (!campaign) {
    return res.status(404).json({
      success: false,
      message: 'Campaign not found'
    });
  }
  
  // Check ownership
  if (campaign.user.toString() !== req.user.id) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to update this campaign'
    });
  }
  
  const { provider, apiKey, listId, formId, tagId, webhookUrl, secretKey } = req.body;
  
  // Update campaign integration settings
  campaign.integrations = {
    provider: provider || 'none',
    apiKey,
    listId,
    formId,
    tagId,
    webhookUrl,
    secretKey,
    isVerified: false // Reset verification status
  };
  
  // If provider is specified, verify the integration
  if (provider && provider !== 'none') {
    try {
      const adapter = AdapterFactory.createAdapter(provider, {
        apiKey,
        listId,
        formId,
        tagId,
        webhookUrl,
        secretKey
      });
      
      const verificationResult = await adapter.verify();
      
      campaign.integrations.isVerified = verificationResult.success;
      
      // Also save/update in Integration model
      let integration = await Integration.findOne({ campaign: campaign._id });
      
      if (integration) {
        integration.provider = provider;
        integration.apiKey = apiKey;
        integration.listId = listId;
        integration.formId = formId;
        integration.tagId = tagId;
        integration.webhookUrl = webhookUrl;
        integration.secretKey = secretKey;
        integration.isVerified = verificationResult.success;
        await integration.save();
      } else {
        integration = await Integration.create({
          user: req.user.id,
          campaign: campaign._id,
          provider,
          apiKey,
          listId,
          formId,
          tagId,
          webhookUrl,
          secretKey,
          isVerified: verificationResult.success
        });
      }
    } catch (error) {
      // Log the error but don't fail the request
      console.error('Integration verification error:', error);
    }
  }
  
  await campaign.save();
  
  res.json({
    success: true,
    message: 'Campaign integration settings updated',
    data: {
      provider: campaign.integrations.provider,
      isVerified: campaign.integrations.isVerified
    }
  });
});

/**
 * @desc    Test integration by sending a test email
 * @route   POST /api/integrations/test-send
 * @access  Private
 */
const testSend = asyncHandler(async (req, res) => {
  const { provider, apiKey, listId, formId, tagId, webhookUrl, secretKey, email, name } = req.body;
  
  if (!provider || provider === 'none') {
    return res.status(400).json({
      success: false,
      message: 'Provider is required'
    });
  }
  
  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Email is required for test send'
    });
  }
  
  try {
    // Create adapter for the provider
    const adapter = AdapterFactory.createAdapter(provider, {
      apiKey,
      listId,
      formId,
      tagId,
      webhookUrl,
      secretKey
    });
    
    // Send a test
    const result = await adapter.sendTest({
      email,
      name: name || 'Test User'
    });
    
    res.json({
      success: result.success,
      message: result.message,
      data: result.data
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @desc    Sync campaign entries with email provider
 * @route   POST /api/integrations/sync/:id
 * @access  Private
 */
const syncEntries = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findById(req.params.id);
  
  if (!campaign) {
    return res.status(404).json({
      success: false,
      message: 'Campaign not found'
    });
  }
  
  // Check ownership
  if (campaign.user.toString() !== req.user.id) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to update this campaign'
    });
  }
  
  // Check if integration is configured
  if (!campaign.integrations || campaign.integrations.provider === 'none') {
    return res.status(400).json({
      success: false,
      message: 'No integration configured for this campaign'
    });
  }
  
  try {
    // Get all entries for the campaign
    const entries = await Entry.find({ campaign: campaign._id });
    
    if (entries.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No entries found to sync'
      });
    }
    
    // Create adapter for the provider
    const adapter = AdapterFactory.createAdapter(campaign.integrations.provider, {
      apiKey: campaign.integrations.apiKey,
      listId: campaign.integrations.listId,
      formId: campaign.integrations.formId,
      tagId: campaign.integrations.tagId,
      webhookUrl: campaign.integrations.webhookUrl,
      secretKey: campaign.integrations.secretKey
    });
    
    // Track results
    const results = {
      total: entries.length,
      success: 0,
      failed: 0,
      errors: []
    };
    
    // Process each entry
    for (const entry of entries) {
      try {
        const subscriberData = {
          email: entry.email,
          firstName: entry.name,
          source: `ListLaunchr: ${campaign.title}`,
          campaignId: campaign._id.toString()
        };
        
        const result = await adapter.addSubscriber(subscriberData);
        
        if (result.success) {
          results.success++;
        } else {
          results.failed++;
          results.errors.push({
            email: entry.email,
            error: result.message
          });
        }
      } catch (error) {
        results.failed++;
        results.errors.push({
          email: entry.email,
          error: error.message
        });
      }
    }
    
    // Update campaign integration stats
    campaign.integrations.lastSynced = Date.now();
    campaign.integrations.stats = {
      totalSynced: (campaign.integrations.stats?.totalSynced || 0) + results.success,
      successCount: (campaign.integrations.stats?.successCount || 0) + results.success,
      failureCount: (campaign.integrations.stats?.failureCount || 0) + results.failed
    };
    
    await campaign.save();
    
    // Also update Integration model
    const integration = await Integration.findOne({ campaign: campaign._id });
    if (integration) {
      integration.lastSynced = Date.now();
      integration.stats = {
        totalSynced: (integration.stats?.totalSynced || 0) + results.success,
        successCount: (integration.stats?.successCount || 0) + results.success,
        failureCount: (integration.stats?.failureCount || 0) + results.failed
      };
      
      await integration.save();
    }
    
    res.json({
      success: true,
      message: `Synced ${results.success} of ${results.total} entries (${results.failed} failed)`,
      data: results
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @desc    Get user's integrations
 * @route   GET /api/integrations
 * @access  Private
 */
const getIntegrations = asyncHandler(async (req, res) => {
  try {
    const integrations = await Integration.find({ user: req.user.id })
      .populate('campaign', 'title')
      .select('-apiKey -secretKey'); // Don't send sensitive data
    
    res.json({
      success: true,
      data: integrations
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = {
  verifyIntegration,
  updateCampaignIntegration,
  testSend,
  syncEntries,
  getIntegrations
};