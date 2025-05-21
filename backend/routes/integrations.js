const express = require('express');
const router = express.Router();
const { 
  verifyIntegration, 
  updateCampaignIntegration, 
  testSend, 
  syncEntries 
} = require('../controllers/integrationController');
const { protect } = require('../middleware/auth');
const { requireProAccess, requireFeature } = require('../middleware/proAccess');

// All routes require authentication and Pro access
router.use(protect);
router.use(requireProAccess);
router.use(requireFeature('emailIntegrations'));

// Integration verification route
router.post('/verify', verifyIntegration);

// Test send route
router.post('/test-send', testSend);

// Update campaign integration
router.put('/campaign/:id', updateCampaignIntegration);

// Sync entries
router.post('/sync/:id', syncEntries);

module.exports = router;