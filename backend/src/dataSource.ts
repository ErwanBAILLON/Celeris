import "reflect-metadata";
import { DataSource } from "typeorm";
import { User, Project, Task, Reminder, Tag } from "./entities";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    database: process.env.DB_NAME || "celeris",
    username: process.env.DB_USER || "celeris",
    password: process.env.DB_PASS || "celeris",
    synchronize: false,
    logging: false,
    entities: [User, Project, Task, Reminder, Tag],
    migrations: [],
    subscribers: []
});
