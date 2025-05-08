import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { indexedDBStorage } from './indexedDBStorage';
import ReminderService from '../services/reminder/reminderService';

export type Reminder = {
  id: string;
  title: string;
  date: string;
  description?: string;
  completed?: boolean;
}

type ReminderStore = {
  reminders: Reminder[];
  isHydrated: boolean;
  setHydrated: () => void;
  addReminder: (reminder: Reminder) => void;
  removeReminder: (reminderId: string) => void;
  updateReminder: (reminderId: string, updatedReminder: Partial<Reminder>) => void;
  clearReminders: () => void;
  getReminders: (token: string) => Promise<Reminder[] | undefined>;
  deleteReminder: (reminderId: string, token: string) => Promise<void | undefined>;
  createReminder: (reminderData: Omit<Reminder, 'id'>, token: string) => Promise<Reminder | undefined>;
  updateReminderService: (reminderId: string, reminderData: Partial<Reminder>, token: string) => Promise<Reminder | undefined>;
}

export const useReminderStore = create<ReminderStore>()(
  persist(
    (set) => ({
      reminders: [],
      isHydrated: false,
      setHydrated: () => set({ isHydrated: true }),

      addReminder: (reminder) => set((state) => ({ reminders: [...state.reminders, reminder] })),
      removeReminder: (reminderId) => set((state) => ({ reminders: state.reminders.filter((reminder) => reminder.id !== reminderId) })),
      updateReminder: (reminderId, updatedReminder) =>
        set((state) => ({
          reminders: state.reminders.map((reminder) =>
            reminder.id === reminderId ? { ...reminder, ...updatedReminder } : reminder
          ),
        })),
      clearReminders: () => set({ reminders: [] }),

      getReminders: async (token) => {
        try {
          const data = await ReminderService.getReminders(token);
          if (!data) {
            console.error('Error fetching reminders:', data);
            return undefined;
          }
          set({ reminders: data });
          return data;
        } catch (error) {
          console.error('Error fetching reminders:', error);
          return undefined;
        }
      },

      deleteReminder: async (reminderId, token) => {
        try {
          await ReminderService.deleteReminder(reminderId, token);
          set((state) => ({ reminders: state.reminders.filter((reminder) => reminder.id !== reminderId) }));
        } catch (error) {
          console.error('Error deleting reminder:', error);
        }
      },

      createReminder: async (reminderData, token) => {
        try {
          const data = await ReminderService.createReminder(reminderData, token);
          if (!data) {
            console.error('Error creating reminder:', data);
            return undefined;
          }
          set((state) => ({ reminders: [...state.reminders, data] }));
          return data;
        } catch (error) {
          console.error('Error creating reminder:', error);
          return undefined;
        }
      },

      updateReminderService: async (reminderId, reminderData, token) => {
        try {
          const data = await ReminderService.updateReminder(reminderId, reminderData, token);
          if (!data) {
            throw new Error('Error updating reminder: Reminder data is undefined');
          }
          set((state) => ({
            reminders: state.reminders.map((reminder) =>
              reminder.id === reminderId ? { ...reminder, ...data } : reminder
            ),
          }));
          return data;
        } catch (error) {
          console.error('Error updating reminder:', error);
          return undefined;
        }
      }
    }),
    {
      name: 'zustland-reminder-storage',
      storage: createJSONStorage(() => indexedDBStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);
