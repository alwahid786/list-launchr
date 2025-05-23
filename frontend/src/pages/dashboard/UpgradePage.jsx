import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { stripeAPI } from '../../api';
import useAuth from '../../hooks/useAuth';
import { LoadingSpinner } from '../../components/ui';

const UpgradePage = () => {
  const { currentUser, updateUserDetails } = useAuth();
  const [annualBilling, setAnnualBilling] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const proFeatures = [
    'Unlimited campaigns',
    '10,000 entries per campaign',
    'All entry methods unlocked',
    'Customizable design & branding',
    'No ListLaunchr branding',
    'Integrations with email platforms',
    'Advanced analytics & reporting',
    'Priority support',
  ];

  // Check for session_id parameter if coming from successful checkout
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const sessionId = query.get('session_id');
    
    if (sessionId) {
      verifyCheckoutSession(sessionId);
    } else {
      // Fetch subscription status
      fetchSubscriptionStatus();
    }
  }, [location.search]);

  const fetchSubscriptionStatus = async () => {
    try {
      const response = await stripeAPI.getSubscriptionStatus();
      setSubscription(response.data.data);
    } catch (error) {
      console.error('Error fetching subscription status:', error);
      toast.error('Could not load subscription status');
    }
  };

  const verifyCheckoutSession = async (sessionId) => {
    setVerifying(true);
    try {
      const response = await stripeAPI.verifySession(sessionId);
      
      if (response.data.success) {
        toast.success('Subscription activated successfully!');
        // Clear the session_id from the URL without refreshing the page
        navigate('/dashboard/upgrade', { replace: true });
        // Refresh user data to update subscription status
        await updateUserDetails(currentUser);
        // Fetch updated subscription status
        await fetchSubscriptionStatus();
      } else {
        toast.error('There was an issue verifying your subscription');
      }
    } catch (error) {
      console.error('Error verifying checkout session:', error);
      toast.error('Could not verify your subscription');
    } finally {
      setVerifying(false);
    }
  };

  const handleUpgrade = async () => {
    setIsProcessing(true);
    try {
      const response = await stripeAPI.createCheckoutSession();
      
      if (response.data.success && response.data.url) {
        // Redirect to Stripe checkout
        window.location.href = response.data.url;
      } else {
        toast.error('Could not create checkout session');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast.error('Error starting checkout process');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handlePortal = async () => {
    setIsProcessing(true);
    try {
      const response = await stripeAPI.createPortalSession();
      
      if (response.data.success && response.data.url) {
        // Redirect to Stripe customer portal
        window.location.href = response.data.url;
      } else {
        toast.error('Could not access billing portal');
      }
    } catch (error) {
      console.error('Error creating portal session:', error);
      toast.error('Error accessing billing portal');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col items-center text-center mb-12">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-full mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h1 className="text-3xl font-headline font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">Unleash Your Full Potential</h1>
        <p className="text-neutral-600 max-w-lg">
          Upgrade to Pro and take your giveaway campaigns to the next level with advanced features and no limitations.
        </p>
      </div>

      <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl overflow-hidden mb-12 shadow-xl p-1">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-indigo-400/20 rounded-full -mt-24 -mr-24 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-indigo-400/20 rounded-full -mb-24 -ml-24 blur-3xl"></div>

        <div className="bg-white rounded-xl p-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
            {/* Pricing Info */}
            <div className="md:w-1/2">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold mb-4">
                <span className="mr-1">⚡</span> PRO PLAN
              </div>

              <div className="mb-6">
                <div className="flex justify-start mb-6">
                  <div className="bg-transparent border border-blue-200 rounded-full inline-flex w-full max-w-xs h-14 p-1 relative">
                    {/* Divider line */}
                    <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-px h-8 bg-blue-200"></div>

                    <button
                      onClick={() => setAnnualBilling(true)}
                      className={`relative flex-1 flex items-center justify-center transition-all duration-300 h-full ${
                        annualBilling
                          ? 'bg-blue-600 text-white rounded-full z-10 text-base font-bold'
                          : 'bg-transparent text-blue-600 hover:text-blue-700 text-sm font-medium'
                      }`}
                    >
                      Annual
                      {annualBilling && (
                        <span className="absolute top-0 -right-2 bg-gradient-to-r from-amber-400 to-yellow-400 text-[10px] px-2 py-0.5 rounded-full text-amber-900 font-extrabold shadow-sm z-20 flex items-center justify-center h-4 transform -translate-y-1/2">
                          -20%
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => setAnnualBilling(false)}
                      className={`relative flex-1 flex items-center justify-center transition-all duration-300 h-full ${
                        !annualBilling
                          ? 'bg-blue-600 text-white rounded-full z-10 text-base font-bold'
                          : 'bg-transparent text-blue-600 hover:text-blue-700 text-sm font-medium'
                      }`}
                    >
                      Monthly
                    </button>
                  </div>
                </div>

                <h2 className="flex items-end">
                  <span className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                    $9
                  </span>
                  <span className="text-gray-500 ml-2 pb-1">/month</span>
                </h2>
              </div>

            </div>

            {/* Features */}
            <div className="md:w-1/2 flex flex-col">
              <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-4">Everything in Pro includes:</h3>
              <ul className="space-y-3 flex-grow">
                {proFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center mr-2">
                      <svg className="h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            {verifying ? (
              <div className="flex flex-col items-center justify-center py-8">
                <LoadingSpinner size="lg" />
                <p className="mt-4 text-gray-600">Verifying your subscription...</p>
              </div>
            ) : subscription?.isPro ? (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-green-800 font-medium">You're subscribed to the Pro plan</span>
                  </div>
                  <p className="text-sm text-green-700 mt-2">
                    Your subscription is {subscription.subscriptionStatus}. 
                    {subscription.nextBillingDate && 
                      ` Next billing: ${new Date(subscription.nextBillingDate).toLocaleDateString()}`
                    }
                  </p>
                </div>
                
                <button
                  onClick={handlePortal}
                  disabled={isProcessing}
                  className="relative w-full h-16 overflow-hidden rounded-xl mb-6 group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70"
                >
                  {/* Background gradient */}
                  <div className="absolute inset-0 bg-gray-100 transform transition-transform duration-500 group-hover:scale-105"></div>

                  {/* Content area */}
                  <div className="relative flex items-center justify-center px-8 py-3 h-full">
                    {isProcessing ? (
                      <div className="flex items-center justify-center gap-3">
                        <LoadingSpinner size="sm" className="mr-2" />
                        <span className="text-gray-600 font-medium">Loading billing portal...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-4">
                        <svg className="w-5 h-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-gray-800 font-medium text-lg">Manage Billing</span>
                      </div>
                    )}
                  </div>
                </button>
              </div>
            ) : (
              <button
                onClick={handleUpgrade}
                disabled={isProcessing}
                className="relative w-full h-16 overflow-hidden rounded-xl mb-6 group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70"
              >
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 transform transition-transform duration-500 group-hover:scale-105"></div>

                {/* Background glow effect */}
                <div className="absolute -inset-1 opacity-30 bg-gradient-to-r from-blue-600 to-indigo-600 blur-lg transform transition-all duration-500 scale-105 group-hover:scale-110 group-hover:opacity-50"></div>

                {/* Content area */}
                <div className="relative flex items-center justify-center px-8 py-3 h-full">
                  {isProcessing ? (
                    <div className="flex items-center justify-center gap-3">
                      <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="text-white font-medium">Processing your upgrade...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-4">
                      <svg className="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span className="text-white font-bold text-lg">Upgrade to Pro Now</span>
                      <span className="ml-1 bg-white/20 text-white text-xs px-2 py-1 rounded-full">
                        $9/mo
                      </span>
                    </div>
                  )}
                </div>
              </button>
            )}

            <p className="text-sm text-gray-500 text-center">
              Secure payment • Cancel anytime • <Link to="/contact" className="text-blue-600 hover:text-blue-800 font-medium">Contact support</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Free vs Pro Plan Comparison</h2>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Feature
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Free Plan
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-blue-50 rounded-l-lg">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-blue-600 mr-2"></div>
                      Pro Plan
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    Active Campaigns
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    1
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-700 bg-blue-50">
                    Unlimited
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    Entries Per Campaign
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    500
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-700 bg-blue-50">
                    10,000
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    Entry Methods
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    Basic (Email + Share)
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-700 bg-blue-50">
                    All Methods
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    Design Customization
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-700 bg-blue-50">
                    <svg className="h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    Remove ListLaunchr Branding
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-700 bg-blue-50">
                    <svg className="h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    Integrations
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-700 bg-blue-50">
                    <svg className="h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradePage;