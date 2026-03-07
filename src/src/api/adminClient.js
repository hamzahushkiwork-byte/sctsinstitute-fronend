import axios from 'axios';
import { getAccessToken, clearTokens } from '../utils/authStorage.js';
import { API_BASE_URL } from './client.js';

const baseURL = API_BASE_URL;

const adminClient = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token and handle FormData
adminClient.interceptors.request.use(
  (config) => {
    // Don't add token for login endpoint
    if (!config.url?.includes('/auth/login')) {
      const token = getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // CRITICAL: If FormData is being sent, remove Content-Type header to let browser set it with boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
      delete config.headers['content-type'];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle 401
adminClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      clearTokens();
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export default adminClient;

