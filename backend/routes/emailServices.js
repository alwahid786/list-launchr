const express = require('express');
const router = express.Router();
const { 
  connectEmailService,
  disconnectEmailService,
  getConnectedServices,
  getServiceLists,
  testEmailService
} = require('../controllers/emailServiceController');
const { protect } = require('../middleware/auth');
const { requireProAccess, requireFeature } = require('../middleware/proAccess');

// All routes require authentication and Pro access
router.use(protect);
router.use(requireProAccess);
router.use(requireFeature('emailIntegrations'));

// Email service management routes
router.get('/', getConnectedServices);
router.post('/connect', connectEmailService);
router.delete('/:provider', disconnectEmailService);
router.get('/:provider/lists', getServiceLists);
router.post('/:provider/test', testEmailService);

module.exports = router;