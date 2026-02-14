import { TodoModel } from '../../domain/models/todo.model';
import { ITodoRepository } from '../../domain/repositories/todoRepository.interface';

export class getTodosUseCases {
  constructor(private readonly todoRepository: ITodoRepository) {}

  async execute(): Promise<TodoModel[]> {
    return await this.todoRepository.findAll();
  }
}
