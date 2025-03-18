import { AppDataSource } from "../dataSource";
import { Task } from "../entities/Task";

const taskRepository = AppDataSource.getRepository(Task);

export class TaskRepository {
    static async create(task: Task): Promise<Task> {
        return taskRepository.save(task);
    }

    static async update(task: Task): Promise<Task> {
        return taskRepository.save(task);
    }

    static async delete(task: Task): Promise<void> {
        await taskRepository.remove(task);
    }

    static async findById(id: string): Promise<Task | null> {
        return taskRepository
            .createQueryBuilder("task")
            .where("task.id = :id", { id })
            .getOne();
    }

    static async findByProjectId(projectId: string): Promise<Task[]> {
        return taskRepository
            .createQueryBuilder("task")
            .where("task.projectId = :projectId", { projectId })
            .getMany();
    }
}
