import { Routes } from '../../utils/routes';
import { fetchWithOfflineSupport } from '../../utils/offlineRequests';

export interface Project {
  id: string;
  name: string;
  // ...autres champs si nécessaire...
}

export interface ProjectDetail {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
}

class ProjectService {
  async getProjectById(id: string, token: string): Promise<ProjectDetail> {
    try {
      const response = await fetchWithOfflineSupport(Routes.GET_PROJECT_BY_ID(id), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error(`Error fetching project: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching project by ID with offline support:', error);
      throw error;
    }
  }

  async createProject(projectData: Partial<ProjectDetail>, token: string): Promise<Project> {
    try {
      const response = await fetchWithOfflineSupport(Routes.CREATE_PROJECT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(projectData),
        keepalive: true,
      });
      if (!response.ok) {
        throw new Error(`Error creating project: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating project with offline support:', error);
      throw error;
    }
  }

  async deleteProject(id: string, token: string): Promise<void> {
    try {
      const response = await fetchWithOfflineSupport(Routes.DELETE_PROJECT(id), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
        keepalive: true,
      });
      if (!response.ok) {
        throw new Error(`Error deleting project: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error deleting project with offline support:', error);
      throw error;
    }
  }

  async updateProject(id: string, data: Partial<ProjectDetail>, token: string): Promise<Project> {
    try {
      const response = await fetchWithOfflineSupport(Routes.UPDATE_PROJECT(id), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data),
        keepalive: true,
      });
      if (!response.ok) {
        throw new Error(`Error updating project: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating project with offline support:', error);
      throw error;
    }
  }
}

export default new ProjectService();
