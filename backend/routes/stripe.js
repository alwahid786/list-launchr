const express = require('express');
const router = express.Router();
const { 
  createCheckoutSession,
  createPortalSession,
  getSubscriptionStatus,
  verifySession
} = require('../controllers/stripeController');
const { handleWebhook } = require('../controllers/webhookController');
const { protect } = require('../middleware/auth');

// Route to handle Stripe webhooks (needs raw body)
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

// Protected routes
router.use(protect);

// Create a checkout session
router.post('/create-checkout-session', createCheckoutSession);

// Create a customer portal session
router.post('/create-portal-session', createPortalSession);

// Get subscription status
router.get('/subscription-status', getSubscriptionStatus);

// Verify session after checkout completion
router.get('/verify-session/:sessionId', verifySession);

module.exports = router;