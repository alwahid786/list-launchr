const axios = require('axios');
const BaseAdapter = require('./BaseAdapter');

/**
 * MailerLite API adapter for email integration
 */
class MailerLiteAdapter extends BaseAdapter {
  constructor(config) {
    super(config);
    
    this.apiKey = config.apiKey;
    this.groupId = config.listId; // In MailerLite, lists are called groups
    this.baseUrl = 'https://api.mailerlite.com/api/v2';
  }

  /**
   * Make a request to the MailerLite API
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
        data,
        headers: {
          'Content-Type': 'application/json',
          'X-MailerLite-ApiKey': this.apiKey
        }
      });
      
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error?.message || error.message;
      throw new Error(`MailerLite API error: ${message}`);
    }
  }

  /**
   * Verify API credentials and group existence
   * @returns {Promise<Object>} Result with verification status and account info
   */
  async verify() {
    try {
      // Check if we can access the API and get account info
      const accountInfo = await this.makeRequest('GET', '/me');
      
      // If group ID is provided, verify it exists
      let groupInfo = null;
      if (this.groupId) {
        try {
          groupInfo = await this.makeRequest('GET', `/groups/${this.groupId}`);
        } catch (groupError) {
          return {
            success: false,
            message: `Valid API key, but group ID ${this.groupId} not found`
          };
        }
      }
      
      // Get subscriber count
      const stats = await this.makeRequest('GET', '/stats');
      
      return {
        success: true,
        message: 'MailerLite integration verified successfully',
        data: {
          account: accountInfo.account,
          planName: accountInfo.account.plan_name,
          subscriberCount: stats.subscribed,
          groupName: groupInfo ? groupInfo.name : null
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
   * Add a subscriber to MailerLite
   * @param {Object} subscriber - Subscriber data (email, name, etc.)
   * @returns {Promise<Object>} Result of the subscriber addition
   */
  async addSubscriber(subscriber) {
    try {
      const { email, firstName, lastName } = subscriber;
      
      // Prepare subscriber data
      const data = {
        email,
        fields: {}
      };
      
      // Add name data if provided
      if (firstName) {
        data.name = firstName;
      }
      
      if (lastName) {
        data.fields.last_name = lastName;
      }
      
      let response;
      
      // If group ID is provided, add to group
      if (this.groupId) {
        response = await this.makeRequest('POST', `/groups/${this.groupId}/subscribers`, data);
      } else {
        // Otherwise just add subscriber
        response = await this.makeRequest('POST', '/subscribers', data);
      }
      
      return {
        success: true,
        message: 'Subscriber added successfully to MailerLite',
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
      // For MailerLite, we add the subscriber as a test
      const result = await this.addSubscriber({
        email: subscriber.email,
        firstName: subscriber.name || 'Test',
        lastName: 'User'
      });
      
      if (result.success) {
        return {
          success: true,
          message: 'Test subscriber added successfully to MailerLite',
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
   * Get all groups from MailerLite
   * @returns {Promise<Object>} Groups information
   */
  async getLists() {
    try {
      const groups = await this.makeRequest('GET', '/groups');
      
      return {
        success: true,
        message: 'Groups retrieved successfully',
        data: groups.map(group => ({
          id: group.id,
          name: group.name,
          subscriberCount: group.total,
          active: group.active
        }))
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: []
      };
    }
  }

  /**
   * Get information about the MailerLite account and groups
   * @returns {Promise<Object>} Provider specific information
   */
  async getProviderInfo() {
    try {
      // Get account info
      const accountInfo = await this.makeRequest('GET', '/me');
      
      // Get groups
      const groups = await this.makeRequest('GET', '/groups');
      
      // Get stats
      const stats = await this.makeRequest('GET', '/stats');
      
      return {
        success: true,
        message: 'Provider information retrieved successfully',
        data: {
          account: accountInfo.account,
          planName: accountInfo.account.plan_name,
          groups: groups.map(group => ({
            id: group.id,
            name: group.name,
            active: group.active,
            subscriberCount: group.total
          })),
          stats: {
            subscriberCount: stats.subscribed,
            unsubscribedCount: stats.unsubscribed,
            bouncedCount: stats.bounced
          }
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

module.exports = MailerLiteAdapter;