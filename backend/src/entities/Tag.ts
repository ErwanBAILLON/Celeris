import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn, ManyToMany, Unique } from 'typeorm';
import { User } from './User';
import { Task } from './Task';

@Entity('tags')
@Unique(['name', 'user'])
export class Tag {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "name", type: 'varchar' })
    name: string;

    @Column({ name: "description", type: 'text', nullable: true })
    description: string;

    @Column({ name: "color", type: 'varchar' })
    color: string;

    @ManyToOne(() => User, (user) => user.tags)
    @JoinColumn({ name: 'owner_id' })
    user: User;

    @ManyToMany(() => Task, (task) => task.tags)
    tasks: Task[];
}
