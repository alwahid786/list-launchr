import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { campaignAPI } from '../../api';
import { toast } from 'react-hot-toast';

const CampaignsPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        const response = await campaignAPI.getCampaigns();
        setCampaigns(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch campaigns');
        console.error('Error fetching campaigns:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-purple-100 text-purple-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDeleteCampaign = async (id) => {
    if (!window.confirm('Are you sure you want to delete this campaign?')) {
      return;
    }

    try {
      await campaignAPI.deleteCampaign(id);
      // Remove the deleted campaign from state
      setCampaigns(campaigns.filter(campaign => campaign._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete campaign');
      console.error('Error deleting campaign:', err);
    }
  };

  const handleDuplicateCampaign = async (id) => {
    try {
      const response = await campaignAPI.duplicateCampaign(id);
      // Add the duplicated campaign to state
      setCampaigns([response.data.data, ...campaigns]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to duplicate campaign');
      console.error('Error duplicating campaign:', err);
    }
  };
  
  const handleActivateCampaign = async (id) => {
    try {
      await campaignAPI.updateCampaignStatus(id, 'active');
      // Update the campaign status in the list
      setCampaigns(campaigns.map(campaign => 
        campaign._id === id ? { ...campaign, status: 'active' } : campaign
      ));
      toast.success('Campaign activated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to activate campaign');
      console.error('Error activating campaign:', err);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-headline font-bold text-neutral">My Campaigns</h1>
        <Link
          to="/dashboard/giveaway/create"
          className="px-4 py-2 bg-white text-blue-600 border border-blue-200 rounded-md hover:bg-blue-600 hover:text-white hover:border-transparent shadow-sm transition-all duration-200"
        >
          Create New Campaign
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : campaigns.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-neutral mb-2">No Campaigns Yet</h2>
          <p className="text-neutral-600 mb-6">
            You haven't created any giveaway campaigns yet. Create your first campaign to start growing your email list.
          </p>
          <Link
            to="/dashboard/giveaway/create"
            className="inline-flex items-center px-4 py-2 border border-blue-200 rounded-md shadow-sm text-sm font-medium text-blue-600 bg-white hover:bg-blue-600 hover:text-white hover:border-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Create Your First Campaign
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {campaigns.map(campaign => (
            <div key={campaign._id} className="bg-white shadow rounded-lg overflow-hidden">
              <div className="relative">
                {campaign.design && campaign.design.headerImage && (
                  <div className="h-24 w-full overflow-hidden">
                    <img 
                      src={campaign.design.headerImage.startsWith('http') 
                        ? campaign.design.headerImage 
                        : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${campaign.design.headerImage}`}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                  </div>
                )}
                
                {/* Logo positioned over header image or at top of card */}
                <div className={`absolute ${campaign.design && campaign.design.headerImage ? '-bottom-8 left-6' : 'top-6 left-6'}`}>
                  <div className="w-16 h-16 shadow-md rounded-md overflow-hidden flex items-center justify-center bg-white">
                    {campaign.design && campaign.design.logo ? (
                      <img 
                        src={campaign.design.logo.startsWith('http') 
                          ? campaign.design.logo 
                          : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${campaign.design.logo}`}
                        alt={`${campaign.title} logo`}
                        className="h-14 w-auto max-h-14 object-contain"
                      />
                    ) : (
                      <div className="text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className={`p-5 ${campaign.design && campaign.design.headerImage ? 'pt-12' : ''} border-b`}>
                <div>
                  <div className="pl-20">
                    <h2 className="text-lg font-bold text-neutral mb-1 line-clamp-1">{campaign.title}</h2>
                    <div className="flex flex-wrap items-center mb-2 gap-2">
                      <span 
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${getStatusBadgeClass(campaign.status)}`}
                      >
                        {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                      </span>
                      <span className="text-xs text-neutral-500">
                        {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-neutral-500 text-sm line-clamp-2 mb-2">{campaign.description}</p>
                  
                    {campaign.slug && (
                      <div className="flex items-center overflow-hidden">
                        <span className="text-xs font-medium text-neutral-500 mr-1 whitespace-nowrap">URL:</span>
                        <span className="text-xs text-blue-600 truncate">
                          {window.location.origin}/giveaway/{campaign.slug}
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText(`${window.location.origin}/giveaway/${campaign.slug}`);
                              toast.success('Link copied to clipboard!');
                            }}
                            className="ml-2 text-neutral-500 hover:text-blue-600 inline-flex"
                            title="Copy URL"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                            </svg>
                          </button>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-center space-x-1 mt-4 pt-3 border-t border-gray-100">
                    <Link
                      to={`/dashboard/campaigns/${campaign._id}`}
                      className="p-1.5 text-neutral-600 hover:text-primary bg-gray-50 rounded-md"
                      title="View Campaign Dashboard"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </Link>
                    {campaign.status === 'active' && (
                      <Link
                        to={`/giveaway/${campaign.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-green-600 hover:text-white hover:bg-green-600 bg-green-50 rounded-md"
                        title="View Public Giveaway Page"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </Link>
                    )}
                    <Link
                      to={`/dashboard/campaigns/${campaign._id}/edit`}
                      className="p-1.5 text-neutral-600 hover:text-primary bg-gray-50 rounded-md"
                      title="Edit Campaign"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </Link>
                    <button
                      onClick={() => handleDuplicateCampaign(campaign._id)}
                      className="p-1.5 text-neutral-600 hover:text-primary bg-gray-50 rounded-md"
                      title="Duplicate Campaign"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                      </svg>
                    </button>
                    {campaign.status === 'draft' && (
                      <>
                        <button
                          onClick={() => handleActivateCampaign(campaign._id)}
                          className="p-1.5 text-green-600 hover:text-white hover:bg-green-600 bg-green-50 rounded-md"
                          title="Activate Campaign"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteCampaign(campaign._id)}
                          className="p-1.5 text-red-600 hover:text-white hover:bg-red-600 bg-red-50 rounded-md"
                          title="Delete Campaign"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </>
                    )}
                </div>
              </div>
              
              <div className="bg-gray-50 p-3">
                <div className="grid grid-cols-3 gap-1 text-center text-xs">
                  <div className="bg-white rounded-md py-2 px-1 shadow-sm">
                    <p className="text-neutral-500">Entries</p>
                    <p className="text-lg font-semibold text-neutral">{campaign.stats?.entries || 0}</p>
                  </div>
                  <div className="bg-white rounded-md py-2 px-1 shadow-sm">
                    <p className="text-neutral-500">Views</p>
                    <p className="text-lg font-semibold text-neutral">{campaign.stats?.views || 0}</p>
                  </div>
                  <div className="bg-white rounded-md py-2 px-1 shadow-sm">
                    <p className="text-neutral-500">Conversion</p>
                    <p className="text-lg font-semibold text-neutral">{campaign.stats?.conversionRate || 0}%</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CampaignsPage;