import { addTodoUseCases } from './addTodo.usecases';
import { ILogger } from '../../domain/logger/logger.interface';
import { TodoRepository } from '../../domain/repositories/todoRepository.interface';
import { TodoModel } from '../../domain/models/todo.model';

describe('addTodoUseCases', () => {
  it('creates a todo and logs insertion', async () => {
    const logger: jest.Mocked<ILogger> = {
      debug: jest.fn(),
      log: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      verbose: jest.fn(),
    };
    const todoRepository: jest.Mocked<TodoRepository> = {
      insert: jest.fn(),
      findAll: jest.fn(),
      findAllDone: jest.fn(),
      findById: jest.fn(),
      updateContent: jest.fn(),
      deleteById: jest.fn(),
    };

    const useCase = new addTodoUseCases(logger, todoRepository);
    const result = await useCase.execute('new task');

    expect(result).toBeInstanceOf(TodoModel);
    expect(result.content).toBe('new task');
    expect(result.isDone).toBe(false);
    expect(todoRepository.insert).toHaveBeenCalledWith(result);
    expect(logger.log).toHaveBeenCalledWith(
      'addTodoUseCases execute',
      'New todo have been inserted',
    );
  });
});
