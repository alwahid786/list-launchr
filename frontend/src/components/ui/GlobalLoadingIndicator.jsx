import React from 'react';
import { useLoading } from '../../contexts/LoadingContext';

/**
 * A global loading indicator that appears at the top of the page
 * when any API request is in progress.
 * 
 * @returns {JSX.Element|null} The loading indicator or null if not loading
 */
const GlobalLoadingIndicator = () => {
  const { globalLoading } = useLoading();
  
  if (!globalLoading) return null;
  
  return (
    <div className="fixed top-0 left-0 w-full z-50">
      <div className="h-1 w-full bg-blue-100">
        <div className="h-full bg-blue-600 animate-loading-bar"></div>
      </div>
    </div>
  );
};

export default GlobalLoadingIndicator;