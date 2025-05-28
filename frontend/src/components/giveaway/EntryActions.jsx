import React, { useState } from 'react';
import PropTypes from 'prop-types';

const EntryActions = ({ 
  entryOptions, 
  onActionComplete,
  completedActions = []
}) => {
  const [actionStates, setActionStates] = useState({});

  const handleActionClick = (actionType, platform = null) => {
    const actionKey = platform ? `${actionType}_${platform}` : actionType;
    
    // Mark as completed (honor system)
    setActionStates(prev => ({
      ...prev,
      [actionKey]: true
    }));

    // Notify parent component
    if (onActionComplete) {
      onActionComplete({
        type: actionType,
        platform,
        completed: true,
        points: 1 // Default 1 point per action
      });
    }
  };

  const isActionCompleted = (actionType, platform = null) => {
    const actionKey = platform ? `${actionType}_${platform}` : actionType;
    return completedActions.includes(actionKey) || actionStates[actionKey];
  };

  const getInstagramUrl = (username) => {
    const cleanUsername = username.replace('@', '');
    return `https://instagram.com/${cleanUsername}`;
  };

  const getFacebookUrl = (pageUrl) => {
    return pageUrl.startsWith('http') ? pageUrl : `https://facebook.com/${pageUrl}`;
  };

  const getYouTubeUrl = (channelUrl) => {
    return channelUrl.startsWith('http') ? channelUrl : `https://youtube.com/c/${channelUrl}`;
  };

  const getTikTokUrl = (username) => {
    const cleanUsername = username.replace('@', '');
    return `https://tiktok.com/@${cleanUsername}`;
  };

  if (!entryOptions) return null;

  const hasAnyActions = 
    entryOptions.visitUrl?.enabled ||
    entryOptions.socialFollow?.instagram?.enabled ||
    entryOptions.socialFollow?.facebook?.enabled ||
    entryOptions.socialFollow?.youtube?.enabled ||
    entryOptions.socialFollow?.tiktok?.enabled;

  if (!hasAnyActions) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mt-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">
        Earn More Entries
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        Complete these actions to increase your chances of winning!
      </p>

      <div className="space-y-3">
        {/* Visit URL Action */}
        {entryOptions.visitUrl?.enabled && entryOptions.visitUrl?.url && (
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Visit our website</p>
                <p className="text-sm text-gray-500">Check out our latest content</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-blue-600">+1 entry</span>
              {isActionCompleted('visit_url') ? (
                <div className="flex items-center space-x-1 text-green-600 bg-green-100 px-3 py-1 rounded-full">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">Completed</span>
                </div>
              ) : (
                <button
                  onClick={() => {
                    window.open(entryOptions.visitUrl.url, '_blank');
                    handleActionClick('visit_url');
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Visit Now
                </button>
              )}
            </div>
          </div>
        )}

        {/* Instagram Follow */}
        {entryOptions.socialFollow?.instagram?.enabled && entryOptions.socialFollow?.instagram?.username && (
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C8.396 0 7.989.013 7.041.048 6.094.082 5.52.204 5.012.401c-.533.204-.973.478-1.417.923-.445.444-.72.884-.923 1.417-.197.509-.319 1.083-.353 2.03C2.284 6.009 2.27 6.416 2.27 10.017s.013 4.008.048 4.956c.034.947.156 1.521.353 2.03.203.533.478.973.923 1.417.444.445.884.72 1.417.923.508.197 1.082.319 2.029.353.948.035 1.355.048 4.956.048s4.008-.013 4.956-.048c.947-.034 1.521-.156 2.03-.353.533-.203.973-.478 1.417-.923.445-.444.72-.884.923-1.417.197-.508.319-1.082.353-2.029.035-.948.048-1.355.048-4.956s-.013-4.008-.048-4.956c-.034-.947-.156-1.521-.353-2.03-.203-.533-.478-.973-.923-1.417-.444-.445-.884-.72-1.417-.923-.508-.197-1.082-.319-2.029-.353C16.025.013 15.618 0 12.017 0zM12.017 2.162c3.557 0 3.983.013 4.889.047.834.04 1.287.184 1.589.305.4.156.686.343.985.642.3.3.487.586.642.986.121.301.265.754.305 1.588.034.906.047 1.332.047 4.889s-.013 3.983-.047 4.889c-.04.834-.184 1.287-.305 1.589-.156.4-.343.686-.642.985-.3.3-.586.487-.986.642-.301.121-.754.265-1.588.305-.906.034-1.332.047-4.889.047s-3.983-.013-4.889-.047c-.834-.04-1.287-.184-1.589-.305-.4-.156-.686-.343-.985-.642-.3-.3-.487-.586-.642-.986-.121-.301-.265-.754-.305-1.588-.034-.906-.047-1.332-.047-4.889s.013-3.983.047-4.889c.04-.834.184-1.287.305-1.589.156-.4.343-.686.642-.985.3-.3.586-.487.986-.642.301-.121.754-.265 1.588-.305.906-.034 1.332-.047 4.889-.047zM12.017 5.838a4.179 4.179 0 100 8.358 4.179 4.179 0 000-8.358zm0 6.893a2.714 2.714 0 110-5.428 2.714 2.714 0 010 5.428zm5.287-7.07a.976.976 0 11-1.952 0 .976.976 0 011.952 0z"/>
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Follow us on Instagram</p>
                <p className="text-sm text-gray-500">@{entryOptions.socialFollow.instagram.username.replace('@', '')}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-blue-600">+1 entry</span>
              {isActionCompleted('social_follow', 'instagram') ? (
                <div className="flex items-center space-x-1 text-green-600 bg-green-100 px-3 py-1 rounded-full">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">Completed</span>
                </div>
              ) : (
                <button
                  onClick={() => {
                    window.open(getInstagramUrl(entryOptions.socialFollow.instagram.username), '_blank');
                    handleActionClick('social_follow', 'instagram');
                  }}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:from-purple-600 hover:to-pink-600 transition-colors"
                >
                  Follow
                </button>
              )}
            </div>
          </div>
        )}

        {/* Facebook Follow */}
        {entryOptions.socialFollow?.facebook?.enabled && entryOptions.socialFollow?.facebook?.pageUrl && (
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Like our Facebook page</p>
                <p className="text-sm text-gray-500">Follow us for updates</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-blue-600">+1 entry</span>
              {isActionCompleted('social_follow', 'facebook') ? (
                <div className="flex items-center space-x-1 text-green-600 bg-green-100 px-3 py-1 rounded-full">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">Completed</span>
                </div>
              ) : (
                <button
                  onClick={() => {
                    window.open(getFacebookUrl(entryOptions.socialFollow.facebook.pageUrl), '_blank');
                    handleActionClick('social_follow', 'facebook');
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Follow
                </button>
              )}
            </div>
          </div>
        )}

        {/* YouTube Follow */}
        {entryOptions.socialFollow?.youtube?.enabled && entryOptions.socialFollow?.youtube?.channelUrl && (
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Subscribe to our YouTube</p>
                <p className="text-sm text-gray-500">Get the latest videos</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-blue-600">+1 entry</span>
              {isActionCompleted('social_follow', 'youtube') ? (
                <div className="flex items-center space-x-1 text-green-600 bg-green-100 px-3 py-1 rounded-full">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">Completed</span>
                </div>
              ) : (
                <button
                  onClick={() => {
                    window.open(getYouTubeUrl(entryOptions.socialFollow.youtube.channelUrl), '_blank');
                    handleActionClick('social_follow', 'youtube');
                  }}
                  className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  Subscribe
                </button>
              )}
            </div>
          </div>
        )}

        {/* TikTok Follow */}
        {entryOptions.socialFollow?.tiktok?.enabled && entryOptions.socialFollow?.tiktok?.username && (
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Follow us on TikTok</p>
                <p className="text-sm text-gray-500">@{entryOptions.socialFollow.tiktok.username.replace('@', '')}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-blue-600">+1 entry</span>
              {isActionCompleted('social_follow', 'tiktok') ? (
                <div className="flex items-center space-x-1 text-green-600 bg-green-100 px-3 py-1 rounded-full">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">Completed</span>
                </div>
              ) : (
                <button
                  onClick={() => {
                    window.open(getTikTokUrl(entryOptions.socialFollow.tiktok.username), '_blank');
                    handleActionClick('social_follow', 'tiktok');
                  }}
                  className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  Follow
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-700">
          <span className="font-medium">Tip:</span> Complete these actions to earn additional entries and increase your chances of winning!
        </p>
      </div>
    </div>
  );
};

EntryActions.propTypes = {
  entryOptions: PropTypes.object.isRequired,
  onActionComplete: PropTypes.func,
  completedActions: PropTypes.array
};

export default EntryActions;