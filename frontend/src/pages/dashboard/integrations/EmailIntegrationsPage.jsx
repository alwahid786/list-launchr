import React from 'react';

const EmailIntegrationsPage = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-2xl font-bold text-gray-900">Email Service Integrations</h2>
          <p className="mt-1 text-sm text-gray-600">
            Connect your campaigns with popular email marketing services to export participants.
          </p>
        </div>
        <div className="border-t border-gray-200">
          {/* Integration Cards */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Mailchimp */}
            <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="p-5">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <img src="https://cdn.worldvectorlogo.com/logos/mailchimp-freddie-icon.svg" alt="Mailchimp" className="h-10 w-10" />
                    <h3 className="ml-3 text-lg font-medium text-gray-900">Mailchimp</h3>
                  </div>
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Not Connected</span>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  Integrate with Mailchimp to automatically sync your giveaway participants to your audience lists.
                </p>
                <div className="mt-4">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Connect Mailchimp
                  </button>
                </div>
              </div>
            </div>

            {/* ConvertKit */}
            <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="p-5">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <img src="https://convertkit.com/favicon.ico" alt="ConvertKit" className="h-10 w-10" />
                    <h3 className="ml-3 text-lg font-medium text-gray-900">ConvertKit</h3>
                  </div>
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Not Connected</span>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  Add participants to ConvertKit sequences and forms automatically from your giveaway campaigns.
                </p>
                <div className="mt-4">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Connect ConvertKit
                  </button>
                </div>
              </div>
            </div>

            {/* ActiveCampaign */}
            <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="p-5">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <img src="https://www.activecampaign.com/wp-content/uploads/2019/12/favicon.png" alt="ActiveCampaign" className="h-10 w-10" />
                    <h3 className="ml-3 text-lg font-medium text-gray-900">ActiveCampaign</h3>
                  </div>
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Not Connected</span>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  Integrate with ActiveCampaign to add contacts to your email marketing automation workflows.
                </p>
                <div className="mt-4">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Connect ActiveCampaign
                  </button>
                </div>
              </div>
            </div>

            {/* Custom API */}
            <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="p-5">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                    </div>
                    <h3 className="ml-3 text-lg font-medium text-gray-900">Custom API</h3>
                  </div>
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Not Connected</span>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  Use custom API endpoints to integrate with any other email service or CRM of your choice.
                </p>
                <div className="mt-4">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Configure API
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Settings Section */}
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Integration Settings</h3>
            <p className="mt-1 text-sm text-gray-600">
              Configure how participant data is exported to your connected services.
            </p>
          </div>
          <div className="p-6">
            <div className="shadow sm:rounded-md sm:overflow-hidden">
              <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Export Data
                    </label>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center">
                        <input
                          id="export-entry"
                          name="export-data"
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          defaultChecked
                        />
                        <label htmlFor="export-entry" className="ml-2 block text-sm text-gray-700">
                          Export new entries immediately
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="export-tags"
                          name="export-tags"
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          defaultChecked
                        />
                        <label htmlFor="export-tags" className="ml-2 block text-sm text-gray-700">
                          Include campaign tags with exports
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="double-optin"
                          name="double-optin"
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="double-optin" className="ml-2 block text-sm text-gray-700">
                          Enable double opt-in for exports
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="export-fields" className="block text-sm font-medium text-gray-700">
                      Fields to Export
                    </label>
                    <div className="mt-2">
                      <select
                        id="export-fields"
                        name="export-fields"
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        multiple
                        defaultValue={['email', 'name']}
                      >
                        <option value="email">Email</option>
                        <option value="name">Name</option>
                        <option value="phone">Phone</option>
                        <option value="custom_fields">Custom Fields</option>
                        <option value="entry_date">Entry Date</option>
                        <option value="referral_count">Referral Count</option>
                      </select>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">Select multiple fields to export to connected services.</p>
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailIntegrationsPage;