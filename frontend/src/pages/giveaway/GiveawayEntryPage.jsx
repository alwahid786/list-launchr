import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { campaignAPI, entriesAPI } from '../../api';
import { SocialShareButtons, SocialShareButtonsWithText } from '../../components/sharing';

const GiveawayEntryPage = () => {
  const { slug } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    newsletterOptIn: false,
  });
  const [referralCode, setReferralCode] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [entryId, setEntryId] = useState(null);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        setLoading(true);
        const response = await campaignAPI.getPublicCampaign(slug);
        setCampaign(response.data.data);
        
        // Check if there's a referral code in URL params
        const urlParams = new URLSearchParams(window.location.search);
        const ref = urlParams.get('ref');
        if (ref) {
          setReferralCode(ref);
        }
      } catch (err) {
        console.error('Error fetching campaign:', err);
        setError(err.response?.data?.message || 'Failed to load campaign');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchCampaign();
    }
  }, [slug]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Prepare entry data
      const entryData = {
        email: formData.email,
        name: formData.name,
        newsletterOptIn: formData.newsletterOptIn,
        campaignId: campaign._id,
      };
      
      // Add referral code if it exists
      if (referralCode) {
        entryData.referralCode = referralCode;
      }
      
      // Submit entry
      const response = await entriesAPI.createPublicEntry(entryData);
      
      // Save entry ID and referral code
      setEntryId(response.data.data._id);
      setReferralCode(response.data.data.referralCode);
      setSubmitted(true);
      
      toast.success('Entry submitted successfully!');
    } catch (err) {
      console.error('Error submitting entry:', err);
      toast.error(err.response?.data?.message || 'Failed to submit entry');
    } finally {
      setLoading(false);
    }
  };

  const copyReferralLink = () => {
    const referralLink = `${window.location.origin}/giveaway/${slug}?ref=${referralCode}`;
    navigator.clipboard.writeText(referralLink);
    toast.success('Referral link copied to clipboard!');
  };

  if (loading && !campaign) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-600">Campaign Not Found</h1>
          <p className="mt-4 text-gray-600">{error}</p>
          <Link to="/" className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return null;
  }

  // Check if campaign is active
  const now = new Date();
  const startDate = new Date(campaign.startDate);
  const endDate = new Date(campaign.endDate);
  const isActive = now >= startDate && now <= endDate;

  // Handle inactive campaign
  if (!isActive) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="max-w-lg w-full bg-white shadow-lg rounded-lg p-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">{campaign.title}</h1>
          <div className="mt-4 text-gray-600">
            {now < startDate ? (
              <p>This giveaway hasn't started yet. It will begin on {startDate.toLocaleDateString()}.</p>
            ) : (
              <p>This giveaway has ended. It closed on {endDate.toLocaleDateString()}.</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Helper to get color scheme based on campaign settings
  const getColorScheme = () => {
    if (!campaign || !campaign.design) return { 
      header: '#EFF6FF', // blue bg
      text: '#2563EB',   // blue text
      button: '#3B82F6'  // blue button
    };
    
    const colorScheme = campaign.design.colorScheme || 'blue';
    
    switch (colorScheme) {
      case 'green':
        return { header: '#ECFDF5', text: '#059669', button: '#10B981' };
      case 'red':
        return { header: '#FEF2F2', text: '#DC2626', button: '#EF4444' };
      case 'purple':
        return { header: '#F5F3FF', text: '#7C3AED', button: '#8B5CF6' };
      case 'orange':
        return { header: '#FFF7ED', text: '#D97706', button: '#F59E0B' };
      case 'blue':
      default:
        return { header: '#EFF6FF', text: '#2563EB', button: '#3B82F6' };
    }
  };
  
  const colorScheme = getColorScheme();
  
  // Helper function to format image URLs
  const getFullImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${url}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full mx-auto">
        {submitted ? (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            {/* Use the same header style as the entry form */}
            <div 
              className="relative h-48 flex items-center justify-center"
              style={{
                backgroundColor: colorScheme.header
              }}
            >
              {campaign.design && campaign.design.headerImage && (
                <div className="absolute inset-0 z-0">
                  <img 
                    src={getFullImageUrl(campaign.design.headerImage)}
                    alt="Header Background"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              
              {campaign.design && campaign.design.logo ? (
                <div className="relative z-10 bg-white bg-opacity-90 p-3 rounded-lg shadow-lg">
                  <img 
                    src={getFullImageUrl(campaign.design.logo)}
                    alt="Logo" 
                    className="h-16 w-auto max-w-[180px] object-contain"
                  />
                </div>
              ) : (
                <div className="relative z-10 text-white text-xl font-bold bg-black bg-opacity-50 px-4 py-2 rounded-md">
                  {campaign.title || 'Campaign Title'}
                </div>
              )}
            </div>
            
            {/* Success message */}
            <div className="p-6 text-center">
              <h2 className="text-2xl font-bold text-green-600 mb-3">Entry Submitted!</h2>
              <p className="text-gray-600 mb-6">Thank you for entering {campaign.title}!</p>
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold" style={{ color: colorScheme.text }}>Increase Your Chances</h3>
                <p className="text-sm text-gray-600 mb-4">Share your unique referral link to earn more entries!</p>
                
                <div className="flex items-center space-x-1 mb-6">
                  <input 
                    type="text" 
                    value={`${window.location.origin}/giveaway/${slug}?ref=${referralCode}`}
                    className="flex-grow p-2 border border-gray-300 rounded-l-md bg-gray-50 text-sm"
                    readOnly
                  />
                  <button 
                    onClick={copyReferralLink}
                    className="px-3 py-2 text-white rounded-r-md transition-colors"
                    style={{ backgroundColor: colorScheme.button }}
                  >
                    Copy
                  </button>
                </div>
                
                <div className="mt-4">
                  <SocialShareButtonsWithText
                    url={`${window.location.origin}/giveaway/${slug}?ref=${referralCode}`}
                    title={campaign.entryOptions?.socialShare?.twitter?.message || `Enter this awesome giveaway: ${campaign.title}`}
                    description={campaign.entryOptions?.socialShare?.email?.message || `I just entered ${campaign.title} - you should check it out too!`}
                    hashtags={campaign.entryOptions?.socialShare?.hashtags || "giveaway,win,contest"}
                    platforms={{
                      facebook: campaign.entryOptions?.socialShare?.facebook?.enabled !== false,
                      twitter: campaign.entryOptions?.socialShare?.twitter?.enabled !== false,
                      linkedin: campaign.entryOptions?.socialShare?.linkedin?.enabled !== false,
                      whatsapp: campaign.entryOptions?.socialShare?.whatsapp?.enabled === true,
                      telegram: campaign.entryOptions?.socialShare?.telegram?.enabled === true,
                      pinterest: campaign.entryOptions?.socialShare?.pinterest?.enabled === true,
                      email: campaign.entryOptions?.socialShare?.email?.enabled === true
                    }}
                    onShare={(platform) => {
                      console.log(`Shared on ${platform}`);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            {/* Header with logo - exactly matching the preview style */}
            <div 
              className="relative h-48 flex items-center justify-center"
              style={{
                backgroundColor: colorScheme.header
              }}
            >
              {campaign.design && campaign.design.headerImage && (
                <div className="absolute inset-0 z-0">
                  <img 
                    src={getFullImageUrl(campaign.design.headerImage)}
                    alt="Header Background"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              
              {campaign.design && campaign.design.logo ? (
                <div className="relative z-10 bg-white bg-opacity-90 p-3 rounded-lg shadow-lg">
                  <img 
                    src={getFullImageUrl(campaign.design.logo)}
                    alt="Logo" 
                    className="h-16 w-auto max-w-[180px] object-contain"
                  />
                </div>
              ) : (
                <div className="relative z-10 text-white text-xl font-bold bg-black bg-opacity-50 px-4 py-2 rounded-md">
                  {campaign.title || 'Campaign Title'}
                </div>
              )}
            </div>
            
            {/* Form content */}
            <div className="p-6 text-center">
              <h2 
                className="text-2xl font-bold mb-3"
                style={{ color: colorScheme.text }}
              >
                {campaign.design?.headlineText || 'Win Amazing Prizes!'}
              </h2>
              
              <p className="text-sm text-gray-600 mb-6">
                {campaign.description || 'Enter your email below to join this exciting giveaway.'}
              </p>
              
              <div className="bg-white p-4 mb-4 border border-gray-200 rounded-md shadow-sm mx-auto">
                <form onSubmit={handleSubmit}>
                  <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                    {campaign.emailHeadline || 'Join the giveaway!'}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                    placeholder="Your email address"
                  />
                  <p className="text-xs mt-1 text-gray-500 text-left">
                    {campaign.emailSubheadline || 'Enter your email to join this giveaway'}
                  </p>
                  
                  <div className="mt-4">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                      placeholder="Your name (optional)"
                    />
                  </div>
                  
                  <div className="flex items-start mt-4">
                    <div className="flex items-center h-5">
                      <input
                        id="newsletterOptIn"
                        name="newsletterOptIn"
                        type="checkbox"
                        checked={formData.newsletterOptIn}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="newsletterOptIn" className="font-medium text-gray-700 text-left block">
                        Subscribe to newsletter
                      </label>
                      <p className="text-gray-500 text-left">Get updates about future giveaways</p>
                    </div>
                  </div>
                  
                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-3 text-white font-medium rounded-md shadow-md mt-6"
                    style={{ backgroundColor: colorScheme.button }}
                  >
                    {loading ? 'Submitting...' : (campaign.design?.ctaText || 'Enter Giveaway')}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GiveawayEntryPage;