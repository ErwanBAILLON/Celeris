import { Routes } from '../../utils/routes';
import { fetchWithOfflineSupport } from '../../utils/offlineRequests';

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
      const response = await fetchWithOfflineSupport(Routes.GET_REMINDERS, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error(response.statusText);
      return await response.json();
    } catch (error) {
      console.error('Error fetching reminders:', error);
    }
  }

  async deleteReminder(reminderId: string, token: string): Promise<void | undefined> {
    try {
      const response = await fetchWithOfflineSupport(Routes.DELETE_REMINDER(reminderId), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
        keepalive: true,
      });
      if (!response.ok) throw new Error(response.statusText);
    } catch (error) {
      console.error('Error deleting reminder with offline support:', error);
    }
  }

  async createReminder(reminderData: Omit<Reminder, 'id'>, token: string): Promise<Reminder | undefined> {
    try {
      const response = await fetchWithOfflineSupport(Routes.CREATE_REMINDER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(reminderData),
        keepalive: true,
      });
      if (!response.ok) throw new Error(response.statusText);
      return await response.json();
    } catch (error) {
      console.error('Error creating reminder with offline support:', error);
      return undefined;
    }
  }

  async updateReminder(reminderId: string, reminderData: Partial<Reminder>, token: string): Promise<Reminder | undefined> {
    try {
      const response = await fetchWithOfflineSupport(Routes.UPDATE_REMINDER(reminderId), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(reminderData),
        keepalive: true,
      });
      if (!response.ok) throw new Error(response.statusText);
      return await response.json();
    } catch (error) {
      console.error('Error updating reminder with offline support:', error);
      return undefined;
    }
  }
}

export default new ReminderService();
