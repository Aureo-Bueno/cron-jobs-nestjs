import { Controller, Get } from '@nestjs/common';
import { TaskService } from '../service/task.service';

@Controller()
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  getHello(): void {
    return this.taskService.getCrons();
  }
}
