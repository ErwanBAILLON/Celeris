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

export const getProjectById = async (
  id: string,
  token: string
): Promise<ProjectDetail> => {
  const resp = await axios.get<ProjectDetail>(
    Routes.GET_PROJECT_BY_ID(id),
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return resp.data;
};

export const createProject = async (
  projectData: {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
  },
  token: string
): Promise<Project> => {
  const resp = await axios.post<Project>(
    Routes.CREATE_PROJECT,
    projectData,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return resp.data;
};

export const deleteProject = async (id: string, token: string): Promise<void> => {
  await axios.delete(Routes.DELETE_PROJECT(id), {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateProject = async (
  id: string,
  data: { name: string; description?: string; startDate?: string; endDate?: string },
  token: string
): Promise<Project> => {
  const resp = await axios.put<Project>(
    Routes.UPDATE_PROJECT(id),
    data,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return resp.data;
};
