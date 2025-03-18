import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { Task } from './Task';
import { Project } from './Project';

@Entity('reminders')
export class Reminder {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "name", unique: true, type: 'varchar' })
    name: string;

    @Column({ name: "description", unique: true, type: 'text' })
    description: string;

    @Column({ name: "status", unique: true, type: 'text' })
    status: string;

    @Column({ name: "date_time", type: 'timestamp' })
    dateTime: Date;

    @ManyToOne(() => User, (user) => user.tasks)
    @JoinColumn({ name: 'owner_id' })
    user: User;

    @ManyToOne(() => Task, (task) => task.reminders)
    @JoinColumn({ name: 'task_id' })
    task: Task;

    @ManyToOne(() => Project, (project) => project.reminders)
    @JoinColumn({ name: 'project_id' })
    project: Project;
}
