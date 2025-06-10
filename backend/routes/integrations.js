const express = require('express');
const router = express.Router();
const { 
  verifyIntegration, 
  updateCampaignIntegration, 
  testSend, 
  syncEntries,
  getIntegrations
} = require('../controllers/integrationController');
const { protect } = require('../middleware/auth');
const { requireProAccess, requireFeature } = require('../middleware/proAccess');

// All routes require authentication
router.use(protect);

// Get user's integrations (available to all users)
router.get('/', getIntegrations);

// Pro-only routes
router.post('/verify', requireProAccess, requireFeature('emailIntegrations'), verifyIntegration);
router.post('/test-send', requireProAccess, requireFeature('emailIntegrations'), testSend);
router.put('/campaign/:id', requireProAccess, requireFeature('emailIntegrations'), updateCampaignIntegration);
router.post('/sync/:id', requireProAccess, requireFeature('emailIntegrations'), syncEntries);

module.exports = router;