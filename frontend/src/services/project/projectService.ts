import api from '../../utils/api';
import { Routes } from '../../utils/routes';

export interface Project {
  id: string;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

export interface ProjectDetail {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
}

export const getProjectById = async (id: string): Promise<ProjectDetail> => {
  const resp = await api.get<ProjectDetail>(Routes.GET_PROJECT_BY_ID(id));
  return resp.data;
};

export const createProject = async (
  projectData: {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
  }
): Promise<Project> => {
  const resp = await api.post<Project>(Routes.CREATE_PROJECT, projectData);
  return resp.data;
};

export const deleteProject = async (id: string): Promise<void> => {
  await api.delete(Routes.DELETE_PROJECT(id));
};

export const updateProject = async (
  id: string,
  data: { name: string; description?: string; startDate?: string; endDate?: string }
): Promise<Project> => {
  const resp = await api.put<Project>(Routes.UPDATE_PROJECT(id), data);
  return resp.data;
};

export const getProjects = async (): Promise<Project[]> => {
  const resp = await api.get<Project[]>(Routes.GET_PROJECTS);
  return resp.data;
};
