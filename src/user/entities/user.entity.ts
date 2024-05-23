import { Todo } from 'src/todo/entities/todo.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: 'NORMAL_USER_ROLE' })
  role: string;

  // one user can have multipe todos
  @OneToMany(() => Todo, (todo) => todo.user, { cascade: true })
  todos: Todo[];
}
