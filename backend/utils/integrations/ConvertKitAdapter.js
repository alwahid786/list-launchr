const axios = require('axios');
const BaseAdapter = require('./BaseAdapter');

/**
 * ConvertKit API adapter for email integration
 */
class ConvertKitAdapter extends BaseAdapter {
  constructor(config) {
    super(config);
    
    this.apiKey = config.apiKey;
    this.formId = config.formId;
    this.tagId = config.tagId;
    this.baseUrl = 'https://api.convertkit.com/v3';
  }

  /**
   * Make a request to the ConvertKit API
   * @param {String} method - HTTP method (GET, POST, etc.)
   * @param {String} endpoint - API endpoint (without base URL)
   * @param {Object} data - Data to send in the request (for POST, PUT, etc.)
   * @returns {Promise<Object>} API response
   */
  async makeRequest(method, endpoint, data = null) {
    try {
      // Add API key to all requests
      const params = {
        api_key: this.apiKey
      };
      
      // For GET requests, append data to params
      if (method.toUpperCase() === 'GET' && data) {
        Object.assign(params, data);
      }
      
      const response = await axios({
        method,
        url: `${this.baseUrl}${endpoint}`,
        params,
        data: method.toUpperCase() !== 'GET' ? data : undefined,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      throw new Error(`ConvertKit API error: ${message}`);
    }
  }

  /**
   * Verify API credentials and account access
   * @returns {Promise<Object>} Result with verification status and account info
   */
  async verify() {
    try {
      // Check if we can access the API and get account info
      const accountInfo = await this.makeRequest('GET', '/account');
      
      // If form ID is provided, verify it exists
      let formInfo = null;
      if (this.formId) {
        try {
          formInfo = await this.makeRequest('GET', `/forms/${this.formId}`);
        } catch (formError) {
          return {
            success: false,
            message: `Valid API key, but form ID ${this.formId} not found`
          };
        }
      }
      
      // If tag ID is provided, verify it exists
      let tagInfo = null;
      if (this.tagId) {
        try {
          const tags = await this.makeRequest('GET', '/tags');
          tagInfo = tags.tags.find(tag => tag.id.toString() === this.tagId.toString());
          
          if (!tagInfo) {
            return {
              success: false,
              message: `Valid API key, but tag ID ${this.tagId} not found`
            };
          }
        } catch (tagError) {
          return {
            success: false,
            message: `Valid API key, but error verifying tag ID ${this.tagId}`
          };
        }
      }
      
      return {
        success: true,
        message: 'ConvertKit integration verified successfully',
        data: {
          name: accountInfo.name,
          plan: accountInfo.plan_type,
          formName: formInfo ? formInfo.name : null,
          tagName: tagInfo ? tagInfo.name : null
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
   * Add a subscriber to ConvertKit
   * @param {Object} subscriber - Subscriber data (email, name, etc.)
   * @returns {Promise<Object>} Result of the subscriber addition
   */
  async addSubscriber(subscriber) {
    try {
      const { email, firstName } = subscriber;
      
      // Prepare subscriber data
      const data = {
        email,
        first_name: firstName || '',
        api_key: this.apiKey
      };
      
      let response;
      
      // If form ID is provided, subscribe to form
      if (this.formId) {
        response = await this.makeRequest('POST', `/forms/${this.formId}/subscribe`, data);
      } else {
        // Otherwise just add subscriber
        response = await this.makeRequest('POST', '/subscribers', data);
      }
      
      // If tag ID is provided, add tag to subscriber
      if (this.tagId && response.subscriber) {
        await this.makeRequest('POST', `/tags/${this.tagId}/subscribe`, {
          email,
          api_key: this.apiKey
        });
      }
      
      return {
        success: true,
        message: 'Subscriber added successfully to ConvertKit',
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
      // For ConvertKit, we add the subscriber as a test
      const result = await this.addSubscriber({
        email: subscriber.email,
        firstName: subscriber.name || 'Test'
      });
      
      if (result.success) {
        return {
          success: true,
          message: 'Test subscriber added successfully to ConvertKit',
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
   * Get information about the ConvertKit account
   * @returns {Promise<Object>} Provider specific information
   */
  async getProviderInfo() {
    try {
      // Get account info
      const accountInfo = await this.makeRequest('GET', '/account');
      
      // Get forms
      const forms = await this.makeRequest('GET', '/forms');
      
      // Get tags
      const tags = await this.makeRequest('GET', '/tags');
      
      return {
        success: true,
        message: 'Provider information retrieved successfully',
        data: {
          name: accountInfo.name,
          plan: accountInfo.plan_type,
          forms: forms.forms.map(form => ({
            id: form.id,
            name: form.name,
            subscribers: form.subscribers
          })),
          tags: tags.tags.map(tag => ({
            id: tag.id,
            name: tag.name,
            subscribers: tag.subscriber_count
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

module.exports = ConvertKitAdapter;