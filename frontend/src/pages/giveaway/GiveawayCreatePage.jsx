import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import ModernStepper from '../../components/stepper/ModernStepper';
import FormStepWrapper from '../../components/stepper/FormStepWrapper';
import { campaignAPI } from '../../api';

const GiveawayCreatePage = () => {
  const { currentUser, isPro } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState('next');
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
          enabled: false
        },
        twitter: {
          enabled: false
        }
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
      webhookUrl: ''
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
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle checkboxes
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
      return;
    }
    
    // Handle select-one or number inputs
    if (type === 'select-one' || type === 'number') {
      setFormData({ ...formData, [name]: type === 'number' ? Number(value) : value });
      return;
    }
    
    // Handle nested fields (using dot notation in name attribute)
    if (name.includes('.')) {
      const parts = name.split('.');
      if (parts.length === 2) {
        setFormData({
          ...formData,
          [parts[0]]: {
            ...formData[parts[0]],
            [parts[1]]: value
          }
        });
      } else if (parts.length === 3) {
        setFormData({
          ...formData,
          [parts[0]]: {
            ...formData[parts[0]],
            [parts[1]]: {
              ...formData[parts[0]][parts[1]],
              [parts[2]]: value
            }
          }
        });
      } else if (parts.length === 4) {
        setFormData({
          ...formData,
          [parts[0]]: {
            ...formData[parts[0]],
            [parts[1]]: {
              ...formData[parts[0]][parts[1]],
              [parts[2]]: {
                ...formData[parts[0]][parts[1]][parts[2]],
                [parts[3]]: type === 'checkbox' ? checked : value
              }
            }
          }
        });
      }
      return;
    }
    
    // Handle regular inputs
    setFormData({ ...formData, [name]: value });
  };
  
  // Validate the current step
  const validateStep = () => {
    switch (currentStep) {
      case 1: // Basics
        if (!formData.title || !formData.prizeTitle || !formData.description || !formData.startDate || !formData.endDate) {
          alert('Please fill in all required fields');
          return false;
        }
        
        // Validate dates
        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);
        const now = new Date();
        
        if (start < now) {
          alert('Start date cannot be in the past');
          return false;
        }
        
        if (end <= start) {
          alert('End date must be after start date');
          return false;
        }
        
        return true;
      
      case 2: // Email Collection
        if (!formData.emailHeadline || !formData.emailSubheadline) {
          alert('Please fill in all required fields');
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
          alert('Please fill in all required fields');
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
            alert('Please provide an API key for the selected integration');
            return false;
          }
          
          if (formData.integrations.provider !== 'webhook' && !formData.integrations.listId) {
            alert('Please provide a list ID for the selected integration');
            return false;
          }
          
          if (formData.integrations.provider === 'webhook' && !formData.integrations.webhookUrl) {
            alert('Please provide a webhook URL');
            return false;
          }
        }
        return true;
      
      default:
        return true;
    }
  };
  
  // Handle step change
  const handleStepChange = (newStep) => {
    // Only allow going back or to the next step
    if (newStep < currentStep) {
      setTransitionDirection('prev');
      setCurrentStep(newStep);
    } else if (newStep === currentStep + 1) {
      if (validateStep()) {
        setTransitionDirection('next');
        setCurrentStep(newStep);
      }
    } else if (newStep === currentStep) {
      // Clicking on current step does nothing
      return;
    }
  };
  
  // Handle next step
  const handleNext = () => {
    if (validateStep()) {
      setTransitionDirection('next');
      setCurrentStep(currentStep + 1);
    }
  };
  
  // Handle previous step
  const handlePrev = () => {
    setTransitionDirection('prev');
    setCurrentStep(currentStep - 1);
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Final validation
    if (!validateStep()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Submit to API
      const response = await campaignAPI.createCampaign(formData);
      
      // Navigate to campaigns page on success
      navigate('/dashboard/campaigns');
    } catch (error) {
      console.error('Error creating campaign:', error);
      alert('Failed to create campaign. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Define step titles for stepper
  const stepTitles = [
    'Basics',
    'Email Collection',
    'Entry Options',
    'Design',
    'Integrations',
    'Preview & Launch'
  ];
  
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
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            placeholder="Describe your giveaway in a few sentences..."
            required
          ></textarea>
          <p className="mt-1 text-xs text-neutral-500">
            {formData.description.length}/500 characters
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
        </div>
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
          <div>
            <label htmlFor="logo" className="block text-sm font-medium text-neutral-600 mb-1">
              Logo Upload
            </label>
            <div className="mt-1 flex items-center">
              <span className="inline-block h-12 w-12 rounded-md overflow-hidden bg-gray-100">
                {formData.design.logo ? (
                  <img
                    src={formData.design.logo}
                    alt="Logo preview"
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 20.993V24H0v-2.993A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )}
              </span>
              <button
                type="button"
                className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-neutral hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Upload
              </button>
            </div>
          </div>
          
          <div>
            <label htmlFor="headerImage" className="block text-sm font-medium text-neutral-600 mb-1">
              Header Background Image
            </label>
            <div className="mt-1 flex items-center">
              <span className="inline-block h-24 w-48 rounded-md overflow-hidden bg-gray-100">
                {formData.design.headerImage ? (
                  <img
                    src={formData.design.headerImage}
                    alt="Header preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 20.993V24H0v-2.993A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )}
              </span>
              <button
                type="button"
                className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-neutral hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Upload
              </button>
            </div>
          </div>
          
          <div>
            <label htmlFor="colorScheme" className="block text-sm font-medium text-neutral-600 mb-1">
              Color Scheme
            </label>
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
      )}
    </div>
  );
  
  const renderIntegrationsStep = () => (
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
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label htmlFor="provider" className="block text-sm font-medium text-neutral-600 mb-1">
              Integration Provider
            </label>
            <select
              id="provider"
              name="integrations.provider"
              value={formData.integrations.provider}
              onChange={handleChange}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
            >
              <option value="none">None</option>
              <option value="mailchimp">Mailchimp</option>
              <option value="mailerlite">MailerLite</option>
              <option value="convertkit">ConvertKit</option>
              <option value="webhook">Custom Webhook</option>
            </select>
          </div>
          
          {formData.integrations.provider !== 'none' && (
            <>
              {formData.integrations.provider === 'webhook' ? (
                <div>
                  <label htmlFor="webhookUrl" className="block text-sm font-medium text-neutral-600 mb-1">
                    Webhook URL
                  </label>
                  <input
                    type="url"
                    id="webhookUrl"
                    name="integrations.webhookUrl"
                    value={formData.integrations.webhookUrl}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="e.g., https://zapier.com/hooks/catch/123abc/"
                  />
                </div>
              ) : (
                <>
                  <div>
                    <label htmlFor="apiKey" className="block text-sm font-medium text-neutral-600 mb-1">
                      API Key
                    </label>
                    <input
                      type="password"
                      id="apiKey"
                      name="integrations.apiKey"
                      value={formData.integrations.apiKey}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                      placeholder="Enter your API key"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="listId" className="block text-sm font-medium text-neutral-600 mb-1">
                      List ID
                    </label>
                    <input
                      type="text"
                      id="listId"
                      name="integrations.listId"
                      value={formData.integrations.listId}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                      placeholder="Enter your list ID"
                    />
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
  
  const renderPreviewStep = () => (
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
            className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-neutral-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <svg className="inline-block w-5 h-5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Desktop View
          </button>
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-neutral-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <svg className="inline-block w-5 h-5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Mobile View
          </button>
        </div>
        
        <div className="bg-gray-100 p-6 rounded-lg text-center min-h-[400px] flex items-center justify-center">
          <div>
            <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="mt-2 text-neutral-600">Preview would be displayed here in a real application</p>
            <p className="text-neutral-500 text-sm mt-1">Campaign: {formData.title}</p>
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
                : 'No integrations configured'}
          </li>
        </ul>
      </div>
    </div>
  );
  
  const renderCurrentStep = () => {
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
        return renderPreviewStep();
      default:
        return null;
    }
  };
  
  return (
    <div className="max-w-6xl mx-auto" ref={formContainerRef}>
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
              >
                {renderCurrentStep()}
              </FormStepWrapper>
            </div>
            
            <div className="floating-action-container">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="floating-action-secondary"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>
              )}
              
              <div className="flex-1"></div>
              
              {currentStep < 6 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="floating-action-primary"
                >
                  Next
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="floating-action-primary bg-cta hover:bg-red-600"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Launching...
                    </>
                  ) : (
                    <>
                      Launch Campaign
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                      </svg>
                    </>
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