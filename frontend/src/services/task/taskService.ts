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

export const getTasks = async (
  projectId: string,
  token: string
): Promise<Task[]> => {
  const url = `${Routes.GET_PROJECT_BY_ID(projectId)}/tasks`;
  const resp = await axios.get<Task[]>(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return resp.data;
};

export const createTask = async (
  projectId: string,
  taskData: {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    status: string;
    priority: string;
  },
  token: string
): Promise<Task> => {
  const url = `${Routes.GET_PROJECT_BY_ID(projectId)}/tasks`;
  const resp = await axios.post<Task>(url, taskData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return resp.data;
};

export const updateTask = async (
  projectId: string,
  taskId: string,
  taskData: {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    status: string;
    priority: string;
  },
  token: string
): Promise<Task> => {
  const url = `${Routes.GET_PROJECT_BY_ID(projectId)}/tasks/${taskId}`;
  const resp = await axios.put<Task>(url, taskData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return resp.data;
};

export const deleteTask = async (
  projectId: string,
  taskId: string,
  token: string
): Promise<void> => {
  const url = `${Routes.GET_PROJECT_BY_ID(projectId)}/tasks/${taskId}`;
  await axios.delete<void>(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
