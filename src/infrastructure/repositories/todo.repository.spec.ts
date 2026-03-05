import { Repository } from 'typeorm';
import { DatabaseTodoRepository } from './todo.repository';
import {
  IException,
  IFormatExceptionMessage,
} from '../../domain/exception/exceptions.interface';
import { Todo } from '../entities/todo.entity';
import { TodoModel } from '../../domain/models/todo.model';

const buildExceptionsService = (): jest.Mocked<IException> => ({
  badRequestException: jest.fn<never, [IFormatExceptionMessage | undefined]>(),
  internalServerErrorException: jest.fn<
    never,
    [IFormatExceptionMessage | undefined]
  >(),
  forbiddenException: jest.fn<never, [IFormatExceptionMessage | undefined]>(),
  unauthorizedException: jest.fn<
    never,
    [IFormatExceptionMessage | undefined]
  >(),
  notFoundException: jest.fn<never, [IFormatExceptionMessage | undefined]>(),
  conflictException: jest.fn<never, [IFormatExceptionMessage | undefined]>(),
  unprocessableEntityException: jest.fn<
    never,
    [IFormatExceptionMessage | undefined]
  >(),
  tooManyRequestsException: jest.fn<
    never,
    [IFormatExceptionMessage | undefined]
  >(),
  serviceUnavailableException: jest.fn<
    never,
    [IFormatExceptionMessage | undefined]
  >(),
});

const buildRepository = () => {
  const todoEntityRepository: jest.Mocked<Repository<Todo>> = {
    update: jest.fn(),
    insert: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  } as unknown as jest.Mocked<Repository<Todo>>;
  const exceptionsService = buildExceptionsService();
  const repository = new DatabaseTodoRepository(
    todoEntityRepository,
    exceptionsService as unknown as any,
  );

  return { repository, todoEntityRepository, exceptionsService };
};

describe('DatabaseTodoRepository', () => {
  it('returns mapped todo when found', async () => {
    const { repository, todoEntityRepository, exceptionsService } =
      buildRepository();
    const entity: Todo = {
      id: '1',
      content: 'task',
      isDone: false,
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
      updatedAt: new Date('2024-01-02T00:00:00.000Z'),
    };
    todoEntityRepository.findOne.mockResolvedValue(entity);

    const result = await repository.findById(1);

    expect(result).toEqual<TodoModel>({
      id: '1',
      content: 'task',
      isDone: false,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
    expect(exceptionsService.notFoundException).not.toHaveBeenCalled();
  });

  it('throws not found when todo does not exist', async () => {
    const { repository, todoEntityRepository, exceptionsService } =
      buildRepository();
    todoEntityRepository.findOne.mockResolvedValue(null);
    exceptionsService.notFoundException.mockImplementation(() => {
      throw new Error('not found');
    });

    await expect(repository.findById(10)).rejects.toThrow('not found');
    expect(exceptionsService.notFoundException).toHaveBeenCalledWith({
      message: 'Todo 10 not found',
    });
  });

  it('throws not found when update affects no rows', async () => {
    const { repository, todoEntityRepository, exceptionsService } =
      buildRepository();
    todoEntityRepository.update.mockResolvedValue({ affected: 0 } as any);
    exceptionsService.notFoundException.mockImplementation(() => {
      throw new Error('not found');
    });

    await expect(repository.updateContent('3', true)).rejects.toThrow('not found');
    expect(exceptionsService.notFoundException).toHaveBeenCalledWith({
      message: 'Todo 3 not found',
    });
  });

  it('throws not found when delete affects no rows', async () => {
    const { repository, todoEntityRepository, exceptionsService } =
      buildRepository();
    todoEntityRepository.delete.mockResolvedValue({ affected: 0 } as any);
    exceptionsService.notFoundException.mockImplementation(() => {
      throw new Error('not found');
    });

    await expect(repository.deleteById(4)).rejects.toThrow('not found');
    expect(exceptionsService.notFoundException).toHaveBeenCalledWith({
      message: 'Todo 4 not found',
    });
  });

  it('does not throw when update affects rows', async () => {
    const { repository, todoEntityRepository, exceptionsService } =
      buildRepository();
    todoEntityRepository.update.mockResolvedValue({ affected: 1 } as any);

    await repository.updateContent('2', true);

    expect(exceptionsService.notFoundException).not.toHaveBeenCalled();
  });

  it('does not throw when delete affects rows', async () => {
    const { repository, todoEntityRepository, exceptionsService } =
      buildRepository();
    todoEntityRepository.delete.mockResolvedValue({ affected: 1 } as any);

    await repository.deleteById(5);

    expect(exceptionsService.notFoundException).not.toHaveBeenCalled();
  });

  it('inserts todo using mapped entity', async () => {
    const { repository, todoEntityRepository } = buildRepository();
    const todo: TodoModel = {
      id: '10',
      content: 'new task',
      isDone: false,
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
      updatedAt: new Date('2024-01-02T00:00:00.000Z'),
    };

    await repository.insert(todo);

    expect(todoEntityRepository.insert).toHaveBeenCalledWith({
      id: '10',
      content: 'new task',
      isDone: false,
    });
  });

  it('returns all todos mapped', async () => {
    const { repository, todoEntityRepository } = buildRepository();
    const entities: Todo[] = [
      {
        id: '1',
        content: 'task',
        isDone: false,
        createdAt: new Date('2024-01-01T00:00:00.000Z'),
        updatedAt: new Date('2024-01-02T00:00:00.000Z'),
      },
    ];
    todoEntityRepository.find.mockResolvedValue(entities);

    const result = await repository.findAll();

    expect(result).toEqual<TodoModel[]>([
      {
        id: '1',
        content: 'task',
        isDone: false,
        createdAt: entities[0].createdAt,
        updatedAt: entities[0].updatedAt,
      },
    ]);
  });

  it('returns only done todos mapped', async () => {
    const { repository, todoEntityRepository } = buildRepository();
    const entities: Todo[] = [
      {
        id: '2',
        content: 'done',
        isDone: true,
        createdAt: new Date('2024-01-01T00:00:00.000Z'),
        updatedAt: new Date('2024-01-02T00:00:00.000Z'),
      },
    ];
    todoEntityRepository.find.mockResolvedValue(entities);

    const result = await repository.findAllDone();

    expect(todoEntityRepository.find).toHaveBeenCalledWith({
      where: { isDone: true },
    });
    expect(result).toEqual<TodoModel[]>([
      {
        id: '2',
        content: 'done',
        isDone: true,
        createdAt: entities[0].createdAt,
        updatedAt: entities[0].updatedAt,
      },
    ]);
  });
});
