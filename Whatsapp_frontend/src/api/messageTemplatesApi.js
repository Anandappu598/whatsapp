import apiClient from './client';

// Get all message templates
export const getMessageTemplates = async () => {
  const response = await apiClient.get('/message-templates/');
  return response.data;
};

// Get message template by ID
export const getMessageTemplate = async (templateId) => {
  const response = await apiClient.get(`/message-templates/${templateId}/`);
  return response.data;
};

// Create new message template
export const createMessageTemplate = async (payload) => {
  const response = await apiClient.post('/message-templates/', payload);
  return response.data;
};

// Update message template
export const updateMessageTemplate = async (templateId, payload) => {
  const response = await apiClient.patch(`/message-templates/${templateId}/`, payload);
  return response.data;
};

// Delete message template
export const deleteMessageTemplate = async (templateId) => {
  const response = await apiClient.delete(`/message-templates/${templateId}/`);
  return response.data;
};
