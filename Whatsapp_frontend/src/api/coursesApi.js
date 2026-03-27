import apiClient from './client';

// Get all courses
export const getCourses = async () => {
  const response = await apiClient.get('/courses/');
  return response.data;
};

// Get course by ID
export const getCourse = async (courseId) => {
  const response = await apiClient.get(`/courses/${courseId}/`);
  return response.data;
};

// Create new course
export const createCourse = async (payload) => {
  const response = await apiClient.post('/courses/', payload);
  return response.data;
};

// Update course
export const updateCourse = async (courseId, payload) => {
  const response = await apiClient.patch(`/courses/${courseId}/`, payload);
  return response.data;
};

// Delete course
export const deleteCourse = async (courseId) => {
  const response = await apiClient.delete(`/courses/${courseId}/`);
  return response.data;
};
