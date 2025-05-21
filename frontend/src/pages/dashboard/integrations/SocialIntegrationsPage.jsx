import React from 'react';

const SocialIntegrationsPage = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-2xl font-bold text-gray-900">Social Media Integrations</h2>
          <p className="mt-1 text-sm text-gray-600">
            Connect your campaigns with social media platforms to boost engagement and reach.
          </p>
        </div>
        <div className="border-t border-gray-200">
          {/* Integration Cards */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Facebook */}
            <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="p-5">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <svg className="h-10 w-10 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <h3 className="ml-3 text-lg font-medium text-gray-900">Facebook</h3>
                  </div>
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Not Connected</span>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  Integrate with Facebook to enable social sharing, increase reach, and verify page likes.
                </p>
                <div className="mt-4">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Connect Facebook
                  </button>
                </div>
              </div>
            </div>

            {/* Twitter */}
            <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="p-5">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <svg className="h-10 w-10 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                    <h3 className="ml-3 text-lg font-medium text-gray-900">Twitter</h3>
                  </div>
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Not Connected</span>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  Verify tweet actions and enable participants to easily share your giveaway.
                </p>
                <div className="mt-4">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Connect Twitter
                  </button>
                </div>
              </div>
            </div>

            {/* Instagram */}
            <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="p-5">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2C14.717 2 15.056 2.01 16.122 2.06C17.187 2.11 17.912 2.277 18.55 2.525C19.21 2.779 19.766 3.123 20.322 3.678C20.8305 4.1779 21.224 4.78259 21.475 5.45C21.722 6.087 21.89 6.813 21.94 7.878C21.987 8.944 22 9.283 22 12C22 14.717 21.99 15.056 21.94 16.122C21.89 17.187 21.722 17.912 21.475 18.55C21.2247 19.2178 20.8311 19.8226 20.322 20.322C19.822 20.8303 19.2173 21.2238 18.55 21.475C17.913 21.722 17.187 21.89 16.122 21.94C15.056 21.987 14.717 22 12 22C9.283 22 8.944 21.99 7.878 21.94C6.813 21.89 6.088 21.722 5.45 21.475C4.78233 21.2245 4.17753 20.8309 3.678 20.322C3.16941 19.8222 2.77593 19.2175 2.525 18.55C2.277 17.913 2.11 17.187 2.06 16.122C2.013 15.056 2 14.717 2 12C2 9.283 2.01 8.944 2.06 7.878C2.11 6.812 2.277 6.088 2.525 5.45C2.77524 4.78218 3.1688 4.17732 3.678 3.678C4.17767 3.16923 4.78243 2.77573 5.45 2.525C6.088 2.277 6.812 2.11 7.878 2.06C8.944 2.013 9.283 2 12 2Z" stroke="url(#instagram-gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M17.5 6.5L17.51 6.5" stroke="url(#instagram-gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" stroke="url(#instagram-gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <defs>
                        <linearGradient id="instagram-gradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#FFDD55" />
                          <stop offset="0.5" stopColor="#FF543E" />
                          <stop offset="1" stopColor="#C837AB" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <h3 className="ml-3 text-lg font-medium text-gray-900">Instagram</h3>
                  </div>
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Not Connected</span>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  Verify Instagram follows and enable sharing on one of the most popular platforms.
                </p>
                <div className="mt-4">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Connect Instagram
                  </button>
                </div>
              </div>
            </div>

            {/* YouTube */}
            <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="p-5">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <svg className="h-10 w-10 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                    <h3 className="ml-3 text-lg font-medium text-gray-900">YouTube</h3>
                  </div>
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Not Connected</span>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  Verify YouTube channel subscriptions and video likes for video content creators.
                </p>
                <div className="mt-4">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Connect YouTube
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Settings Section */}
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Social Integration Settings</h3>
            <p className="mt-1 text-sm text-gray-600">
              Configure how participants interact with your social platforms.
            </p>
          </div>
          <div className="p-6">
            <div className="shadow sm:rounded-md sm:overflow-hidden">
              <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Social Sharing
                    </label>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center">
                        <input
                          id="auto-share-text"
                          name="auto-share"
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          defaultChecked
                        />
                        <label htmlFor="auto-share-text" className="ml-2 block text-sm text-gray-700">
                          Use default sharing text templates
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="validate-shares"
                          name="validate-shares"
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          defaultChecked
                        />
                        <label htmlFor="validate-shares" className="ml-2 block text-sm text-gray-700">
                          Validate social shares before granting entries
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="track-clicks"
                          name="track-clicks"
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          defaultChecked
                        />
                        <label htmlFor="track-clicks" className="ml-2 block text-sm text-gray-700">
                          Track click-through rates on social shares
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="default-message" className="block text-sm font-medium text-gray-700">
                      Default Sharing Message
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="default-message"
                        name="default-message"
                        rows={3}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                        placeholder="I just entered to win the #Giveaway! Enter now: {{entry_link}}"
                        defaultValue="I just entered to win the #Giveaway! Enter now: {{entry_link}}"
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Use {{entry_link}} to include the participant's unique referral link.
                    </p>
                  </div>

                  <div>
                    <label htmlFor="action-points" className="block text-sm font-medium text-gray-700">
                      Entry Points for Social Actions
                    </label>
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="facebook-like" className="block text-xs font-medium text-gray-500">
                          Facebook Like
                        </label>
                        <input
                          type="number"
                          name="facebook-like"
                          id="facebook-like"
                          className="mt-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          defaultValue="1"
                          min="0"
                        />
                      </div>
                      <div>
                        <label htmlFor="facebook-share" className="block text-xs font-medium text-gray-500">
                          Facebook Share
                        </label>
                        <input
                          type="number"
                          name="facebook-share"
                          id="facebook-share"
                          className="mt-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          defaultValue="3"
                          min="0"
                        />
                      </div>
                      <div>
                        <label htmlFor="twitter-follow" className="block text-xs font-medium text-gray-500">
                          Twitter Follow
                        </label>
                        <input
                          type="number"
                          name="twitter-follow"
                          id="twitter-follow"
                          className="mt-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          defaultValue="1"
                          min="0"
                        />
                      </div>
                      <div>
                        <label htmlFor="twitter-tweet" className="block text-xs font-medium text-gray-500">
                          Twitter Tweet
                        </label>
                        <input
                          type="number"
                          name="twitter-tweet"
                          id="twitter-tweet"
                          className="mt-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          defaultValue="2"
                          min="0"
                        />
                      </div>
                    </div>
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

export default SocialIntegrationsPage;