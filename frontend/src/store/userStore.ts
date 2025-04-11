import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type User = {
  name: string;
  email: string;
};

type UserStore = {
  user: User;
  setUser: (user: User) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: { name: '', email: '' },
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: { name: '', email: '' } }),
    }),
    {
      name: 'user-store',
      partialize: (state) => ({ user: state.user }),
    }
  )
);
