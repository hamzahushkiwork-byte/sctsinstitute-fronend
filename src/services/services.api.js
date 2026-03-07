import adminClient from '../api/adminClient.js';

/**
 * Get all services (admin)
 * @returns {Promise<Array>} Array of services
 */
export async function getServices() {
  try {
    const response = await adminClient.get('/admin/services');
    return response.data?.data || [];
  } catch (error) {
    console.error('Failed to fetch services:', error);
    throw error;
  }
}

/**
 * Get service by ID (admin)
 * @param {string} id - Service ID
 * @returns {Promise<Object>} Service object
 */
export async function getServiceById(id) {
  try {
    const response = await adminClient.get(`/admin/services/${id}`);
    return response.data?.data;
  } catch (error) {
    console.error('Failed to fetch service:', error);
    throw error;
  }
}

/**
 * Create a new service
 * @param {FormData} formData - FormData with service fields and image file
 * @returns {Promise<Object>} Created service object
 */
export async function createService(formData) {
  try {
    const response = await adminClient.post('/admin/services', formData);
    return response.data?.data;
  } catch (error) {
    console.error('Failed to create service:', error);
    throw error;
  }
}

/**
 * Update an existing service
 * @param {string} id - Service ID
 * @param {FormData} formData - FormData with service fields and optional image file
 * @returns {Promise<Object>} Updated service object
 */
export async function updateService(id, formData) {
  try {
    const response = await adminClient.put(`/admin/services/${id}`, formData);
    return response.data?.data;
  } catch (error) {
    console.error('Failed to update service:', error);
    throw error;
  }
}

/**
 * Delete a service
 * @param {string} id - Service ID
 * @returns {Promise<void>}
 */
export async function deleteService(id) {
  try {
    await adminClient.delete(`/admin/services/${id}`);
  } catch (error) {
    console.error('Failed to delete service:', error);
    throw error;
  }
}

/**
 * Toggle service active status
 * @param {string} id - Service ID
 * @param {boolean} isActive - New active status
 * @returns {Promise<Object>} Updated service object
 */
export async function toggleServiceActive(id, isActive) {
  try {
    const response = await adminClient.patch(`/admin/services/${id}/active`, { isActive });
    return response.data?.data;
  } catch (error) {
    console.error('Failed to toggle service status:', error);
    throw error;
  }
}

/**
 * Get service by slug (public)
 * @param {string} slug - Service slug
 * @returns {Promise<Object>} Service object
 */
export async function getServiceBySlug(slug) {
  try {
    const apiClient = (await import('../api/client.js')).default;
    const { normalizeService } = await import('../utils/apiDefaults.js');
    const response = await apiClient.get(`/services/${slug}`);
    return normalizeService(response.data?.data || null);
  } catch (error) {
    console.error('Failed to fetch service by slug:', error);
    throw error;
  }
}
