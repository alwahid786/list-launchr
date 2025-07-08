const MailchimpAdapter = require('./MailchimpAdapter');
const ConvertKitAdapter = require('./ConvertKitAdapter');
const MailerLiteAdapter = require('./MailerLiteAdapter');
const SendGridAdapter = require('./SendGridAdapter');
const WebhookAdapter = require('./WebhookAdapter');

/**
 * Factory for creating the appropriate integration adapter
 */
class AdapterFactory {
  /**
   * Create an adapter instance based on provider type
   * @param {String} provider - The provider type (mailchimp, convertkit, etc.)
   * @param {Object} config - Provider configuration options
   * @returns {BaseAdapter} The appropriate adapter instance
   */
  static createAdapter(provider, config) {
    switch (provider.toLowerCase()) {
      case 'mailchimp':
        return new MailchimpAdapter(config);
      
      case 'convertkit':
        return new ConvertKitAdapter(config);
      
      case 'mailerlite':
        return new MailerLiteAdapter(config);
      
      case 'sendgrid':
        return new SendGridAdapter(config);
      
      case 'webhook':
        return new WebhookAdapter(config);
      
      case 'none':
        throw new Error('No provider specified');
      
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  }
}

module.exports = AdapterFactory;