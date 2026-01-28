import { SchedulerRegistry } from '@nestjs/schedule';
import { TaskService } from './task.service';
import { DatabaseTodoRepository } from '../../infrastructure/repositories/todo.repository';
import { DatabaseUserRepository } from '../../infrastructure/repositories/user.repository';
import { TodoModel } from '../../domain/models/todo.model';
import { UserModel } from '../../domain/models/user.model';

jest.mock('cron', () => ({
  CronJob: jest.fn().mockImplementation((cronTime: string, onTick: () => void) => ({
    cronTime,
    onTick,
    start: jest.fn().mockResolvedValue(undefined),
    nextDates: jest.fn(),
  })),
}));

const buildService = () => {
  const schedulerRegistry: jest.Mocked<SchedulerRegistry> = {
    addCronJob: jest.fn(),
    getCronJobs: jest.fn(),
  } as unknown as jest.Mocked<SchedulerRegistry>;
  const todoRepository: jest.Mocked<DatabaseTodoRepository> = {
    findAllDone: jest.fn(),
  } as unknown as jest.Mocked<DatabaseTodoRepository>;
  const userRepository: jest.Mocked<DatabaseUserRepository> = {
    getUsersWithLastLoginBefore: jest.fn(),
  } as unknown as jest.Mocked<DatabaseUserRepository>;

  const service = new TaskService(
    schedulerRegistry,
    todoRepository,
    userRepository,
  );
  const logger = {
    debug: jest.fn(),
    warn: jest.fn(),
    log: jest.fn(),
    error: jest.fn(),
  };
  (service as unknown as { logger: typeof logger }).logger = logger;

  return {
    service,
    schedulerRegistry,
    todoRepository,
    userRepository,
    logger,
  };
};

describe('TaskService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('logs done todos and stale users on cron', async () => {
    const { service, todoRepository, userRepository, logger } = buildService();
    const doneTodos: TodoModel[] = [
      {
        id: '1',
        content: 'task',
        isDone: true,
        createdAt: new Date('2024-01-01T00:00:00.000Z'),
        updatedAt: new Date('2024-01-02T00:00:00.000Z'),
      },
    ];
    const users: UserModel[] = [
      {
        id: 1,
        username: 'demo',
        password: 'hash',
        createDate: new Date('2024-01-01T00:00:00.000Z'),
        updatedDate: new Date('2024-01-02T00:00:00.000Z'),
        lastLogin: new Date('2024-01-01T00:00:00.000Z'),
        hashRefreshToken: 'refresh',
      },
    ];
    todoRepository.findAllDone.mockResolvedValue(doneTodos);
    userRepository.getUsersWithLastLoginBefore.mockResolvedValue(users);

    await service.handleCron();

    expect(logger.log).toHaveBeenCalledTimes(2);
    expect(logger.log).toHaveBeenCalledWith(
      expect.stringContaining('Done todos (1):'),
    );
    expect(logger.log).toHaveBeenCalledWith(
      expect.stringContaining('Users with last login > 7 days (1):'),
    );
  });

  it('logs cron errors when fetching data fails', async () => {
    const { service, logger } = buildService();
    jest
      .spyOn(service, 'listDoneTodos')
      .mockRejectedValue(new Error('boom'));

    await service.handleCron();

    expect(logger.error).toHaveBeenCalledWith(
      'Failed to fetch cron data',
      expect.any(String),
    );
  });

  it('logs timeout execution', () => {
    const { service, logger } = buildService();

    service.handleTimeout();

    expect(logger.debug).toHaveBeenCalledWith('Call on in 5 seconds');
  });

  it('adds cron job and logs registration', async () => {
    const { service, schedulerRegistry, logger } = buildService();
    const { CronJob } = jest.requireMock('cron') as {
      CronJob: jest.Mock;
    };

    await service.addCronJob('job-name', '5');

    expect(CronJob).toHaveBeenCalledWith(
      '5 * * * * *',
      expect.any(Function),
    );
    const jobInstance = CronJob.mock.results[0].value;
    expect(schedulerRegistry.addCronJob).toHaveBeenCalledWith(
      'job-name',
      jobInstance,
    );
    expect(jobInstance.start).toHaveBeenCalled();
    expect(logger.warn).toHaveBeenCalledWith(
      'job job-name added for each minute at 5 seconds!',
    );
  });

  it('logs upcoming cron executions', () => {
    const { service, schedulerRegistry, logger } = buildService();
    const jobOk = { nextDates: jest.fn().mockReturnValue('next-date') };
    const jobError = {
      nextDates: jest.fn().mockImplementation(() => {
        throw new Error('past');
      }),
    };
    schedulerRegistry.getCronJobs.mockReturnValue(
      new Map([
        ['ok', jobOk],
        ['error', jobError],
      ]) as never,
    );

    service.getCrons();

    expect(logger.log).toHaveBeenCalledWith('job: ok -> next: next-date');
    expect(logger.log).toHaveBeenCalledWith(
      'job: error -> next: error: next fire date is in the past!',
    );
  });

  it('lists done todos via repository', async () => {
    const { service, todoRepository } = buildService();
    todoRepository.findAllDone.mockResolvedValue([]);

    const result = await service.listDoneTodos();

    expect(todoRepository.findAllDone).toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it('lists users with last login older than seven days', async () => {
    const { service, userRepository } = buildService();
    jest.useFakeTimers().setSystemTime(new Date('2024-01-08T00:00:00.000Z'));
    userRepository.getUsersWithLastLoginBefore.mockResolvedValue([]);

    await service.listUsersWithLastLoginOverSevenDays();

    expect(userRepository.getUsersWithLastLoginBefore).toHaveBeenCalledWith(
      new Date('2024-01-01T00:00:00.000Z'),
    );
  });
});
