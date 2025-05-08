import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { indexedDBStorage } from './indexedDBStorage';
import ProjectService from '../services/project/projectService';

export type ProjectDetail = {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
}

type ProjectStore = {
  projects: ProjectDetail[];
  isHydrated: boolean;
  setHydrated: () => void;
  addProject: (project: ProjectDetail) => void;
  removeProject: (projectId: string) => void;
  updateProject: (projectId: string, updatedProject: Partial<ProjectDetail>) => void;
  clearProjects: () => void;
  getProjects: (token: string) => Promise<ProjectDetail[] | undefined>;
  getProjectById: (id: string, token: string) => Promise<ProjectDetail | undefined>;
  createProject: (projectData: Partial<ProjectDetail>, token: string) => Promise<ProjectDetail | undefined>;
  deleteProject: (id: string, token: string) => Promise<void>;
  updateProjectService: (id: string, data: Partial<ProjectDetail>, token: string) => Promise<ProjectDetail | undefined>;
};

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      projects: [],
      isHydrated: false,
      setHydrated: () => set({ isHydrated: true }),

      addProject: (project) => set((state) => ({ projects: [...state.projects, project] })),
      removeProject: (projectId) => set((state) => ({ projects: state.projects.filter((project) => project.id !== projectId) })),
      updateProject: (projectId, updatedProject) =>
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === projectId ? { ...project, ...updatedProject } : project
          ),
        })),
      clearProjects: () => set({ projects: [] }),

      getProjects: async (token) => {
        try {
          const data = await ProjectService.getProjects(token);
          if (!data) {
            console.error('Error fetching projects:', data);
            return undefined;
          }
          set({ projects: data });
          return data;
        } catch (error) {
          console.error('Error fetching projects:', error);
          const projects = get().projects;
          if (projects.length > 0) {
            console.warn('Returning cached projects:', projects);
            return projects;
          }
          return undefined;
        }
      },

      getProjectById: async (id, token) => {
        try {
          const data = await ProjectService.getProjectById(id, token);
          if (!data) {
            console.error('Error fetching project by ID:', data);
            return undefined;
          }
          return data;
        } catch (error) {
          console.error('Error fetching project by ID:', error);
          return undefined;
        }
      },

      createProject: async (projectData, token) => {
        try {
          const data = await ProjectService.createProject(projectData, token);
          if (!data) {
            console.error('Error creating project:', data);
            return undefined;
          }
          set((state) => ({ projects: [...state.projects, data] }));
          return data;
        } catch (error) {
          console.error('Error creating project:', error);
          return undefined;
        }
      },

      deleteProject: async (id, token) => {
        try {
          await ProjectService.deleteProject(id, token);
          set((state) => ({ projects: state.projects.filter((project) => project.id !== id) }));
        } catch (error) {
          console.error('Error deleting project:', error);
        }
      },

      updateProjectService: async (id, data, token) => {
        try {
          const updatedProject = await ProjectService.updateProject(id, data, token);
          if (!updatedProject) {
            throw new Error('Error updating project: Project not found or update failed.');
          }
          set((state) => ({
            projects: state.projects.map((project) =>
              project.id === id ? { ...project, ...updatedProject } : project
            ),
          }));
          return updatedProject;
        } catch (error) {
          console.error('Error updating project:', error);
          return undefined;
        }
      },
    }),
    {
      name: 'zustand-project-storage',
      storage: createJSONStorage<ProjectStore>(() => indexedDBStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);
