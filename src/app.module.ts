import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { LoggerModule } from './infrastructure/logger/logger.module';
import { ExceptionsModule } from './infrastructure/exceptions/exceptions.module';
import { BcryptModule } from './infrastructure/services/bcrypt/bcrypt.module';
import { JwtModule as JwtServiceModule } from './infrastructure/services/jwt/jwt.module';
import { EnvironmentConfigModule } from './infrastructure/config/environment-config/environment-config.module';
import { AuthModule } from './infrastructure/common/auth/auth.module';
import { UsecasesProxyModule } from './infrastructure/services/usecases-proxy/usecases-proxy.module';
import { ControllersModule } from './infrastructure/controllers/controllers.module';
import { TaskModule } from './task/task.module';

@Module({
  imports: [
    PassportModule,
    LoggerModule,
    ExceptionsModule,
    UsecasesProxyModule.register(),
    ControllersModule,
    BcryptModule,
    JwtServiceModule,
    EnvironmentConfigModule,
    AuthModule,
    TaskModule,
  ],
})
export class AppModule {}
