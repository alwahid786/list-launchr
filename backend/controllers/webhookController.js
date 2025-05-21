const asyncHandler = require('express-async-handler');
const { stripe, STRIPE_CONFIG } = require('../config/stripe');
const User = require('../models/User');

/**
 * @desc    Handle Stripe webhook events
 * @route   POST /api/stripe/webhook
 * @access  Public (But secured with Stripe signature)
 */
const handleWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  if (!sig) {
    return res.status(400).json({
      success: false,
      message: 'Missing Stripe signature'
    });
  }

  // Verify webhook signature
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody || req.body, 
      sig, 
      STRIPE_CONFIG.WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).json({
      success: false,
      message: `Webhook Error: ${err.message}`
    });
  }

  // Process different event types
  try {
    switch (event.type) {
      // Handle successful subscription creation
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;

      // Handle subscription payment success
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object);
        break;

      // Handle subscription payment failure
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object);
        break;

      // Handle subscription updates
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;

      // Handle subscription deletion
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error(`Error processing webhook: ${error.message}`);
    res.status(500).json({
      success: false,
      message: `Webhook processing error: ${error.message}`
    });
  }
});

/**
 * Process checkout.session.completed event
 * @param {Object} session - Checkout session object from Stripe
 */
const handleCheckoutSessionCompleted = async (session) => {
  if (session.mode !== 'subscription') {
    console.log('Not a subscription checkout session');
    return;
  }

  try {
    // Get user ID from metadata or customer
    let userId = session.metadata?.userId;
    
    // If userId not in metadata, get customer details and check metadata there
    if (!userId && session.customer) {
      const customer = await stripe.customers.retrieve(session.customer);
      userId = customer.metadata?.userId;
    }

    if (!userId) {
      console.error('User ID not found in session metadata');
      return;
    }

    // Retrieve subscription details
    const subscription = await stripe.subscriptions.retrieve(session.subscription);
    
    // Update user with subscription details
    const user = await User.findById(userId);
    
    if (!user) {
      console.error(`User not found: ${userId}`);
      return;
    }

    // Update user subscription details
    user.stripeCustomerId = session.customer;
    user.subscriptionId = session.subscription;
    user.accountType = 'pro';
    user.isPro = true;
    user.subscriptionStatus = subscription.status;
    
    // Calculate subscription end date
    const currentPeriodEnd = new Date(subscription.current_period_end * 1000);
    user.subscriptionEndsAt = currentPeriodEnd;
    user.nextBillingDate = currentPeriodEnd;
    user.lastBillingDate = new Date(subscription.current_period_start * 1000);
    
    await user.save();
    
    console.log(`User ${userId} subscription activated: ${subscription.status}`);
  } catch (error) {
    console.error(`Error processing checkout.session.completed: ${error.message}`);
    throw error;
  }
};

/**
 * Process invoice.payment_succeeded event
 * @param {Object} invoice - Invoice object from Stripe
 */
const handleInvoicePaymentSucceeded = async (invoice) => {
  if (!invoice.subscription) {
    console.log('Not a subscription invoice');
    return;
  }

  try {
    // Get subscription and customer details
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
    
    // Find user by Stripe customer ID
    const user = await User.findOne({ stripeCustomerId: invoice.customer });
    
    if (!user) {
      console.error(`User not found for customer: ${invoice.customer}`);
      return;
    }

    // Update user subscription details
    user.subscriptionStatus = subscription.status;
    user.isPro = true;
    user.accountType = 'pro';
    
    // Update billing dates
    const currentPeriodEnd = new Date(subscription.current_period_end * 1000);
    user.subscriptionEndsAt = currentPeriodEnd;
    user.nextBillingDate = currentPeriodEnd;
    user.lastBillingDate = new Date(subscription.current_period_start * 1000);
    
    await user.save();
    
    console.log(`Subscription renewed for user ${user._id}: ${subscription.status}`);
  } catch (error) {
    console.error(`Error processing invoice.payment_succeeded: ${error.message}`);
    throw error;
  }
};

/**
 * Process invoice.payment_failed event
 * @param {Object} invoice - Invoice object from Stripe
 */
const handleInvoicePaymentFailed = async (invoice) => {
  if (!invoice.subscription) {
    console.log('Not a subscription invoice');
    return;
  }

  try {
    // Get subscription details
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
    
    // Find user by Stripe customer ID
    const user = await User.findOne({ stripeCustomerId: invoice.customer });
    
    if (!user) {
      console.error(`User not found for customer: ${invoice.customer}`);
      return;
    }

    // Update user subscription status
    user.subscriptionStatus = subscription.status; // 'past_due' or 'unpaid'
    
    // Don't immediately remove Pro access, as Stripe will retry the payment
    // But update the flag to indicate payment issues
    if (subscription.status === 'past_due') {
      // Keep isPro true but update status to reflect payment issues
      user.isPro = true;
    } else if (subscription.status === 'unpaid') {
      // After several retries, Stripe marks as unpaid
      user.isPro = false;
    }
    
    await user.save();
    
    console.log(`Payment failed for user ${user._id}: ${subscription.status}`);
    
    // Here you could also implement logic to notify the user about the failed payment
    // via email or in-app notification
  } catch (error) {
    console.error(`Error processing invoice.payment_failed: ${error.message}`);
    throw error;
  }
};

/**
 * Process customer.subscription.updated event
 * @param {Object} subscription - Subscription object from Stripe
 */
const handleSubscriptionUpdated = async (subscription) => {
  try {
    // Find user by subscription ID
    const user = await User.findOne({ subscriptionId: subscription.id });
    
    if (!user) {
      console.error(`User not found for subscription: ${subscription.id}`);
      return;
    }

    // Update user subscription details
    user.subscriptionStatus = subscription.status;
    
    // Update isPro status based on subscription status
    user.isPro = ['active', 'trialing'].includes(subscription.status);
    
    // If subscription is active, update the plan type and dates
    if (['active', 'trialing'].includes(subscription.status)) {
      user.accountType = 'pro';
      
      // Update billing dates
      const currentPeriodEnd = new Date(subscription.current_period_end * 1000);
      user.subscriptionEndsAt = currentPeriodEnd;
      user.nextBillingDate = currentPeriodEnd;
      
      if (subscription.current_period_start) {
        user.lastBillingDate = new Date(subscription.current_period_start * 1000);
      }
    } else if (['canceled', 'unpaid', 'past_due'].includes(subscription.status)) {
      // Handle downgrade but keep pro until current period ends
      // isPro is already set based on status above
      
      // If canceled, the user will remain pro until the end of the current period
      if (subscription.status === 'canceled') {
        // Keep end date as is to allow access until end of billing period
      }
    }
    
    await user.save();
    
    console.log(`Subscription updated for user ${user._id}: ${subscription.status}`);
  } catch (error) {
    console.error(`Error processing customer.subscription.updated: ${error.message}`);
    throw error;
  }
};

/**
 * Process customer.subscription.deleted event
 * @param {Object} subscription - Subscription object from Stripe
 */
const handleSubscriptionDeleted = async (subscription) => {
  try {
    // Find user by subscription ID
    const user = await User.findOne({ subscriptionId: subscription.id });
    
    if (!user) {
      console.error(`User not found for subscription: ${subscription.id}`);
      return;
    }

    // Update user subscription details
    user.subscriptionStatus = 'canceled';
    user.isPro = false;
    user.accountType = 'free';
    
    // Keep subscription end date if it's in the future
    // This allows users to continue using Pro features until the end of their billing period
    const currentPeriodEnd = new Date(subscription.current_period_end * 1000);
    const now = new Date();
    
    if (currentPeriodEnd > now) {
      user.subscriptionEndsAt = currentPeriodEnd;
    } else {
      user.subscriptionEndsAt = now;
    }
    
    await user.save();
    
    console.log(`Subscription canceled for user ${user._id}`);
  } catch (error) {
    console.error(`Error processing customer.subscription.deleted: ${error.message}`);
    throw error;
  }
};

module.exports = { handleWebhook };