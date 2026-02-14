import { Module } from '@nestjs/common';
import { ExceptionsModule } from '../../exceptions/exceptions.module';
import { LoggerModule } from '../../logger/logger.module';
import { UsecasesProxyModule } from '../../services/usecases-proxy/usecases-proxy.module';
import { EnvironmentConfigModule } from '../../config/environment-config/environment-config.module';
import { LocalStrategy } from '../strategies/local.strategy';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { JwtRefreshTokenStrategy } from '../strategies/jwtRefresh.strategy';

@Module({
  imports: [
    LoggerModule,
    ExceptionsModule,
    EnvironmentConfigModule,
    UsecasesProxyModule.register(),
  ],
  providers: [LocalStrategy, JwtStrategy, JwtRefreshTokenStrategy],
})
export class AuthModule {}
