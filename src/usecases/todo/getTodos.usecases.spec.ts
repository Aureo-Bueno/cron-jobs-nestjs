import { getTodosUseCases } from './getTodos.usecases';
import { TodoRepository } from '../../domain/repositories/todoRepository.interface';
import { TodoModel } from '../../domain/models/todo.model';

describe('getTodosUseCases', () => {
  it('returns all todos', async () => {
    const todoRepository: jest.Mocked<TodoRepository> = {
      insert: jest.fn(),
      findAll: jest.fn(),
      findAllDone: jest.fn(),
      findById: jest.fn(),
      updateContent: jest.fn(),
      deleteById: jest.fn(),
    };
    const todos: TodoModel[] = [
      {
        id: '1',
        content: 'task',
        isDone: false,
        createdAt: new Date('2024-01-01T00:00:00.000Z'),
        updatedAt: new Date('2024-01-02T00:00:00.000Z'),
      },
    ];
    todoRepository.findAll.mockResolvedValue(todos);

    const useCase = new getTodosUseCases(todoRepository);
    const result = await useCase.execute();

    expect(todoRepository.findAll).toHaveBeenCalled();
    expect(result).toEqual(todos);
  });
});
