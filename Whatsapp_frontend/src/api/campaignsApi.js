import apiClient from './client';

// Get all campaigns
export const getCampaigns = async () => {
  const response = await apiClient.get('/campaigns/');
  return response.data;
};

// Get campaign by ID
export const getCampaign = async (campaignId) => {
  const response = await apiClient.get(`/campaigns/${campaignId}/`);
  return response.data;
};

// Create new campaign
export const createCampaign = async (payload) => {
  const response = await apiClient.post('/campaigns/', payload);
  return response.data;
};

// Update campaign
export const updateCampaign = async (campaignId, payload) => {
  const response = await apiClient.patch(`/campaigns/${campaignId}/`, payload);
  return response.data;
};

// Delete campaign
export const deleteCampaign = async (campaignId) => {
  const response = await apiClient.delete(`/campaigns/${campaignId}/`);
  return response.data;
};

// Get running campaigns
export const getRunningCampaigns = async () => {
  const response = await apiClient.get('/campaigns/running/');
  return response.data;
};

// Launch a campaign
export const launchCampaign = async (campaignId) => {
  const response = await apiClient.post(`/campaigns/${campaignId}/launch/`);
  return response.data;
};

// Complete a campaign
export const completeCampaign = async (campaignId) => {
  const response = await apiClient.post(`/campaigns/${campaignId}/complete/`);
  return response.data;
};
