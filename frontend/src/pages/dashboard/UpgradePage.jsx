import { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const UpgradePage = () => {
  const { currentUser } = useAuth();
  const [annualBilling, setAnnualBilling] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const features = [
    'Unlimited campaigns',
    '10,000 entries per campaign',
    'All entry methods unlocked',
    'Customizable design & branding',
    'No ListLaunchr branding',
    'Integrations with email platforms',
    'Advanced analytics & reporting',
    'Priority support',
  ];

  const handleUpgrade = async () => {
    setIsProcessing(true);
    
    // This would typically connect to a payment processor like Stripe
    // For demo purposes, we're just showing a processing state
    setTimeout(() => {
      setIsProcessing(false);
      alert('This is a demo - in a real application, this would connect to a payment processor.');
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-headline font-bold text-neutral mb-6">Upgrade to Pro</h1>
      
      <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-8">
        <div className="px-6 py-8 border-b">
          <h2 className="text-xl font-semibold text-neutral mb-4">Unlock Premium Features</h2>
          <p className="text-neutral-600 mb-6">
            Upgrade to Pro to unlock unlimited campaigns, advanced features, and remove all restrictions.
          </p>
          
          <div className="bg-primary bg-opacity-5 rounded-lg p-6 mb-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-neutral">Pro Plan</h3>
                <p className="text-neutral-600">For serious creators and marketers</p>
              </div>
            </div>
            
            <div className="flex justify-center mb-6">
              <div className="relative bg-white rounded-lg inline-flex p-1 border border-gray-300">
                <button
                  onClick={() => setAnnualBilling(true)}
                  className={`${annualBilling ? 'bg-primary text-white' : 'bg-white text-neutral-600'} relative py-2 px-4 text-sm font-medium rounded-md transition-colors focus:outline-none`}
                >
                  Annual
                  <span className="absolute -top-3 right-0 bg-accent text-black px-2 py-0.5 rounded-full text-xs font-semibold">Save 20%</span>
                </button>
                <button
                  onClick={() => setAnnualBilling(false)}
                  className={`${!annualBilling ? 'bg-primary text-white' : 'bg-white text-neutral-600'} relative py-2 px-4 text-sm font-medium rounded-md transition-colors focus:outline-none`}
                >
                  Monthly
                </button>
              </div>
            </div>
            
            <div className="text-center mb-6">
              <span className="text-5xl font-bold text-neutral">${annualBilling ? '8' : '9'}</span>
              <span className="text-lg text-neutral-600">/month</span>
              {annualBilling && (
                <p className="text-sm text-neutral-600 mt-1">Billed annually (${8 * 12} total)</p>
              )}
            </div>
            
            <ul className="space-y-3 mb-6">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-neutral-600">{feature}</span>
                </li>
              ))}
            </ul>
            
            <button
              onClick={handleUpgrade}
              disabled={isProcessing}
              className="w-full py-3 px-4 border border-transparent text-base font-medium rounded-md text-white bg-cta hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cta disabled:opacity-70 transition-colors"
            >
              {isProcessing ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </div>
              ) : (
                'Upgrade Now'
              )}
            </button>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-neutral-600 mb-2">Questions about upgrading?</p>
            <Link to="/contact" className="text-sm text-primary hover:text-blue-700">
              Contact our support team
            </Link>
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-6 py-6 border-b">
          <h2 className="text-lg font-medium text-neutral">Free vs Pro Plan Comparison</h2>
        </div>
        <div className="px-6 py-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                    Feature
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                    Free Plan
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                    Pro Plan
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                    Active Campaigns
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral">
                    1
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral">
                    Unlimited
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                    Entries Per Campaign
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral">
                    500
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral">
                    10,000
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                    Entry Methods
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral">
                    Basic (Email + Share)
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral">
                    All Methods
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                    Design Customization
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral">
                    <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral">
                    <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                    Remove ListLaunchr Branding
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral">
                    <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral">
                    <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                    Integrations
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral">
                    <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral">
                    <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
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