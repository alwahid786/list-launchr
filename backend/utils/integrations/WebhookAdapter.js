const axios = require('axios');
const crypto = require('crypto');
const BaseAdapter = require('./BaseAdapter');

/**
 * Custom Webhook adapter for flexible integrations
 */
class WebhookAdapter extends BaseAdapter {
  constructor(config) {
    super(config);
    
    this.webhookUrl = config.webhookUrl;
    this.secretKey = config.secretKey || null;
  }

  /**
   * Generate HMAC signature for webhook payload
   * @param {Object} payload - Data to sign
   * @returns {String} HMAC signature
   */
  generateSignature(payload) {
    if (!this.secretKey) return null;
    
    const hmac = crypto.createHmac('sha256', this.secretKey);
    hmac.update(JSON.stringify(payload));
    return hmac.digest('hex');
  }

  /**
   * Make a request to the webhook URL
   * @param {Object} data - Data to send in the request
   * @returns {Promise<Object>} API response
   */
  async makeRequest(data) {
    try {
      const payload = {
        ...data,
        timestamp: Date.now()
      };
      
      const headers = {
        'Content-Type': 'application/json'
      };
      
      // Add HMAC signature if secret key is configured
      if (this.secretKey) {
        const signature = this.generateSignature(payload);
        headers['X-Webhook-Signature'] = signature;
      }
      
      const response = await axios({
        method: 'POST',
        url: this.webhookUrl,
        data: payload,
        headers
      });
      
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      throw new Error(`Webhook error: ${message}`);
    }
  }

  /**
   * Verify webhook URL is accessible
   * @returns {Promise<Object>} Result with verification status
   */
  async verify() {
    try {
      // Send a verification payload to check if webhook URL responds
      const response = await this.makeRequest({
        event: 'verification',
        data: {
          test: true
        }
      });
      
      // If response has a success property, check it
      if (response.hasOwnProperty('success') && !response.success) {
        return {
          success: false,
          message: response.message || 'Webhook returned unsuccessful response'
        };
      }
      
      return {
        success: true,
        message: 'Webhook integration verified successfully',
        data: {
          response
        }
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Send subscriber data to webhook
   * @param {Object} subscriber - Subscriber data (email, name, etc.)
   * @returns {Promise<Object>} Result of the webhook call
   */
  async addSubscriber(subscriber) {
    try {
      const response = await this.makeRequest({
        event: 'subscriber_added',
        data: subscriber
      });
      
      return {
        success: true,
        message: 'Subscriber data sent successfully to webhook',
        data: response
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: null
      };
    }
  }

  /**
   * Send a test webhook call
   * @param {Object} subscriber - Test subscriber data (email, name)
   * @returns {Promise<Object>} Result of the test operation
   */
  async sendTest(subscriber) {
    try {
      const response = await this.makeRequest({
        event: 'test',
        data: {
          ...subscriber,
          test: true
        }
      });
      
      return {
        success: true,
        message: 'Test webhook call sent successfully',
        data: response
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: null
      };
    }
  }

  /**
   * No specific provider info for webhook
   * @returns {Promise<Object>} Basic information
   */
  async getProviderInfo() {
    return {
      success: true,
      message: 'Custom webhook configured',
      data: {
        url: this.webhookUrl,
        secured: !!this.secretKey
      }
    };
  }
}

module.exports = WebhookAdapter;