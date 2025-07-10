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
    this.baseUrl = 'https://connect.mailerlite.com/api';
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
          'Accept': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        }
      });
      
      return response.data;
    } catch (error) {
      let message = 'Unknown error occurred';
      
      if (error.response) {
        // API responded with error status
        const status = error.response.status;
        const errorData = error.response.data;
        
        if (status === 401) {
          message = 'Invalid API key or unauthorized access';
        } else if (status === 403) {
          message = 'Access forbidden - please check your API key permissions';
        } else if (status === 404) {
          message = 'Resource not found - please check your configuration';
        } else if (errorData?.error?.message) {
          message = errorData.error.message;
        } else if (errorData?.message) {
          message = errorData.message;
        } else {
          message = `HTTP ${status} error`;
        }
      } else if (error.request) {
        message = 'Network error - please check your internet connection';
      } else {
        message = error.message;
      }
      
      throw new Error(`MailerLite API error: ${message}`);
    }
  }

  /**
   * Verify API credentials and group existence
   * @returns {Promise<Object>} Result with verification status and account info
   */
  async verify() {
    try {
      console.log('Verifying MailerLite API key...');
      
      // Check if we can access the API by getting groups (which will verify auth)
      const groups = await this.makeRequest('GET', '/groups');
      
      console.log('MailerLite API verification successful - groups retrieved');
      
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
      
      return {
        success: true,
        message: 'MailerLite integration verified successfully',
        data: {
          account: 'MailerLite Account',
          email: 'Connected',
          plan: 'Standard',
          groupName: groupInfo ? groupInfo.name : null,
          groupId: groupInfo ? groupInfo.id : null,
          totalGroups: groups.data ? groups.data.length : 0
        }
      };
    } catch (error) {
      console.error('MailerLite verification error:', error.message);
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
      
      // Prepare subscriber data according to new API format
      const data = {
        email,
        fields: {}
      };
      
      // Add name fields if provided
      if (firstName) {
        data.fields.name = firstName;
      }
      
      if (lastName) {
        data.fields.last_name = lastName;
      }
      
      // If group ID is provided, add to groups array
      if (this.groupId) {
        data.groups = [this.groupId];
      }
      
      // Use the new API endpoint format
      const response = await this.makeRequest('POST', '/subscribers', data);
      
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
      const response = await this.makeRequest('GET', '/groups');
      
      // Handle the response format: { data: [...], links: {...}, meta: {...} }
      const groups = response.data || [];
      
      return {
        success: true,
        message: 'Groups retrieved successfully',
        data: groups.map(group => ({
          id: group.id,
          name: group.name,
          subscriberCount: group.active_count || 0,
          active: true // All groups returned are typically active
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
      // Get groups
      const groupsResponse = await this.makeRequest('GET', '/groups');
      const groups = groupsResponse.data || [];
      
      return {
        success: true,
        message: 'Provider information retrieved successfully',
        data: {
          account: 'MailerLite Account',
          planName: 'Standard',
          groups: groups.map(group => ({
            id: group.id,
            name: group.name,
            active: true,
            subscriberCount: group.active_count || 0
          })),
          stats: {
            subscriberCount: groups.reduce((total, group) => total + (group.active_count || 0), 0),
            totalGroups: groups.length
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