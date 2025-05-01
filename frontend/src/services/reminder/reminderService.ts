import axios from 'axios';
import { Routes } from '../../utils/routes';

export interface Reminder {
  id: string;
  title: string;
  date: string;
  description?: string;
  completed?: boolean;
}

/**
 * Récupère tous les rappels de l'utilisateur
 */
export const getReminders = async (token: string): Promise<Reminder[]> => {
  try {
    const response = await axios.get<Reminder[]>(Routes.GET_REMINDERS, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data || [];
  } catch (error) {
    console.error('Error fetching reminders:', error);
    throw error;
  }
};

/**
 * Supprime un rappel par son ID
 */
export const deleteReminder = async (reminderId: string, token: string): Promise<void> => {
  try {
    await axios.delete(Routes.DELETE_REMINDER(reminderId), {
      headers: { Authorization: `Bearer ${token}` }
    });
  } catch (error) {
    console.error('Error deleting reminder:', error);
    throw error;
  }
};

/**
 * Crée un nouveau rappel
 */
export const createReminder = async (
  reminderData: Omit<Reminder, 'id'>,
  token: string
): Promise<Reminder> => {
  try {
    const response = await axios.post<Reminder>(
      Routes.CREATE_REMINDER,
      reminderData,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating reminder:', error);
    throw error;
  }
};

/**
 * Met à jour un rappel existant
 */
export const updateReminder = async (
  reminderId: string,
  reminderData: Partial<Reminder>,
  token: string
): Promise<Reminder> => {
  try {
    const response = await axios.put<Reminder>(
      Routes.UPDATE_REMINDER(reminderId),
      reminderData,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating reminder:', error);
    throw error;
  }
};
