import axios from 'axios';
import { Routes } from './routes';
import { useUserStore } from '../store/userStore';

const api = axios.create();

// Request interceptor to add the auth token
api.interceptors.request.use(
  (config) => {
    const accessToken = useUserStore.getState().user.accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is 401 (unauthorized) and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = useUserStore.getState().user.refreshToken;
        
        if (!refreshToken) {
          // No refresh token available, logout the user
          useUserStore.getState().clearUser();
          return Promise.reject(error);
        }
        
        // Set the refresh token in the header
        const response = await axios.get(Routes.REFRESH, {
          headers: {
            'x-refresh-token': refreshToken
          }
        });
        
        // Update the tokens in the store
        useUserStore.getState().setUser({
          ...useUserStore.getState().user,
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken
        });
        
        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        // If refresh fails, logout the user
        useUserStore.getState().clearUser();
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api; 
