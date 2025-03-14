import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn, ManyToMany } from 'typeorm';
import { User } from './User';
import { Task } from './Task';

@Entity('tags')
export class Tag {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "name", unique: true, type: 'varchar' })
    name: string;

    @Column({ name: "description", unique: true, type: 'text' })
    description: string;

    @Column({ name: "color", type: 'varchar' })
    color: string;

    @ManyToOne(() => User, (user) => user.tags)
    @JoinColumn({ name: 'ownerId' })
    user: User;

    @ManyToMany(() => Task, (task) => task.tags)
    tasks: Task[];
}
