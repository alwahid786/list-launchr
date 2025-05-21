import React from 'react';

const NotificationsPage = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-2xl font-bold text-gray-900">Notification Settings</h2>
          <p className="mt-1 text-sm text-gray-600">
            Manage how and when you receive notifications about your campaigns.
          </p>
        </div>
        <div className="border-t border-gray-200">
          <div className="p-6">
            <form className="space-y-8 divide-y divide-gray-200">
              <div className="space-y-8 divide-y divide-gray-200">
                <div>
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Email Notifications</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Choose which emails you'd like to receive from ListLaunchr.
                    </p>
                  </div>
                  <div className="mt-6">
                    <fieldset>
                      <div className="space-y-4">
                        <div className="relative flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="campaign-activity"
                              name="campaign-activity"
                              type="checkbox"
                              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                              defaultChecked
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="campaign-activity" className="font-medium text-gray-700">
                              Campaign Activity
                            </label>
                            <p className="text-gray-500">Receive updates when participants join your campaigns or refer others.</p>
                          </div>
                        </div>
                        <div className="relative flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="campaign-completion"
                              name="campaign-completion"
                              type="checkbox"
                              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                              defaultChecked
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="campaign-completion" className="font-medium text-gray-700">
                              Campaign Completion
                            </label>
                            <p className="text-gray-500">Get notified when campaigns end and winners are selected.</p>
                          </div>
                        </div>
                        <div className="relative flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="milestones"
                              name="milestones"
                              type="checkbox"
                              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                              defaultChecked
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="milestones" className="font-medium text-gray-700">
                              Milestones
                            </label>
                            <p className="text-gray-500">Receive notifications when campaigns reach milestones (e.g., 100, 1000 entries).</p>
                          </div>
                        </div>
                        <div className="relative flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="system-updates"
                              name="system-updates"
                              type="checkbox"
                              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                              defaultChecked
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="system-updates" className="font-medium text-gray-700">
                              System Updates
                            </label>
                            <p className="text-gray-500">Get notified about platform updates, maintenance, and new features.</p>
                          </div>
                        </div>
                        <div className="relative flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="marketing"
                              name="marketing"
                              type="checkbox"
                              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="marketing" className="font-medium text-gray-700">
                              Marketing & Tips
                            </label>
                            <p className="text-gray-500">Receive marketing emails and tips to improve your campaigns.</p>
                          </div>
                        </div>
                      </div>
                    </fieldset>
                  </div>
                </div>

                <div className="pt-8">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Notification Frequency</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Choose how often you want to receive notification emails.
                    </p>
                  </div>
                  <div className="mt-6">
                    <fieldset>
                      <legend className="sr-only">Notification frequency</legend>
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <input
                            id="frequency-realtime"
                            name="notification-frequency"
                            type="radio"
                            defaultChecked
                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                          />
                          <label htmlFor="frequency-realtime" className="ml-3 block text-sm font-medium text-gray-700">
                            Real-time (as they happen)
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="frequency-daily"
                            name="notification-frequency"
                            type="radio"
                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                          />
                          <label htmlFor="frequency-daily" className="ml-3 block text-sm font-medium text-gray-700">
                            Daily digest
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="frequency-weekly"
                            name="notification-frequency"
                            type="radio"
                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                          />
                          <label htmlFor="frequency-weekly" className="ml-3 block text-sm font-medium text-gray-700">
                            Weekly summary
                          </label>
                        </div>
                      </div>
                    </fieldset>
                  </div>
                </div>

                <div className="pt-8">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Push Notifications</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Configure browser push notifications for real-time updates.
                    </p>
                  </div>
                  <div className="mt-6">
                    <div className="flex items-center justify-between">
                      <span className="flex-grow flex flex-col">
                        <span className="text-sm font-medium text-gray-900">Enable push notifications</span>
                        <span className="text-sm text-gray-500">Receive instant notifications in your browser.</span>
                      </span>
                      <button
                        type="button"
                        className="bg-gray-200 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        role="switch"
                        aria-checked="false"
                      >
                        <span className="sr-only">Enable push notifications</span>
                        <span
                          aria-hidden="true"
                          className="translate-x-0 pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                        ></span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-5">
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;