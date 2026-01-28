import { TodoModel } from '../models/todo.model';

export interface TodoRepository {
  insert(todo: TodoModel): Promise<void>;
  findAll(): Promise<TodoModel[]>;
  findAllDone(): Promise<TodoModel[]>;
  findById(id: number): Promise<TodoModel>;
  updateContent(id: number, isDone: boolean): Promise<void>;
  deleteById(id: number): Promise<void>;
}
