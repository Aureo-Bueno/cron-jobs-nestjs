import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskController } from './controllers/task.controller';
import { TaskService } from './service/task.service';
import { RepositoriesModule } from '../infrastructure/repositories/repositories.module';

@Module({
  imports: [ScheduleModule.forRoot(), RepositoriesModule],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
