import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn, ManyToMany } from 'typeorm';
import { User } from './User';
import { Task } from './Task';
import { Project } from './Project';

@Entity('reminders')
export class Reminder {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "name", type: 'varchar' })
    name: string;

    @Column({ name: "description", type: 'text', nullable: true })
    description: string;

    @Column({ name: "status", type: 'varchar' })
    status: string;

    @Column({ name: "datetime", type: 'timestamp' })
    dateTime: Date;

    @ManyToOne(() => User, (user) => user.reminders)
    @JoinColumn({ name: 'owner_id' })
    user: User;

    @ManyToMany(() => Task, (task) => task.reminders)
    task: Task[];

    @ManyToOne(() => Project, (project) => project.reminders)
    @JoinColumn({ name: 'project_id' })
    project: Project;
}
