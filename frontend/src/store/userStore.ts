import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { indexedDBStorage } from './indexedDBStorage';
import UserService from '../services/user/userService';

type User = {
  username: string;
  email?: string;
  accessToken?: string;
  refreshToken?: string;
};

export type UserData = {
  username: string;
  email: string;
  password: string;
};

type UserResponse = {
  name: string;
  accessToken: string;
  refreshToken: string;
}

type Credentials = {
  username: string;
  password: string;
};

type RegistrationData = {
  username: string;
  password: string;
  email: string;
};

type UserStore = {
  user: User;
  isHydrated: boolean;
  setHydrated: () => void;
  setUser: (user: User) => void;
  clearUser: () => void;
  login: (credentials: Credentials) => Promise<void>;
  register: (userData: RegistrationData) => Promise<void>;
  logout: () => void;
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: { username: '', email: '' },
      isHydrated: false,
      setHydrated: () => set({ isHydrated: true }),

      setUser: (user) => set({ user }),

      clearUser: () => set({ user: { username: '', email: '' } }),

      login: async (credentials) => {
        try {
          const data = await UserService.login(credentials);
          if (!data) {
            console.error('Login failed');
          }
          set({ user: { username: data.name, accessToken: data.accessToken, refreshToken: data.refreshToken } });
        } catch (error) {
          console.error('Login failed:', error);
          throw error;
        }
      },

      register: async (userData) => {
        try {
          const data: UserResponse = await UserService.register(userData);
          if (!data) {
            console.error('Registration failed');
            return;
          }
          await UserService.login({ username: userData.username, password: userData.password });
          set({ user: { username: data.name, accessToken: data.accessToken, refreshToken: data.refreshToken } });
        } catch (error) {
          console.error('Registration failed:', error);
          throw error;
        }
      },

      logout: async () => {
          try {
            const user = useUserStore.getState().user;
            if (!user) {
              throw new Error('User not found in store');
            }

            const { accessToken, refreshToken } = user;
            if (!accessToken || !refreshToken) {
              console.error('User is not logged in');
            }

            await UserService.logout();
            set({ user: { username: '', email: '', accessToken: '', refreshToken: '' } });
          } catch (error) {
            console.error('Logout failed:', error);
            throw error;
          }
      },
    }),
    {
      name: 'zustand-user-storage',
      storage: createJSONStorage<UserStore>(() => indexedDBStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);
