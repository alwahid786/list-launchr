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
    
    if (!this.apiKey) {
      throw new Error('Mailchimp API key is required');
    }
    
    // Extract datacenter from API key (format: xxxx-us1)
    const apiKeyParts = this.apiKey.split('-');
    const datacenter = apiKeyParts[apiKeyParts.length - 1]; // Get last part after last dash
    
    if (!datacenter || apiKeyParts.length < 2) {
      throw new Error('Invalid Mailchimp API key format. Expected format: xxxx-us1 (should end with datacenter like -us1, -us2, etc.)');
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
      let message = 'Unknown error occurred';
      
      if (error.response) {
        // API responded with error status
        const status = error.response.status;
        const errorData = error.response.data;
        
        if (status === 401) {
          message = 'Invalid API key or unauthorized access';
        } else if (status === 404) {
          message = 'Resource not found - please check your API key format (should end with datacenter like -us1)';
        } else if (errorData?.detail) {
          message = errorData.detail;
        } else if (errorData?.title) {
          message = errorData.title;
        } else {
          message = `HTTP ${status} error`;
        }
      } else if (error.request) {
        message = 'Network error - please check your internet connection';
      } else {
        message = error.message;
      }
      
      throw new Error(`Mailchimp API error: ${message}`);
    }
  }

  /**
   * Verify API credentials and optionally list existence
   * @returns {Promise<Object>} Result with verification status and account info
   */
  async verify() {
    try {
      console.log(`Verifying Mailchimp API key with baseUrl: ${this.baseUrl}`);
      
      // Check if we can access the API and get account info
      const accountInfo = await this.makeRequest('GET', '/');
      
      console.log('Mailchimp account info received:', {
        account_name: accountInfo.account_name,
        email: accountInfo.email
      });
      
      let listInfo = null;
      
      // If list ID is provided, verify it exists
      if (this.listId) {
        try {
          listInfo = await this.makeRequest('GET', `/lists/${this.listId}`);
        } catch (listError) {
          return {
            success: false,
            message: `Valid API key, but list ID ${this.listId} not found`
          };
        }
      }
      
      return {
        success: true,
        message: 'Mailchimp integration verified successfully',
        data: {
          account: accountInfo.account_name,
          email: accountInfo.email,
          listName: listInfo ? listInfo.name : null,
          memberCount: listInfo ? listInfo.stats.member_count : null,
          totalLists: accountInfo.total_subscribers || 0
        }
      };
    } catch (error) {
      console.error('Mailchimp verification error:', error.message);
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
   * Get all lists/audiences from Mailchimp
   * @returns {Promise<Object>} Lists information
   */
  async getLists() {
    try {
      const response = await this.makeRequest('GET', '/lists');
      
      return {
        success: true,
        message: 'Lists retrieved successfully',
        data: response.lists.map(list => ({
          id: list.id,
          name: list.name,
          memberCount: list.stats.member_count
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
   * Get information about the Mailchimp account and optionally a specific list
   * @returns {Promise<Object>} Provider specific information
   */
  async getProviderInfo() {
    try {
      // Get account info
      const accountInfo = await this.makeRequest('GET', '/');
      
      let listInfo = null;
      
      // If list ID is provided, get specific list info
      if (this.listId) {
        try {
          listInfo = await this.makeRequest('GET', `/lists/${this.listId}`);
        } catch (listError) {
          // If specific list fails, still return account info
          console.warn(`Could not fetch list ${this.listId}:`, listError.message);
        }
      }
      
      return {
        success: true,
        message: 'Provider information retrieved successfully',
        data: {
          account: accountInfo.account_name,
          email: accountInfo.email,
          accountType: accountInfo.type || 'unknown',
          listName: listInfo ? listInfo.name : null,
          listId: listInfo ? listInfo.id : null,
          memberCount: listInfo ? listInfo.stats.member_count : null,
          openRate: listInfo ? listInfo.stats.open_rate : null,
          clickRate: listInfo ? listInfo.stats.click_rate : null
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