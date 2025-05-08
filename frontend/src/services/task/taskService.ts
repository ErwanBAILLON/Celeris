import axios from 'axios';
import { Routes } from '../../utils/routes';

export interface Task {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  priority: string;
}

class TaskService {
  async getTasks(projectId: string, token: string): Promise<Task[] | undefined> {
    try {
      const url = `${Routes.GET_PROJECT_BY_ID(projectId)}/tasks`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data || [];
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  }

  async createTask(projectId: string, taskData: Partial<Task>, token: string): Promise<Task | undefined> {
    try {
      const url = `${Routes.GET_PROJECT_BY_ID(projectId)}/tasks`;
      const response = await axios.post<Task>(url, taskData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      return response.data || undefined;
    } catch (error) {
      console.error('Error creating task:', error);
    }
  }

  async updateTask(projectId: string, taskId: string, taskData: Partial<Task>, token: string): Promise<Task | undefined> {
    try {
      const url = `${Routes.GET_PROJECT_BY_ID(projectId)}/tasks/${taskId}`;
      const response = await axios.put<Task>(url, taskData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data || undefined;
    } catch (error) {
      console.error('Error updating task:', error);
    }
  }

  async deleteTask(projectId: string, taskId: string, token: string): Promise<void> {
    try {
      const url = `${Routes.GET_PROJECT_BY_ID(projectId)}/tasks/${taskId}`;
      await axios.delete(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  }
}

export default new TaskService();
