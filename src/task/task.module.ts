import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskController } from './controllers/task.controller';
import { TaskService } from './service/task.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
