import apiClient from './client';

export const getMyProfile = async () => {
  const response = await apiClient.get('/users/me/');
  return response.data;
};

export const getUserProfile = async (userId) => {
  const response = await apiClient.get(`/users/${userId}/profile/`);
  return response.data;
};

export const updateThemePreference = async (themePreference) => {
  const response = await apiClient.patch('/users/theme/', {
    theme_preference: themePreference,
  });
  return response.data;
};
