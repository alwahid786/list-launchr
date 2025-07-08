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
      const message = error.response?.data?.errors?.[0]?.message || error.message;
      throw new Error(`SendGrid API error: ${message}`);
    }
  }

  /**
   * Verify API credentials and list existence
   * @returns {Promise<Object>} Result with verification status and account info
   */
  async verify() {
    try {
      // Check if we can access the API and get account info
      const accountInfo = await this.makeRequest('GET', '/user/account');
      
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
          account: accountInfo.name || accountInfo.username,
          email: accountInfo.email,
          listName: listInfo ? listInfo.name : null,
          contactCount: listInfo ? listInfo.contact_count : null
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
   * Add a subscriber to SendGrid
   * @param {Object} subscriber - Subscriber data (email, name, etc.)
   * @returns {Promise<Object>} Result of the subscriber addition
   */
  async addSubscriber(subscriber) {
    try {
      const { email, firstName, lastName } = subscriber;
      
      // Prepare contact data
      const contactData = {
        email,
        first_name: firstName || '',
        last_name: lastName || ''
      };
      
      // Add contact to SendGrid
      const response = await this.makeRequest('PUT', '/marketing/contacts', {
        contacts: [contactData]
      });
      
      // If list ID is provided, add contact to list
      if (this.listId && response.job_id) {
        // Wait a moment for contact to be processed
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Add contact to list
        await this.makeRequest('POST', `/marketing/lists/${this.listId}/contacts`, {
          contacts: [email]
        });
      }
      
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
      
      return {
        success: true,
        message: 'Lists retrieved successfully',
        data: listsResponse.result.map(list => ({
          id: list.id,
          name: list.name,
          contactCount: list.contact_count
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
      
      return {
        success: true,
        message: 'Provider information retrieved successfully',
        data: {
          account: accountInfo.name || accountInfo.username,
          email: accountInfo.email,
          lists: listsResponse.result.map(list => ({
            id: list.id,
            name: list.name,
            contactCount: list.contact_count
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