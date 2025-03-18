import express from 'express';
import { User, Reminder } from '../entities';
import { UserRepository, ReminderRepository } from '../repositories';
import { authMiddleware } from '../middlewares/authMiddleware';

const reminderRouter = express.Router();

const reminderExporter: (reminder: Reminder) => object = (reminder: Reminder) => {
    return {
        id: reminder.id,
        name: reminder.name,
        description: reminder.description,
        dateTime: reminder.dateTime,
        status: reminder.status,
    }
}

reminderRouter.get('/', authMiddleware, async (req, res) => {
    try {
        const { userId } = req.user!;
        const user = await UserRepository.findById(userId);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        const reminders = await ReminderRepository.findByUserId(userId);
        const exportedReminders = reminders.map(reminderExporter);
        res.status(200).json(exportedReminders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

reminderRouter.get('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const reminder = await ReminderRepository.findById(id);
        if (!reminder) {
            res.status(404).json({ error: 'Reminder not found' });
            return;
        }
        const exportedReminder = reminderExporter(reminder);
        res.status(200).json(exportedReminder);
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
});

reminderRouter.post('/', authMiddleware, async (req, res) => {
    try {
        const { userId } = req.user!;
        const { name, description, dateTime, status } = req.body;
        const user = await UserRepository.findById(userId);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        const reminder = new Reminder();
        reminder.name = name;
        reminder.description = description;
        reminder.dateTime = dateTime;
        reminder.status = status;
        reminder.user = user;
        const createdReminder = await ReminderRepository.create(reminder);
        const exportedReminder = reminderExporter(createdReminder);
        res.status(201).json(exportedReminder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

reminderRouter.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, dateTime, status } = req.body;
        const reminder = await ReminderRepository.findById(id);
        if (!reminder) {
            res.status(404).json({ error: 'Reminder not found' });
            return;
        }
        reminder.name = name;
        reminder.description = description;
        reminder.dateTime = dateTime;
        reminder.status = status;
        const updatedReminder = await ReminderRepository.update(reminder);
        const exportedReminder = reminderExporter(updatedReminder);
        res.status(200).json(exportedReminder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

reminderRouter.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const reminder = await ReminderRepository.findById(id);
        if (!reminder) {
            res.status(404).json({ error: 'Reminder not found' });
            return;
        }
        await ReminderRepository.delete(reminder);
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default reminderRouter;
