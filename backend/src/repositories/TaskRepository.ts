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
        const result = await taskRepository.delete({ id: task.id });
        if (result.affected === 0) {
            console.error("Task was not deleted:", task.id);
            throw new Error("Task was not deleted");
        }
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
            .where("task.project_id = :projectId", { projectId })
            .getMany();
    }
}
