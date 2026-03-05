import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ITodoRepository } from '../../domain/repositories/todoRepository.interface';
import { Todo } from '../entities/todo.entity';
import { TodoModel } from '../../domain/models/todo.model';
import { ExceptionsService } from '../exceptions/exceptions.service';

@Injectable()
export class DatabaseTodoRepository implements ITodoRepository {
  constructor(
    @InjectRepository(Todo)
    private readonly todoEntityRepository: Repository<Todo>,
    private readonly exceptionService: ExceptionsService,
  ) {}

  async updateContent(id: string, isDone: boolean): Promise<void> {
    const result = await this.todoEntityRepository.update(
      {
        id: id,
      },
      { isDone: isDone },
    );
    if (!result.affected) {
      this.exceptionService.notFoundException({
        message: `Todo ${id} not found`,
      });
    }
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
    const todoEntity = await this.todoEntityRepository.findOne({
      where: { id: String(id) },
    });
    if (!todoEntity) {
      this.exceptionService.notFoundException({
        message: `Todo ${id} not found`,
      });
    }
    return this.toTodo(todoEntity);
  }
  async deleteById(id: number): Promise<void> {
    const result = await this.todoEntityRepository.delete({ id: String(id) });
    if (!result.affected) {
      this.exceptionService.notFoundException({
        message: `Todo ${id} not found`,
      });
    }
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
