import { AppDataSource } from "../dataSource";
import { User } from "../entities/";

const userRepository = AppDataSource.getRepository(User);

export class UserRepository {
    static async create(user: User) : Promise<User> {
        return userRepository.save(user);
    }

    static async findByUsername(username: string) : Promise<User | null> {
        return userRepository
            .createQueryBuilder("users")
            .where("users.username = :username", { username })
            .getOne();
    }

    static async findByEmail(email: string) : Promise<User | null> {
        return userRepository
            .createQueryBuilder("users")
            .where("users.email = :email", { email })
            .getOne();
    }

    static async findById(id: number) : Promise<User | null> {
        return userRepository
            .createQueryBuilder("users")
            .where("users.id = :id", { id })
            .getOne();
    }
}
