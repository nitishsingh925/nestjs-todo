import { Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo) private readonly todoRepository: Repository<Todo>,
    private UserServices: UserService,
  ) {}

  async create(createTodoDto: CreateTodoDto, userId: number) {
    let todo: Todo = new Todo();
    todo.title = createTodoDto.title;
    todo.completed = false;
    todo.user = await this.UserServices.findOne(userId);
    return this.todoRepository.save(todo);
  }

  findAllTodoByUserNotCompleted(userId: number) {
    return this.todoRepository.find({
      relations: ['user'],
      where: { user: { id: userId }, completed: false },
    });
  }
  findAllTodoByUserCompleted(userId: number) {
    return this.todoRepository.find({
      relations: ['user'],
      where: { user: { id: userId }, completed: true },
    });
  }

  findOne(id: number) {
    return this.todoRepository.findOneBy({ id });
  }

  update(todoId: number) {
    return this.todoRepository.update(todoId, { completed: true });
  }

  remove(todoId: number) {
    return this.todoRepository.delete(todoId);
  }
}
