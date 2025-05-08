import api from '../../utils/api';
import { Routes } from '../../utils/routes';

export interface Reminder {
  id: string;
  name: string;
  dateTime: string;
  description?: string;
  status: string;
}

/**
 * Get all reminders for the user
 */
export const getReminders = async (): Promise<Reminder[]> => {
  try {
    const response = await api.get<Reminder[]>(Routes.GET_REMINDERS);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching reminders:', error);
    throw error;
  }
};

/**
 * Delete a reminder by its ID
 */
export const deleteReminder = async (reminderId: string): Promise<void> => {
  try {
    await api.delete(Routes.DELETE_REMINDER(reminderId));
  } catch (error) {
    console.error('Error deleting reminder:', error);
    throw error;
  }
};

/**
 * Create a new reminder
 */
export const createReminder = async (
  reminderData: Omit<Reminder, 'id'>
): Promise<Reminder> => {
  try {
    const response = await api.post<Reminder>(
      Routes.CREATE_REMINDER,
      reminderData
    );
    return response.data;
  } catch (error) {
    console.error('Error creating reminder:', error);
    throw error;
  }
};

/**
 * Update an existing reminder
 */
export const updateReminder = async (
  reminderId: string,
  reminderData: Partial<Reminder>
): Promise<Reminder> => {
  try {
    const response = await api.put<Reminder>(
      Routes.UPDATE_REMINDER(reminderId),
      reminderData
    );
    return response.data;
  } catch (error) {
    console.error('Error updating reminder:', error);
    throw error;
  }
};
