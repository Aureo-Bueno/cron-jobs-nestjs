import { Module } from '@nestjs/common';
import { UsecasesProxyModule } from '../services/usecases-proxy/usecases-proxy.module';
import { AuthController } from './auth/auth.controller';
import { TodoController } from './todo/todo.controller';

@Module({
  imports: [UsecasesProxyModule.register()],
  controllers: [TodoController, AuthController],
})
export class ControllersModule {}
