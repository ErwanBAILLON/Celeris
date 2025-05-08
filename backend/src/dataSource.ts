import "reflect-metadata";
import { DataSource } from "typeorm";
import { User, Project, Task, Reminder, Tag } from "./entities";

// Determine if we're in production
const isProduction = process.env.NODE_ENV === 'production';

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    database: process.env.DB_NAME || "celeris",
    username: process.env.DB_USER || "celeris",
    password: process.env.DB_PASS || "celeris",
    synchronize: !isProduction, // Only synchronize in non-production environments
    logging: !isProduction,
    entities: [User, Project, Task, Reminder, Tag],
    migrations: [],
    subscribers: []
});
