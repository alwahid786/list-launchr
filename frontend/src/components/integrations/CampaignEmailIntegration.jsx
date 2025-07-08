import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../api';
import { LoadingSpinner } from '../ui';

const CampaignEmailIntegration = ({ 
  initialValues = {}, 
  onSave,
  campaignId,
  className = ''
}) => {
  const [connectedServices, setConnectedServices] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(initialValues.provider || 'none');
  const [selectedListId, setSelectedListId] = useState(initialValues.listId || '');
  const [availableLists, setAvailableLists] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [loadingLists, setLoadingLists] = useState(false);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  
  useEffect(() => {
    fetchConnectedServices();
  }, []);

  useEffect(() => {
    if (selectedProvider !== 'none' && selectedProvider) {
      fetchProviderLists(selectedProvider);
    } else {
      setAvailableLists([]);
      setSelectedListId('');
    }
  }, [selectedProvider]);

  const fetchConnectedServices = async () => {
    try {
      setLoading(true);
      const response = await api.get('/email-services');
      setConnectedServices(response.data.data || []);
    } catch (err) {
      console.error('Failed to load connected services:', err);
      toast.error('Failed to load connected email services');
    } finally {
      setLoading(false);
    }
  };

  const fetchProviderLists = async (provider) => {
    try {
      setLoadingLists(true);
      const response = await api.get(`/email-services/${provider}/lists`);
      setAvailableLists(response.data.data.lists || []);
    } catch (err) {
      console.error('Failed to load lists:', err);
      toast.error(`Failed to load ${provider} lists`);
      setAvailableLists([]);
    } finally {
      setLoadingLists(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    
    try {
      const integrationData = {
        provider: selectedProvider,
        listId: selectedListId
      };

      if (campaignId) {
        await api.put(`/integrations/campaign/${campaignId}`, integrationData);
      }
      
      if (onSave) {
        onSave(integrationData);
      }
      
      toast.success('Campaign email integration saved successfully!');
    } catch (err) {
      console.error('Save integration error:', err);
      toast.error(err.response?.data?.message || 'Failed to save integration settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSyncEntries = async () => {
    if (!campaignId) {
      toast.error('Campaign ID is required to sync entries');
      return;
    }
    
    setSyncing(true);
    
    try {
      const response = await api.post(`/integrations/sync/${campaignId}`);
      
      const { total, success, failed } = response.data.data;
      toast.success(`Synced ${success} of ${total} entries (${failed} failed)`);
    } catch (err) {
      console.error('Sync entries error:', err);
      toast.error(err.response?.data?.message || 'Failed to sync entries');
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center py-8 ${className}`}>
        <LoadingSpinner size="md" />
        <span className="ml-2 text-gray-600">Loading email services...</span>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Email Integration
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>Select an email service to automatically sync campaign subscribers to your email lists.</p>
            </div>
          </div>
        </div>
      </div>

      {connectedServices.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                No Email Services Connected
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>To use email campaigns, please connect at least one email service in the Email Services tab.</p>
                <div className="mt-3">
                  <a
                    href="/dashboard/integrations/email"
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-yellow-800 bg-yellow-100 hover:bg-yellow-200"
                  >
                    Connect Email Service
                    <svg className="ml-2 -mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Service Selection */}
          <div>
            <label htmlFor="email-service" className="block text-sm font-medium text-gray-700 mb-1">
              Email Service
            </label>
            <select
              id="email-service"
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="none">None (Store emails only)</option>
              {connectedServices.map((service) => (
                <option key={service.provider} value={service.provider}>
                  {service.provider.charAt(0).toUpperCase() + service.provider.slice(1)} 
                  {service.accountInfo?.account && ` - ${service.accountInfo.account}`}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500">
              Only connected email services are shown. To add more services, visit the Email Services tab.
            </p>
          </div>

          {/* List/Audience Selection */}
          {selectedProvider !== 'none' && (
            <div>
              <label htmlFor="email-list" className="block text-sm font-medium text-gray-700 mb-1">
                {selectedProvider === 'mailchimp' ? 'Audience' : 
                 selectedProvider === 'mailerlite' ? 'Group' : 
                 selectedProvider === 'sendgrid' ? 'List' : 'List'} 
                <span className="text-red-500">*</span>
              </label>
              
              {loadingLists ? (
                <div className="flex items-center py-2">
                  <LoadingSpinner size="sm" />
                  <span className="ml-2 text-gray-600">Loading {selectedProvider} lists...</span>
                </div>
              ) : (
                <select
                  id="email-list"
                  value={selectedListId}
                  onChange={(e) => setSelectedListId(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                >
                  <option value="">Select a {selectedProvider === 'mailchimp' ? 'audience' : 'list'}</option>
                  {availableLists.map((list) => (
                    <option key={list.id} value={list.id}>
                      {list.name} {list.memberCount !== undefined ? `(${list.memberCount} members)` : 
                                  list.contactCount !== undefined ? `(${list.contactCount} contacts)` :
                                  list.subscriberCount !== undefined ? `(${list.subscriberCount} subscribers)` : ''}
                    </option>
                  ))}
                </select>
              )}
              
              {availableLists.length === 0 && !loadingLists && selectedProvider !== 'none' && (
                <p className="mt-1 text-sm text-yellow-600">
                  No {selectedProvider === 'mailchimp' ? 'audiences' : 'lists'} found for this {selectedProvider} account.
                </p>
              )}
            </div>
          )}

          {/* Connection Status */}
          {selectedProvider !== 'none' && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">
                    {selectedProvider.charAt(0).toUpperCase() + selectedProvider.slice(1)} Connected
                  </h3>
                  <div className="mt-1 text-sm text-green-700">
                    <p>New campaign subscribers will be automatically synced to your selected {selectedProvider === 'mailchimp' ? 'audience' : 'list'}.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || (selectedProvider !== 'none' && !selectedListId)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <LoadingSpinner size="sm" color="white" className="mr-2" /> 
                  Saving...
                </>
              ) : (
                'Save Integration'
              )}
            </button>
            
            {campaignId && selectedProvider !== 'none' && selectedListId && (
              <button
                type="button"
                onClick={handleSyncEntries}
                disabled={syncing}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {syncing ? (
                  <>
                    <LoadingSpinner size="sm" color="white" className="mr-2" /> 
                    Syncing...
                  </>
                ) : (
                  'Sync Existing Entries'
                )}
              </button>
            )}
          </div>

          {/* Help Text */}
          <div className="bg-gray-50 rounded-md p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">How it works:</h4>
            <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
              <li>New campaign entries will be automatically synced to your selected email list</li>
              <li>Use "Sync Existing Entries" to sync entries that were created before setting up this integration</li>
              <li>You can change the selected list anytime - it only affects future entries</li>
              <li>Entry sync happens in real-time when people join your campaign</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignEmailIntegration;