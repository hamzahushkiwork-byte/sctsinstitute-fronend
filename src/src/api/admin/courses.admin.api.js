import adminClient from '../adminClient.js';

/**
 * Get all courses (admin)
 * @param {object} params - Query params: status (available | coming-soon | all)
 */
export async function listAdminCourses(params = {}) {
  try {
    const response = await adminClient.get('/admin/courses', { params });
    return response.data?.data || [];
  } catch (error) {
    console.error('[listAdminCourses] Error:', error);
    throw error;
  }
}

/**
 * Get course by ID (admin)
 */
export async function getAdminCourseById(id) {
  try {
    const response = await adminClient.get(`/admin/courses/${id}`);
    return response.data?.data || null;
  } catch (error) {
    console.error('[getAdminCourseById] Error:', error);
    throw error;
  }
}

/**
 * Create a new course (admin)
 * @param {FormData} formData - FormData with fields: title, slug (optional), cardBody, description, sortOrder, isActive, isAvailable, image
 */
export async function createAdminCourse(formData) {
  try {
    const response = await adminClient.post('/admin/courses', formData);
    return response.data?.data || null;
  } catch (error) {
    console.error('[createAdminCourse] Error:', error);
    throw error;
  }
}

/**
 * Update an existing course (admin)
 * @param {string} id - Course ID
 * @param {FormData} formData - FormData with fields to update
 */
export async function updateAdminCourse(id, formData) {
  try {
    const response = await adminClient.put(`/admin/courses/${id}`, formData);
    return response.data?.data || null;
  } catch (error) {
    console.error('[updateAdminCourse] Error:', error);
    throw error;
  }
}

/**
 * Delete a course (admin)
 * @param {string} id - Course ID
 */
export async function deleteAdminCourse(id) {
  try {
    const response = await adminClient.delete(`/admin/courses/${id}`);
    return response.data || null;
  } catch (error) {
    console.error('[deleteAdminCourse] Error:', error);
    throw error;
  }
}

/**
 * Toggle course availability (admin)
 * @param {string} id - Course ID
 */
export async function toggleCourseAvailability(id) {
  try {
    const response = await adminClient.patch(`/admin/courses/${id}/toggle-availability`);
    return response.data?.data || null;
  } catch (error) {
    console.error('[toggleCourseAvailability] Error:', error);
    throw error;
  }
}
