import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const DashboardPage = () => {
  const { currentUser } = useAuth();
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [stats, setStats] = useState({
    activeCampaigns: 0,
    totalEntries: 0,
    conversionRate: 0,
    topReferrers: []
  });

  useEffect(() => {
    // Check if this is the user's first login
    const isFirstLogin = localStorage.getItem('firstLogin') !== 'false';
    if (isFirstLogin) {
      setShowWelcomeModal(true);
      localStorage.setItem('firstLogin', 'false');
    }

    // Fetch dashboard stats - would normally come from API
    // This is just placeholder data
    setStats({
      activeCampaigns: 0,
      totalEntries: 0,
      conversionRate: 0,
      topReferrers: []
    });
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
              <p className="text-2xl font-semibold text-neutral">{stats.activeCampaigns}</p>
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
              <p className="text-2xl font-semibold text-neutral">{stats.totalEntries}</p>
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
              <p className="text-2xl font-semibold text-neutral">{stats.conversionRate}%</p>
            </div>
          </div>
        </div>

        {/* Account Type */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-neutral-600">Account Type</p>
              <p className="text-2xl font-semibold text-neutral capitalize">{currentUser?.accountType || 'Free'}</p>
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

      {/* No Campaigns Message */}
      {stats.activeCampaigns === 0 && (
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