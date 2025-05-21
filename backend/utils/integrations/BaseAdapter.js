/**
 * Base class for email service provider adapters
 * This defines the interface that all specific provider adapters must implement
 */
class BaseAdapter {
  constructor(config) {
    this.config = config;
  }

  /**
   * Verify the integration credentials and connection
   * @returns {Promise<Object>} Result with verification status and provider info
   */
  async verify() {
    throw new Error('verify() method must be implemented by adapter subclass');
  }

  /**
   * Add a subscriber to the email list
   * @param {Object} subscriber - The subscriber data (email, name, etc.)
   * @returns {Promise<Object>} Result of the subscriber addition
   */
  async addSubscriber(subscriber) {
    throw new Error('addSubscriber() method must be implemented by adapter subclass');
  }

  /**
   * Send a test email to verify integration
   * @param {Object} subscriber - The subscriber to send test to (email, name, etc.)
   * @returns {Promise<Object>} Result of the test email send
   */
  async sendTest(subscriber) {
    throw new Error('sendTest() method must be implemented by adapter subclass');
  }

  /**
   * Get provider-specific information like list details, account info
   * @returns {Promise<Object>} Provider specific information
   */
  async getProviderInfo() {
    throw new Error('getProviderInfo() method must be implemented by adapter subclass');
  }
}

module.exports = BaseAdapter;