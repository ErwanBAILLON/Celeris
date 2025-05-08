import api from '../../utils/api';
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

export const getTasks = async (projectId: string): Promise<Task[]> => {
  const url = `${Routes.GET_PROJECT_BY_ID(projectId)}/tasks`;
  const resp = await api.get<Task[]>(url);
  return resp.data;
};

// Fonction createTask améliorée avec plus de logging et de gestion d'erreurs
export const createTask = async (
  projectId: string,
  taskData: Partial<Task>
): Promise<Task> => {
  try {
    console.log('Creating task with data:', taskData, 'for project:', projectId);

    const response = await api.post<Task>(
      `${Routes.GET_PROJECT_BY_ID(projectId)}/tasks`,
      taskData
    );

    console.log('Server response for createTask:', response);

    // Check if the response contains the expected data
    if (!response.data || !response.data.id) {
      console.warn('Invalid response from server for createTask:', response.data);

      // If the server responded successfully but without valid data,
      // create a default task object to avoid errors on the frontend
      return {
        id: `temp-${Date.now()}`,
        ...taskData,
      } as Task;
    }

    return response.data;
  } catch (error) {
    console.error('Error in createTask service:', error);

    // Log additional error context
    if (error && typeof error === 'object' && 'response' in error) {
      console.error('Server response:', (error as any).response?.data);
    }

    throw new Error(
      `Failed to create task: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
}

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
  }
): Promise<Task> => {
  const url = `${Routes.GET_PROJECT_BY_ID(projectId)}/tasks/${taskId}`;
  const resp = await api.put<Task>(url, taskData);
  return resp.data;
};

export const deleteTask = async (
  projectId: string,
  taskId: string
): Promise<void> => {
  const url = `${Routes.GET_PROJECT_BY_ID(projectId)}/tasks/${taskId}`;
  await api.delete<void>(url);
};
