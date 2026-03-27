import apiClient from './client';

// Get all templates
export const getTemplates = async () => {
  const response = await apiClient.get('/templates/');
  return response.data;
};

// Get template by ID
export const getTemplate = async (templateId) => {
  const response = await apiClient.get(`/templates/${templateId}/`);
  return response.data;
};

// Create new template
export const createTemplate = async (payload) => {
  const response = await apiClient.post('/templates/', payload);
  return response.data;
};

// Update template
export const updateTemplate = async (templateId, payload) => {
  const response = await apiClient.patch(`/templates/${templateId}/`, payload);
  return response.data;
};

// Delete template
export const deleteTemplate = async (templateId) => {
  const response = await apiClient.delete(`/templates/${templateId}/`);
  return response.data;
};

// Get approved templates only
export const getApprovedTemplates = async () => {
  const response = await apiClient.get('/templates/approved/');
  return response.data;
};
