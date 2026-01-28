import { ILogger } from '../../domain/logger/logger.interface';
import { TodoModel } from '../../domain/models/todo.model';
import { TodoRepository } from '../../domain/repositories/todoRepository.interface';

export class addTodoUseCases {
  constructor(
    private readonly logger: ILogger,
    private readonly todoRepository: TodoRepository,
  ) {}

  async execute(content: string): Promise<TodoModel> {
    const todo = new TodoModel();
    todo.content = content;
    todo.isDone = false;
    await this.todoRepository.insert(todo);
    this.logger.log('addTodoUseCases execute', 'New todo have been inserted');
    return todo;
  }
}
