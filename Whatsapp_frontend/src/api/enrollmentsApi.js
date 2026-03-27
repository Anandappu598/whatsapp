import apiClient from './client';

// Get all enrollments
export const getEnrollments = async () => {
  const response = await apiClient.get('/enrollments/');
  return response.data;
};

// Get enrollment by ID
export const getEnrollment = async (enrollmentId) => {
  const response = await apiClient.get(`/enrollments/${enrollmentId}/`);
  return response.data;
};

// Create new enrollment
export const createEnrollment = async (payload) => {
  const response = await apiClient.post('/enrollments/', payload);
  return response.data;
};

// Update enrollment
export const updateEnrollment = async (enrollmentId, payload) => {
  const response = await apiClient.patch(`/enrollments/${enrollmentId}/`, payload);
  return response.data;
};

// Delete enrollment
export const deleteEnrollment = async (enrollmentId) => {
  const response = await apiClient.delete(`/enrollments/${enrollmentId}/`);
  return response.data;
};

// Get all students enrolled in a course
export const getCourseStudents = async (courseId) => {
  const response = await apiClient.get('/enrollments/course_students/', {
    params: { course_id: courseId }
  });
  return response.data;
};
