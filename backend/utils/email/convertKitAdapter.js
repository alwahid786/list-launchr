const axios = require('axios');

/**
 * ConvertKit API adapter
 * @param {Object} config - Configuration object
 * @param {string} config.apiKey - ConvertKit API key
 * @param {string} config.formId - ConvertKit form ID (optional)
 * @param {string} config.tagId - ConvertKit tag ID (optional)
 * @returns {Object} - ConvertKit adapter methods
 */
const convertKitAdapter = (config) => {
  const { apiKey, formId, tagId } = config;
  const baseUrl = 'https://api.convertkit.com/v3';
  
  if (!apiKey) {
    return {
      addSubscriber: async () => ({ success: false, error: 'Missing ConvertKit API key' }),
      verifyConnection: async () => ({ success: false, error: 'Missing ConvertKit API key' }),
    };
  }
  
  /**
   * Add a subscriber to ConvertKit
   * @param {Object} subscriberData - Subscriber information
   * @param {string} subscriberData.email - Subscriber email
   * @param {string} subscriberData.name - Subscriber name (optional)
   * @param {Object} subscriberData.fields - Additional fields (optional)
   * @returns {Object} - Response with success flag and message
   */
  const addSubscriber = async (subscriberData) => {
    try {
      // Prepare request data
      const data = {
        api_key: apiKey,
        email: subscriberData.email,
        first_name: subscriberData.name,
        fields: subscriberData.fields
      };
      
      let response;
      
      // If form ID is provided, subscribe to the form
      if (formId) {
        response = await axios.post(`${baseUrl}/forms/${formId}/subscribe`, data);
      } 
      // Otherwise, subscribe directly using the subscriber endpoint
      else {
        response = await axios.post(`${baseUrl}/subscribers`, data);
      }
      
      // If tag ID is provided, add tag to the subscriber
      if (tagId && response.data.subscriber) {
        const subscriberId = response.data.subscriber.id;
        await axios.post(`${baseUrl}/tags/${tagId}/subscribe`, {
          api_key: apiKey,
          email: subscriberData.email
        });
      }
      
      return {
        success: true,
        data: response.data,
        message: 'Subscriber added successfully to ConvertKit'
      };
    } catch (error) {
      console.error('ConvertKit error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error || error.message,
      };
    }
  };
  
  /**
   * Verify the API connection to ConvertKit
   * @returns {Object} - Response with success flag and message
   */
  const verifyConnection = async () => {
    try {
      // Get account information to verify connection
      const response = await axios.get(`${baseUrl}/account?api_key=${apiKey}`);
      
      return {
        success: true,
        data: {
          name: response.data.name,
          plan: response.data.plan_type,
        },
        message: 'ConvertKit connection verified'
      };
    } catch (error) {
      console.error('ConvertKit connection error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error || error.message,
      };
    }
  };
  
  return {
    addSubscriber,
    verifyConnection
  };
};

module.exports = convertKitAdapter;