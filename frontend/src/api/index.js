import axios from 'axios';

// Create an axios instance with base URL
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to attach token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 (Unauthorized) errors - clear token and redirect to login
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API endpoints
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (email, password) => api.post('/auth/login', { email, password }),
  googleAuth: (tokenId) => api.post('/auth/google', { tokenId }),
  getMe: () => api.get('/auth/me'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.put(`/auth/reset-password/${token}`, { password }),
  verifyEmail: (token) => api.get(`/auth/verify-email/${token}`),
  updateDetails: (userData) => api.put('/auth/updatedetails', userData),
  updatePassword: (passwordData) => api.put('/auth/updatepassword', passwordData),
  logout: () => api.get('/auth/logout'),
};

// Campaign API endpoints
export const campaignAPI = {
  getCampaigns: () => api.get('/campaigns'),
  getCampaign: (id) => api.get(`/campaigns/${id}`),
  getPublicCampaign: (slug) => axios.get(`${api.defaults.baseURL}/campaigns/public/${slug}`),
  createCampaign: (campaignData) => api.post('/campaigns', campaignData),
  updateCampaign: (id, campaignData) => api.put(`/campaigns/${id}`, campaignData),
  updateCampaignStatus: (id, status) => api.put(`/campaigns/${id}/status`, { status }),
  deleteCampaign: (id) => api.delete(`/campaigns/${id}`),
  duplicateCampaign: (id) => api.post(`/campaigns/${id}/duplicate`),
  selectWinners: (id) => api.post(`/campaigns/${id}/select-winners`),
};

// Entries API endpoints
export const entriesAPI = {
  getEntries: (campaignId) => api.get(`/entries/${campaignId}`),
  createEntry: (entryData) => api.post('/entries', entryData),
  createPublicEntry: (entryData) => axios.post(`${api.defaults.baseURL}/entries`, entryData),
  submitEntryAction: (entryId, referralCode, actionData) => 
    axios.post(`${api.defaults.baseURL}/entries/${entryId}/actions`, actionData, {
      headers: { 'X-Referral-Code': referralCode }
    }),
  exportEntries: (campaignId) => api.get(`/entries/${campaignId}/export`),
};

// Analytics API endpoints
export const analyticsAPI = {
  getCampaignStats: (campaignId) => api.get(`/analytics/campaign/${campaignId}`),
  getDashboardStats: () => api.get('/analytics/dashboard'),
};

// Upload API endpoints
export const uploadAPI = {
  uploadFile: (file, onUploadProgress = null) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    };
    
    // Add progress tracking if callback provided
    if (onUploadProgress && typeof onUploadProgress === 'function') {
      config.onUploadProgress = onUploadProgress;
    }
    
    return api.post('/uploads', formData, config);
  },
};

// Integration API endpoints
export const integrationAPI = {
  verifyIntegration: (data) => api.post('/integrations/verify', data),
  updateCampaignIntegration: (campaignId, data) => api.put(`/integrations/campaign/${campaignId}`, data),
  testSend: (data) => api.post('/integrations/test-send', data),
  syncEntries: (campaignId) => api.post(`/integrations/sync/${campaignId}`),
};

// Stripe API endpoints
export const stripeAPI = {
  createCheckoutSession: () => api.post('/stripe/create-checkout-session'),
  createPortalSession: () => api.post('/stripe/create-portal-session'),
  getSubscriptionStatus: () => api.get('/stripe/subscription-status'),
  verifySession: (sessionId) => api.get(`/stripe/verify-session/${sessionId}`),
};

export default api;