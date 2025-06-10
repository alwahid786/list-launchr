import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import api from '../../../api';

const EmailIntegrationsPage = () => {
  const { currentUser, isPro } = useAuth();
  const [integrations, setIntegrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connectingProvider, setConnectingProvider] = useState(null);
  const [showApiForm, setShowApiForm] = useState(null);
  const [apiCredentials, setApiCredentials] = useState({
    apiKey: '',
    listId: '',
    webhookUrl: ''
  });

  // Define available integrations based on membership level
  const freeIntegrations = [
    {
      id: 'csv',
      name: 'CSV Download',
      description: 'Download your subscriber data as a CSV file for manual import',
      icon: '📄',
      color: 'gray',
      available: true,
      type: 'download'
    }
  ];

  const proIntegrations = [
    {
      id: 'mailchimp',
      name: 'Mailchimp',
      description: 'Automatically sync subscribers to your Mailchimp audience lists',
      icon: '🐵',
      color: 'yellow',
      available: isPro(),
      logoUrl: 'https://cdn.worldvectorlogo.com/logos/mailchimp-freddie-icon.svg'
    },
    {
      id: 'mailerlite',
      name: 'MailerLite',
      description: 'Connect with MailerLite to grow your subscriber lists effortlessly',
      icon: '✉️',
      color: 'green',
      available: isPro(),
      logoUrl: 'https://www.mailerlite.com/favicon.ico'
    },
    {
      id: 'aweber',
      name: 'AWeber',
      description: 'Integrate with AWeber to automate your email marketing campaigns',
      icon: '📧',
      color: 'orange',
      available: isPro(),
      logoUrl: 'https://www.aweber.com/favicon.ico'
    },
    {
      id: 'campaignmonitor',
      name: 'Campaign Monitor',
      description: 'Sync subscribers directly to your Campaign Monitor lists',
      icon: '📊',
      color: 'blue',
      available: isPro(),
      logoUrl: 'https://www.campaignmonitor.com/favicon.ico'
    },
    {
      id: 'kit',
      name: 'Kit (ConvertKit)',
      description: 'Add subscribers to your Kit forms and sequences automatically',
      icon: '🔧',
      color: 'pink',
      available: isPro(),
      logoUrl: 'https://convertkit.com/favicon.ico'
    },
    {
      id: 'emma',
      name: 'Emma',
      description: 'Connect with Emma to manage your email marketing workflows',
      icon: '💌',
      color: 'purple',
      available: isPro(),
      logoUrl: 'https://myemma.com/favicon.ico'
    },
    {
      id: 'sendgrid',
      name: 'SendGrid',
      description: 'Integrate with SendGrid for reliable email delivery and management',
      icon: '⚡',
      color: 'blue',
      available: isPro(),
      logoUrl: 'https://sendgrid.com/favicon.ico'
    },
    {
      id: 'webhook',
      name: 'Custom Webhook',
      description: 'Send subscriber data to any custom endpoint or API',
      icon: '🔗',
      color: 'gray',
      available: isPro(),
      type: 'webhook'
    }
  ];

  const allIntegrations = [...freeIntegrations, ...proIntegrations];

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const fetchIntegrations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/integrations');
      setIntegrations(response.data.data || []);
    } catch (err) {
      setError('Failed to load integrations');
      console.error('Integration fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (provider) => {
    if (provider.type === 'download') {
      // Handle CSV download
      try {
        const response = await api.get('/entries/export/csv', {
          responseType: 'blob'
        });
        
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `subscribers_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } catch (err) {
        setError('Failed to download CSV');
        console.error('CSV download error:', err);
      }
      return;
    }

    if (!provider.available) {
      return;
    }

    setShowApiForm(provider.id);
    setApiCredentials({ apiKey: '', listId: '', webhookUrl: '' });
  };

  const handleSaveIntegration = async (providerId) => {
    try {
      setConnectingProvider(providerId);
      
      const data = {
        provider: providerId,
        ...apiCredentials
      };

      const response = await api.post('/integrations/verify', data);
      
      if (response.data.success) {
        await fetchIntegrations();
        setShowApiForm(null);
        setApiCredentials({ apiKey: '', listId: '', webhookUrl: '' });
      } else {
        setError(response.data.message || 'Failed to verify integration');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to connect integration');
      console.error('Integration connection error:', err);
    } finally {
      setConnectingProvider(null);
    }
  };

  const getConnectionStatus = (providerId) => {
    const integration = integrations.find(int => int.provider === providerId);
    return integration?.isVerified ? 'connected' : 'not-connected';
  };

  const getColorClasses = (color) => {
    const colors = {
      gray: { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-600' },
      yellow: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-600' },
      green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-600' },
      orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-600' },
      blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600' },
      pink: { bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-600' },
      purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-600' }
    };
    return colors[color] || colors.gray;
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-40 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white shadow-sm rounded-lg">
        <div className="px-6 py-8 border-b border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900">Email Integrations</h2>
          <p className="mt-2 text-gray-600">
            Connect your giveaway campaigns with email marketing services to automatically sync subscribers.
          </p>
          
          {/* Membership Level Info */}
          <div className="mt-4 p-4 rounded-lg border-l-4 border-blue-500 bg-blue-50">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  <strong>Current Plan: {isPro() ? 'Pro' : 'Free'}</strong>
                  {!isPro() && (
                    <span className="ml-2">
                      <Link to="/dashboard/upgrade" className="underline font-medium">
                        Upgrade to Pro
                      </Link> to unlock all email integrations.
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex">
              <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="p-6">
          {/* Free Plan Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Free Plan</h3>
            <div className="grid grid-cols-1 gap-4">
              {freeIntegrations.map((integration) => (
                <IntegrationCard
                  key={integration.id}
                  integration={integration}
                  status={getConnectionStatus(integration.id)}
                  onConnect={() => handleConnect(integration)}
                  connecting={connectingProvider === integration.id}
                  colorClasses={getColorClasses(integration.color)}
                />
              ))}
            </div>
          </div>

          {/* Pro Plan Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Pro Plan</h3>
              {!isPro() && (
                <Link
                  to="/dashboard/upgrade"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Upgrade to Pro
                </Link>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {proIntegrations.map((integration) => (
                <IntegrationCard
                  key={integration.id}
                  integration={integration}
                  status={getConnectionStatus(integration.id)}
                  onConnect={() => handleConnect(integration)}
                  connecting={connectingProvider === integration.id}
                  colorClasses={getColorClasses(integration.color)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* API Credentials Modal */}
      {showApiForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Configure {allIntegrations.find(i => i.id === showApiForm)?.name}
              </h3>
              
              <div className="space-y-4">
                {showApiForm !== 'webhook' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        API Key
                      </label>
                      <input
                        type="password"
                        value={apiCredentials.apiKey}
                        onChange={(e) => setApiCredentials({...apiCredentials, apiKey: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Enter your API key"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        List/Audience ID
                      </label>
                      <input
                        type="text"
                        value={apiCredentials.listId}
                        onChange={(e) => setApiCredentials({...apiCredentials, listId: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Enter list or audience ID"
                      />
                    </div>
                  </>
                )}
                
                {showApiForm === 'webhook' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Webhook URL
                    </label>
                    <input
                      type="url"
                      value={apiCredentials.webhookUrl}
                      onChange={(e) => setApiCredentials({...apiCredentials, webhookUrl: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="https://your-endpoint.com/webhook"
                    />
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowApiForm(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSaveIntegration(showApiForm)}
                  disabled={connectingProvider === showApiForm}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {connectingProvider === showApiForm ? 'Connecting...' : 'Save & Test'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Integration Card Component
const IntegrationCard = ({ integration, status, onConnect, connecting, colorClasses }) => {
  const isConnected = status === 'connected';
  
  return (
    <div className={`border rounded-lg p-6 transition-all duration-200 hover:shadow-md ${
      integration.available ? 'hover:border-blue-300' : 'opacity-60'
    } ${colorClasses.border}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          {integration.logoUrl ? (
            <img 
              src={integration.logoUrl} 
              alt={integration.name} 
              className="h-10 w-10 rounded"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div 
            className={`h-10 w-10 rounded ${colorClasses.bg} flex items-center justify-center text-lg ${
              integration.logoUrl ? 'hidden' : ''
            }`}
          >
            {integration.icon}
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-gray-900">{integration.name}</h3>
            {isConnected && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Connected
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center">
          {!integration.available && (
            <span className="text-xs text-gray-500 mr-2">Pro Only</span>
          )}
          {isConnected ? (
            <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          )}
        </div>
      </div>
      
      <p className="mt-3 text-sm text-gray-600">{integration.description}</p>
      
      <div className="mt-4">
        <button
          onClick={onConnect}
          disabled={!integration.available || connecting}
          className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            integration.available
              ? isConnected
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                : 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          } ${connecting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {connecting ? 'Connecting...' : isConnected ? 'Reconfigure' : `Connect ${integration.name}`}
        </button>
      </div>
    </div>
  );
};

export default EmailIntegrationsPage;