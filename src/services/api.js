import axios from 'axios';

const api = axios.create({
  baseURL: 'https://backend-iao4.onrender.com/api',
});

// This is an interceptor. It runs before every request.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // Debug: show outgoing request details
    console.log(`[API] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    if (config.params) {
      console.log('[API] Request params:', config.params);
    }
    if (config.data) {
      console.log('[API] Request data:', config.data);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to debug responses and errors
api.interceptors.response.use(
  (response) => {
    console.log(`[API] Response ${response.status} for ${response.config.url}`);
    console.log('[API] Response data:', response.data);
    return response;
  },
  (error) => {
    const cfg = error?.config || {};
    console.error(`[API] Error ${error.response?.status || 'Network'} for ${cfg.url}`);
    console.error('[API] Error message:', error.message);
    if (error.response?.data) {
      console.error('[API] Error response:', error.response.data);
    }
    return Promise.reject(error);
  }
);

export default api;