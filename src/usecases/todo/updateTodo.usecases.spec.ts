import { updateTodoUseCases } from './updateTodo.usecases';
import { ILogger } from '../../domain/logger/logger.interface';
import { TodoRepository } from '../../domain/repositories/todoRepository.interface';

describe('updateTodoUseCases', () => {
  it('updates todo and logs action', async () => {
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

    const useCase = new updateTodoUseCases(logger, todoRepository);
    await useCase.execute(1, true);

    expect(todoRepository.updateContent).toHaveBeenCalledWith(1, true);
    expect(logger.log).toHaveBeenCalledWith(
      'updateTodoUseCases execute',
      'Todo 1 have been updated',
    );
  });
});
