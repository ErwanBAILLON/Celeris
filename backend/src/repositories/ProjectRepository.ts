import { AppDataSource } from "../dataSource";
import { Project } from "../entities/Project";

const projectRepository = AppDataSource.getRepository(Project);

export class ProjectRepository {
    static async create(project: Project): Promise<Project> {
        return projectRepository.save(project);
    }

    static async update(project: Project): Promise<Project> {
        return projectRepository.save(project);
    }

    static async delete(project: Project): Promise<void> {
        await projectRepository.remove(project);
    }

    static async findById(id: string): Promise<Project | null> {
        return projectRepository
            .createQueryBuilder("project")
            .where("project.id = :id", { id })
            .getOne();
    }

    static async findByUserId(userId: number): Promise<Project[]> {
        return projectRepository
            .createQueryBuilder("project")
            .innerJoinAndSelect("project.user", "user")
            .where("user.id = :userId", { userId })
            .getMany();
    }
}
