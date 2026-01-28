import { GetTodoUseCases } from './getTodo.usecases';
import { TodoRepository } from '../../domain/repositories/todoRepository.interface';
import { TodoModel } from '../../domain/models/todo.model';

describe('GetTodoUseCases', () => {
  it('returns todo by id', async () => {
    const todoRepository: jest.Mocked<TodoRepository> = {
      insert: jest.fn(),
      findAll: jest.fn(),
      findAllDone: jest.fn(),
      findById: jest.fn(),
      updateContent: jest.fn(),
      deleteById: jest.fn(),
    };
    const todo: TodoModel = {
      id: '1',
      content: 'task',
      isDone: false,
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
      updatedAt: new Date('2024-01-02T00:00:00.000Z'),
    };
    todoRepository.findById.mockResolvedValue(todo);

    const useCase = new GetTodoUseCases(todoRepository);
    const result = await useCase.execute(1);

    expect(todoRepository.findById).toHaveBeenCalledWith(1);
    expect(result).toEqual(todo);
  });
});
