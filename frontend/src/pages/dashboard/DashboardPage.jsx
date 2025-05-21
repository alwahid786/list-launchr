import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { analyticsAPI } from '../../api';
import { toast } from 'react-hot-toast';

const DashboardPage = () => {
  const { currentUser } = useAuth();
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [stats, setStats] = useState({
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalEntries: 0,
    totalViews: 0,
    conversionRate: 0,
    recentCampaigns: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    // Check if this is the user's first login
    const isFirstLogin = localStorage.getItem('firstLogin') !== 'false';
    if (isFirstLogin) {
      setShowWelcomeModal(true);
      localStorage.setItem('firstLogin', 'false');
    }

    // Fetch dashboard stats
    const fetchDashboardStats = async () => {
      try {
        const response = await analyticsAPI.getDashboardStats();
        
        if (response.data && response.data.data) {
          const data = response.data.data;
          setStats({
            totalCampaigns: data.totalCampaigns || 0,
            activeCampaigns: data.activeCampaigns || 0,
            totalEntries: data.totalEntries || 0,
            totalViews: data.totalViews || 0,
            conversionRate: data.conversionRate || 0,
            recentCampaigns: data.recentCampaigns || [],
            loading: false,
            error: null
          });
        } else {
          throw new Error("Invalid data format received from server");
        }
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        setStats(prevStats => ({
          ...prevStats,
          loading: false,
          error: err.message || "Failed to fetch dashboard statistics"
        }));
        toast.error("Failed to load dashboard statistics. Please try again later.");
      }
    };

    fetchDashboardStats();
  }, []);

  const closeWelcomeModal = () => {
    setShowWelcomeModal(false);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-headline font-bold text-neutral mb-2">Welcome, {currentUser?.name || 'User'}!</h1>
        <p className="text-neutral-600">Here's an overview of your giveaway campaigns.</p>
      </div>

      {/* Stats Grid */}
      {stats.error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{stats.error}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Active Campaigns */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-neutral-600">Active Campaigns</p>
              {stats.loading ? (
                <div className="animate-pulse h-8 w-16 bg-gray-200 rounded mt-1"></div>
              ) : (
                <p className="text-2xl font-semibold text-neutral">{stats.activeCampaigns}</p>
              )}
            </div>
          </div>
        </div>

        {/* Total Entries */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-neutral-600">Total Entries</p>
              {stats.loading ? (
                <div className="animate-pulse h-8 w-16 bg-gray-200 rounded mt-1"></div>
              ) : (
                <p className="text-2xl font-semibold text-neutral">{stats.totalEntries.toLocaleString()}</p>
              )}
            </div>
          </div>
        </div>

        {/* Total Views */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-neutral-600">Total Views</p>
              {stats.loading ? (
                <div className="animate-pulse h-8 w-16 bg-gray-200 rounded mt-1"></div>
              ) : (
                <p className="text-2xl font-semibold text-neutral">{stats.totalViews.toLocaleString()}</p>
              )}
            </div>
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-neutral-600">Conversion Rate</p>
              {stats.loading ? (
                <div className="animate-pulse h-8 w-16 bg-gray-200 rounded mt-1"></div>
              ) : (
                <p className="text-2xl font-semibold text-neutral">{stats.conversionRate.toFixed(1)}%</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-lg font-bold text-neutral mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/dashboard/giveaway/create"
            className="flex items-center p-4 bg-white border border-blue-200 rounded-lg hover:bg-blue-600 transition-all duration-200 group"
          >
            <div className="p-2 rounded-full bg-blue-100 text-blue-600 group-hover:bg-white group-hover:text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="ml-3 text-blue-600 font-medium group-hover:text-white">Create New Giveaway</span>
          </Link>
          <Link
            to="/dashboard/campaigns"
            className="flex items-center p-4 bg-white border border-blue-200 rounded-lg hover:bg-blue-600 transition-all duration-200 group"
          >
            <div className="p-2 rounded-full bg-blue-100 text-blue-600 group-hover:bg-white group-hover:text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
              </svg>
            </div>
            <span className="ml-3 text-blue-600 font-medium group-hover:text-white">View My Campaigns</span>
          </Link>
          {currentUser?.accountType !== 'pro' && (
            <Link
              to="/dashboard/upgrade"
              className="flex items-center p-4 bg-white border border-blue-200 rounded-lg hover:bg-blue-600 transition-all duration-200 group"
            >
              <div className="p-2 rounded-full bg-blue-100 text-blue-600 group-hover:bg-white group-hover:text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="ml-3 text-blue-600 font-medium group-hover:text-white">Upgrade to Pro</span>
            </Link>
          )}
        </div>
      </div>

      {/* Recent Campaigns */}
      {!stats.loading && stats.recentCampaigns && stats.recentCampaigns.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-lg font-bold text-neutral mb-4">Recent Campaigns</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Campaign
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Entries
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Views
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Conversion
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.recentCampaigns.map((campaign) => {
                  const isActive = campaign.status === 'active';
                  
                  return (
                    <tr key={campaign._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{campaign.title}</div>
                            <div className="text-sm text-gray-500">
                              {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${campaign.status === 'active' ? 'bg-green-100 text-green-800' : 
                            campaign.status === 'draft' ? 'bg-gray-100 text-gray-800' : 
                            campaign.status === 'scheduled' ? 'bg-blue-100 text-blue-800' : 
                            campaign.status === 'completed' ? 'bg-purple-100 text-purple-800' : 
                            'bg-red-100 text-red-800'}`}>
                          {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {campaign.stats?.entries || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {campaign.stats?.views || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {campaign.stats?.conversionRate || 0}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            to={`/dashboard/campaigns/${campaign._id}`}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            View
                          </Link>
                          {isActive && campaign.slug && (
                            <Link
                              to={`/giveaway/${campaign.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-600 hover:text-green-900"
                            >
                              Public Link
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {stats.totalCampaigns > stats.recentCampaigns.length && (
              <div className="mt-4 text-center">
                <Link
                  to="/dashboard/campaigns"
                  className="text-sm text-primary hover:text-primary-dark font-medium"
                >
                  View all {stats.totalCampaigns} campaigns →
                </Link>
              </div>
            )}
          </div>
        </div>
      ) : (!stats.loading && stats.activeCampaigns === 0) && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
          <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-neutral mb-2">No Active Campaigns</h2>
          <p className="text-neutral-600 mb-6">
            You don't have any active giveaway campaigns yet. Create your first campaign to start growing your email list.
          </p>
          <Link
            to="/dashboard/giveaway/create"
            className="inline-flex items-center px-4 py-2 border border-blue-200 rounded-md shadow-sm text-sm font-medium text-blue-600 bg-white hover:bg-blue-600 hover:text-white hover:border-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Create First Campaign
          </Link>
        </div>
      )}

      {/* Welcome Modal */}
      {showWelcomeModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-neutral opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-primary">
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-headline font-bold text-neutral" id="modal-title">
                    Welcome to ListLaunchr!
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-neutral-600">
                      Thank you for joining us! You're now ready to create viral giveaways that will help grow your email list and online following.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 space-y-3">
                <Link
                  to="/dashboard/giveaway/create"
                  className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-cta text-base font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cta sm:text-sm"
                >
                  Start a Giveaway
                </Link>
                <Link
                  to="/examples"
                  className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-neutral-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:text-sm"
                >
                  Browse Examples
                </Link>
                <button
                  type="button"
                  onClick={closeWelcomeModal}
                  className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:text-sm"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;