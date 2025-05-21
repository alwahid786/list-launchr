import { useEffect, useState } from 'react';
import { LoadingSpinner } from '../ui';

const FormStepWrapper = (props) => {
  // Destructure props with defaults for safety
  const { 
    children = null, 
    isActive = true, 
    transitionDirection = 'next', 
    isLoading = false 
  } = props;
  
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    let timeoutId;
    if (isActive) {
      timeoutId = setTimeout(() => {
        setMounted(true);
      }, 50);
    } else {
      setMounted(false);
    }
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [isActive]);
  
  // Determine CSS classes based on active state and transition direction
  let className = 'form-step';
  
  if (!isActive && transitionDirection === 'next') {
    className += ' previous';
  } else if (!isActive && transitionDirection === 'prev') {
    className += ' next';
  } else if (isActive) {
    className += ' current';
  }
  
  // For debugging
  console.log('FormStepWrapper', { isActive, transitionDirection, mounted, className });
  
  if (!isActive && !mounted) {
    return null;
  }
  
  return (
    <div className={className}>
      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <LoadingSpinner size="lg" label="Loading step content..." />
        </div>
      ) : (
        children
      )}
    </div>
  );
};

export default FormStepWrapper;