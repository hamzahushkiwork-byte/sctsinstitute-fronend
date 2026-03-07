import apiClient from './client.js';
import { normalizeCertification, normalizeCertifications } from '../utils/apiDefaults.js';

/**
 * Get list of active certification services (public)
 * @returns {Promise<Array>} Array of certification services
 */
export async function getCertificationList() {
  try {
    const response = await apiClient.get('/certification');
    return normalizeCertifications(response.data?.data || []);
  } catch (error) {
    console.error('[getCertificationList] Error:', error);
    throw error;
  }
}

/**
 * Get a single certification service by slug (public)
 * @param {string} slug - The slug of the certification service
 * @returns {Promise<Object>} Certification service object
 */
export async function getCertificationBySlug(slug) {
  try {
    const response = await apiClient.get(`/certification/${slug}`);
    return normalizeCertification(response.data?.data || null);
  } catch (error) {
    console.error('[getCertificationBySlug] Error:', error);
    throw error;
  }
}
