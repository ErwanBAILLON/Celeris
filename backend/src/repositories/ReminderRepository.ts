import { AppDataSource } from "../dataSource";
import { Reminder } from "../entities/Reminder";

const reminderRepository = AppDataSource.getRepository(Reminder);

export class ReminderRepository {
    static async create(reminder: Reminder): Promise<Reminder> {
        return reminderRepository.save(reminder);
    }

    static async update(reminder: Reminder): Promise<Reminder> {
        return reminderRepository.save(reminder);
    }

    static async delete(reminder: Reminder): Promise<void> {
        await reminderRepository.remove(reminder);
    }

    static async findById(id: string): Promise<Reminder | null> {
        return reminderRepository
            .createQueryBuilder("reminder")
            .where("reminder.id = :id", { id })
            .getOne();
    }

    static async findByTaskId(taskId: string): Promise<Reminder[]> {
        return reminderRepository
            .createQueryBuilder("reminder")
            .where("reminder.taskId = :taskId", { taskId })
            .getMany();
    }
}
