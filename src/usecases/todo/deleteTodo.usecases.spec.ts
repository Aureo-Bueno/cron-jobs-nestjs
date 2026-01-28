import { deleteTodoUseCases } from './deleteTodo.usecases';
import { ILogger } from '../../domain/logger/logger.interface';
import { TodoRepository } from '../../domain/repositories/todoRepository.interface';

describe('deleteTodoUseCases', () => {
  it('deletes todo and logs action', async () => {
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

    const useCase = new deleteTodoUseCases(logger, todoRepository);
    await useCase.execute(2);

    expect(todoRepository.deleteById).toHaveBeenCalledWith(2);
    expect(logger.log).toHaveBeenCalledWith(
      'deleteTodoUseCases execute',
      'Todo 2 have been deleted',
    );
  });
});
