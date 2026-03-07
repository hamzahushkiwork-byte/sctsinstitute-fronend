import apiClient from './client.js';
import { normalizeHeroSlides, normalizePartners, normalizeServices } from '../utils/apiDefaults.js';

/**
 * Fetch hero slides from API
 * @returns {Promise<Array>} Array of hero slides
 */
export async function fetchHeroSlides() {
  try {
    const response = await apiClient.get('/home/hero-slides');
    // Return only the data field from the API envelope, normalized with defaults
    return normalizeHeroSlides(response.data?.data || []);
  } catch (error) {
    console.error('Failed to fetch hero slides:', error.message);
    throw error;
  }
}

/**
 * Fetch services from API
 * @returns {Promise<Array>} Array of services
 */
export async function fetchServices() {
  try {
    const response = await apiClient.get('/services');
    // Return only the data field from the API envelope, normalized with defaults
    return normalizeServices(response.data?.data || []);
  } catch (error) {
    console.error('Failed to fetch services:', error.message);
    throw error;
  }
}

/**
 * Fetch partners from API (public endpoint - active only)
 * @returns {Promise<Array>} Array of active partners
 */
export async function fetchPartners() {
  try {
    const response = await apiClient.get('/partners');
    // Return only the data field from the API envelope, normalized with defaults
    return normalizePartners(response.data?.data || []);
  } catch (error) {
    console.error('Failed to fetch partners:', error.message);
    throw error;
  }
}



