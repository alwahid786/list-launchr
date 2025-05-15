import { useEffect, useState } from 'react';

const FormStepWrapper = ({ children, isActive, transitionDirection }) => {
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
  
  if (!isActive && !mounted) {
    return null;
  }
  
  return (
    <div className={className}>
      {children}
    </div>
  );
};

export default FormStepWrapper;