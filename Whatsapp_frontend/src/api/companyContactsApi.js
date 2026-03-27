import apiClient from './client';

// Get all company contacts
export const getCompanyContacts = async () => {
  const response = await apiClient.get('/company-contacts/');
  return response.data;
};

// Get company contact by ID
export const getCompanyContact = async (contactId) => {
  const response = await apiClient.get(`/company-contacts/${contactId}/`);
  return response.data;
};

// Create new company contact
export const createCompanyContact = async (payload) => {
  const response = await apiClient.post('/company-contacts/', payload);
  return response.data;
};

// Update company contact
export const updateCompanyContact = async (contactId, payload) => {
  const response = await apiClient.patch(`/company-contacts/${contactId}/`, payload);
  return response.data;
};

// Delete company contact
export const deleteCompanyContact = async (contactId) => {
  const response = await apiClient.delete(`/company-contacts/${contactId}/`);
  return response.data;
};
