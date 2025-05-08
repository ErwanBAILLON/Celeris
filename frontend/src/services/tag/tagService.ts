import axios from 'axios';
import { useUserStore } from '../../store/userStore';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

interface Tag {
  id: number;
  name: string;
  color: string;
  description?: string;
}

interface TagData {
  name: string;
  color: string;
  description?: string;
}

const TagService = {
  async getTags(): Promise<Tag[]> {
    try {
      const state = useUserStore.getState();
      const token = state.user.accessToken;
      
      if (!token) {
        throw new Error('Not authenticated');
      }
      
      const response = await axios.get(`${API_URL}/tags`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching tags:', error);
      throw error;
    }
  },
  
  async getTag(id: number): Promise<Tag> {
    try {
      const state = useUserStore.getState();
      const token = state.user.accessToken;
      
      if (!token) {
        throw new Error('Not authenticated');
      }
      
      const response = await axios.get(`${API_URL}/tags/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching tag:', error);
      throw error;
    }
  },
  
  async createTag(tagData: TagData): Promise<void> {
    try {
      const state = useUserStore.getState();
      const token = state.user.accessToken;
      
      if (!token) {
        throw new Error('Not authenticated');
      }
      
      await axios.post(`${API_URL}/tags`, tagData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Error creating tag:', error);
      throw error;
    }
  },
  
  async updateTag(id: number, tagData: Partial<TagData>): Promise<void> {
    try {
      const state = useUserStore.getState();
      const token = state.user.accessToken;
      
      if (!token) {
        throw new Error('Not authenticated');
      }
      
      await axios.put(`${API_URL}/tags/${id}`, tagData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Error updating tag:', error);
      throw error;
    }
  },
  
  async deleteTag(id: number): Promise<void> {
    try {
      const state = useUserStore.getState();
      const token = state.user.accessToken;
      
      if (!token) {
        throw new Error('Not authenticated');
      }
      
      await axios.delete(`${API_URL}/tags/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error('Error deleting tag:', error);
      throw error;
    }
  }
};

export default TagService; 
