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

// Fonction createTask améliorée avec plus de logging et de gestion d'erreurs
export const createTask = async (
  projectId: string,
  taskData: Partial<Task>,
  token: string
): Promise<Task> => {
  try {
    console.log('Creating task with data:', taskData, 'for project:', projectId);

    const response = await axios.post<Task>(
      `${Routes.GET_PROJECT_BY_ID(projectId)}/tasks`,
      taskData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Server response for createTask:', response);

    // Vérifier si la réponse contient les données attendues
    if (!response.data || !response.data.id) {
      console.warn('Invalid response from server for createTask:', response.data);

      // Si le serveur a répondu avec succès mais sans données valides,
      // on crée un objet de tâche par défaut pour éviter les erreurs côté frontend
      return {
        id: `temp-${Date.now()}`,
        ...taskData,
      } as Task;
    }

    return response.data;
  } catch (error) {
    console.error('Error in createTask service:', error);

    // Rethrow error with enhanced context
    if (axios.isAxiosError(error)) {
      console.error('Server response:', error.response?.data);
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
