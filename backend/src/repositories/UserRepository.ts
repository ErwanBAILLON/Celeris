import { AppDataSource } from "../dataSource";
import { User } from "../entities/";

const userRepository = AppDataSource.getRepository(User);

export class UserRepository {
    static async create(user: User) : Promise<User> {
        return userRepository.save(user);
    }

    static async findByUsername(username: string) : Promise<User | null> {
        return userRepository
            .createQueryBuilder("user")
            .where("user.username = :username", { username })
            .getOne();
    }

    static async findByEmail(email: string) : Promise<User | null> {
        return userRepository
            .createQueryBuilder("user")
            .where("user.email = :email", { email })
            .getOne();
    }

    static async findById(id: string) : Promise<User | null> {
        return userRepository
            .createQueryBuilder("user")
            .where("user.id = :id", { id })
            .getOne();
    }
}
