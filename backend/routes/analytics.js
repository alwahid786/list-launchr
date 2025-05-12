const express = require('express');
const {
  getCampaignStats,
  getDashboardStats
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All analytics routes are protected
router.get('/campaign/:campaignId', protect, getCampaignStats);
router.get('/dashboard', protect, getDashboardStats);

module.exports = router;