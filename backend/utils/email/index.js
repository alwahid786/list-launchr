const mailchimpAdapter = require('./mailchimpAdapter');
const convertKitAdapter = require('./convertKitAdapter');
const mailerLiteAdapter = require('./mailerLiteAdapter');
const webhookAdapter = require('./webhookAdapter');
const sendEmail = require('../sendEmail');

/**
 * Get the appropriate email service adapter based on provider name
 * @param {string} provider - Provider name: 'mailchimp', 'convertkit', 'mailerlite', 'webhook'
 * @param {Object} config - Provider configuration including apiKey, listId, webhookUrl, etc.
 * @returns {Object} - Email service adapter
 */
const getEmailAdapter = (provider, config) => {
  switch (provider) {
    case 'mailchimp':
      return mailchimpAdapter(config);
    case 'convertkit':
      return convertKitAdapter(config);
    case 'mailerlite':
      return mailerLiteAdapter(config);
    case 'webhook':
      return webhookAdapter(config);
    default:
      return {
        addSubscriber: async () => ({ success: false, error: 'Invalid provider' }),
        verifyConnection: async () => ({ success: false, error: 'Invalid provider' }),
      };
  }
};

module.exports = {
  getEmailAdapter,
  sendEmail
};