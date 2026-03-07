import apiClient from './client.js';

/**
 * Get list of active courses (public)
 * @returns {Promise<Array>} Array of courses
 */
export async function getCoursesList() {
  try {
    const response = await apiClient.get('/courses');
    return response.data?.data || [];
  } catch (error) {
    console.error('[getCoursesList] Error:', error);
    throw error;
  }
}

/**
 * Get a single course by slug (public)
 * @param {string} slug - The slug of the course
 * @returns {Promise<Object>} Course object
 */
export async function getCourseBySlug(slug) {
  try {
    const response = await apiClient.get(`/courses/${slug}`);
    return response.data?.data || null;
  } catch (error) {
    console.error('[getCourseBySlug] Error:', error);
    throw error;
  }
}
