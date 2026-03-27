import apiClient from './client';

// Get all messages
export const getMessages = async () => {
  const response = await apiClient.get('/messages/');
  return response.data;
};

// Get message by ID
export const getMessage = async (messageId) => {
  const response = await apiClient.get(`/messages/${messageId}/`);
  return response.data;
};

// Create new message
export const createMessage = async (payload) => {
  const response = await apiClient.post('/messages/', payload);
  return response.data;
};

// Update message
export const updateMessage = async (messageId, payload) => {
  const response = await apiClient.patch(`/messages/${messageId}/`, payload);
  return response.data;
};

// Delete message
export const deleteMessage = async (messageId) => {
  const response = await apiClient.delete(`/messages/${messageId}/`);
  return response.data;
};

// Get messages for a specific contact
export const getContactMessages = async (contactId) => {
  const response = await apiClient.get('/messages/contact_messages/', {
    params: { contact_id: contactId }
  });
  return response.data;
};
