import { ApiProperty } from '@nestjs/swagger';
import { TodoModel } from 'src/domain/models/todo.model';

export class TodoPresenter {
  @ApiProperty()
  id: string;
  @ApiProperty()
  content: string;
  @ApiProperty()
  isDone: boolean;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;

  constructor(todo: TodoModel) {
    this.id = todo.id;
    this.content = todo.content;
    this.isDone = todo.isDone;
    this.createdAt = todo.createdAt;
    this.updatedAt = todo.updatedAt;
  }
}
