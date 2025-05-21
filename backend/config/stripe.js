const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Validate that the Stripe secret key is configured
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('STRIPE_SECRET_KEY is not set in environment variables');
}

// Define the product and price IDs (can be moved to env variables in production)
const STRIPE_CONFIG = {
  PRODUCT_ID: process.env.STRIPE_PRODUCT_ID,
  PRICE_ID: process.env.STRIPE_PRICE_ID,
  SUCCESS_URL: process.env.STRIPE_SUCCESS_URL || 'http://localhost:5173/dashboard/upgrade/success',
  CANCEL_URL: process.env.STRIPE_CANCEL_URL || 'http://localhost:5173/dashboard/upgrade',
  WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  CUSTOMER_PORTAL_URL: process.env.STRIPE_CUSTOMER_PORTAL_URL || 'http://localhost:5173/dashboard/settings',
};

// Subscription details
const SUBSCRIPTION = {
  MONTHLY_PRICE: 9,
  FEATURES: {
    free: {
      maxCampaigns: 1,
      maxEntriesPerCampaign: 500,
      customBranding: false,
      emailIntegrations: false,
      fullSocialEntryMethods: false,
      couponReveal: false,
      campaignDuplication: false,
      noBranding: false
    },
    pro: {
      maxCampaigns: Infinity,
      maxEntriesPerCampaign: 10000,
      customBranding: true,
      emailIntegrations: true,
      fullSocialEntryMethods: true,
      couponReveal: true,
      campaignDuplication: true,
      noBranding: true
    }
  }
};

module.exports = { stripe, STRIPE_CONFIG, SUBSCRIPTION };