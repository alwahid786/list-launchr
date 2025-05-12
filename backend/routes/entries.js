const express = require('express');
const {
  createEntry,
  getEntries,
  completeAction,
  exportEntries
} = require('../controllers/entryController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/', createEntry);
router.post('/:id/actions', completeAction);

// Protected routes
router.get('/:campaignId', protect, getEntries);
router.get('/:campaignId/export', protect, exportEntries);

module.exports = router;