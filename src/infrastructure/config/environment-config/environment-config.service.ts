import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseConfig } from '../../../domain/config/database.interface';
import { JWTConfig } from '../../../domain/config/jwt.interface';

@Injectable()
export class EnvironmentConfigService implements DatabaseConfig, JWTConfig {
  constructor(private configService: ConfigService) {}

  getJwtSecret(): string {
    return this.configService.getOrThrow<string>('JWT_SECRET');
  }

  getJwtExpirationTime(): number {
    return this.configService.getOrThrow<number>('JWT_EXPIRATION_TIME');
  }

  getJwtRefreshSecret(): string {
    return this.configService.getOrThrow<string>('JWT_REFRESH_TOKEN_SECRET');
  }

  getJwtRefreshExpirationTime(): number {
    return this.configService.getOrThrow<number>(
      'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
    );
  }

  getDatabaseHost(): string {
    return this.configService.getOrThrow<string>('DATABASE_HOST');
  }

  getDatabasePort(): number {
    return this.configService.getOrThrow<number>('DATABASE_PORT');
  }

  getDatabaseUser(): string {
    return this.configService.getOrThrow<string>('DATABASE_USER');
  }

  getDatabasePassword(): string {
    return this.configService.getOrThrow<string>('DATABASE_PASSWORD');
  }

  getDatabaseName(): string {
    return this.configService.getOrThrow<string>('DATABASE_NAME');
  }

  getDatabaseSchema(): string {
    return this.configService.getOrThrow<string>('DATABASE_SCHEMA');
  }

  getDatabaseSync(): boolean {
    return this.configService.getOrThrow<boolean>('DATABASE_SYNCHRONIZE');
  }
}
