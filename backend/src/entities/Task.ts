import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { User } from './User';
import { Tag } from './Tag';
import { Reminder } from './Reminder';
import { Project } from './Project';

@Entity('tasks')
export class Task {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "name", unique: true, type: 'varchar' })
    name: string;

    @Column({ name: "description", unique: true, type: 'text' })
    description: string;

    @Column({ name: "status", type: 'varchar' })
    status: string;

    @Column({ name: "priority", type: 'varchar' })
    priority: string;

    @Column({ name: "startDate", type: 'timestamp' })
    startDate: Date;

    @Column({ name: "endDate", type: 'timestamp' })
    endDate: Date;

    @ManyToOne(() => User, (user) => user.tasks)
    @JoinColumn({ name: 'ownerId' })
    user: User;

    @ManyToOne(() => Project, (project) => project.tasks)
    @JoinColumn({ name: 'projectId' })
    project: Project;

    @ManyToMany(() => Reminder, (reminder) => reminder.task)
    reminders: Reminder[];

    @ManyToMany(() => Tag, { cascade: true })
    @JoinTable({
    name: 'tasks_tags',
    joinColumn: { name: 'taskId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tagId', referencedColumnName: 'id' }
    })
    tags: Tag[];
}
