const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const PORT = process.env.PORT || 5000;
const API_URL = `http://localhost:${PORT}/api`;

const testRegister = async () => {
  try {
    console.log('Testing registration endpoint...');
    
    // Generate a unique email to avoid conflicts
    const timestamp = new Date().getTime();
    const email = `testuser${timestamp}@example.com`;
    
    const userData = {
      name: 'Test User',
      email: email,
      password: 'Test123!'
    };
    
    console.log(`Attempting to register user with email: ${email}`);
    
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    
    console.log('✅ Registration successful!');
    console.log('Response status:', response.status);
    console.log('User data:', {
      name: response.data.user.name,
      email: response.data.user.email,
      id: response.data.user.id
    });
    console.log('Token received:', response.data.token ? 'Yes' : 'No');
    
  } catch (error) {
    console.error('❌ Registration failed:');
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from server. Make sure the backend server is running.');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', error.message);
    }
  }
};

// Run the test
testRegister();