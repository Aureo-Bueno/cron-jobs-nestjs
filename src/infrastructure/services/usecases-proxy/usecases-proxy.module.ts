import { DynamicModule, Module } from '@nestjs/common';
import { UseCaseProxy } from './usecases-proxy';
import { JwtModule } from '../jwt/jwt.module';
import { BcryptModule } from '../bcrypt/bcrypt.module';
import { JwtTokenService } from '../jwt/jwt.service';
import { IsAuthenticatedUseCases } from '../../../usecases/auth/isAuthencated.usecases';
import { LoginUseCases } from '../../../usecases/auth/login.usecases';
import { LogoutUseCases } from '../../../usecases/auth/logout.usecases';
import { RegisterUseCases } from '../../../usecases/auth/register.usecases';
import { addTodoUseCases } from '../../../usecases/todo/addTodo.usecases';
import { deleteTodoUseCases } from '../../../usecases/todo/deleteTodo.usecases';
import { GetTodoUseCases } from '../../../usecases/todo/getTodo.usecases';
import { getTodosUseCases } from '../../../usecases/todo/getTodos.usecases';
import { updateTodoUseCases } from '../../../usecases/todo/updateTodo.usecases';
import { EnvironmentConfigModule } from '../../config/environment-config/environment-config.module';
import { EnvironmentConfigService } from '../../config/environment-config/environment-config.service';
import { ExceptionsModule } from '../../exceptions/exceptions.module';
import { ExceptionsService } from '../../exceptions/exceptions.service';
import { LoggerModule } from '../../logger/logger.module';
import { LoggerService } from '../../logger/logger.service';
import { RepositoriesModule } from '../../repositories/repositories.module';
import { BcryptService } from '../bcrypt/bcrypt.service';
import {
  TODO_REPOSITORY,
  USER_REPOSITORY,
} from '../../../domain/repositories/repositories.tokens';
import { ITodoRepository } from '../../../domain/repositories/todoRepository.interface';
import { IUserRepository } from '../../../domain/repositories/userRepository.interface';

@Module({
  imports: [
    LoggerModule,
    JwtModule,
    BcryptModule,
    EnvironmentConfigModule,
    RepositoriesModule,
    ExceptionsModule,
  ],
})
export class UsecasesProxyModule {
  static LOGIN_USECASES_PROXY = 'LoginUseCasesProxy';
  static REGISTER_USECASES_PROXY = 'RegisterUseCasesProxy';
  static IS_AUTHENTICATED_USECASES_PROXY = 'IsAuthenticatedUseCasesProxy';
  static LOGOUT_USECASES_PROXY = 'LogoutUseCasesProxy';

  static GET_TODO_USECASES_PROXY = 'getTodoUsecasesProxy';
  static GET_TODOS_USECASES_PROXY = 'getTodosUsecasesProxy';
  static POST_TODO_USECASES_PROXY = 'postTodoUsecasesProxy';
  static DELETE_TODO_USECASES_PROXY = 'deleteTodoUsecasesProxy';
  static PUT_TODO_USECASES_PROXY = 'putTodoUsecasesProxy';

  static register(): DynamicModule {
    return {
      module: UsecasesProxyModule,
      providers: [
        {
          inject: [
            LoggerService,
            JwtTokenService,
            EnvironmentConfigService,
            USER_REPOSITORY,
            BcryptService,
          ],
          provide: UsecasesProxyModule.LOGIN_USECASES_PROXY,
          useFactory: (
            logger: LoggerService,
            jwtTokenService: JwtTokenService,
            config: EnvironmentConfigService,
            userRepo: IUserRepository,
            bcryptService: BcryptService,
          ) =>
            new UseCaseProxy(
              new LoginUseCases(
                logger,
                jwtTokenService,
                config,
                userRepo,
                bcryptService,
              ),
            ),
        },
        {
          inject: [
            LoggerService,
            USER_REPOSITORY,
            BcryptService,
            ExceptionsService,
          ],
          provide: UsecasesProxyModule.REGISTER_USECASES_PROXY,
          useFactory: (
            logger: LoggerService,
            userRepo: IUserRepository,
            bcryptService: BcryptService,
            exceptionsService: ExceptionsService,
          ) =>
            new UseCaseProxy(
              new RegisterUseCases(
                logger,
                userRepo,
                bcryptService,
                exceptionsService,
              ),
            ),
        },
        {
          inject: [USER_REPOSITORY, ExceptionsService],
          provide: UsecasesProxyModule.IS_AUTHENTICATED_USECASES_PROXY,
          useFactory: (
            userRepo: IUserRepository,
            exceptionsService: ExceptionsService,
          ) =>
            new UseCaseProxy(
              new IsAuthenticatedUseCases(userRepo, exceptionsService),
            ),
        },
        {
          inject: [],
          provide: UsecasesProxyModule.LOGOUT_USECASES_PROXY,
          useFactory: () => new UseCaseProxy(new LogoutUseCases()),
        },
        {
          inject: [TODO_REPOSITORY],
          provide: UsecasesProxyModule.GET_TODO_USECASES_PROXY,
          useFactory: (todoRepository: ITodoRepository) =>
            new UseCaseProxy(new GetTodoUseCases(todoRepository)),
        },
        {
          inject: [TODO_REPOSITORY],
          provide: UsecasesProxyModule.GET_TODOS_USECASES_PROXY,
          useFactory: (todoRepository: ITodoRepository) =>
            new UseCaseProxy(new getTodosUseCases(todoRepository)),
        },
        {
          inject: [LoggerService, TODO_REPOSITORY],
          provide: UsecasesProxyModule.POST_TODO_USECASES_PROXY,
          useFactory: (
            logger: LoggerService,
            todoRepository: ITodoRepository,
          ) => new UseCaseProxy(new addTodoUseCases(logger, todoRepository)),
        },
        {
          inject: [LoggerService, TODO_REPOSITORY],
          provide: UsecasesProxyModule.PUT_TODO_USECASES_PROXY,
          useFactory: (
            logger: LoggerService,
            todoRepository: ITodoRepository,
          ) => new UseCaseProxy(new updateTodoUseCases(logger, todoRepository)),
        },
        {
          inject: [LoggerService, TODO_REPOSITORY],
          provide: UsecasesProxyModule.DELETE_TODO_USECASES_PROXY,
          useFactory: (
            logger: LoggerService,
            todoRepository: ITodoRepository,
          ) => new UseCaseProxy(new deleteTodoUseCases(logger, todoRepository)),
        },
      ],
      exports: [
        UsecasesProxyModule.GET_TODO_USECASES_PROXY,
        UsecasesProxyModule.GET_TODOS_USECASES_PROXY,
        UsecasesProxyModule.POST_TODO_USECASES_PROXY,
        UsecasesProxyModule.PUT_TODO_USECASES_PROXY,
        UsecasesProxyModule.DELETE_TODO_USECASES_PROXY,
        UsecasesProxyModule.LOGIN_USECASES_PROXY,
        UsecasesProxyModule.REGISTER_USECASES_PROXY,
        UsecasesProxyModule.IS_AUTHENTICATED_USECASES_PROXY,
        UsecasesProxyModule.LOGOUT_USECASES_PROXY,
      ],
    };
  }
}
