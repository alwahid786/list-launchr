import React from 'react';

const HelpSupportPage = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-2xl font-bold text-gray-900">Help & Support</h2>
          <p className="mt-1 text-sm text-gray-600">
            Find answers to your questions or contact our support team.
          </p>
        </div>
        <div className="border-t border-gray-200">
          {/* Search and quick links */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-6 sm:px-6">
            <div className="max-w-lg mx-auto">
              <div className="rounded-md shadow-sm">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="search"
                    id="search"
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3"
                    placeholder="Search help articles..."
                  />
                </div>
              </div>
              <div className="mt-4 flex space-x-3 justify-center">
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Getting Started
                </button>
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Campaign Setup
                </button>
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Billing
                </button>
              </div>
            </div>
          </div>

          {/* FAQs */}
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Frequently Asked Questions</h3>
            <div className="mt-5 border-t border-gray-200 divide-y divide-gray-200">
              <div className="py-4">
                <details className="group">
                  <summary className="flex justify-between items-center font-medium cursor-pointer">
                    <span>How do I set up my first giveaway campaign?</span>
                    <span className="transition group-open:rotate-180">
                      <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24">
                        <path d="M6 9l6 6 6-6"></path>
                      </svg>
                    </span>
                  </summary>
                  <p className="text-gray-600 mt-3 group-open:animate-fadeIn">
                    To create your first giveaway campaign, navigate to the Dashboard and click on "Create Giveaway" in the sidebar. Follow the step-by-step wizard to set up your campaign details, entry methods, and design. Once you're happy with your campaign, publish it and start sharing the unique link with your audience.
                  </p>
                </details>
              </div>

              <div className="py-4">
                <details className="group">
                  <summary className="flex justify-between items-center font-medium cursor-pointer">
                    <span>How do I select winners for my giveaway?</span>
                    <span className="transition group-open:rotate-180">
                      <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24">
                        <path d="M6 9l6 6 6-6"></path>
                      </svg>
                    </span>
                  </summary>
                  <p className="text-gray-600 mt-3 group-open:animate-fadeIn">
                    After your campaign ends, go to the campaign details page and click the "Select Winners" button. You can choose to randomly select winners from all entries, or filter based on various criteria like location or entry method. The platform uses a transparent random selection algorithm to ensure fairness.
                  </p>
                </details>
              </div>

              <div className="py-4">
                <details className="group">
                  <summary className="flex justify-between items-center font-medium cursor-pointer">
                    <span>What's the difference between Free and Pro plans?</span>
                    <span className="transition group-open:rotate-180">
                      <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24">
                        <path d="M6 9l6 6 6-6"></path>
                      </svg>
                    </span>
                  </summary>
                  <p className="text-gray-600 mt-3 group-open:animate-fadeIn">
                    The Free plan allows you to run 1 active campaign with up to 500 entries per campaign and basic entry methods. The Pro plan ($9/month) gives you unlimited campaigns, up to 10,000 entries per campaign, access to all entry methods, integrations with email platforms, advanced analytics, and customizable design without ListLaunchr branding.
                  </p>
                </details>
              </div>

              <div className="py-4">
                <details className="group">
                  <summary className="flex justify-between items-center font-medium cursor-pointer">
                    <span>How do I integrate with my email marketing platform?</span>
                    <span className="transition group-open:rotate-180">
                      <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24">
                        <path d="M6 9l6 6 6-6"></path>
                      </svg>
                    </span>
                  </summary>
                  <p className="text-gray-600 mt-3 group-open:animate-fadeIn">
                    Pro users can integrate with popular email platforms by navigating to the Integrations section in the dashboard. We support direct integrations with Mailchimp, ConvertKit, ActiveCampaign, and more. Simply click "Connect" next to your platform of choice and follow the authentication steps. Once connected, you can automatically export campaign participants to your email lists.
                  </p>
                </details>
              </div>

              <div className="py-4">
                <details className="group">
                  <summary className="flex justify-between items-center font-medium cursor-pointer">
                    <span>Is there a limit to how many campaigns I can create?</span>
                    <span className="transition group-open:rotate-180">
                      <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24">
                        <path d="M6 9l6 6 6-6"></path>
                      </svg>
                    </span>
                  </summary>
                  <p className="text-gray-600 mt-3 group-open:animate-fadeIn">
                    Free users can create and have 1 active campaign at a time. Pro users can create unlimited campaigns with no restriction on the number of active campaigns running simultaneously. If you need higher entry limits than what the Pro plan offers, please contact our sales team for custom enterprise solutions.
                  </p>
                </details>
              </div>
            </div>
          </div>

          {/* Contact support */}
          <div className="bg-gray-50 px-4 py-5 sm:px-6 border-t border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Still need help?</h3>
            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                      <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="ml-5">
                      <h4 className="text-lg leading-6 font-medium text-gray-900">Email Support</h4>
                      <p className="mt-2 text-sm text-gray-500">
                        Send us an email and we'll get back to you within 24 hours.
                      </p>
                      <div className="mt-3">
                        <a href="mailto:support@listlaunchr.com" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                          Contact Support
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                      <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    </div>
                    <div className="ml-5">
                      <h4 className="text-lg leading-6 font-medium text-gray-900">Live Chat</h4>
                      <p className="mt-2 text-sm text-gray-500">
                        Chat with our support team during business hours.
                      </p>
                      <div className="mt-3">
                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          Start Chat
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Documentation */}
          <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Documentation</h3>
            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
              <a href="#" className="group hover:bg-gray-50 p-4 rounded-md transition duration-150 ease-in-out">
                <div className="flex items-center space-x-3">
                  <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <div>
                    <h4 className="text-base font-medium text-gray-900 group-hover:text-blue-600">User Guide</h4>
                    <p className="mt-1 text-sm text-gray-500">Complete documentation on using ListLaunchr.</p>
                  </div>
                </div>
              </a>

              <a href="#" className="group hover:bg-gray-50 p-4 rounded-md transition duration-150 ease-in-out">
                <div className="flex items-center space-x-3">
                  <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                  </svg>
                  <div>
                    <h4 className="text-base font-medium text-gray-900 group-hover:text-blue-600">API Reference</h4>
                    <p className="mt-1 text-sm text-gray-500">Technical documentation for developers.</p>
                  </div>
                </div>
              </a>

              <a href="#" className="group hover:bg-gray-50 p-4 rounded-md transition duration-150 ease-in-out">
                <div className="flex items-center space-x-3">
                  <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                  </svg>
                  <div>
                    <h4 className="text-base font-medium text-gray-900 group-hover:text-blue-600">Video Tutorials</h4>
                    <p className="mt-1 text-sm text-gray-500">Step-by-step video guides for all features.</p>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpSupportPage;