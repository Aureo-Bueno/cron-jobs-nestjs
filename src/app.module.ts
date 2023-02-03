import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskModule } from './task/task.module';

@Module({
  imports: [ScheduleModule.forRoot(), TaskModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
