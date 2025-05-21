import React from 'react';
import LoadingSpinner from './LoadingSpinner';

/**
 * LoadingOverlay component that displays a full-screen or container-specific overlay 
 * with a loading spinner.
 * 
 * @param {Object} props - Component props
 * @param {boolean} [props.isLoading=false] - Whether the loading overlay should be shown
 * @param {string} [props.message] - Optional message to display below the spinner
 * @param {boolean} [props.fullScreen=false] - Whether the overlay should cover the entire screen
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element|null} The LoadingOverlay component or null if not loading
 */
const LoadingOverlay = ({ isLoading = false, message, fullScreen = false, className = '' }) => {
  if (!isLoading) return null;
  
  const containerClass = fullScreen
    ? 'fixed inset-0 z-50'
    : 'absolute inset-0 z-20';
  
  return (
    <div className={`${containerClass} bg-white bg-opacity-70 flex items-center justify-center ${className}`}>
      <div className="text-center">
        <LoadingSpinner size="lg" color="primary" />
        {message && (
          <p className="mt-4 text-gray-700">{message}</p>
        )}
      </div>
    </div>
  );
};

export default LoadingOverlay;