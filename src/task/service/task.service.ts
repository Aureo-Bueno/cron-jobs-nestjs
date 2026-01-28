import { Injectable, Logger } from '@nestjs/common';
import {
  Cron,
  CronExpression,
  SchedulerRegistry,
  Timeout,
} from '@nestjs/schedule';
import { CronJob } from 'cron';
import { DatabaseTodoRepository } from '../../infrastructure/repositories/todo.repository';
import { DatabaseUserRepository } from '../../infrastructure/repositories/user.repository';
import { TodoModel } from '../../domain/models/todo.model';
import { UserModel } from '../../domain/models/user.model';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private readonly todoRepository: DatabaseTodoRepository,
    private readonly userRepository: DatabaseUserRepository,
  ) {}

  @Cron(CronExpression.EVERY_30_SECONDS)
  async handleCron() {
    try {
      const [doneTodos, oldUsers] = await Promise.all([
        this.listDoneTodos(),
        this.listUsersWithLastLoginOverSevenDays(),
      ]);

      const doneTodoLog = doneTodos.map((todo) => ({
        id: todo.id,
        content: todo.content,
        isDone: todo.isDone,
        createdAt: todo.createdAt,
        updatedAt: todo.updatedAt,
      }));
      const oldUserLog = oldUsers.map((user) => ({
        id: user.id,
        username: user.username,
        lastLogin: user.lastLogin,
      }));

      this.logger.log(
        `Done todos (${doneTodoLog.length}): ${JSON.stringify(doneTodoLog)}`,
      );
      this.logger.log(
        `Users with last login > 7 days (${oldUserLog.length}): ${JSON.stringify(oldUserLog)}`,
      );
    } catch (error) {
      this.logger.error('Failed to fetch cron data', error instanceof Error ? error.stack : String(error));
    }
  }

  @Timeout(5000)
  handleTimeout() {
    this.logger.debug('Call on in 5 seconds');
  }

  async addCronJob(name: string, seconds: string) {
    const job = new CronJob(`${seconds} * * * * *`, () => {
      this.logger.warn(`time (${seconds}) for job ${name} to run!`);
    });

    this.schedulerRegistry.addCronJob(name, job);
    await job.start();

    this.logger.warn(
      `job ${name} added for each minute at ${seconds} seconds!`,
    );
  }

  getCrons() {
    const jobs = this.schedulerRegistry.getCronJobs();
    jobs.forEach((value, key) => {
      let next;
      try {
        next = value.nextDates();
      } catch (e) {
        next = 'error: next fire date is in the past!';
      }
      this.logger.log(`job: ${key} -> next: ${next}`);
    });
  }

  async listDoneTodos(): Promise<TodoModel[]> {
    return this.todoRepository.findAllDone();
  }

  async listUsersWithLastLoginOverSevenDays(): Promise<UserModel[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 7);
    return this.userRepository.getUsersWithLastLoginBefore(cutoffDate);
  }
}
