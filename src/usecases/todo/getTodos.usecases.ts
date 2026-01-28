import { TodoModel } from '../../domain/models/todo.model';
import { TodoRepository } from '../../domain/repositories/todoRepository.interface';

export class getTodosUseCases {
  constructor(private readonly todoRepository: TodoRepository) {}

  async execute(): Promise<TodoModel[]> {
    return await this.todoRepository.findAll();
  }
}
