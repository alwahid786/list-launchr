const axios = require('axios');
const BaseAdapter = require('./BaseAdapter');

/**
 * SendGrid API adapter for email integration
 */
class SendGridAdapter extends BaseAdapter {
  constructor(config) {
    super(config);
    
    this.apiKey = config.apiKey;
    this.listId = config.listId;
    this.baseUrl = 'https://api.sendgrid.com/v3';
  }

  /**
   * Make a request to the SendGrid API
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
        } else if (errorData?.errors?.[0]?.message) {
          message = errorData.errors[0].message;
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
      
      throw new Error(`SendGrid API error: ${message}`);
    }
  }

  /**
   * Verify API credentials and list existence
   * @returns {Promise<Object>} Result with verification status and account info
   */
  async verify() {
    try {
      console.log('Verifying SendGrid API key...');
      
      // Check if we can access the API and get account info
      const accountInfo = await this.makeRequest('GET', '/user/account');
      
      console.log('SendGrid account info received:', {
        account: accountInfo.name || accountInfo.username,
        email: accountInfo.email
      });
      
      // If list ID is provided, verify it exists
      let listInfo = null;
      if (this.listId) {
        try {
          listInfo = await this.makeRequest('GET', `/marketing/lists/${this.listId}`);
        } catch (listError) {
          return {
            success: false,
            message: `Valid API key, but list ID ${this.listId} not found`
          };
        }
      }
      
      return {
        success: true,
        message: 'SendGrid integration verified successfully',
        data: {
          account: accountInfo.name || accountInfo.username || 'SendGrid Account',
          email: accountInfo.email,
          type: accountInfo.type || 'Standard',
          listName: listInfo ? listInfo.name : null,
          contactCount: listInfo ? listInfo.contact_count : null
        }
      };
    } catch (error) {
      console.error('SendGrid verification error:', error.message);
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Add a subscriber to SendGrid
   * @param {Object} subscriber - Subscriber data (email, name, etc.)
   * @returns {Promise<Object>} Result of the subscriber addition
   */
  async addSubscriber(subscriber) {
    try {
      const { email, firstName, lastName } = subscriber;
      
      // Prepare contact data according to current API format
      const contactData = {
        email,
        first_name: firstName || '',
        last_name: lastName || ''
      };
      
      // Prepare request payload with optional list assignment
      const requestData = {
        contacts: [contactData]
      };
      
      // If list ID is provided, include it in the request to add contact directly to list
      if (this.listId) {
        requestData.list_ids = [this.listId];
      }
      
      // Add contact to SendGrid using the current API format
      const response = await this.makeRequest('PUT', '/marketing/contacts', requestData);
      
      return {
        success: true,
        message: 'Contact added successfully to SendGrid',
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
      // For SendGrid, we add the subscriber as a test
      const result = await this.addSubscriber({
        email: subscriber.email,
        firstName: subscriber.name || 'Test',
        lastName: 'User'
      });
      
      if (result.success) {
        return {
          success: true,
          message: 'Test contact added successfully to SendGrid',
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
   * Get all lists from SendGrid
   * @returns {Promise<Object>} Lists information
   */
  async getLists() {
    try {
      const listsResponse = await this.makeRequest('GET', '/marketing/lists?page_size=100');
      
      // Handle the response format: { result: [...], _metadata: {...} }
      const lists = listsResponse.result || [];
      
      return {
        success: true,
        message: 'Lists retrieved successfully',
        data: lists.map(list => ({
          id: list.id,
          name: list.name,
          contactCount: list.contact_count || 0
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
   * Get information about the SendGrid account and lists
   * @returns {Promise<Object>} Provider specific information
   */
  async getProviderInfo() {
    try {
      // Get account info
      const accountInfo = await this.makeRequest('GET', '/user/account');
      
      // Get lists
      const listsResponse = await this.makeRequest('GET', '/marketing/lists?page_size=100');
      const lists = listsResponse.result || [];
      
      return {
        success: true,
        message: 'Provider information retrieved successfully',
        data: {
          account: accountInfo.name || accountInfo.username,
          email: accountInfo.email,
          lists: lists.map(list => ({
            id: list.id,
            name: list.name,
            contactCount: list.contact_count || 0
          }))
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

module.exports = SendGridAdapter;