import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Task } from './Task';
import { Project } from './Project';
import { Tag } from './Tag';
import { Reminder } from './Reminder';

@Entity({ name:'users' })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "name", unique: true, type: 'varchar' })
    username: string;

    @Column({ name: "email", unique: true, type: 'varchar' })
    email: string;

    @Column({ name: "password_hash", type: 'varchar' })
    passwordHash: string;

    @Column({ name: "created_at", type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @OneToMany(() => Task, (task) => task.user)
    tasks: Task[];

    @OneToMany(() => Tag, (tag) => tag.user)
    tags: Tag[];

    @OneToMany(() => Project, (project) => project.user)
    projects: Project[];

    @OneToMany(() => Reminder, (reminder) => reminder.user)
    reminders: Reminder[];
}
