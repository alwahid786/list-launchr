import React from 'react';

/**
 * LoadingSpinner component for indicating loading states.
 * 
 * @param {Object} props - Component props
 * @param {string} [props.size='md'] - Size of the spinner (sm, md, lg, xl)
 * @param {string} [props.color='primary'] - Color of the spinner (primary, white, blue, gray)
 * @param {string} [props.label] - Optional label to show below the spinner
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element} The LoadingSpinner component
 */
const LoadingSpinner = ({ size = 'md', color = 'primary', label, className = '' }) => {
  // Size mapping
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-4',
    xl: 'h-16 w-16 border-4'
  };
  
  // Color mapping
  const colorClasses = {
    primary: 'border-blue-600 border-t-transparent',
    white: 'border-white border-t-transparent',
    blue: 'border-blue-500 border-t-transparent',
    gray: 'border-gray-300 border-t-transparent',
  };
  
  // Get the correct size and color classes
  const spinnerSize = sizeClasses[size] || sizeClasses.md;
  const spinnerColor = colorClasses[color] || colorClasses.primary;
  
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`animate-spin rounded-full ${spinnerSize} ${spinnerColor}`} role="status" aria-label="Loading">
        <span className="sr-only">Loading...</span>
      </div>
      {label && (
        <span className="mt-2 text-sm text-gray-600">{label}</span>
      )}
    </div>
  );
};

export default LoadingSpinner;