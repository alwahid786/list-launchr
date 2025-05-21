import { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { stripeAPI } from '../../api';
import useAuth from '../../hooks/useAuth';
import { LoadingSpinner } from '../../components/ui';

const UpgradeSuccessPage = () => {
  const { updateUserDetails } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const sessionId = query.get('session_id');
    
    if (!sessionId) {
      // No session ID, redirect to upgrade page
      navigate('/dashboard/upgrade');
      return;
    }
    
    // Verify the checkout session
    const verifySession = async () => {
      try {
        const response = await stripeAPI.verifySession(sessionId);
        
        if (response.data.success) {
          // Update user data
          await updateUserDetails();
          toast.success('Subscription activated successfully!');
        } else {
          toast.error('There was an issue verifying your subscription');
          navigate('/dashboard/upgrade');
        }
      } catch (error) {
        console.error('Error verifying session:', error);
        toast.error('Could not verify your subscription');
        navigate('/dashboard/upgrade');
      }
    };
    
    verifySession();
  }, [location.search, navigate, refreshUserData]);

  return (
    <div className="max-w-3xl mx-auto my-12 p-8 bg-white rounded-xl shadow-lg">
      <div className="text-center mb-8">
        <div className="bg-green-100 text-green-700 p-3 rounded-full inline-flex items-center justify-center">
          <svg className="h-10 w-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="mt-4 text-3xl font-bold text-gray-900">Welcome to ListLaunchr Pro!</h1>
        <p className="mt-2 text-xl text-gray-600">Your subscription has been activated successfully.</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-blue-800 mb-3">You now have access to:</h2>
        <ul className="space-y-2">
          <li className="flex items-start">
            <svg className="h-5 w-5 text-blue-600 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Unlimited giveaway campaigns</span>
          </li>
          <li className="flex items-start">
            <svg className="h-5 w-5 text-blue-600 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Up to 10,000 entries per campaign</span>
          </li>
          <li className="flex items-start">
            <svg className="h-5 w-5 text-blue-600 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Custom branding and design options</span>
          </li>
          <li className="flex items-start">
            <svg className="h-5 w-5 text-blue-600 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Email marketing integrations (Mailchimp, ConvertKit, MailerLite)</span>
          </li>
          <li className="flex items-start">
            <svg className="h-5 w-5 text-blue-600 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Full set of social entry methods and coupon reveal feature</span>
          </li>
          <li className="flex items-start">
            <svg className="h-5 w-5 text-blue-600 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Campaign duplication and removal of ListLaunchr branding</span>
          </li>
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link 
          to="/dashboard/campaigns/new"
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Create a New Campaign
        </Link>
        <Link 
          to="/dashboard"
          className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default UpgradeSuccessPage;