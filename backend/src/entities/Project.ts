import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { Reminder } from './Reminder';
import { Task } from './Task';

@Entity('projects')
export class Project {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "name", unique: true, type: 'varchar' })
    name: string;

    @Column({ name: "description", unique: true, type: 'text' })
    description: string;

    @Column({ name: "start_date", type: 'timestamp' })
    startDate: Date;

    @Column({ name: "end_date", type: 'timestamp' })
    endDate: Date;

    @ManyToOne(() => User, (user) => user.tasks)
    @JoinColumn({ name: 'owner_id' })
    user: User;

    @OneToMany(() => Reminder, (reminder) => reminder.project)
    reminders: Reminder[];

    @OneToMany(() => Task, (task) => task.project)
    tasks: Task[];
}
