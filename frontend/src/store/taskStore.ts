import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { indexedDBStorage } from './indexedDBStorage';
import TaskService from '../services/task/taskService';

export type Task = {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  priority: string;
}

type TaskStore = {
  tasks: Task[];
  isHydrated: boolean;
  setHydrated: () => void;
  addTask: (task: Task) => void;
  removeTask: (taskId: string) => void;
  updateTask: (taskId: string, updatedTask: Partial<Task>) => void;
  clearTasks: () => void;
  getTasks: (projectId: string, token: string) => Promise<Task[] | undefined>;
  createTask: (projectId: string, taskData: Partial<Task>, token: string) => Promise<Task | undefined>;
  updateTaskService: (projectId: string, taskId: string, taskData: Partial<Task>, token: string) => Promise<Task>;
  deleteTask: (projectId: string, taskId: string, token: string) => Promise<void>;
};

export const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      tasks: [],
      isHydrated: false,
      setHydrated: () => set({ isHydrated: true }),

      addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
      removeTask: (taskId) => set((state) => ({ tasks: state.tasks.filter((task) => task.id !== taskId) })),
      updateTask: (taskId, updatedTask) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId ? { ...task, ...updatedTask } : task
          ),
        })),
      clearTasks: () => set({ tasks: [] }),

      getTasks: async (projectId, token) => {
        try {
          const data = await TaskService.getTasks(projectId, token);
          if (!data) {
            console.error('Error fetching tasks:', data);
            return undefined;
          }
          set({ tasks: data });
          return data;
        } catch (error) {
          console.error('Error fetching tasks:', error);
          return undefined;
        }
      },

      createTask: async (projectId, taskData, token) => {
        try {
          const data = await TaskService.createTask(projectId, taskData, token);
          if (!data) {
            console.error('Error creating task:', data);
            return undefined;
          }
          set((state) => ({ tasks: [...state.tasks, data] }));
          return data;
        } catch (error) {
          console.error('Error creating task:', error);
          return undefined;
        }
      },

      updateTaskService: async (projectId, taskId, taskData, token) => {
        try {
          const data = await TaskService.updateTask(projectId, taskId, taskData, token);
          if (!data) {
            throw new Error('Error updating task: Task data is undefined');
          }
          set((state) => ({
            tasks: state.tasks.map((task) =>
              task.id === taskId ? { ...task, ...data } : task
            ),
          }));
          return data;
        } catch (error) {
          console.error('Error updating task:', error);
          throw error;
        }
      },

      deleteTask: async (projectId, taskId, token) => {
        try {
          await TaskService.deleteTask(projectId, taskId, token);
          set((state) => ({ tasks: state.tasks.filter((task) => task.id !== taskId) }));
        } catch (error) {
          console.error('Error deleting task:', error);
        }
      },
    }),
    {
      name: 'zustand-task-storage',
      storage: createJSONStorage<TaskStore>(() => indexedDBStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);
