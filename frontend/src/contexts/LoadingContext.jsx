import React, { createContext, useState, useContext } from 'react';

// Create the loading context
const LoadingContext = createContext();

/**
 * LoadingProvider component that tracks loading state for different API requests
 * @param {Object} props - Component props including children
 * @returns {JSX.Element} Provider component with loading state management
 */
export const LoadingProvider = ({ children }) => {
  const [loadingRequests, setLoadingRequests] = useState({});
  const [globalLoading, setGlobalLoading] = useState(false);

  // Start loading for a specific request ID
  const startLoading = (requestId) => {
    setLoadingRequests(prev => ({
      ...prev,
      [requestId]: true
    }));
    
    // Set global loading to true when any request is loading
    setGlobalLoading(true);
  };

  // Stop loading for a specific request ID
  const stopLoading = (requestId) => {
    setLoadingRequests(prev => {
      const newState = { ...prev };
      delete newState[requestId];
      
      // Set global loading to false when no requests are loading
      if (Object.keys(newState).length === 0) {
        setGlobalLoading(false);
      }
      
      return newState;
    });
  };

  // Check if a specific request is loading
  const isLoading = (requestId) => {
    return !!loadingRequests[requestId];
  };

  // Value object to be provided by the context
  const value = {
    loadingRequests,
    globalLoading,
    startLoading,
    stopLoading,
    isLoading
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
};

/**
 * Custom hook for accessing the loading context
 * @returns {Object} The loading context value
 */
export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

export default LoadingContext;