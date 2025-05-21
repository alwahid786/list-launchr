const asyncHandler = require('express-async-handler');
const { stripe, STRIPE_CONFIG } = require('../config/stripe');
const User = require('../models/User');

/**
 * @desc    Create a checkout session for subscription
 * @route   POST /api/stripe/create-checkout-session
 * @access  Private
 */
const createCheckoutSession = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // If user already has a Stripe customer ID, use it; otherwise create one
    let customerId = user.stripeCustomerId;

    if (!customerId) {
      // Create a new customer in Stripe
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          userId: user._id.toString()
        }
      });
      
      customerId = customer.id;
      
      // Update user with Stripe customer ID
      user.stripeCustomerId = customerId;
      await user.save();
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: STRIPE_CONFIG.PRICE_ID,
          quantity: 1
        }
      ],
      mode: 'subscription',
      success_url: `${STRIPE_CONFIG.SUCCESS_URL}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: STRIPE_CONFIG.CANCEL_URL,
      metadata: {
        userId: user._id.toString()
      }
    });

    res.json({ 
      success: true, 
      url: session.url,
      sessionId: session.id
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating checkout session',
      error: error.message
    });
  }
});

/**
 * @desc    Create a customer portal session
 * @route   POST /api/stripe/create-portal-session
 * @access  Private
 */
const createPortalSession = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('+stripeCustomerId');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.stripeCustomerId) {
      return res.status(400).json({
        success: false,
        message: 'No subscription found for this user'
      });
    }

    // Create customer portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: STRIPE_CONFIG.CUSTOMER_PORTAL_URL
    });

    res.json({
      success: true,
      url: session.url
    });
  } catch (error) {
    console.error('Error creating portal session:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating customer portal session',
      error: error.message
    });
  }
});

/**
 * @desc    Check subscription status
 * @route   GET /api/stripe/subscription-status
 * @access  Private
 */
const getSubscriptionStatus = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Return subscription status
    res.json({
      success: true,
      data: {
        isPro: user.isPro,
        accountType: user.accountType,
        subscriptionStatus: user.subscriptionStatus,
        subscriptionEndsAt: user.subscriptionEndsAt,
        nextBillingDate: user.nextBillingDate,
        hasActiveSubscription: user.hasProAccess()
      }
    });
  } catch (error) {
    console.error('Error getting subscription status:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving subscription status',
      error: error.message
    });
  }
});

/**
 * @desc    Verify checkout session and update user
 * @route   GET /api/stripe/verify-session/:sessionId
 * @access  Private
 */
const verifySession = asyncHandler(async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Session ID is required'
      });
    }

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // Check payment status
    if (session.payment_status !== 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Payment not completed',
        paymentStatus: session.payment_status
      });
    }

    // Get user ID from metadata or customer
    let userId = session.metadata.userId;
    
    // If userId not in metadata, get customer details and check metadata there
    if (!userId && session.customer) {
      const customer = await stripe.customers.retrieve(session.customer);
      userId = customer.metadata.userId;
    }

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID not found in session metadata'
      });
    }

    // Retrieve the subscription
    const subscriptionId = session.subscription;
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    // Update user with subscription details
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.stripeCustomerId = session.customer;
    user.subscriptionId = subscriptionId;
    user.accountType = 'pro';
    user.isPro = true;
    user.subscriptionStatus = subscription.status;
    
    // Calculate subscription end date
    const currentPeriodEnd = new Date(subscription.current_period_end * 1000);
    user.subscriptionEndsAt = currentPeriodEnd;
    user.nextBillingDate = currentPeriodEnd;
    user.lastBillingDate = new Date(subscription.current_period_start * 1000);
    
    await user.save();

    res.json({
      success: true,
      message: 'Subscription activated successfully',
      data: {
        subscriptionStatus: user.subscriptionStatus,
        isPro: user.isPro,
        subscriptionEndsAt: user.subscriptionEndsAt
      }
    });
  } catch (error) {
    console.error('Error verifying session:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying checkout session',
      error: error.message
    });
  }
});

module.exports = {
  createCheckoutSession,
  createPortalSession,
  getSubscriptionStatus,
  verifySession
};