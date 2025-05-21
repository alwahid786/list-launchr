const axios = require('axios');

/**
 * Webhook adapter for custom integrations
 * @param {Object} config - Configuration object
 * @param {string} config.webhookUrl - Webhook URL to send data to
 * @param {string} config.secretKey - Secret key for webhook authentication (optional)
 * @returns {Object} - Webhook adapter methods
 */
const webhookAdapter = (config) => {
  const { webhookUrl, secretKey } = config;
  
  if (!webhookUrl) {
    return {
      addSubscriber: async () => ({ success: false, error: 'Missing webhook URL' }),
      verifyConnection: async () => ({ success: false, error: 'Missing webhook URL' }),
    };
  }
  
  // Prepare headers with secret key if provided
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (secretKey) {
    headers['X-Webhook-Secret'] = secretKey;
  }
  
  /**
   * Add a subscriber by sending data to webhook
   * @param {Object} subscriberData - Subscriber information
   * @param {string} subscriberData.email - Subscriber email
   * @param {string} subscriberData.name - Subscriber name (optional)
   * @param {Object} subscriberData.fields - Additional fields (optional)
   * @returns {Object} - Response with success flag and message
   */
  const addSubscriber = async (subscriberData) => {
    try {
      // Send all data to webhook endpoint
      const response = await axios.post(
        webhookUrl,
        {
          ...subscriberData,
          timestamp: new Date().toISOString(),
          source: 'ListLaunchr',
          event: 'new_subscriber'
        },
        { headers }
      );
      
      return {
        success: true,
        data: response.data,
        message: 'Data sent to webhook successfully'
      };
    } catch (error) {
      console.error('Webhook error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  };
  
  /**
   * Verify the webhook connection by sending a test ping
   * @returns {Object} - Response with success flag and message
   */
  const verifyConnection = async () => {
    try {
      // Send test ping to webhook
      const response = await axios.post(
        webhookUrl,
        {
          event: 'ping',
          timestamp: new Date().toISOString(),
          source: 'ListLaunchr'
        },
        { headers }
      );
      
      return {
        success: true,
        data: response.data,
        message: 'Webhook connection verified'
      };
    } catch (error) {
      console.error('Webhook connection error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  };
  
  return {
    addSubscriber,
    verifyConnection
  };
};

module.exports = webhookAdapter;