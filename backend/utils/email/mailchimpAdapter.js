const axios = require('axios');
const crypto = require('crypto');

/**
 * Mailchimp API adapter
 * @param {Object} config - Configuration object
 * @param {string} config.apiKey - Mailchimp API key
 * @param {string} config.listId - Mailchimp list/audience ID
 * @returns {Object} - Mailchimp adapter methods
 */
const mailchimpAdapter = (config) => {
  // Extract API key and data center from the key (format: xxxx-usX)
  const { apiKey, listId } = config;
  
  if (!apiKey || !listId) {
    return {
      addSubscriber: async () => ({ success: false, error: 'Missing Mailchimp API key or list ID' }),
      verifyConnection: async () => ({ success: false, error: 'Missing Mailchimp API key or list ID' }),
    };
  }
  
  const dc = apiKey.split('-')[1] || 'us1';
  const baseUrl = `https://${dc}.api.mailchimp.com/3.0`;
  
  // Create auth header with API key
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${Buffer.from(`apikey:${apiKey}`).toString('base64')}`
  };
  
  /**
   * Add a subscriber to the list
   * @param {Object} subscriberData - Subscriber information
   * @param {string} subscriberData.email - Subscriber email
   * @param {string} subscriberData.name - Subscriber name (optional)
   * @param {Object} subscriberData.fields - Additional fields (optional)
   * @returns {Object} - Response with success flag and message
   */
  const addSubscriber = async (subscriberData) => {
    try {
      // Generate MD5 hash of lowercase email for Mailchimp
      const emailHash = crypto
        .createHash('md5')
        .update(subscriberData.email.toLowerCase())
        .digest('hex');
      
      // Split name into first and last name if provided
      let firstName = '';
      let lastName = '';
      
      if (subscriberData.name) {
        const nameParts = subscriberData.name.split(' ');
        firstName = nameParts[0] || '';
        lastName = nameParts.slice(1).join(' ') || '';
      }
      
      // Prepare data for Mailchimp
      const data = {
        email_address: subscriberData.email,
        status: 'subscribed', // Use 'pending' if you want double opt-in
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
          ...subscriberData.fields
        }
      };
      
      // Make API request to Mailchimp
      const response = await axios.put(
        `${baseUrl}/lists/${listId}/members/${emailHash}`,
        data,
        { headers }
      );
      
      return {
        success: true,
        data: response.data,
        message: 'Subscriber added successfully'
      };
    } catch (error) {
      console.error('Mailchimp error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.detail || error.message,
      };
    }
  };
  
  /**
   * Verify the API connection to Mailchimp
   * @returns {Object} - Response with success flag and message
   */
  const verifyConnection = async () => {
    try {
      // Try to get list details to verify connection
      const response = await axios.get(
        `${baseUrl}/lists/${listId}`,
        { headers }
      );
      
      return {
        success: true,
        data: {
          listName: response.data.name,
          memberCount: response.data.stats.member_count,
        },
        message: 'Mailchimp connection verified'
      };
    } catch (error) {
      console.error('Mailchimp connection error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.detail || error.message,
      };
    }
  };
  
  return {
    addSubscriber,
    verifyConnection
  };
};

module.exports = mailchimpAdapter;