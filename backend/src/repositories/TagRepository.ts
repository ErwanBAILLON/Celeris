import { AppDataSource } from "../dataSource";
import { Tag } from "../entities/Tag";

const tagRepository = AppDataSource.getRepository(Tag);

export class TagRepository {
    static async create(tag: Tag): Promise<Tag> {
        return tagRepository.save(tag);
    }

    static async update(tag: Tag): Promise<Tag> {
        return tagRepository.save(tag);
    }

    static async delete(tag: Tag): Promise<void> {
        await tagRepository.remove(tag);
    }

    static async findById(id: string): Promise<Tag | null> {
        return tagRepository
            .createQueryBuilder("tag")
            .where("tag.id = :id", { id })
            .getOne();
    }

    static async findByProjectId(projectId: string): Promise<Tag[]> {
        return tagRepository
            .createQueryBuilder("tag")
            .where("tag.projectId = :projectId", { projectId })
            .getMany();
    }
}
