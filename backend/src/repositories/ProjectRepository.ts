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
        const result = await projectRepository.delete({ id: project.id });
        if (result.affected === 0) {
            console.error("Project was not deleted:", project.id);
            throw new Error("Project was not deleted");
        }
    }

    static async findById(id: string): Promise<Project | null> {
        return projectRepository
            .createQueryBuilder("project")
            .leftJoinAndSelect("project.user", "user")
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

    static async isOwner(projectId: number, userId: number): Promise<boolean> {
        const project = await projectRepository
            .createQueryBuilder("project")
            .innerJoinAndSelect("project.user", "user")
            .where("project.id = :projectId", { projectId })
            .andWhere("user.id = :userId", { userId })
            .getOne();

        return !!project;
    }
}
