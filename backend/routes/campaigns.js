const express = require('express');
const {
  createCampaign,
  getCampaigns,
  getCampaign,
  updateCampaign,
  deleteCampaign,
  duplicateCampaign,
  getPublicCampaign,
  updateCampaignStatus
} = require('../controllers/campaignController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/public/:slug', getPublicCampaign);

// Protected routes
router.route('/')
  .get(protect, getCampaigns)
  .post(protect, createCampaign);

router.route('/:id')
  .get(protect, getCampaign)
  .put(protect, updateCampaign)
  .delete(protect, deleteCampaign);

router.post('/:id/duplicate', protect, duplicateCampaign);
router.put('/:id/status', protect, updateCampaignStatus);

module.exports = router;