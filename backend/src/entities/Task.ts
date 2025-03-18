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

    @Column({ name: "start_date", type: 'timestamp' })
    startDate: Date;

    @Column({ name: "end_date", type: 'timestamp' })
    endDate: Date;

    @ManyToOne(() => User, (user) => user.tasks)
    @JoinColumn({ name: 'owner_id' })
    user: User;

    @ManyToOne(() => Project, (project) => project.tasks)
    @JoinColumn({ name: 'project_id' })
    project: Project;

    @ManyToMany(() => Reminder, (reminder) => reminder.task)
    reminders: Reminder[];

    @ManyToMany(() => Tag, { cascade: true })
    @JoinTable({
    name: 'tasks_tags',
    joinColumn: { name: 'task_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' }
    })
    tags: Tag[];
}
