import React from 'react';

const WinnerSelectionPage = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-2xl font-bold text-gray-900">Winner Selection</h2>
          <p className="mt-1 text-sm text-gray-600">
            Randomly select and manage winners for your giveaway campaigns.
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-12 sm:px-6 flex flex-col items-center justify-center text-center">
          <svg
            className="mx-auto h-16 w-16 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No winners selected yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Select a campaign to pick winners from their entries.
          </p>
          <div className="mt-6">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Select Campaign
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WinnerSelectionPage;