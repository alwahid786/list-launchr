import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const GiveawayCreatePage = () => {
  const { currentUser, isPro } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
  
  // Handle next step
  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  // Handle previous step
  const handlePrev = () => {
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
      // TODO: Submit to API
      // const response = await campaignAPI.createCampaign(formData);
      
      // For demo purposes, just show alert and navigate
      setTimeout(() => {
        alert('Campaign created successfully! (This is a demo - no actual API call was made)');
        navigate('/dashboard/campaigns');
      }, 1500);
    } catch (error) {
      console.error('Error creating campaign:', error);
      alert('Failed to create campaign. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Render progress steps
  const renderSteps = () => {
    const steps = [
      'Basics',
      'Email Collection',
      'Entry Options',
      'Design',
      'Integrations',
      'Preview & Launch'
    ];
    
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep > index + 1
                    ? 'bg-primary text-white'
                    : currentStep === index + 1
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-neutral-600'
                }`}
              >
                {currentStep > index + 1 ? (
                  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <span className="text-xs mt-1 text-neutral-600 hidden sm:block">{step}</span>
            </div>
          ))}
        </div>
        <div className="relative mt-2">
          <div className="absolute top-0 left-5 right-5 h-1 bg-gray-200"></div>
          <div
            className="absolute top-0 left-5 h-1 bg-primary transition-all duration-500"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          ></div>
        </div>
      </div>
    );
  };
  
  // Render form based on current step
  const renderForm = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <h2 className="text-xl font-bold text-neutral mb-6">Campaign Basics</h2>
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
      
      case 2:
        return (
          <div>
            <h2 className="text-xl font-bold text-neutral mb-6">Email Collection</h2>
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
      
      case 3:
        return (
          <div>
            <h2 className="text-xl font-bold text-neutral mb-6">Entry Options</h2>
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
              
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-md font-medium text-neutral mb-3">Social Media Follow</h3>
                
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
                  
                  {/* Additional social media platforms would go here */}
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-md font-medium text-neutral mb-3">Social Sharing</h3>
                
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
              
              <div className="bg-gray-50 p-4 rounded-md">
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
              
              <div className="bg-gray-50 p-4 rounded-md">
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
          </div>
        );
      
      case 4:
        return (
          <div>
            <h2 className="text-xl font-bold text-neutral mb-6">Design Customization</h2>
            
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
      
      case 5:
        return (
          <div>
            <h2 className="text-xl font-bold text-neutral mb-6">Integrations</h2>
            
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
      
      case 6:
        return (
          <div>
            <h2 className="text-xl font-bold text-neutral mb-6">Preview & Launch</h2>
            
            <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-8">
              <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-medium text-neutral">Campaign Preview</h3>
              </div>
              <div className="px-6 py-6">
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
            </div>
            
            <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-8">
              <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-medium text-neutral">Pre-launch Checklist</h3>
              </div>
              <div className="px-6 py-6">
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
          </div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h1 className="text-xl font-headline font-bold text-neutral">Create New Giveaway</h1>
        </div>
        <div className="px-6 py-6">
          {renderSteps()}
          
          <form onSubmit={handleSubmit}>
            {renderForm()}
            
            <div className="mt-8 pt-5 border-t border-gray-200 flex justify-between">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-neutral-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Previous
                </button>
              )}
              
              <div className="flex-1"></div>
              
              {currentStep < 6 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cta hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cta disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Launching...
                    </div>
                  ) : (
                    'Launch Campaign'
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