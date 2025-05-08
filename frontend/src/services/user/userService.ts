import axios from 'axios';
import { Routes } from '../../utils/routes';

class UserService {

  async register(userData: { username: string; password: string; email: string }) {
    try {
      const response = await axios.post(Routes.REGISTER, userData);
      return response.data;
    } catch (error) {
      console.error('Error during registration:', error);
    }
  }

  async login(credentials: { username: string; password: string }) {
    try {
      const response = await axios.post(Routes.LOGIN, credentials);
      return response.data;
    } catch (error) {
      console.error('Error during login:', error);
    }
  }

  async logout() {
    try {
      const response = await axios.post(Routes.LOGOUT);
      return response.data;
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }
}

export default new UserService();
