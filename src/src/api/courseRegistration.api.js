import axios from 'axios';
import { getAccessToken as getUserAccessToken } from '../utils/authStorage.js';
import adminClient from './adminClient.js';
import { API_BASE_URL } from './client.js';

const baseURL = API_BASE_URL;

// Create a client for user API calls (uses user auth tokens)
const userApiClient = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    Accept: 'application/json',
  },
});

// Request interceptor - add user auth token
userApiClient.interceptors.request.use(
  (config) => {
    const token = getUserAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Register for a course
 * @param {string} courseId - Course ID
 * @returns {Promise<Object>} Registration data
 */
export async function registerForCourse(courseId) {
  try {
    const response = await userApiClient.post('/course-registrations/register', {
      courseId,
    });

    if (response.data?.success && response.data?.data) {
      return response.data.data;
    }

    throw new Error(response.data?.message || 'Registration failed');
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
}

/**
 * Get user's course registrations
 * @returns {Promise<Array>} Array of registrations
 */
export async function getMyRegistrations() {
  try {
    const response = await userApiClient.get('/course-registrations/my-registrations');
    return response.data?.data || [];
  } catch (error) {
    console.error('Failed to fetch registrations:', error);
    throw error;
  }
}

/**
 * Get user's registration for a specific course
 * @param {string} courseId - Course ID
 * @returns {Promise<Object|null>} Registration object or null if not registered
 */
export async function getUserCourseRegistration(courseId) {
  try {
    const response = await userApiClient.get(`/course-registrations/course/${courseId}`);
    // Check if data exists and is not null
    if (response.data?.success && response.data?.data) {
      return response.data.data;
    }
    // If success but no data, user is not registered
    return null;
  } catch (error) {
    // If 404, user is not registered
    if (error.response?.status === 404) {
      return null;
    }
    // For other errors, throw to be handled by caller
    console.error('Failed to fetch course registration:', error);
    throw error;
  }
}

/**
 * Get all course registrations (admin only)
 * @returns {Promise<Array>} Array of registrations
 */
export async function getAllRegistrations() {
  try {
    const response = await adminClient.get('/admin/course-registrations');
    return response.data?.data || [];
  } catch (error) {
    console.error('Failed to fetch registrations:', error);
    throw error;
  }
}

/**
 * Update registration status (admin only)
 * @param {string} registrationId - Registration ID
 * @param {string} status - New status (pending, paid, rejected)
 * @param {string} notes - Optional notes
 * @returns {Promise<Object>} Updated registration
 */
export async function updateRegistrationStatus(registrationId, status, notes = '') {
  try {
    const response = await adminClient.put(`/admin/course-registrations/${registrationId}/status`, {
      status,
      notes,
    });

    if (response.data?.success && response.data?.data) {
      return response.data.data;
    }

    throw new Error(response.data?.message || 'Failed to update status');
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
}
