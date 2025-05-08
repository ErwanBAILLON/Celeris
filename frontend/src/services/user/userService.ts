import axios from 'axios';
import { Routes } from '../../utils/routes';
import api from '../../utils/api';

class UserService {

  async register(userData: { username: string; password: string; email: string }) {
    try {
      const response = await axios.post(Routes.REGISTER, userData);
      return response.data;
    } catch (error) {
      console.error('Error during registration:', error);
      throw error;
    }
  }

  async login(credentials: { username: string; password: string }) {
    try {
      const response = await axios.post(Routes.LOGIN, credentials);
      return response.data;
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      const response = await axios.get(Routes.REFRESH, {
        headers: {
          'x-refresh-token': refreshToken
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  }

  async logout() {
    try {
      const response = await api.post(Routes.LOGOUT);
      return response.data;
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  }
}

export default new UserService();
