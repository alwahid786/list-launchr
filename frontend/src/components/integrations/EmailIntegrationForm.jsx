import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { integrationAPI } from '../../api';
import { LoadingSpinner } from '../ui';

const EmailIntegrationForm = ({ 
  initialValues = {}, 
  onSave,
  campaignId,
  className = ''
}) => {
  const [provider, setProvider] = useState(initialValues.provider || 'none');
  const [apiKey, setApiKey] = useState(initialValues.apiKey || '');
  const [listId, setListId] = useState(initialValues.listId || '');
  const [formId, setFormId] = useState(initialValues.formId || '');
  const [tagId, setTagId] = useState(initialValues.tagId || '');
  const [webhookUrl, setWebhookUrl] = useState(initialValues.webhookUrl || '');
  const [secretKey, setSecretKey] = useState(initialValues.secretKey || '');
  const [testEmail, setTestEmail] = useState('');
  
  const [isVerifying, setIsVerifying] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  
  const [verificationResult, setVerificationResult] = useState(null);
  
  const handleVerify = async () => {
    setIsVerifying(true);
    setVerificationResult(null);
    
    try {
      const data = {
        provider,
        apiKey,
        listId,
        formId,
        tagId,
        webhookUrl,
        secretKey
      };
      
      const response = await integrationAPI.verifyIntegration(data);
      
      setVerificationResult({
        success: true,
        message: response.data.message,
        data: response.data.data
      });
      
      toast.success('Integration verified successfully!');
    } catch (err) {
      console.error('Integration verification error:', err);
      
      setVerificationResult({
        success: false,
        message: err.response?.data?.message || 'Failed to verify integration'
      });
      
      toast.error(err.response?.data?.message || 'Failed to verify integration');
    } finally {
      setIsVerifying(false);
    }
  };
  
  const handleTestSend = async () => {
    if (!testEmail) {
      toast.error('Please enter a test email address');
      return;
    }
    
    setIsTesting(true);
    
    try {
      const data = {
        provider,
        apiKey,
        listId,
        formId,
        tagId,
        webhookUrl,
        secretKey,
        email: testEmail,
        name: 'Test User'
      };
      
      await integrationAPI.testSend(data);
      toast.success('Test email sent successfully!');
    } catch (err) {
      console.error('Test send error:', err);
      toast.error(err.response?.data?.message || 'Failed to send test email');
    } finally {
      setIsTesting(false);
    }
  };
  
  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      const data = {
        provider,
        apiKey,
        listId,
        formId,
        tagId,
        webhookUrl,
        secretKey
      };
      
      if (campaignId) {
        await integrationAPI.updateCampaignIntegration(campaignId, data);
      }
      
      if (onSave) {
        onSave(data);
      }
      
      toast.success('Integration settings saved!');
    } catch (err) {
      console.error('Save integration error:', err);
      toast.error(err.response?.data?.message || 'Failed to save integration settings');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleSyncEntries = async () => {
    if (!campaignId) {
      toast.error('Campaign ID is required to sync entries');
      return;
    }
    
    setIsSyncing(true);
    
    try {
      const response = await integrationAPI.syncEntries(campaignId);
      
      const { total, success, failed } = response.data.data;
      toast.success(`Synced ${success} of ${total} entries (${failed} failed)`);
    } catch (err) {
      console.error('Sync entries error:', err);
      toast.error(err.response?.data?.message || 'Failed to sync entries');
    } finally {
      setIsSyncing(false);
    }
  };
  
  return (
    <div className={`space-y-6 ${className}`}>
      <div>
        <label htmlFor="provider" className="block text-sm font-medium text-gray-700 mb-1">
          Email Service Provider
        </label>
        <select
          id="provider"
          value={provider}
          onChange={(e) => setProvider(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="none">None (Emails stored in database only)</option>
          <option value="mailchimp">Mailchimp</option>
          <option value="convertkit">ConvertKit</option>
          <option value="mailerlite">MailerLite</option>
          <option value="webhook">Custom Webhook</option>
        </select>
      </div>
      
      {provider !== 'none' && (
        <div className="space-y-6">
          {/* Mailchimp Fields */}
          {provider === 'mailchimp' && (
            <>
              <div>
                <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
                  Mailchimp API Key <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="apiKey"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Enter your API key (e.g., abc123def456-us1)"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  Format: xxxx-us1 (includes data center at the end)
                </p>
              </div>
              
              <div>
                <label htmlFor="listId" className="block text-sm font-medium text-gray-700 mb-1">
                  List/Audience ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="listId"
                  value={listId}
                  onChange={(e) => setListId(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Enter your list ID (e.g., abc123def456)"
                  required
                />
              </div>
            </>
          )}
          
          {/* ConvertKit Fields */}
          {provider === 'convertkit' && (
            <>
              <div>
                <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
                  ConvertKit API Key <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="apiKey"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Enter your API key"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="formId" className="block text-sm font-medium text-gray-700 mb-1">
                  Form ID
                </label>
                <input
                  type="text"
                  id="formId"
                  value={formId}
                  onChange={(e) => setFormId(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Enter your form ID (optional)"
                />
              </div>
              
              <div>
                <label htmlFor="tagId" className="block text-sm font-medium text-gray-700 mb-1">
                  Tag ID
                </label>
                <input
                  type="text"
                  id="tagId"
                  value={tagId}
                  onChange={(e) => setTagId(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Enter your tag ID (optional)"
                />
              </div>
            </>
          )}
          
          {/* MailerLite Fields */}
          {provider === 'mailerlite' && (
            <>
              <div>
                <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
                  MailerLite API Key <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="apiKey"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Enter your API key"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="groupId" className="block text-sm font-medium text-gray-700 mb-1">
                  Group ID
                </label>
                <input
                  type="text"
                  id="groupId"
                  value={listId}
                  onChange={(e) => setListId(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Enter your group ID (optional)"
                />
              </div>
            </>
          )}
          
          {/* Webhook Fields */}
          {provider === 'webhook' && (
            <>
              <div>
                <label htmlFor="webhookUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  Webhook URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  id="webhookUrl"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="https://your-webhook-url.com/endpoint"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="secretKey" className="block text-sm font-medium text-gray-700 mb-1">
                  Secret Key
                </label>
                <input
                  type="text"
                  id="secretKey"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Enter a secret key (optional for authentication)"
                />
              </div>
            </>
          )}
          
          {/* Verification Result */}
          {verificationResult && (
            <div className={`p-4 rounded-md ${verificationResult.success ? 'bg-green-50' : 'bg-red-50'}`}>
              <div className="flex">
                <div className="flex-shrink-0">
                  {verificationResult.success ? (
                    <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="ml-3">
                  <h3 className={`text-sm font-medium ${verificationResult.success ? 'text-green-800' : 'text-red-800'}`}>
                    {verificationResult.message}
                  </h3>
                  {verificationResult.success && verificationResult.data && (
                    <div className="mt-2 text-sm text-green-700">
                      {provider === 'mailchimp' && (
                        <ul className="list-disc pl-5 space-y-1">
                          <li>List Name: {verificationResult.data.listName}</li>
                          <li>Members: {verificationResult.data.memberCount}</li>
                        </ul>
                      )}
                      {provider === 'convertkit' && (
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Account: {verificationResult.data.name}</li>
                          <li>Plan: {verificationResult.data.plan}</li>
                        </ul>
                      )}
                      {provider === 'mailerlite' && (
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Account: {verificationResult.data.account?.company || 'Unknown'}</li>
                          <li>Plan: {verificationResult.data.planName}</li>
                          <li>Subscribers: {verificationResult.data.subscriberCount}</li>
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleVerify}
              disabled={isVerifying || provider === 'none' || (
                provider !== 'webhook' && !apiKey
              ) || (
                provider === 'webhook' && !webhookUrl
              )}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isVerifying ? (
                <>
                  <LoadingSpinner size="sm" color="white" className="mr-2" /> 
                  Verifying...
                </>
              ) : (
                'Verify Connection'
              )}
            </button>
            
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || provider === 'none' || (
                provider !== 'webhook' && !apiKey
              ) || (
                provider === 'webhook' && !webhookUrl
              )}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <LoadingSpinner size="sm" color="white" className="mr-2" /> 
                  Saving...
                </>
              ) : (
                'Save Settings'
              )}
            </button>
            
            {campaignId && (
              <button
                type="button"
                onClick={handleSyncEntries}
                disabled={isSyncing || provider === 'none' || (
                  provider !== 'webhook' && !apiKey
                ) || (
                  provider === 'webhook' && !webhookUrl
                )}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSyncing ? (
                  <>
                    <LoadingSpinner size="sm" color="white" className="mr-2" /> 
                    Syncing...
                  </>
                ) : (
                  'Sync Entries'
                )}
              </button>
            )}
          </div>
          
          {/* Test Send */}
          <div className="mt-6 p-4 bg-gray-50 rounded-md">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Test Integration</h3>
            <div className="flex gap-2">
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="Enter email for test"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
              <button
                type="button"
                onClick={handleTestSend}
                disabled={isTesting || !testEmail || provider === 'none' || (
                  provider !== 'webhook' && !apiKey
                ) || (
                  provider === 'webhook' && !webhookUrl
                )}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isTesting ? (
                  <>
                    <LoadingSpinner size="sm" color="white" className="mr-2" /> 
                    Sending...
                  </>
                ) : (
                  'Send Test'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailIntegrationForm;