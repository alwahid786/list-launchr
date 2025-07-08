const asyncHandler = require('express-async-handler');
const { AdapterFactory } = require('../utils/integrations');
const User = require('../models/User');

/**
 * @desc    Connect an email service by validating API key
 * @route   POST /api/email-services/connect
 * @access  Private
 */
const connectEmailService = asyncHandler(async (req, res) => {
  const { provider, apiKey } = req.body;
  
  if (!provider || !apiKey) {
    return res.status(400).json({
      success: false,
      message: 'Provider and API key are required'
    });
  }

  // Only allow specified providers
  const allowedProviders = ['mailchimp', 'mailerlite', 'sendgrid'];
  if (!allowedProviders.includes(provider.toLowerCase())) {
    return res.status(400).json({
      success: false,
      message: `Provider ${provider} is not supported. Supported providers: ${allowedProviders.join(', ')}`
    });
  }
  
  try {
    // Create adapter for the provider
    const adapter = AdapterFactory.createAdapter(provider, { apiKey });
    
    // Verify the API key by making a live request
    const verificationResult = await adapter.verify();
    
    if (!verificationResult.success) {
      return res.status(400).json({
        success: false,
        message: verificationResult.message
      });
    }

    // Get the user and update their email services
    const user = await User.findById(req.user.id).select('+emailServices');
    
    if (!user.emailServices) {
      user.emailServices = {};
    }
    
    // Store the email service connection
    user.emailServices.set(provider, {
      apiKey,
      connected: true,
      connectedAt: new Date(),
      accountInfo: verificationResult.data
    });
    
    await user.save();
    
    res.json({
      success: true,
      message: `${provider} connected successfully`,
      data: {
        provider,
        accountInfo: verificationResult.data,
        connectedAt: user.emailServices.get(provider).connectedAt
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @desc    Disconnect an email service
 * @route   DELETE /api/email-services/:provider
 * @access  Private
 */
const disconnectEmailService = asyncHandler(async (req, res) => {
  const { provider } = req.params;
  
  try {
    const user = await User.findById(req.user.id).select('+emailServices');
    
    if (!user.emailServices || !user.emailServices.get(provider)) {
      return res.status(404).json({
        success: false,
        message: `${provider} is not connected`
      });
    }
    
    // Remove the email service connection
    user.emailServices.delete(provider);
    await user.save();
    
    res.json({
      success: true,
      message: `${provider} disconnected successfully`
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @desc    Get connected email services
 * @route   GET /api/email-services
 * @access  Private
 */
const getConnectedServices = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('+emailServices');
    
    console.log('User emailServices:', user.emailServices);
    console.log('emailServices type:', typeof user.emailServices);
    console.log('emailServices size:', user.emailServices?.size);
    
    const connectedServices = [];
    
    if (user.emailServices) {
      // Convert Map to array and iterate
      for (const [provider, serviceData] of user.emailServices.entries()) {
        console.log(`Checking provider ${provider}:`, serviceData);
        if (serviceData.connected) {
          connectedServices.push({
            provider,
            accountInfo: serviceData.accountInfo,
            connectedAt: serviceData.connectedAt
          });
        }
      }
    }
    
    console.log('Final connected services:', connectedServices);
    
    res.json({
      success: true,
      data: connectedServices
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @desc    Get lists/audiences for a connected email service
 * @route   GET /api/email-services/:provider/lists
 * @access  Private
 */
const getServiceLists = asyncHandler(async (req, res) => {
  const { provider } = req.params;
  
  try {
    const user = await User.findById(req.user.id).select('+emailServices');
    
    if (!user.emailServices || !user.emailServices.get(provider) || !user.emailServices.get(provider).connected) {
      return res.status(404).json({
        success: false,
        message: `${provider} is not connected`
      });
    }
    
    // Create adapter and get lists
    const adapter = AdapterFactory.createAdapter(provider, {
      apiKey: user.emailServices.get(provider).apiKey
    });
    
    const listsResult = await adapter.getLists();
    
    if (!listsResult.success) {
      return res.status(400).json({
        success: false,
        message: listsResult.message
      });
    }
    
    const lists = listsResult.data || [];
    
    res.json({
      success: true,
      data: {
        provider,
        lists
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @desc    Test email service connection
 * @route   POST /api/email-services/:provider/test
 * @access  Private
 */
const testEmailService = asyncHandler(async (req, res) => {
  const { provider } = req.params;
  const { email, name } = req.body;
  
  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Email is required for testing'
    });
  }
  
  try {
    const user = await User.findById(req.user.id).select('+emailServices');
    
    if (!user.emailServices || !user.emailServices.get(provider) || !user.emailServices.get(provider).connected) {
      return res.status(404).json({
        success: false,
        message: `${provider} is not connected`
      });
    }
    
    // Create adapter and send test
    const adapter = AdapterFactory.createAdapter(provider, {
      apiKey: user.emailServices.get(provider).apiKey
    });
    
    const testResult = await adapter.sendTest({
      email,
      name: name || 'Test User'
    });
    
    res.json({
      success: testResult.success,
      message: testResult.message,
      data: testResult.data
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = {
  connectEmailService,
  disconnectEmailService,
  getConnectedServices,
  getServiceLists,
  testEmailService
};