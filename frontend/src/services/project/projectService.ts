import axios from 'axios';
import { Routes } from '../../utils/routes';

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
      const resp = await axios.get<ProjectDetail>(
        Routes.GET_PROJECT_BY_ID(id),
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return resp.data;
    } catch (error) {
      console.error('Error fetching project by ID:', error);
      throw error;
    }
  }

  async createProject(projectData: Partial<ProjectDetail>, token: string): Promise<Project> {
    try {
      const resp = await axios.post<Project>(
        Routes.CREATE_PROJECT,
        projectData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return resp.data;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }

  async deleteProject(id: string, token: string): Promise<void> {
    try {
      await axios.delete(Routes.DELETE_PROJECT(id), {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  }

  async updateProject(id: string, data: Partial<ProjectDetail>, token: string): Promise<Project> {
    try {
      const resp = await axios.put<Project>(
        Routes.UPDATE_PROJECT(id),
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return resp.data;
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  }

}

export default new ProjectService();
