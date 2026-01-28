import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TodoRepository } from '../../domain/repositories/todoRepository.interface';
import { Todo } from '../entities/todo.entity';
import { TodoModel } from '../../domain/models/todo.model';

@Injectable()
export class DatabaseTodoRepository implements TodoRepository {
  constructor(
    @InjectRepository(Todo)
    private readonly todoEntityRepository: Repository<Todo>,
  ) {}

  async updateContent(id: number, isDone: boolean): Promise<void> {
    await this.todoEntityRepository.update(
      {
        id: String(id),
      },
      { isDone: isDone },
    );
  }
  async insert(todo: TodoModel): Promise<void> {
    const todoEntity = this.toTodoEntity(todo);
    await this.todoEntityRepository.insert(todoEntity);
  }
  async findAll(): Promise<TodoModel[]> {
    const todoEntity = await this.todoEntityRepository.find();
    return todoEntity.map((todoEntity) => this.toTodo(todoEntity));
  }
  async findAllDone(): Promise<TodoModel[]> {
    const todoEntity = await this.todoEntityRepository.find({
      where: { isDone: true },
    });
    return todoEntity.map((todoEntity) => this.toTodo(todoEntity));
  }
  async findById(id: number): Promise<TodoModel> {
    const todoEntity = await this.todoEntityRepository.findOneOrFail({
      where: { id: String(id) },
    });
    return this.toTodo(todoEntity);
  }
  async deleteById(id: number): Promise<void> {
    await this.todoEntityRepository.delete({ id: String(id) });
  }

  private toTodo(todoEntity: Todo): TodoModel {
    const todo: TodoModel = new TodoModel();

    todo.id = todoEntity.id;
    todo.content = todoEntity.content;
    todo.isDone = todoEntity.isDone;
    todo.createdAt = todoEntity.createdAt;
    todo.updatedAt = todoEntity.updatedAt;

    return todo;
  }

  private toTodoEntity(todo: TodoModel): Todo {
    const todoEntity: Todo = new Todo();

    todoEntity.id = todo.id;
    todoEntity.content = todo.content;
    todoEntity.isDone = todo.isDone;

    return todoEntity;
  }
}
