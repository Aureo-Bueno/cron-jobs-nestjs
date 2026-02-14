import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigModule } from '../config/typeorm/typeorm.module';
import { ExceptionsModule } from '../exceptions/exceptions.module';
import { Todo } from '../entities/todo.entity';
import { User } from '../entities/user.entity';
import { DatabaseTodoRepository } from './todo.repository';
import { DatabaseUserRepository } from './user.repository';
import {
  TODO_REPOSITORY,
  USER_REPOSITORY,
} from '../../domain/repositories/repositories.tokens';

@Module({
  imports: [
    TypeOrmConfigModule,
    TypeOrmModule.forFeature([Todo, User]),
    ExceptionsModule,
  ],
  providers: [
    { provide: TODO_REPOSITORY, useClass: DatabaseTodoRepository },
    { provide: USER_REPOSITORY, useClass: DatabaseUserRepository },
  ],
  exports: [TODO_REPOSITORY, USER_REPOSITORY],
})
export class RepositoriesModule {}
