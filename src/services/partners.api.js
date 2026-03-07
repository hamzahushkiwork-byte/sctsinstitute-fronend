import adminClient from '../api/adminClient.js';

/**
 * Get all partners (admin)
 * @param {Object} options - Query options
 * @param {boolean} options.activeOnly - Filter by active status
 * @returns {Promise<Array>} Array of partners
 */
export async function getPartners(options = {}) {
  try {
    const params = {};
    if (options.activeOnly) {
      params.activeOnly = 'true';
    }
    
    const response = await adminClient.get('/admin/partners', { params });
    return response.data?.data || [];
  } catch (error) {
    console.error('Failed to fetch partners:', error);
    throw error;
  }
}

/**
 * Get partner by ID (admin)
 * @param {string} id - Partner ID
 * @returns {Promise<Object>} Partner object
 */
export async function getPartnerById(id) {
  try {
    const response = await adminClient.get(`/admin/partners/${id}`);
    return response.data?.data;
  } catch (error) {
    console.error('Failed to fetch partner:', error);
    throw error;
  }
}

/**
 * Create a new partner
 * @param {FormData} formData - FormData with partner fields and logo file
 * @returns {Promise<Object>} Created partner object
 */
export async function createPartner(formData) {
  try {
    const response = await adminClient.post('/admin/partners', formData, {
      // DO NOT set Content-Type - let axios/browser set it with boundary for multipart
    });
    return response.data?.data;
  } catch (error) {
    console.error('Failed to create partner:', error);
    throw error;
  }
}

/**
 * Update an existing partner
 * @param {string} id - Partner ID
 * @param {FormData} formData - FormData with partner fields and optional logo file
 * @returns {Promise<Object>} Updated partner object
 */
export async function updatePartner(id, formData) {
  try {
    const response = await adminClient.put(`/admin/partners/${id}`, formData);
    return response.data?.data;
  } catch (error) {
    console.error('Failed to update partner:', error);
    throw error;
  }
}

/**
 * Delete a partner
 * @param {string} id - Partner ID
 * @returns {Promise<void>}
 */
export async function deletePartner(id) {
  try {
    await adminClient.delete(`/admin/partners/${id}`);
  } catch (error) {
    console.error('Failed to delete partner:', error);
    throw error;
  }
}
