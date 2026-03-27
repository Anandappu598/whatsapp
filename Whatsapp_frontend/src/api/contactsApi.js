import apiClient from './client';

// Get all contacts
export const getContacts = async () => {
  const response = await apiClient.get('/contacts/');
  return response.data;
};

// Get contact by ID
export const getContact = async (contactId) => {
  const response = await apiClient.get(`/contacts/${contactId}/`);
  return response.data;
};

// Create new contact
export const createContact = async (payload) => {
  const response = await apiClient.post('/contacts/', payload);
  return response.data;
};

// Update contact
export const updateContact = async (contactId, payload) => {
  const response = await apiClient.patch(`/contacts/${contactId}/`, payload);
  return response.data;
};

// Delete contact
export const deleteContact = async (contactId) => {
  const response = await apiClient.delete(`/contacts/${contactId}/`);
  return response.data;
};

// Get B2B contacts
export const getB2BContacts = async () => {
  const response = await apiClient.get('/contacts/b2b/');
  return response.data;
};

// Get B2C contacts
export const getB2CContacts = async () => {
  const response = await apiClient.get('/contacts/b2c/');
  return response.data;
};
