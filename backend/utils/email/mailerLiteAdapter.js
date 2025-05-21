const axios = require('axios');

/**
 * MailerLite API adapter
 * @param {Object} config - Configuration object
 * @param {string} config.apiKey - MailerLite API key
 * @param {string} config.groupId - MailerLite group ID (optional)
 * @returns {Object} - MailerLite adapter methods
 */
const mailerLiteAdapter = (config) => {
  const { apiKey, groupId } = config;
  const baseUrl = 'https://api.mailerlite.com/api/v2';
  
  if (!apiKey) {
    return {
      addSubscriber: async () => ({ success: false, error: 'Missing MailerLite API key' }),
      verifyConnection: async () => ({ success: false, error: 'Missing MailerLite API key' }),
    };
  }
  
  // Create headers with API key
  const headers = {
    'Content-Type': 'application/json',
    'X-MailerLite-ApiKey': apiKey
  };
  
  /**
   * Add a subscriber to MailerLite
   * @param {Object} subscriberData - Subscriber information
   * @param {string} subscriberData.email - Subscriber email
   * @param {string} subscriberData.name - Subscriber name (optional)
   * @param {Object} subscriberData.fields - Additional fields (optional)
   * @returns {Object} - Response with success flag and message
   */
  const addSubscriber = async (subscriberData) => {
    try {
      // Split name into first and last name if provided
      let firstName = '';
      let lastName = '';
      
      if (subscriberData.name) {
        const nameParts = subscriberData.name.split(' ');
        firstName = nameParts[0] || '';
        lastName = nameParts.slice(1).join(' ') || '';
      }
      
      // Prepare request data
      const data = {
        email: subscriberData.email,
        name: firstName,
        fields: {
          last_name: lastName,
          ...subscriberData.fields
        },
        resubscribe: true
      };
      
      let response;
      
      // If group ID is provided, add to a specific group
      if (groupId) {
        response = await axios.post(
          `${baseUrl}/groups/${groupId}/subscribers`,
          data,
          { headers }
        );
      } 
      // Otherwise, add to subscribers without specifying a group
      else {
        response = await axios.post(
          `${baseUrl}/subscribers`,
          data,
          { headers }
        );
      }
      
      return {
        success: true,
        data: response.data,
        message: 'Subscriber added successfully to MailerLite'
      };
    } catch (error) {
      console.error('MailerLite error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message,
      };
    }
  };
  
  /**
   * Verify the API connection to MailerLite
   * @returns {Object} - Response with success flag and message
   */
  const verifyConnection = async () => {
    try {
      // Get account information to verify connection
      const response = await axios.get(
        `${baseUrl}/me`,
        { headers }
      );
      
      return {
        success: true,
        data: {
          account: response.data.account,
          planName: response.data.account.plan_name,
          subscriberCount: response.data.stats?.active_subscribers_count || 0,
        },
        message: 'MailerLite connection verified'
      };
    } catch (error) {
      console.error('MailerLite connection error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message,
      };
    }
  };
  
  return {
    addSubscriber,
    verifyConnection
  };
};

module.exports = mailerLiteAdapter;