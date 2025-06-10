const express = require('express');
const {
  createEntry,
  getEntries,
  completeAction,
  exportEntries,
  exportAllEntries
} = require('../controllers/entryController');
const { protect } = require('../middleware/auth');
const { checkEntryLimits } = require('../middleware/proAccess');

const router = express.Router();

// Public routes
router.post('/', checkEntryLimits, createEntry);
router.post('/:id/actions', completeAction);

// Protected routes
router.get('/:campaignId', protect, getEntries);
router.get('/:campaignId/export', protect, exportEntries);

// Export all user entries as CSV (for free users)
router.get('/export/csv', protect, exportAllEntries);

module.exports = router;