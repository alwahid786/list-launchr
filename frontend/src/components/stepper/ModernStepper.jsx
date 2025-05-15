import { useEffect, useState } from 'react';

const ModernStepper = ({ steps, currentStep, onChange }) => {
  const [animatedSteps, setAnimatedSteps] = useState([]);
  
  // Handle step entrance animations
  useEffect(() => {
    const newAnimatedSteps = [];
    steps.forEach((step, index) => {
      setTimeout(() => {
        newAnimatedSteps.push(index);
        setAnimatedSteps([...newAnimatedSteps]);
      }, 100 * index);
    });
  }, [steps]);
  
  // Calculate progress percentage for progress bar
  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;
  
  return (
    <div className="modern-stepper">
      <div className="stepper-container">
        <div className="stepper-header">
          {steps.map((step, index) => {
            // Determine step status
            const isActive = currentStep === index + 1;
            const isCompleted = currentStep > index + 1;
            
            return (
              <div 
                key={index}
                className={`stepper-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${animatedSteps.includes(index) ? 'entrance-active' : 'entrance'}`}
                onClick={() => {
                  // Only allow clicking on completed steps or the next available step
                  if (isCompleted || index === currentStep - 1 || index === currentStep) {
                    onChange(index + 1);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-current={isActive ? 'step' : undefined}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    if (isCompleted || index === currentStep - 1 || index === currentStep) {
                      onChange(index + 1);
                    }
                  }
                }}
              >
                <div className="stepper-icon">
                  {isCompleted ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <div className="stepper-label">{step}</div>
              </div>
            );
          })}
          
          <div className="stepper-progress-bar">
            <div 
              className="stepper-progress-fill"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernStepper;