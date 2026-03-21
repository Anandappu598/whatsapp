import apiClient from './client';

export const login = async (payload) => {
  const response = await apiClient.post('/auth/login/', payload);
  return response.data;
};

export const signup = async (payload) => {
  const response = await apiClient.post('/auth/signup/', payload);
  return response.data;
};

export const verifySignupOtp = async (payload) => {
  const response = await apiClient.post('/auth/signup/verify/', payload);
  return response.data;
};

export const forgotPassword = async (payload) => {
  const response = await apiClient.post('/auth/forgot-password/', payload);
  return response.data;
};

export const resetPassword = async (payload) => {
  const response = await apiClient.post('/auth/reset-password/', payload);
  return response.data;
};

export const logout = async (payload) => {
  const response = await apiClient.post('/auth/logout/', payload);
  return response.data;
};
