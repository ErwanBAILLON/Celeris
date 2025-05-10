import axios from 'axios';
import { Routes } from '../../utils/routes';
import { fetchWithOfflineSupport } from '../../utils/offlineRequests';

export interface Task {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  priority: string;
  projectId?: string;
}

class TaskService {
  async getTasks(projectId: string, token: string): Promise<Task[] | undefined> {
    try {
      const url = `${Routes.GET_PROJECT_BY_ID(projectId)}/tasks`;
      const response = await fetchWithOfflineSupport(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const data: Task[] = await response.json();
      return data.map((task: Task) => ({
        ...task,
        startDate: new Date(task.startDate).toISOString(),
        endDate: new Date(task.endDate).toISOString(),
      }));
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  }

  async getAllTasks(token: string): Promise<Task[] | undefined> {
    try {
      const url = `${Routes.GET_ALL_TASKS}`;
      const response = await fetchWithOfflineSupport(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const data: Task[] = await response.json();
      return data.map((task: Task) => ({
        ...task,
        startDate: new Date(task.startDate).toISOString(),
        endDate: new Date(task.endDate).toISOString(),
      }));
    } catch (error) {
      console.error('Error fetching all tasks:', error);
    }
  }

  async createTask(projectId: string, taskData: Partial<Task>, token: string): Promise<Task | undefined> {
    try {
      const url = `${Routes.GET_PROJECT_BY_ID(projectId)}/tasks`;
      const response = await fetchWithOfflineSupport(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(taskData),
        keepalive: true,
      });
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const data: Task = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating task with fetch:', error);
      return undefined;
    }
  }

  async updateTask(projectId: string, taskId: string, taskData: Partial<Task>, token: string): Promise<Task | undefined> {
    try {
      const url = `${Routes.GET_PROJECT_BY_ID(projectId)}/tasks/${taskId}`;
      const response = await fetchWithOfflineSupport(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(taskData),
        keepalive: true,
      });
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating task with fetch:', error);
      return undefined;
    }
  }

  async deleteTask(projectId: string, taskId: string, token: string): Promise<void> {
    try {
      const url = `${Routes.GET_PROJECT_BY_ID(projectId)}/tasks/${taskId}`;
      const response = await fetchWithOfflineSupport(url, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
        keepalive: true,
      });
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error deleting task with fetch:', error);
    }
  }
}

export default new TaskService();
