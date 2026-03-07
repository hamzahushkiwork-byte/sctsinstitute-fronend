import axios from 'axios';
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from '../admin/authStorage.js';
import { API_BASE_URL } from '../config/api.js';

const baseURL = API_BASE_URL;

const apiClient = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    Accept: 'application/json',
  },
  withCredentials: true,
});

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor with token refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => {
    // If response has success:false, throw error
    if (response.data && response.data.success === false) {
      const message = response.data.message || 'API request failed';
      throw new Error(message);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 errors for admin routes
    if (error.response?.status === 401 && originalRequest.url?.includes('/admin')) {
      if (isRefreshing) {
        // Queue the request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      isRefreshing = true;
      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        clearTokens();
        window.location.href = '/admin/login';
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(`${baseURL}/auth/refresh`, {
          refreshToken,
        });

        if (response.data?.success && response.data?.data?.accessToken) {
          const newAccessToken = response.data.data.accessToken;
          setTokens({ accessToken: newAccessToken });
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          processQueue(null, newAccessToken);
          isRefreshing = false;
          return apiClient(originalRequest);
        } else {
          throw new Error('Failed to refresh token');
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearTokens();
        window.location.href = '/admin/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle other errors
    if (error.response) {
      const message = error.response.data?.message || error.message || 'Request failed';
      throw new Error(message);
    } else if (error.request) {
      throw new Error('Network error: No response from server');
    } else {
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }
);

export default apiClient;
