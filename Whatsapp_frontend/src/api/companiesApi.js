import apiClient from './client';

// Get all companies
export const getCompanies = async () => {
  const response = await apiClient.get('/companies/');
  return response.data;
};

// Get company by ID
export const getCompany = async (companyId) => {
  const response = await apiClient.get(`/companies/${companyId}/`);
  return response.data;
};

// Create new company
export const createCompany = async (payload) => {
  const response = await apiClient.post('/companies/', payload);
  return response.data;
};

// Update company
export const updateCompany = async (companyId, payload) => {
  const response = await apiClient.patch(`/companies/${companyId}/`, payload);
  return response.data;
};

// Delete company
export const deleteCompany = async (companyId) => {
  const response = await apiClient.delete(`/companies/${companyId}/`);
  return response.data;
};

// Get companies managed by current user
export const getMyCompanies = async () => {
  const response = await apiClient.get('/companies/my_companies/');
  return response.data;
};

// Get all active companies
export const getActiveCompanies = async () => {
  const response = await apiClient.get('/companies/active/');
  return response.data;
};
