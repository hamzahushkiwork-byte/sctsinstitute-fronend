import adminClient from '../adminClient.js';

/**
 * Get all certification services (admin)
 */
export async function listAdminCertification() {
  try {
    const response = await adminClient.get('/admin/certification');
    return response.data?.data || [];
  } catch (error) {
    console.error('[listAdminCertification] Error:', error);
    throw error;
  }
}

/**
 * Get certification service by ID (admin)
 */
export async function getAdminCertificationById(id) {
  try {
    const response = await adminClient.get(`/admin/certification/${id}`);
    return response.data?.data || null;
  } catch (error) {
    console.error('[getAdminCertificationById] Error:', error);
    throw error;
  }
}

/**
 * Create a new certification service (admin)
 * @param {FormData} formData - FormData with fields: title, slug (optional), heroSubtitle, shortDescription, description, sortOrder, isActive, cardImage, heroImage, innerImage
 */
export async function createAdminCertification(formData) {
  try {
    const response = await adminClient.post('/admin/certification', formData);
    return response.data?.data || null;
  } catch (error) {
    console.error('[createAdminCertification] Error:', error);
    throw error;
  }
}

/**
 * Update an existing certification service (admin)
 * @param {string} id - Certification service ID
 * @param {FormData} formData - FormData with fields to update
 */
export async function updateAdminCertification(id, formData) {
  try {
    const response = await adminClient.put(`/admin/certification/${id}`, formData);
    return response.data?.data || null;
  } catch (error) {
    console.error('[updateAdminCertification] Error:', error);
    throw error;
  }
}

/**
 * Delete a certification service (admin)
 * @param {string} id - Certification service ID
 */
export async function deleteAdminCertification(id) {
  try {
    const response = await adminClient.delete(`/admin/certification/${id}`);
    return response.data || null;
  } catch (error) {
    console.error('[deleteAdminCertification] Error:', error);
    throw error;
  }
}

/**
 * Toggle certification service active status (admin)
 * @param {string} id - Certification service ID
 * @param {boolean} isActive - New active status
 */
export async function toggleAdminCertificationActive(id, isActive) {
  try {
    const response = await adminClient.patch(`/admin/certification/${id}/active`, { isActive });
    return response.data?.data || null;
  } catch (error) {
    console.error('[toggleAdminCertificationActive] Error:', error);
    throw error;
  }
}
