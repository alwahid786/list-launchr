import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import ModernStepper from '../../components/stepper/ModernStepper';
import FormStepWrapper from '../../components/stepper/FormStepWrapper';
import { ErrorPopup, LoadingSpinner, LoadingOverlay, SimpleFileUploader } from '../../components/ui';
import { EmailIntegrationForm } from '../../components/integrations';
import { SocialShareButtons } from '../../components/sharing';
import { campaignAPI } from '../../api';

// Helper function to format image URLs
const getFullImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${url}`;
};

// Separate component for the preview step to avoid hook issues
// Using React.memo to prevent unnecessary re-renders
const PreviewStep = React.memo(({ formData, isPro }) => {
  console.log('Rendering PreviewStep component', { 
    formData: formData ? 'formData exists' : 'formData is undefined or null',
    isPro: isPro !== undefined ? isPro : 'isPro is undefined'
  });
  
  // Debug formData specifically
  console.log('formData design:', formData?.design);
  console.log('formData title:', formData?.title);
  
  const [previewMode, setPreviewMode] = useState('desktop');
  
  return (
    <div className="space-y-6">
      <div className="form-card">
        <div className="form-card-header">
          <div className="form-card-icon">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <h2 className="form-card-title">Campaign Preview</h2>
        </div>
        
        <div className="flex justify-center space-x-4 mb-6">
          <button
            type="button"
            onClick={() => setPreviewMode('desktop')}
            className={`px-4 py-2 border shadow-sm text-sm font-medium rounded-md ${
              previewMode === 'desktop' 
                ? 'border-blue-500 text-blue-600 bg-blue-50' 
                : 'border-gray-300 text-gray-600 bg-white'
            }`}
          >
            <svg className="inline-block w-5 h-5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Desktop View
          </button>
          <button
            type="button"
            onClick={() => setPreviewMode('mobile')}
            className={`px-4 py-2 border shadow-sm text-sm font-medium rounded-md ${
              previewMode === 'mobile' 
                ? 'border-blue-500 text-blue-600 bg-blue-50' 
                : 'border-gray-300 text-gray-600 bg-white'
            }`}
          >
            <svg className="inline-block w-5 h-5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Mobile View
          </button>
        </div>
        
        <div className={`bg-gray-100 p-6 rounded-lg ${previewMode === 'mobile' ? 'flex justify-center' : ''}`}>
          <div className={`bg-white border shadow-md rounded-lg overflow-hidden ${previewMode === 'mobile' ? 'w-[375px]' : 'w-full max-w-2xl mx-auto'}`}>
            {/* Header with logo */}
            <div 
              className="relative h-48 flex items-center justify-center"
              style={{
                backgroundColor: formData.design.colorScheme === 'blue' ? '#EFF6FF' : 
                formData.design.colorScheme === 'green' ? '#ECFDF5' : 
                formData.design.colorScheme === 'red' ? '#FEF2F2' : 
                formData.design.colorScheme === 'purple' ? '#F5F3FF' : 
                formData.design.colorScheme === 'orange' ? '#FFF7ED' : '#EFF6FF',
              }}
            >
              {formData.design.headerImage && (
                <div className="absolute inset-0 z-0">
                  <img 
                    src={formData.design.headerImage.startsWith('http') 
                      ? formData.design.headerImage 
                      : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${formData.design.headerImage}`}
                    alt="Header Background"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              
              {formData.design.logo ? (
                <div className="relative z-10 bg-white bg-opacity-90 p-3 rounded-lg shadow-lg">
                  <img 
                    src={formData.design.logo.startsWith('http') 
                      ? formData.design.logo 
                      : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${formData.design.logo}`}
                    alt="Logo" 
                    className="h-16 w-auto max-w-[180px] object-contain"
                  />
                </div>
              ) : (
                <div className="relative z-10 text-white text-xl font-bold bg-black bg-opacity-50 px-4 py-2 rounded-md">
                  {formData.title || 'Campaign Title'}
                </div>
              )}
            </div>
            
            {/* Form content */}
            <div className="p-6 text-center">
              <h2 
                className="text-2xl font-bold mb-3"
                style={{
                  color: formData.design.colorScheme === 'blue' ? '#2563EB' : 
                  formData.design.colorScheme === 'green' ? '#059669' : 
                  formData.design.colorScheme === 'red' ? '#DC2626' : 
                  formData.design.colorScheme === 'purple' ? '#7C3AED' : 
                  formData.design.colorScheme === 'orange' ? '#D97706' : '#2563EB'
                }}
              >
                {formData.design.headlineText || 'Win Amazing Prizes!'}
              </h2>
              
              <p className="text-sm text-gray-600 mb-6">
                {formData.description || 'Enter your email below to join this exciting giveaway.'}
              </p>
              
              <div className="bg-white p-4 mb-4 border border-gray-200 rounded-md shadow-sm mx-auto max-w-md">
                <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                  {formData.emailHeadline || 'Join the giveaway!'}
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                  placeholder="Your email address"
                />
                <p className="text-xs mt-1 text-gray-500 text-left">{formData.emailSubheadline || 'Enter your email to join this giveaway'}</p>
              </div>
              
              <button 
                className="px-6 py-3 text-white font-medium rounded-md shadow-md w-full max-w-md"
                style={{
                  backgroundColor: formData.design.colorScheme === 'blue' ? '#3B82F6' : 
                  formData.design.colorScheme === 'green' ? '#10B981' : 
                  formData.design.colorScheme === 'red' ? '#EF4444' : 
                  formData.design.colorScheme === 'purple' ? '#8B5CF6' : 
                  formData.design.colorScheme === 'orange' ? '#F59E0B' : '#3B82F6'
                }}
              >
                {formData.design.ctaText || 'Enter Giveaway'}
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-6 border-t border-gray-200 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-left">
              <h3 className="text-sm font-medium text-gray-700 mb-1">Share Preview with Team</h3>
              <p className="text-xs text-gray-500">Generate a temporary link to share this campaign with team members before launching</p>
            </div>
            
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => {
                  // In a real implementation, this would call an API to generate a preview link
                  alert('Preview link generated and copied to clipboard!\n\nLink: https://listlaunchr.com/preview/campaign/' + Math.random().toString(36).substring(2, 10));
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                Generate Preview Link
              </button>
            </div>
          </div>
          
          <div className="mt-4 text-sm text-center text-gray-500">
            This preview shows how participants will see your campaign. You can toggle between desktop and mobile views.
          </div>
        </div>
      </div>
      
      <div className="form-card">
        <div className="form-card-header">
          <div className="form-card-icon">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h2 className="form-card-title">Pre-launch Checklist</h2>
        </div>
        
        <ul className="space-y-3 mb-6">
          <li className="flex items-center text-sm text-neutral-600">
            <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Campaign basics are set
          </li>
          <li className="flex items-center text-sm text-neutral-600">
            <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Email collection configured
          </li>
          <li className="flex items-center text-sm text-neutral-600">
            <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Entry options selected
          </li>
          <li className="flex items-center text-sm text-neutral-600">
            {formData.design.logo && formData.design.headerImage ? (
              <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="h-5 w-5 text-yellow-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
            {formData.design.logo && formData.design.headerImage ? 'Branding images uploaded' : 'Branding images recommended'}
          </li>
          <li className="flex items-center text-sm text-neutral-600">
            {formData.integrations && formData.integrations.provider && formData.integrations.provider !== 'none' ? (
              <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="h-5 w-5 text-gray-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
            {formData.integrations && formData.integrations.provider && formData.integrations.provider !== 'none' ? 'Email integration configured' : 'Email integration (optional)'}
          </li>
        </ul>
        
        <div className="mt-6 p-5 bg-blue-50 rounded-lg border border-blue-100">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3 text-sm text-blue-700">
              <h3 className="font-medium text-lg">Ready to launch?</h3>
              <p className="mt-1 mb-3">Review all details carefully. Once launched, your campaign will be live and accepting entries immediately.</p>
              
              <div className="mt-3 border-t border-blue-200 pt-3">
                <h4 className="font-medium mb-2">What happens after launch:</h4>
                <ul className="list-disc ml-5 space-y-1 text-blue-800">
                  <li>Your campaign will be assigned a unique URL that you can share</li>
                  <li>Participants can immediately begin entering your giveaway</li>
                  <li>You'll have access to real-time analytics in your dashboard</li>
                  <li>You can edit basic details after launch, but not core functionality</li>
                </ul>
              </div>
              
              <div className="mt-4 border-t border-blue-200 pt-3">
                <h4 className="font-medium mb-2">Campaign Schedule:</h4>
                <div className="flex justify-between text-xs">
                  <div>
                    <span className="font-semibold block">Start Date:</span>
                    <span>{formData.startDate ? new Date(formData.startDate).toLocaleDateString() : 'Not set'}</span>
                  </div>
                  <div>
                    <span className="font-semibold block">End Date:</span>
                    <span>{formData.endDate ? new Date(formData.endDate).toLocaleDateString() : 'Not set'}</span>
                  </div>
                  <div>
                    <span className="font-semibold block">Duration:</span>
                    <span>
                      {formData.startDate && formData.endDate ? 
                        Math.ceil((new Date(formData.endDate) - new Date(formData.startDate)) / (1000 * 60 * 60 * 24)) + ' days' : 
                        'Not calculated'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

const GiveawayCreatePage = () => {
  const { currentUser, isPro } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [isStepLoading, setIsStepLoading] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState('next');
  const [errorMessage, setErrorMessage] = useState('');
  const formContainerRef = useRef(null);
  
  const [formData, setFormData] = useState({
    // Step 1: Basics
    title: '',
    prizeTitle: '',
    description: '',
    startDate: '',
    endDate: '',
    numWinners: 1,
    externalUrl: '',
    
    // Step 2: Email Collection
    emailHeadline: 'Join the giveaway!',
    emailSubheadline: 'Enter your email to join this exciting giveaway.',
    termsConsent: true,
    newsletterOptIn: true,
    
    // Step 3: Entry Options
    entryOptions: {
      visitUrl: {
        enabled: false,
        url: ''
      },
      socialFollow: {
        instagram: {
          enabled: false,
          username: ''
        },
        facebook: {
          enabled: false,
          pageUrl: ''
        },
        youtube: {
          enabled: false,
          channelUrl: ''
        },
        tiktok: {
          enabled: false,
          username: ''
        }
      },
      socialShare: {
        facebook: {
          enabled: false,
          message: ''
        },
        twitter: {
          enabled: false,
          message: ''
        },
        linkedin: {
          enabled: false,
          message: ''
        },
        whatsapp: {
          enabled: false,
          message: ''
        },
        telegram: {
          enabled: false,
          message: ''
        },
        pinterest: {
          enabled: false,
          message: ''
        },
        email: {
          enabled: false,
          subject: '',
          message: ''
        },
        hashtags: ''
      },
      referral: {
        enabled: false,
        pointsPerReferral: 1
      }
    },
    
    // Step 4: Design
    design: {
      logo: '',
      headerImage: '',
      colorScheme: 'blue',
      ctaText: 'Enter Giveaway',
      headlineText: 'Win Amazing Prizes!'
    },
    
    // Step 5: Integrations
    integrations: {
      provider: 'none',
      apiKey: '',
      listId: '',
      formId: '',
      tagId: '',
      webhookUrl: '',
      secretKey: ''
    },
    
    // Coupon Reveal
    couponReveal: {
      enabled: false,
      code: '',
      description: ''
    }
  });
  
  // Scroll to top when changing steps
  useEffect(() => {
    if (formContainerRef.current) {
      formContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentStep]);
  
  // Function to handle input changes
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    
    // Clear any error messages when user makes changes
    if (errorMessage) {
      setErrorMessage('');
    }
    
    // Handle nested fields (using dot notation in name attribute)
    if (name.includes('.')) {
      const parts = name.split('.');
      setFormData(prevData => {
        // Create a deep copy of the nested structure
        const updateNestedState = (obj, keys, index, newValue) => {
          // Base case: we've reached the final level
          if (index === keys.length - 1) {
            return {
              ...obj,
              [keys[index]]: type === 'checkbox' ? checked : 
                            type === 'number' ? Number(newValue) : newValue
            };
          }
          
          // Recursive case: go deeper into the object
          return {
            ...obj,
            [keys[index]]: updateNestedState(
              obj[keys[index]] || {}, // Make sure this level exists
              keys,
              index + 1,
              newValue
            )
          };
        };
        
        // Start the recursion from the top level
        return updateNestedState(prevData, parts, 0, value);
      });
      return;
    }
    
    // Handle checkboxes for non-nested fields
    if (type === 'checkbox') {
      setFormData(prevData => ({ ...prevData, [name]: checked }));
      return;
    }
    
    // Handle select-one or number inputs for non-nested fields
    if (type === 'select-one' || type === 'number') {
      setFormData(prevData => ({ ...prevData, [name]: type === 'number' ? Number(value) : value }));
      return;
    }
    
    // Handle regular inputs for non-nested fields
    setFormData(prevData => ({ ...prevData, [name]: value }));
  }, [errorMessage]);
  
  // Validate the current step - memoized to prevent unnecessary recalculations
  const validateStep = useCallback(() => {
    switch (currentStep) {
      case 1: // Basics
        if (!formData.title || !formData.prizeTitle || !formData.description || !formData.startDate || !formData.endDate) {
          setErrorMessage('Please fill in all required fields');
          return false;
        }
        
        // Validate dates
        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);
        const now = new Date();
        
        if (start < now) {
          setErrorMessage('Start date cannot be in the past');
          return false;
        }
        
        if (end <= start) {
          setErrorMessage('End date must be after start date');
          return false;
        }
        
        return true;
      
      case 2: // Email Collection
        if (!formData.emailHeadline || !formData.emailSubheadline) {
          setErrorMessage('Please fill in all required fields');
          return false;
        }
        return true;
      
      case 3: // Entry Options
        // No required fields in this step
        return true;
      
      case 4: // Design
        // Only pro users can customize design
        if (!isPro()) {
          return true;
        }
        
        if (!formData.design.headlineText || !formData.design.ctaText) {
          setErrorMessage('Please fill in all required fields');
          return false;
        }
        return true;
      
      case 5: // Integrations
        // Only pro users can use integrations
        if (!isPro()) {
          return true;
        }
        
        if (formData.integrations.provider !== 'none') {
          if (!formData.integrations.apiKey) {
            setErrorMessage('Please provide an API key for the selected integration');
            return false;
          }
          
          if (formData.integrations.provider !== 'webhook' && !formData.integrations.listId) {
            setErrorMessage('Please provide a list ID for the selected integration');
            return false;
          }
          
          if (formData.integrations.provider === 'webhook' && !formData.integrations.webhookUrl) {
            setErrorMessage('Please provide a webhook URL');
            return false;
          }
        }
        return true;
      
      default:
        return true;
    }
  }, [currentStep, formData, isPro]);
  
  // Simplified step change function (not memoized for now) to fix circular references
  const handleStepChange = async (newStep) => {
    // Only allow going back or to the next step
    if (newStep < currentStep) {
      setTransitionDirection('prev');
      setIsStepLoading(true);
      
      // Simulate loading time for step transitions
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setCurrentStep(newStep);
      setIsStepLoading(false);
    } else if (newStep === currentStep + 1) {
      // Inline validation logic for now to fix circular reference
      let isValid = true;
      
      // Check required fields for step 1
      if (currentStep === 1) {
        if (!formData.title || !formData.prizeTitle || !formData.description || !formData.startDate || !formData.endDate) {
          setErrorMessage('Please fill in all required fields');
          isValid = false;
        }
      }
      
      if (isValid) {
        setTransitionDirection('next');
        setIsStepLoading(true);
        
        // Simulate loading time for step transitions
        await new Promise(resolve => setTimeout(resolve, 300));
        
        setCurrentStep(newStep);
        setIsStepLoading(false);
      }
    } else if (newStep === currentStep) {
      // Clicking on current step does nothing
      return;
    }
  };
  
  // Simplified next step handler (not memoized for now)
  const handleNext = async () => {
    // Use the same validation logic as in handleStepChange
    let isValid = true;
    
    // Check required fields for step 1
    if (currentStep === 1) {
      if (!formData.title || !formData.prizeTitle || !formData.description || !formData.startDate || !formData.endDate) {
        setErrorMessage('Please fill in all required fields');
        isValid = false;
      }
    }
    
    if (isValid) {
      setTransitionDirection('next');
      setIsStepLoading(true);
      
      // Simulate loading time for step transitions
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setCurrentStep(prev => prev + 1);
      setIsStepLoading(false);
    }
  };
  
  // Simplified previous step handler (not memoized for now)
  const handlePrev = async () => {
    setTransitionDirection('prev');
    setIsStepLoading(true);
    
    // Simulate loading time for step transitions
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setCurrentStep(prev => prev - 1);
    setIsStepLoading(false);
  };
  
  // Simplified form submission handler (not memoized for now)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Final validation - simplified
    let isValid = true;
    
    // Basic validation for step 6
    if (currentStep === 6) {
      // Any final validation can go here
    }
    
    if (!isValid) {
      return;
    }
    
    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
      // Submit to API
      const response = await campaignAPI.createCampaign(formData);
      
      // Activate the campaign by updating its status to 'active'
      const campaignId = response.data.data._id;
      await campaignAPI.updateCampaignStatus(campaignId, 'active');
      
      // Navigate to campaigns page on success
      navigate('/dashboard/campaigns');
    } catch (error) {
      console.error('Error creating campaign:', error);
      const errorMsg = error.response?.data?.error || 'Failed to create campaign. Please try again.';
      setErrorMessage(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Define step titles for stepper - memoized to prevent unnecessary re-renders
  const stepTitles = useMemo(() => [
    'Basics',
    'Email Collection',
    'Entry Options',
    'Design',
    'Integrations',
    'Preview & Launch'
  ], []);
  
  // Render form based on current step
  const renderBasicsStep = () => (
    <div className="form-card">
      <div className="form-card-header">
        <div className="form-card-icon">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="form-card-title">Campaign Basics</h2>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-neutral-600 mb-1">
            Campaign Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            placeholder="e.g., Summer Book Giveaway"
            required
          />
        </div>
        
        <div>
          <label htmlFor="prizeTitle" className="block text-sm font-medium text-neutral-600 mb-1">
            Prize Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="prizeTitle"
            name="prizeTitle"
            value={formData.prizeTitle}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            placeholder="e.g., Amazon Gift Card"
            required
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-neutral-600 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            maxLength={500}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            placeholder="Describe your giveaway in a few sentences (max 500 characters)..."
            required
          ></textarea>
          <p className="mt-1 text-xs text-neutral-500 flex justify-between">
            <span>Brief description of your campaign</span>
            <span className={formData.description.length >= 450 ? (formData.description.length >= 475 ? "text-red-500" : "text-yellow-500") : ""}>
              {formData.description.length}/500 characters
            </span>
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-neutral-600 mb-1">
              Start Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              required
            />
          </div>
          
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-neutral-600 mb-1">
              End Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              required
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="numWinners" className="block text-sm font-medium text-neutral-600 mb-1">
            Number of Winners
          </label>
          <input
            type="number"
            id="numWinners"
            name="numWinners"
            value={formData.numWinners}
            onChange={handleChange}
            min="1"
            max="100"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>
        
        <div>
          <label htmlFor="externalUrl" className="block text-sm font-medium text-neutral-600 mb-1">
            External URL (Optional)
          </label>
          <input
            type="url"
            id="externalUrl"
            name="externalUrl"
            value={formData.externalUrl}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            placeholder="e.g., https://your-shop.com/products/featured-item"
          />
          <p className="mt-1 text-xs text-neutral-500">
            Link to your product, shop, or website
          </p>
        </div>
      </div>
    </div>
  );
  
  const renderEmailCollectionStep = () => (
    <div className="form-card">
      <div className="form-card-header">
        <div className="form-card-icon">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="form-card-title">Email Collection</h2>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label htmlFor="emailHeadline" className="block text-sm font-medium text-neutral-600 mb-1">
            Headline <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="emailHeadline"
            name="emailHeadline"
            value={formData.emailHeadline}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            placeholder="e.g., Join the giveaway!"
            required
          />
        </div>
        
        <div>
          <label htmlFor="emailSubheadline" className="block text-sm font-medium text-neutral-600 mb-1">
            Subheadline <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="emailSubheadline"
            name="emailSubheadline"
            value={formData.emailSubheadline}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            placeholder="e.g., Enter your email to join this exciting giveaway."
            required
          />
        </div>
        
        <div className="flex items-center">
          <input
            id="termsConsent"
            name="termsConsent"
            type="checkbox"
            checked={formData.termsConsent}
            onChange={handleChange}
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <label htmlFor="termsConsent" className="ml-2 block text-sm text-neutral-600">
            Require terms and conditions consent (recommended)
          </label>
        </div>
        
        <div className="flex items-center">
          <input
            id="newsletterOptIn"
            name="newsletterOptIn"
            type="checkbox"
            checked={formData.newsletterOptIn}
            onChange={handleChange}
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <label htmlFor="newsletterOptIn" className="ml-2 block text-sm text-neutral-600">
            Include newsletter opt-in checkbox
          </label>
        </div>
      </div>
    </div>
  );
  
  const renderEntryOptionsStep = () => (
    <div className="space-y-6">
      <div className="form-card">
        <div className="form-card-header">
          <div className="form-card-icon">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
          </div>
          <h2 className="form-card-title">Entry Options</h2>
        </div>
      
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex items-center">
              <input
                id="visitUrl"
                name="entryOptions.visitUrl.enabled"
                type="checkbox"
                checked={formData.entryOptions.visitUrl.enabled}
                onChange={handleChange}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="visitUrl" className="ml-2 block text-sm font-medium text-neutral-600">
                Visit URL
              </label>
              {!isPro() && <span className="ml-2 bg-cta text-white text-xs px-2 py-0.5 rounded">Pro</span>}
            </div>
            
            {formData.entryOptions.visitUrl.enabled && isPro() && (
              <div className="mt-3 ml-6">
                <label htmlFor="visitUrlValue" className="block text-sm text-neutral-600 mb-1">
                  URL
                </label>
                <input
                  type="url"
                  id="visitUrlValue"
                  name="entryOptions.visitUrl.url"
                  value={formData.entryOptions.visitUrl.url}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="e.g., https://your-website.com/page-to-visit"
                />
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="form-card">
        <div className="form-card-header">
          <div className="form-card-icon">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className="form-card-title">Social Media Follow</h2>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center">
            <input
              id="instagramFollow"
              name="entryOptions.socialFollow.instagram.enabled"
              type="checkbox"
              checked={formData.entryOptions.socialFollow.instagram.enabled}
              onChange={handleChange}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="instagramFollow" className="ml-2 block text-sm text-neutral-600">
              Instagram
            </label>
            {!isPro() && <span className="ml-2 bg-cta text-white text-xs px-2 py-0.5 rounded">Pro</span>}
          </div>
          
          {formData.entryOptions.socialFollow.instagram.enabled && isPro() && (
            <div className="mt-2 ml-6">
              <label htmlFor="instagramUsername" className="block text-sm text-neutral-600 mb-1">
                Instagram Username
              </label>
              <input
                type="text"
                id="instagramUsername"
                name="entryOptions.socialFollow.instagram.username"
                value={formData.entryOptions.socialFollow.instagram.username}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="e.g., @yourusername"
              />
            </div>
          )}
          
          <div className="flex items-center">
            <input
              id="facebookFollow"
              name="entryOptions.socialFollow.facebook.enabled"
              type="checkbox"
              checked={formData.entryOptions.socialFollow.facebook.enabled}
              onChange={handleChange}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="facebookFollow" className="ml-2 block text-sm text-neutral-600">
              Facebook
            </label>
            {!isPro() && <span className="ml-2 bg-cta text-white text-xs px-2 py-0.5 rounded">Pro</span>}
          </div>
          
          {formData.entryOptions.socialFollow.facebook.enabled && isPro() && (
            <div className="mt-2 ml-6">
              <label htmlFor="facebookPageUrl" className="block text-sm text-neutral-600 mb-1">
                Facebook Page URL
              </label>
              <input
                type="url"
                id="facebookPageUrl"
                name="entryOptions.socialFollow.facebook.pageUrl"
                value={formData.entryOptions.socialFollow.facebook.pageUrl}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="e.g., https://facebook.com/yourpage"
              />
            </div>
          )}
        </div>
      </div>
      
      <div className="form-card">
        <div className="form-card-header">
          <div className="form-card-icon">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </div>
          <h2 className="form-card-title">Social Sharing</h2>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center">
            <input
              id="facebookShare"
              name="entryOptions.socialShare.facebook.enabled"
              type="checkbox"
              checked={formData.entryOptions.socialShare.facebook.enabled}
              onChange={handleChange}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="facebookShare" className="ml-2 block text-sm text-neutral-600">
              Facebook
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              id="twitterShare"
              name="entryOptions.socialShare.twitter.enabled"
              type="checkbox"
              checked={formData.entryOptions.socialShare.twitter.enabled}
              onChange={handleChange}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="twitterShare" className="ml-2 block text-sm text-neutral-600">
              Twitter/X
            </label>
          </div>

          <div className="flex items-center">
            <input
              id="linkedinShare"
              name="entryOptions.socialShare.linkedin.enabled"
              type="checkbox"
              checked={formData.entryOptions.socialShare.linkedin.enabled}
              onChange={handleChange}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="linkedinShare" className="ml-2 block text-sm text-neutral-600">
              LinkedIn
            </label>
          </div>

          <div className="flex items-center">
            <input
              id="whatsappShare"
              name="entryOptions.socialShare.whatsapp.enabled"
              type="checkbox"
              checked={formData.entryOptions.socialShare.whatsapp.enabled}
              onChange={handleChange}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="whatsappShare" className="ml-2 block text-sm text-neutral-600">
              WhatsApp
            </label>
            {!isPro() && <span className="ml-2 bg-cta text-white text-xs px-2 py-0.5 rounded">Pro</span>}
          </div>

          <div className="flex items-center">
            <input
              id="telegramShare"
              name="entryOptions.socialShare.telegram.enabled"
              type="checkbox"
              checked={formData.entryOptions.socialShare.telegram.enabled}
              onChange={handleChange}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="telegramShare" className="ml-2 block text-sm text-neutral-600">
              Telegram
            </label>
            {!isPro() && <span className="ml-2 bg-cta text-white text-xs px-2 py-0.5 rounded">Pro</span>}
          </div>

          <div className="flex items-center">
            <input
              id="pinterestShare"
              name="entryOptions.socialShare.pinterest.enabled"
              type="checkbox"
              checked={formData.entryOptions.socialShare.pinterest.enabled}
              onChange={handleChange}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="pinterestShare" className="ml-2 block text-sm text-neutral-600">
              Pinterest
            </label>
            {!isPro() && <span className="ml-2 bg-cta text-white text-xs px-2 py-0.5 rounded">Pro</span>}
          </div>

          <div className="flex items-center">
            <input
              id="emailShare"
              name="entryOptions.socialShare.email.enabled"
              type="checkbox"
              checked={formData.entryOptions.socialShare.email.enabled}
              onChange={handleChange}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="emailShare" className="ml-2 block text-sm text-neutral-600">
              Email
            </label>
            {!isPro() && <span className="ml-2 bg-cta text-white text-xs px-2 py-0.5 rounded">Pro</span>}
          </div>
        </div>
        
        {/* Social Share Message Customization */}
        {Object.values(formData.entryOptions.socialShare).some(platform => 
          typeof platform === 'object' && platform.enabled
        ) && (
          <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Social Sharing Message Customization</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label htmlFor="socialHashtags" className="block text-sm font-medium text-gray-700 mb-1">
                  Hashtags (comma separated)
                </label>
                <input
                  type="text"
                  id="socialHashtags"
                  name="entryOptions.socialShare.hashtags"
                  value={formData.entryOptions.socialShare.hashtags}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm"
                  placeholder="giveaway,contest,win"
                />
              </div>
              
              {formData.entryOptions.socialShare.facebook.enabled && (
                <div>
                  <label htmlFor="facebookMessage" className="block text-sm font-medium text-gray-700 mb-1">
                    Facebook Share Message
                  </label>
                  <input
                    type="text"
                    id="facebookMessage"
                    name="entryOptions.socialShare.facebook.message"
                    value={formData.entryOptions.socialShare.facebook.message}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm"
                    placeholder="I just entered this awesome giveaway!"
                  />
                </div>
              )}
              
              {formData.entryOptions.socialShare.twitter.enabled && (
                <div>
                  <label htmlFor="twitterMessage" className="block text-sm font-medium text-gray-700 mb-1">
                    Twitter Share Message
                  </label>
                  <input
                    type="text"
                    id="twitterMessage"
                    name="entryOptions.socialShare.twitter.message"
                    value={formData.entryOptions.socialShare.twitter.message}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm"
                    placeholder="Check out this giveaway I just entered!"
                  />
                </div>
              )}
              
              {isPro() && formData.entryOptions.socialShare.email.enabled && (
                <>
                  <div>
                    <label htmlFor="emailSubject" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Subject
                    </label>
                    <input
                      type="text"
                      id="emailSubject"
                      name="entryOptions.socialShare.email.subject"
                      value={formData.entryOptions.socialShare.email.subject}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm"
                      placeholder="Check out this amazing giveaway!"
                    />
                  </div>
                  <div>
                    <label htmlFor="emailMessage" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Message
                    </label>
                    <textarea
                      id="emailMessage"
                      name="entryOptions.socialShare.email.message"
                      value={formData.entryOptions.socialShare.email.message}
                      onChange={handleChange}
                      rows="3"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm"
                      placeholder="I just entered this awesome giveaway and thought you might be interested too!"
                    ></textarea>
                  </div>
                </>
              )}
            </div>
            
            <h3 className="text-sm font-medium text-gray-700 mb-3">Social Sharing Preview</h3>
            <SocialShareButtons
              url="https://example.com/giveaway/preview"
              title={formData.title || "Campaign Title"}
              description={formData.description || "Enter this awesome giveaway!"}
              hashtags={formData.entryOptions.socialShare.hashtags}
              platforms={{
                facebook: formData.entryOptions.socialShare.facebook.enabled,
                twitter: formData.entryOptions.socialShare.twitter.enabled,
                linkedin: formData.entryOptions.socialShare.linkedin.enabled,
                whatsapp: formData.entryOptions.socialShare.whatsapp.enabled && isPro(),
                telegram: formData.entryOptions.socialShare.telegram.enabled && isPro(),
                pinterest: formData.entryOptions.socialShare.pinterest.enabled && isPro(),
                email: formData.entryOptions.socialShare.email.enabled && isPro(),
              }}
              size="sm"
              layout="row"
            />
            <p className="text-xs text-gray-500 mt-2">This is how social sharing buttons will appear to participants</p>
          </div>
        )}
      </div>
      
      <div className="form-card">
        <div className="form-card-header">
          <div className="form-card-icon">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h2 className="form-card-title">Referrals</h2>
        </div>
      
        <div className="flex items-center">
          <input
            id="referralEnabled"
            name="entryOptions.referral.enabled"
            type="checkbox"
            checked={formData.entryOptions.referral.enabled}
            onChange={handleChange}
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <label htmlFor="referralEnabled" className="ml-2 block text-sm font-medium text-neutral-600">
            Enable Referrals
          </label>
        </div>
        
        {formData.entryOptions.referral.enabled && (
          <div className="mt-3 ml-6">
            <label htmlFor="pointsPerReferral" className="block text-sm text-neutral-600 mb-1">
              Points per referral
            </label>
            <input
              type="number"
              id="pointsPerReferral"
              name="entryOptions.referral.pointsPerReferral"
              value={formData.entryOptions.referral.pointsPerReferral}
              onChange={handleChange}
              min="1"
              max="10"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
        )}
      </div>
      
      <div className="form-card">
        <div className="form-card-header">
          <div className="form-card-icon">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <h2 className="form-card-title">Coupon Reveal</h2>
        </div>
      
        <div className="flex items-center">
          <input
            id="couponRevealEnabled"
            name="couponReveal.enabled"
            type="checkbox"
            checked={formData.couponReveal.enabled}
            onChange={handleChange}
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <label htmlFor="couponRevealEnabled" className="ml-2 block text-sm font-medium text-neutral-600">
            Reveal Coupon after Entry
          </label>
          {!isPro() && <span className="ml-2 bg-cta text-white text-xs px-2 py-0.5 rounded">Pro</span>}
        </div>
        
        {formData.couponReveal.enabled && isPro() && (
          <div className="mt-3 ml-6 space-y-3">
            <div>
              <label htmlFor="couponCode" className="block text-sm text-neutral-600 mb-1">
                Coupon Code
              </label>
              <input
                type="text"
                id="couponCode"
                name="couponReveal.code"
                value={formData.couponReveal.code}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="e.g., SAVE20"
              />
            </div>
            
            <div>
              <label htmlFor="couponDescription" className="block text-sm text-neutral-600 mb-1">
                Coupon Description
              </label>
              <input
                type="text"
                id="couponDescription"
                name="couponReveal.description"
                value={formData.couponReveal.description}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="e.g., 20% off your first purchase"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
  
  const renderDesignStep = () => (
    <div className="form-card">
      <div className="form-card-header">
        <div className="form-card-icon">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="form-card-title">Design Customization</h2>
      </div>
      
      {!isPro() ? (
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-cta" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-neutral">Design Customization is a Pro Feature</h3>
              <p className="text-sm text-neutral-600 mt-1">
                Upgrade to Pro to customize your campaign's design, including logo, colors, and more.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
            <label htmlFor="logo" className="block text-sm font-medium text-neutral-600 mb-3">
              Logo Upload
            </label>
            <div className="flex flex-col space-y-4">
              {/* Preview section */}
              {formData.design.logo && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm font-medium text-gray-700">Logo Preview</div>
                    <div className="text-xs text-gray-500">{console.log('Logo URL:', formData.design.logo)}</div>
                  </div>
                  <div className="flex items-center justify-center p-4 h-40 bg-gray-50 rounded-md">
                    <img 
                      src={getFullImageUrl(formData.design.logo)} 
                      alt="Logo Preview" 
                      className="max-h-32 max-w-full object-contain shadow-sm"
                      loading="eager"
                      onLoad={() => console.log('Logo image loaded successfully')}
                      onError={(e) => {
                        console.error('Logo image failed to load:', formData.design.logo);
                        e.target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22232%22%20height%3D%22131%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20232%20131%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_187f060ee1d%20text%20%7B%20fill%3A%23989898%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A12pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_187f060ee1d%22%3E%3Crect%20width%3D%22232%22%20height%3D%22131%22%20fill%3D%22%23ebebeb%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2285.8671875%22%20y%3D%2270.15%22%3ELogo%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E';
                      }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-center text-gray-500">This is how your logo will appear in the campaign</p>
                </div>
              )}
              
              {/* Upload section */}
              <div className="border border-gray-200 rounded-lg bg-gray-50 p-4">
                <SimpleFileUploader
                  label={formData.design.logo ? "Replace Logo" : "Upload Logo"}
                  value={formData.design.logo}
                  onFileUploaded={(url) => {
                    setFormData(prev => ({
                      ...prev,
                      design: {
                        ...prev.design,
                        logo: url
                      }
                    }));
                  }}
                  accept="image/*"
                  maxSize={2}
                  className="w-full"
                />
                <p className="mt-2 text-xs text-center text-gray-500">Recommended: Square logo with transparent background (PNG)</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm mt-5">
            <label htmlFor="headerImage" className="block text-sm font-medium text-neutral-600 mb-3">
              Header Background Image
            </label>
            <div className="flex flex-col space-y-4">
              {/* Preview section */}
              {formData.design.headerImage && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm font-medium text-gray-700">Header Image Preview</div>
                  </div>
                  <div className="rounded-md overflow-hidden shadow-sm">
                    <div className="w-full h-48 bg-gray-800">
                      <img 
                        src={getFullImageUrl(formData.design.headerImage)} 
                        alt="Header Preview" 
                        className="w-full h-full object-cover"
                        loading="eager"
                        onLoad={() => console.log('Header image loaded successfully')}
                        onError={(e) => {
                          console.error('Header image failed to load:', formData.design.headerImage);
                          e.target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22232%22%20height%3D%22131%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20232%20131%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_187f060ee1d%20text%20%7B%20fill%3A%23989898%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A12pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_187f060ee1d%22%3E%3Crect%20width%3D%22232%22%20height%3D%22131%22%20fill%3D%22%23ebebeb%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2285.8671875%22%20y%3D%2270.15%22%3EHeader%20Image%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E';
                        }}
                      />
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-center text-gray-500">This is how your header image will appear in the campaign</p>
                </div>
              )}
              
              {/* Upload section */}
              <div className="border border-gray-200 rounded-lg bg-gray-50 p-4">
                <SimpleFileUploader
                  label={formData.design.headerImage ? "Replace Header Image" : "Upload Header Image"}
                  value={formData.design.headerImage}
                  onFileUploaded={(url) => {
                    setFormData(prev => ({
                      ...prev,
                      design: {
                        ...prev.design,
                        headerImage: url
                      }
                    }));
                  }}
                  accept="image/*"
                  maxSize={5}
                  className="w-full"
                />
                <p className="mt-2 text-xs text-center text-gray-500">Recommended: High quality image (1920x1080px)</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
            <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm space-y-5">
              <h3 className="text-lg font-medium text-gray-800 border-b border-gray-100 pb-2">Visual Settings</h3>
              
              <div>
                <label htmlFor="colorScheme" className="block text-sm font-medium text-neutral-600 mb-2">
                  Color Scheme
                </label>
                <div className="grid grid-cols-5 gap-3 mb-3">
                  {['blue', 'green', 'red', 'purple', 'orange'].map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          design: {
                            ...prev.design,
                            colorScheme: color
                          }
                        }));
                      }}
                      className={`w-full h-12 rounded-md shadow-sm transition-all transform hover:scale-105 ${formData.design.colorScheme === color ? 'ring-2 ring-offset-2 ring-gray-800 scale-105' : 'opacity-75 hover:opacity-100'}`}
                      style={{ 
                        backgroundColor: 
                          color === 'blue' ? '#3B82F6' : 
                          color === 'green' ? '#10B981' : 
                          color === 'red' ? '#EF4444' : 
                          color === 'purple' ? '#8B5CF6' : 
                          color === 'orange' ? '#F59E0B' : '#3B82F6' 
                      }}
                      aria-label={`${color} color scheme`}
                    >
                      {formData.design.colorScheme === color && (
                        <svg className="h-5 w-5 mx-auto text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
                <select
                  id="colorScheme"
                  name="design.colorScheme"
                  value={formData.design.colorScheme}
                  onChange={handleChange}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                >
                  <option value="blue">Blue</option>
                  <option value="green">Green</option>
                  <option value="red">Red</option>
                  <option value="purple">Purple</option>
                  <option value="orange">Orange</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="ctaText" className="block text-sm font-medium text-neutral-600 mb-1">
                  CTA Button Text
                </label>
                <input
                  type="text"
                  id="ctaText"
                  name="design.ctaText"
                  value={formData.design.ctaText}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="e.g., Enter Giveaway"
                />
              </div>
              
              <div>
                <label htmlFor="headlineText" className="block text-sm font-medium text-neutral-600 mb-1">
                  Headline Text
                </label>
                <input
                  type="text"
                  id="headlineText"
                  name="design.headlineText"
                  value={formData.design.headlineText}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="e.g., Win Amazing Prizes!"
                />
              </div>
            </div>
            
            {/* Design Preview */}
            <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-gray-800 border-b border-gray-100 pb-2 mb-4">Live Preview</h3>
              
              <div className="border rounded-lg overflow-hidden shadow">
                {/* Header with logo */}
                <div 
                  className="relative h-40 flex items-center justify-center"
                  style={{
                    backgroundColor: 
                      formData.design.colorScheme === 'blue' ? '#EFF6FF' : 
                      formData.design.colorScheme === 'green' ? '#ECFDF5' : 
                      formData.design.colorScheme === 'red' ? '#FEF2F2' : 
                      formData.design.colorScheme === 'purple' ? '#F5F3FF' : 
                      formData.design.colorScheme === 'orange' ? '#FFF7ED' : '#EFF6FF',
                    backgroundImage: 'none'
                  }}
                >
                  {formData.design.headerImage && (
                    <div className="absolute inset-0 z-0">
                      <img 
                        src={getFullImageUrl(formData.design.headerImage)}
                        alt="Header Background"
                        className="w-full h-full object-cover"
                        loading="eager"
                        onLoad={() => console.log('Campaign background loaded successfully')}
                        onError={(e) => console.error('Campaign background failed to load:', formData.design.headerImage)}
                      />
                    </div>
                  )}
                  {/* Dark overlay for better visibility of logo */}
                  <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                  
                  {formData.design.logo ? (
                    <div className="relative z-10 bg-white bg-opacity-90 p-3 rounded-lg shadow-lg">
                      <img 
                        src={getFullImageUrl(formData.design.logo)} 
                        alt="Logo" 
                        className="h-16 w-auto max-w-[180px] object-contain"
                        loading="eager"
                        onLoad={() => console.log('Campaign preview logo loaded successfully')}
                        onError={(e) => {
                          console.error('Campaign preview logo failed to load:', formData.design.logo);
                          e.target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22232%22%20height%3D%22131%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20232%20131%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_187f060ee1d%20text%20%7B%20fill%3A%23989898%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A12pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_187f060ee1d%22%3E%3Crect%20width%3D%22232%22%20height%3D%22131%22%20fill%3D%22%23ebebeb%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2285.8671875%22%20y%3D%2270.15%22%3ELogo%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E';
                        }}
                      />
                    </div>
                  ) : (
                    <div className="relative z-10 text-white text-xl font-bold bg-black bg-opacity-50 px-4 py-2 rounded-md">
                      {formData.title || 'Campaign Title'}
                    </div>
                  )}
                </div>
                
                {/* Content preview */}
                <div className="bg-white p-6">
                  <h2 
                    className="text-2xl font-bold mb-3 text-center"
                    style={{
                      color: 
                        formData.design.colorScheme === 'blue' ? '#2563EB' : 
                        formData.design.colorScheme === 'green' ? '#059669' : 
                        formData.design.colorScheme === 'red' ? '#DC2626' : 
                        formData.design.colorScheme === 'purple' ? '#7C3AED' : 
                        formData.design.colorScheme === 'orange' ? '#D97706' : '#2563EB'
                    }}
                  >
                    {formData.design.headlineText || 'Win Amazing Prizes!'}
                  </h2>
                  
                  <p className="text-sm text-gray-500 mb-6 text-center max-w-md mx-auto line-clamp-2">
                    {formData.description || 'Enter your email below to join this exciting giveaway. Share with friends to increase your chances.'}
                  </p>
                  
                  <div className="flex justify-center">
                    <button
                      type="button"
                      className="px-5 py-2.5 rounded-md text-white text-sm font-medium transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                      style={{
                        backgroundColor: 
                          formData.design.colorScheme === 'blue' ? '#3B82F6' : 
                          formData.design.colorScheme === 'green' ? '#10B981' : 
                          formData.design.colorScheme === 'red' ? '#EF4444' : 
                          formData.design.colorScheme === 'purple' ? '#8B5CF6' : 
                          formData.design.colorScheme === 'orange' ? '#F59E0B' : '#3B82F6' 
                      }}
                    >
                      {formData.design.ctaText || 'Enter Giveaway'}
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex items-center justify-center space-x-2 text-xs text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>This is how participants will see your campaign</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  
  const renderIntegrationsStep = () => {
    // Helper function to handle integration changes
    const handleIntegrationChange = (data) => {
      setFormData(prev => ({
        ...prev,
        integrations: {
          ...data
        }
      }));
    };
    
    return (
      <div className="form-card">
        <div className="form-card-header">
          <div className="form-card-icon">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="form-card-title">Integrations</h2>
        </div>
        
        {!isPro() ? (
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-cta" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-neutral">Integrations are a Pro Feature</h3>
                <p className="text-sm text-neutral-600 mt-1">
                  Upgrade to Pro to connect your campaign with email marketing services.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <EmailIntegrationForm 
            initialValues={formData.integrations}
            onSave={handleIntegrationChange}
          />
        )}
      </div>
    );
  };
  
  // Simplified Preview step for better reliability
  const renderPreviewStep = () => {
    console.log('Rendering Preview Step');
    // Use useState for desktop/mobile toggle
    const [previewMode, setPreviewMode] = useState('desktop');
    console.log('Preview mode:', previewMode);
    
    // Simplified Campaign preview component
    const CampaignEntryPreview = ({ mode }) => {
      const isMobile = mode === 'mobile';
      const [activeView, setActiveView] = useState('form'); // 'form', 'thank-you', 'share'
      const schemeColors = {
        blue: {
          header: '#EFF6FF',
          text: '#2563EB',
          button: '#3B82F6',
          hover: '#2563EB',
          focus: '#1E40AF',
          lightBg: '#DBEAFE'
        },
        green: {
          header: '#ECFDF5',
          text: '#059669',
          button: '#10B981',
          hover: '#059669',
          focus: '#047857',
          lightBg: '#D1FAE5'
        },
        red: {
          header: '#FEF2F2',
          text: '#DC2626',
          button: '#EF4444',
          hover: '#DC2626',
          focus: '#B91C1C',
          lightBg: '#FEE2E2'
        },
        purple: {
          header: '#F5F3FF',
          text: '#7C3AED',
          button: '#8B5CF6',
          hover: '#7C3AED',
          focus: '#6D28D9',
          lightBg: '#EDE9FE'
        },
        orange: {
          header: '#FFF7ED',
          text: '#D97706',
          button: '#F59E0B',
          hover: '#D97706',
          focus: '#B45309',
          lightBg: '#FEF3C7'
        }
      };
      
      const scheme = schemeColors[formData.design.colorScheme || 'blue'];
      
      // Simulate form submission
      const handleSubmitPreview = () => {
        if (activeView === 'form') {
          setActiveView('thank-you');
          setTimeout(() => {
            setActiveView('share');
          }, 2000);
        } else {
          setActiveView('form');
        }
      };
      
      // Determine if any entry methods are enabled
      const hasEntryMethods = Object.values(formData.entryOptions).some(opt => 
        typeof opt === 'object' && Object.values(opt).some(val => 
          typeof val === 'object' && val.enabled
        )
      );
      
      // Progress indicator for share view
      const ProgressBar = ({ percent }) => (
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full" 
            style={{ 
              width: `${percent}%`,
              backgroundColor: scheme.button
            }}
          ></div>
        </div>
      );
      
      // Entry Methods Component
      const EntryMethods = () => (
        <>
          {formData.entryOptions.socialFollow.instagram.enabled && (
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 cursor-pointer">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-pink-600 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                <div>
                  <span className="text-sm font-medium text-gray-700">Follow on Instagram</span>
                  {formData.entryOptions.socialFollow.instagram.username && (
                    <p className="text-xs text-gray-500">@{formData.entryOptions.socialFollow.instagram.username}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-xs font-semibold rounded-full bg-gray-200 px-3 py-1 mr-2">+1 entry</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          )}
          
          {formData.entryOptions.socialFollow.facebook.enabled && (
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 cursor-pointer">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385h-3.047v-3.47h3.047v-2.642c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.514c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385c5.737-.9 10.125-5.864 10.125-11.854z" />
                </svg>
                <div>
                  <span className="text-sm font-medium text-gray-700">Follow on Facebook</span>
                  {formData.entryOptions.socialFollow.facebook.pageUrl && (
                    <p className="text-xs text-gray-500 truncate max-w-[200px]">{formData.entryOptions.socialFollow.facebook.pageUrl}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-xs font-semibold rounded-full bg-gray-200 px-3 py-1 mr-2">+1 entry</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          )}
          
          {formData.entryOptions.socialFollow.youtube.enabled && (
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 cursor-pointer">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-600 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
                </svg>
                <div>
                  <span className="text-sm font-medium text-gray-700">Subscribe on YouTube</span>
                  {formData.entryOptions.socialFollow.youtube.channelUrl && (
                    <p className="text-xs text-gray-500 truncate max-w-[200px]">{formData.entryOptions.socialFollow.youtube.channelUrl}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-xs font-semibold rounded-full bg-gray-200 px-3 py-1 mr-2">+1 entry</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          )}
          
          {formData.entryOptions.socialFollow.tiktok.enabled && (
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 cursor-pointer">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-black mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
                <div>
                  <span className="text-sm font-medium text-gray-700">Follow on TikTok</span>
                  {formData.entryOptions.socialFollow.tiktok.username && (
                    <p className="text-xs text-gray-500">@{formData.entryOptions.socialFollow.tiktok.username}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-xs font-semibold rounded-full bg-gray-200 px-3 py-1 mr-2">+1 entry</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          )}
          
          {formData.entryOptions.visitUrl.enabled && (
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 cursor-pointer">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <div>
                  <span className="text-sm font-medium text-gray-700">Visit Website</span>
                  {formData.entryOptions.visitUrl.url && (
                    <p className="text-xs text-gray-500 truncate max-w-[200px]">{formData.entryOptions.visitUrl.url}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-xs font-semibold rounded-full bg-gray-200 px-3 py-1 mr-2">+1 entry</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          )}
          
          {formData.entryOptions.referral.enabled && (
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 cursor-pointer">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-indigo-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <div>
                  <span className="text-sm font-medium text-gray-700">Refer friends</span>
                  <p className="text-xs text-gray-500">Share this giveaway with friends</p>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-xs font-semibold rounded-full bg-gray-200 px-3 py-1 mr-2">
                  +{formData.entryOptions.referral.pointsPerReferral} per friend
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          )}
        </>
      );
      
      return (
        <div className={`border shadow-md mx-auto rounded-lg overflow-hidden bg-white ${isMobile ? 'w-[375px] max-w-full' : 'w-full max-w-2xl'}`}>
          {/* Header with logo */}
          <div 
            className="relative h-48 flex items-center justify-center"
            style={{
              backgroundColor: scheme.header,
              backgroundImage: 'none'
            }}
          >
            {formData.design.headerImage && (
              <div className="absolute inset-0 z-0">
                <img 
                  src={getFullImageUrl(formData.design.headerImage)}
                  alt="Header Background"
                  className="w-full h-full object-cover"
                  loading="eager"
                  onError={(e) => console.error('Preview header image failed to load:', formData.design.headerImage)}
                />
              </div>
            )}
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            
            {formData.design.logo ? (
              <div className="relative z-10 bg-white bg-opacity-90 p-3 rounded-lg shadow-lg">
                <img 
                  src={getFullImageUrl(formData.design.logo)} 
                  alt="Logo" 
                  className="h-16 w-auto max-w-[180px] object-contain"
                  loading="eager"
                  onError={(e) => console.error('Preview logo failed to load:', formData.design.logo)}
                />
              </div>
            ) : (
              <div className="relative z-10 text-white text-xl font-bold bg-black bg-opacity-50 px-4 py-2 rounded-md">
                {formData.title || 'Campaign Title'}
              </div>
            )}
          </div>
          
          {/* Main content - changes based on activeView */}
          <div className="p-6">
            {activeView === 'form' && (
              <>
                <h2 
                  className="text-2xl font-bold mb-3 text-center"
                  style={{ color: scheme.text }}
                >
                  {formData.design.headlineText || 'Win Amazing Prizes!'}
                </h2>
                
                <p className="text-sm text-gray-600 mb-6 text-center">
                  {formData.description || 'Enter your email below to join this exciting giveaway.'}
                </p>
                
                <div className="space-y-4 max-w-md mx-auto">
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {formData.emailHeadline || 'Join the giveaway!'}
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 transition-all duration-200"
                      placeholder="Your email address"
                      style={{ 
                        focus: `ring-${scheme.focus}`,
                        borderColor: `${scheme.focus}`
                      }}
                    />
                    <p className="text-xs mt-1 text-gray-500">{formData.emailSubheadline || 'Enter your email to join this giveaway'}</p>
                  </div>
                  
                  {formData.termsConsent && (
                    <div className="flex items-start p-2">
                      <div className="flex items-center h-5">
                        <input
                          type="checkbox"
                          className="h-4 w-4 border-gray-300 rounded transition-all duration-200"
                          style={{ 
                            color: scheme.button
                          }}
                        />
                      </div>
                      <div className="ml-3 text-xs">
                        <label className="text-gray-600">I agree to the terms and conditions</label>
                      </div>
                    </div>
                  )}
                  
                  {formData.newsletterOptIn && (
                    <div className="flex items-start p-2">
                      <div className="flex items-center h-5">
                        <input
                          type="checkbox"
                          className="h-4 w-4 border-gray-300 rounded transition-all duration-200"
                          style={{ 
                            color: scheme.button
                          }}
                        />
                      </div>
                      <div className="ml-3 text-xs">
                        <label className="text-gray-600">Subscribe to our newsletter</label>
                      </div>
                    </div>
                  )}
                  
                  <div className="pt-4">
                    <button
                      onClick={handleSubmitPreview}
                      className="w-full px-6 py-3 text-white font-medium rounded-md shadow-md hover:shadow-lg transform hover:translate-y-[-1px] transition-all duration-200 text-center"
                      style={{
                        backgroundColor: scheme.button
                      }}
                    >
                      {formData.design.ctaText || 'Enter Giveaway'}
                    </button>
                  </div>
                </div>
              </>
            )}
            
            {activeView === 'thank-you' && (
              <div className="text-center py-10 space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold" style={{ color: scheme.text }}>
                  Thank You!
                </h2>
                <p className="text-gray-600 mb-4">Your entry has been received.</p>
                <div className="flex items-center justify-center">
                  <div className="inline-block px-6 py-2 text-sm font-medium rounded-full" 
                    style={{ backgroundColor: scheme.lightBg, color: scheme.text }}>
                    1 entry
                  </div>
                </div>
              </div>
            )}
            
            {activeView === 'share' && hasEntryMethods && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-xl font-bold mb-2" style={{ color: scheme.text }}>
                    Want to increase your chances?
                  </h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Get more entries by completing the actions below
                  </p>
                  
                  <div className="mb-6">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>1/5 entries</span>
                    </div>
                    <ProgressBar percent={20} />
                  </div>
                </div>
                
                <div className="space-y-3 max-w-md mx-auto">
                  <EntryMethods />
                </div>
                
                <button
                  onClick={() => setActiveView('form')}
                  className="w-full text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200 mt-6 underline"
                >
                  Go back
                </button>
              </div>
            )}
          </div>
          
          {/* Only show entry options in form view */}
          {activeView === 'form' && Object.values(formData.entryOptions).some(opt => 
            typeof opt === 'object' && Object.values(opt).some(val => 
              typeof val === 'object' && val.enabled
            )
          ) && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4 text-center">
                Earn more entries
              </h3>
              <div className="space-y-4">
                <EntryMethods />
              </div>
            </div>
          )}
          
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-center text-xs text-gray-500">
            Powered by ListLaunchr
          </div>
        </div>
      );
    };

    // Return the preview step UI
    return (
      <div className="space-y-6">
        <div className="form-card">
          <div className="form-card-header">
            <div className="form-card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h2 className="form-card-title">Campaign Preview</h2>
          </div>
          
          <div className="flex justify-center space-x-4 mb-8">
            <button
              type="button"
              onClick={() => setPreviewMode('desktop')}
              className={`px-4 py-2 border shadow-sm text-sm font-medium rounded-md ${
                previewMode === 'desktop' 
                  ? 'border-blue-500 text-blue-600 bg-blue-50' 
                  : 'border-gray-300 text-gray-600 bg-white'
              }`}
            >
              <svg className="inline-block w-5 h-5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Desktop View
            </button>
            <button
              type="button"
              onClick={() => setPreviewMode('mobile')}
              className={`px-4 py-2 border shadow-sm text-sm font-medium rounded-md ${
                previewMode === 'mobile' 
                  ? 'border-blue-500 text-blue-600 bg-blue-50' 
                  : 'border-gray-300 text-gray-600 bg-white'
              }`}
            >
              <svg className="inline-block w-5 h-5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Mobile View
            </button>
          </div>
          
          <div 
            className={`bg-gray-100 p-6 rounded-lg ${
              previewMode === 'mobile' 
                ? 'flex items-center justify-center' 
                : ''
            }`}
          >
            <div className="transition-all duration-300 ease-in-out shadow-md"
            >
              <CampaignEntryPreview mode={previewMode} />
            </div>
          </div>
          
          {/* Using inline styles instead of custom keyframes for better compatibility */}
          
          <div className="mt-4 text-sm text-center text-gray-500">
            This preview shows how participants will see your campaign. You can also generate a preview link to share with your team.
          </div>
          
          <div className="mt-6 border-t border-gray-200 pt-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-left">
                <h3 className="text-sm font-medium text-gray-700 mb-1">Share Preview with Team</h3>
                <p className="text-xs text-gray-500">Generate a temporary link to share this campaign with team members before launching</p>
              </div>
              
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    // In a real implementation, this would call an API to generate a preview link
                    // For this demo, we'll simulate the link generation
                    alert('Preview link generated and copied to clipboard!\n\nLink: https://listlaunchr.com/preview/campaign/' + Math.random().toString(36).substring(2, 10));
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  Generate Preview Link
                </button>
                
                <div className="relative inline-block text-left">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={() => alert('Settings dialog would open here')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Preview Settings
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-4 bg-gray-50 rounded-md p-4 border border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3 text-sm text-gray-500">
                  <p>Preview links are valid for 48 hours and can be accessed without login. Anyone with the link can view your campaign.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="form-card">
          <div className="form-card-header">
            <div className="form-card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h2 className="form-card-title">Pre-launch Checklist</h2>
          </div>
          
          <ul className="space-y-3">
            <li className="flex items-center text-sm text-neutral-600">
              <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Campaign basics are set
            </li>
            <li className="flex items-center text-sm text-neutral-600">
              <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Email collection configured
            </li>
            <li className="flex items-center text-sm text-neutral-600">
              <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Entry options selected
            </li>
            <li className="flex items-center text-sm text-neutral-600">
              {isPro() ? (
                <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-yellow-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
              {isPro() ? 'Design customized' : 'Design uses default template (Pro feature)'}
            </li>
            <li className="flex items-center text-sm text-neutral-600">
              {formData.integrations.provider !== 'none' || !isPro() ? (
                <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-yellow-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
              {formData.integrations.provider !== 'none' 
                ? 'Integration configured' 
                : !isPro() 
                  ? 'No integrations (Pro feature)' 
                  : 'No integrations configured (optional)'}
            </li>
          </ul>
          
          <div className="mt-6 p-5 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 text-sm text-blue-700">
                <h3 className="font-medium text-lg">Ready to launch?</h3>
                <p className="mt-1 mb-3">Review all details carefully. Once launched, your campaign will be live and accepting entries immediately.</p>
                
                <div className="mt-3 border-t border-blue-200 pt-3">
                  <h4 className="font-medium mb-2">What happens after launch:</h4>
                  <ul className="list-disc ml-5 space-y-1 text-blue-800">
                    <li>Your campaign will be assigned a unique URL that you can share</li>
                    <li>Participants can immediately begin entering your giveaway</li>
                    <li>You'll have access to real-time analytics in your dashboard</li>
                    <li>You can edit basic details after launch, but not core functionality</li>
                    <li>Winners will be automatically selected at the end date (or manually if you prefer)</li>
                  </ul>
                </div>
                
                <div className="mt-4 border-t border-blue-200 pt-3">
                  <h4 className="font-medium mb-2">Campaign Schedule:</h4>
                  <div className="flex justify-between text-xs">
                    <div>
                      <span className="font-semibold block">Start Date:</span>
                      <span>{formData.startDate ? new Date(formData.startDate).toLocaleDateString() : 'Not set'}</span>
                    </div>
                    <div>
                      <span className="font-semibold block">End Date:</span>
                      <span>{formData.endDate ? new Date(formData.endDate).toLocaleDateString() : 'Not set'}</span>
                    </div>
                    <div>
                      <span className="font-semibold block">Duration:</span>
                      <span>
                        {formData.startDate && formData.endDate ? 
                          Math.ceil((new Date(formData.endDate) - new Date(formData.startDate)) / (1000 * 60 * 60 * 24)) + ' days' : 
                          'Not calculated'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Step renderer function
  const renderCurrentStep = () => {
    console.log('Rendering current step:', currentStep);
    console.log('formData state at step render:', { 
      hasFormData: !!formData,
      formDataKeys: formData ? Object.keys(formData) : 'none'
    });
    
    // Extra logging for step 6
    if (currentStep === 6) {
      console.log('About to render step 6 (preview)');
      console.log('isPro function available:', typeof isPro === 'function');
    }
    
    switch (currentStep) {
      case 1:
        return renderBasicsStep();
      case 2:
        return renderEmailCollectionStep();
      case 3:
        return renderEntryOptionsStep();
      case 4:
        return renderDesignStep();
      case 5:
        return renderIntegrationsStep();
      case 6:
        console.log('Should render PreviewStep component');
        // Use separate component to avoid React hook issues
        return <PreviewStep formData={formData} isPro={isPro} />;
      default:
        return null;
    }
  };
  
  // Initial page load effect
  useEffect(() => {
    // Simulate checking user permissions or loading initial data
    setIsPageLoading(true);
    setTimeout(() => {
      setIsPageLoading(false);
    }, 800); // Simulate a short loading time for demonstration
  }, []);
  
  // Simple return statement for debugging
  console.log("Rendering GiveawayCreatePage", { 
    currentUser: !!currentUser, 
    currentStep, 
    formDataExists: !!formData,
    renderPreviewStep: currentStep === 6 ? 'Will render PreviewStep component' : 'Not on preview step'
  });
  
  // Log formContainer ref state
  console.log("formContainerRef current:", formContainerRef.current);
  
  return (
      <div className="max-w-6xl mx-auto relative" ref={formContainerRef}>
        <LoadingOverlay isLoading={isPageLoading} message="Loading campaign editor..." />
        <ErrorPopup 
          message={errorMessage} 
          onClose={() => setErrorMessage('')} 
        />
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h1 className="text-xl font-headline font-bold text-neutral">Create New Giveaway</h1>
        </div>
        <div className="px-6 py-6">
          <ModernStepper 
            steps={stepTitles} 
            currentStep={currentStep} 
            onChange={handleStepChange} 
          />
          
          <form onSubmit={handleSubmit}>
            <div className="form-container">
              <FormStepWrapper
                isActive={true}
                transitionDirection={transitionDirection}
                isLoading={isStepLoading}
              >
                {renderCurrentStep()}
              </FormStepWrapper>
            </div>
            
            <div className="py-6 px-8 mt-8 flex items-center justify-between">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={isStepLoading}
                  className="flex items-center justify-center gap-4 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-full hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 min-w-[180px] group disabled:opacity-70 disabled:hover:transform-none disabled:hover:shadow-none border border-blue-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white group-hover:-translate-x-2 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                  </svg>
                  <span className="font-semibold text-lg text-white tracking-wide">
                    {isStepLoading ? 'Processing...' : 'Back'}
                  </span>
                </button>
              )}
              
              <div className="flex-1"></div>
              
              {currentStep < 6 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={isStepLoading}
                  className="flex items-center justify-center gap-4 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-full hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 min-w-[180px] group disabled:opacity-70 disabled:hover:transform-none disabled:hover:shadow-none border border-blue-300"
                >
                  <span className="font-semibold text-lg text-white tracking-wide">
                    {isStepLoading ? 'Processing...' : 'Next'}
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white group-hover:translate-x-2 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-4 px-8 py-4 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-full hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 min-w-[180px] group disabled:opacity-70 disabled:hover:transform-none disabled:hover:shadow-none border border-green-300"
                >
                  <span className="font-semibold text-lg text-white tracking-wide">
                    {isSubmitting ? 'Launching...' : 'Launch Campaign'}
                  </span>
                  {isSubmitting ? (
                    <LoadingSpinner size="sm" color="white" />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white group-hover:translate-y-[-2px] transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
  
};

export default GiveawayCreatePage;