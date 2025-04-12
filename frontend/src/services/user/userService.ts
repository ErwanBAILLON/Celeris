import axios from 'axios';
import { Routes } from '../../utils/routes';

class UserService {

  async register(userData: { name: string; password: string; email: string }) {
    try {
      const response = await axios.post(Routes.REGISTER, userData);
      return response.data;
    } catch (error) {
      console.error('Error during registration:', error);
      throw error;
    }
  }

  async login(credentials: { name: string; password: string }) {
    try {
      const response = await axios.post(Routes.LOGIN, credentials);
      return response.data;
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  }

  async logout() {
    try {
      const response = await axios.post(Routes.LOGOUT);
      return response.data;
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  }
}

export default new UserService();
