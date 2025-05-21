const axios = require('axios');
const crypto = require('crypto');
const BaseAdapter = require('./BaseAdapter');

/**
 * Mailchimp API adapter for email integration
 */
class MailchimpAdapter extends BaseAdapter {
  constructor(config) {
    super(config);
    
    // Extract API key and data center from config
    this.apiKey = config.apiKey;
    
    // Extract datacenter from API key (format: xxxx-us1)
    const [, datacenter] = this.apiKey.split('-');
    if (!datacenter) {
      throw new Error('Invalid Mailchimp API key format. Expected format: xxxx-us1');
    }
    
    this.baseUrl = `https://${datacenter}.api.mailchimp.com/3.0`;
    this.auth = {
      username: 'anystring',
      password: this.apiKey
    };
    this.listId = config.listId;
  }

  /**
   * Make a request to the Mailchimp API
   * @param {String} method - HTTP method (GET, POST, etc.)
   * @param {String} endpoint - API endpoint (without base URL)
   * @param {Object} data - Data to send in the request (for POST, PUT, etc.)
   * @returns {Promise<Object>} API response
   */
  async makeRequest(method, endpoint, data = null) {
    try {
      const response = await axios({
        method,
        url: `${this.baseUrl}${endpoint}`,
        auth: this.auth,
        data,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      const message = error.response?.data?.detail || error.message;
      throw new Error(`Mailchimp API error: ${message}`);
    }
  }

  /**
   * Verify API credentials and list existence
   * @returns {Promise<Object>} Result with verification status and list info
   */
  async verify() {
    try {
      // Check if we can access the API and get account info
      const accountInfo = await this.makeRequest('GET', '/');
      
      // Check if the list/audience exists
      const listInfo = await this.makeRequest('GET', `/lists/${this.listId}`);
      
      return {
        success: true,
        message: 'Mailchimp integration verified successfully',
        data: {
          account: accountInfo.account_name,
          listName: listInfo.name,
          memberCount: listInfo.stats.member_count
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
   * Generate MD5 hash for Mailchimp subscriber ID
   * @param {String} email - Subscriber email
   * @returns {String} MD5 hash of lowercase email
   */
  generateSubscriberId(email) {
    return crypto.createHash('md5').update(email.toLowerCase()).digest('hex');
  }

  /**
   * Add or update a subscriber in the Mailchimp list
   * @param {Object} subscriber - Subscriber data (email, name, etc.)
   * @returns {Promise<Object>} Result of the subscriber addition
   */
  async addSubscriber(subscriber) {
    try {
      const { email, firstName, lastName } = subscriber;
      const subscriberHash = this.generateSubscriberId(email);
      
      // Prepare subscriber data
      const data = {
        email_address: email,
        status: 'subscribed',
        merge_fields: {}
      };
      
      // Add name data if provided
      if (firstName) {
        data.merge_fields.FNAME = firstName;
      }
      
      if (lastName) {
        data.merge_fields.LNAME = lastName;
      } else if (firstName && !lastName) {
        // If only first name is provided, try to extract last name
        const nameParts = firstName.split(' ');
        if (nameParts.length > 1) {
          data.merge_fields.FNAME = nameParts[0];
          data.merge_fields.LNAME = nameParts.slice(1).join(' ');
        }
      }
      
      // Use PUT to add or update a member
      const response = await this.makeRequest(
        'PUT',
        `/lists/${this.listId}/members/${subscriberHash}`,
        data
      );
      
      return {
        success: true,
        message: response.status === 'subscribed' ? 'Subscriber added successfully' : 'Subscriber updated successfully',
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
   * Send a test email by adding a test subscriber
   * @param {Object} subscriber - Test subscriber data (email, name)
   * @returns {Promise<Object>} Result of the test operation
   */
  async sendTest(subscriber) {
    try {
      // For Mailchimp, we just add the subscriber as a test
      const result = await this.addSubscriber({
        email: subscriber.email,
        firstName: subscriber.name || 'Test',
        lastName: 'User'
      });
      
      if (result.success) {
        return {
          success: true,
          message: 'Test subscriber added successfully to Mailchimp',
          data: result.data
        };
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: null
      };
    }
  }

  /**
   * Get information about the Mailchimp account and list
   * @returns {Promise<Object>} Provider specific information
   */
  async getProviderInfo() {
    try {
      // Get account info
      const accountInfo = await this.makeRequest('GET', '/');
      
      // Get list info
      const listInfo = await this.makeRequest('GET', `/lists/${this.listId}`);
      
      return {
        success: true,
        message: 'Provider information retrieved successfully',
        data: {
          account: accountInfo.account_name,
          accountType: accountInfo.type,
          listName: listInfo.name,
          listId: listInfo.id,
          memberCount: listInfo.stats.member_count,
          openRate: listInfo.stats.open_rate,
          clickRate: listInfo.stats.click_rate
        }
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: null
      };
    }
  }
}

module.exports = MailchimpAdapter;