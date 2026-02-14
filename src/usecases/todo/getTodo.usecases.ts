import { TodoModel } from '../../domain/models/todo.model';
import { ITodoRepository } from '../../domain/repositories/todoRepository.interface';

export class GetTodoUseCases {
  constructor(private readonly todoRepository: ITodoRepository) {}

  async execute(id: number): Promise<TodoModel> {
    return await this.todoRepository.findById(id);
  }
}
