import { useState, useCallback } from 'react';
import { useLoading } from '../contexts/LoadingContext';

/**
 * A custom hook for making API calls with loading and error state management
 * @returns {Object} API utilities including execute function and states
 */
const useApi = () => {
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const { startLoading, stopLoading, isLoading } = useLoading();

  /**
   * Execute an API call with automatic loading state management
   * @param {Function} apiCall - The API function to call
   * @param {string} requestId - A unique identifier for this request
   * @param {Object} options - Additional options
   * @param {boolean} options.skipLoading - Skip loading state management
   * @param {Function} options.onSuccess - Callback for successful response
   * @param {Function} options.onError - Callback for error
   * @param {Function} options.onFinally - Callback that runs after completion
   * @returns {Promise<any>} The API response data
   */
  const execute = useCallback(async (
    apiCall,
    requestId,
    {
      skipLoading = false,
      onSuccess = null,
      onError = null,
      onFinally = null
    } = {}
  ) => {
    // Reset states
    setError(null);
    
    // Start loading
    if (!skipLoading) {
      startLoading(requestId);
    }
    
    try {
      // Execute the API call
      const response = await apiCall();
      
      // Set the response data
      const responseData = response.data;
      setData(responseData);
      
      // Call the success callback if provided
      if (onSuccess) {
        onSuccess(responseData);
      }
      
      return responseData;
    } catch (err) {
      // Handle the error
      const errorMessage = err.response?.data?.error || err.message || 'An error occurred';
      setError(errorMessage);
      
      // Call the error callback if provided
      if (onError) {
        onError(errorMessage, err);
      }
      
      throw err;
    } finally {
      // Stop loading
      if (!skipLoading) {
        stopLoading(requestId);
      }
      
      // Call the finally callback if provided
      if (onFinally) {
        onFinally();
      }
    }
  }, [startLoading, stopLoading]);

  return {
    execute,
    error,
    data,
    isLoading
  };
};

export default useApi;