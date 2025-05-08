import axios from 'axios';
import { Routes } from '../../utils/routes';

export interface Reminder {
  id: string;
  title: string;
  date: string;
  description?: string;
  completed?: boolean;
}

class ReminderService {
  async getReminders(token: string): Promise<Reminder[] | undefined> {
    try {
      const response = await axios.get<Reminder[]>(Routes.GET_REMINDERS, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data || [];
    } catch (error) {
      console.error('Error fetching reminders:', error);
    }
  }

  async deleteReminder(reminderId: string, token: string): Promise<void | undefined> {
    try {
      await axios.delete(Routes.DELETE_REMINDER(reminderId), {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Error deleting reminder:', error);
    }
  }

  async createReminder(reminderData: Omit<Reminder, 'id'>, token: string): Promise<Reminder | undefined> {
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
    }
  }

  async updateReminder(reminderId: string, reminderData: Partial<Reminder>, token: string): Promise<Reminder | undefined> {
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
    }
  }

}

export default new ReminderService();
