const express = require('express');
const {
  createCampaign,
  getCampaigns,
  getCampaign,
  updateCampaign,
  deleteCampaign,
  duplicateCampaign,
  getPublicCampaign,
  updateCampaignStatus,
  selectWinners
} = require('../controllers/campaignController');
const { protect } = require('../middleware/auth');
const { 
  requireProAccess, 
  checkCampaignLimits, 
  requireFeature 
} = require('../middleware/proAccess');

const router = express.Router();

// Public routes
router.get('/public/:slug', getPublicCampaign);

// Protected routes
router.route('/')
  .get(protect, getCampaigns)
  .post(protect, checkCampaignLimits, createCampaign);

router.route('/:id')
  .get(protect, getCampaign)
  .put(protect, updateCampaign)
  .delete(protect, deleteCampaign);

// Pro-only features
router.post('/:id/duplicate', protect, requireProAccess, requireFeature('campaignDuplication'), duplicateCampaign);
router.put('/:id/status', protect, updateCampaignStatus);
router.post('/:id/select-winners', protect, selectWinners);

module.exports = router;