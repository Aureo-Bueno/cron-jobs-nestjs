export interface JWTConfig {
  getJwtSecret(): string;
  getJwtExpirationTime(): number;
  getJwtRefreshSecret(): string;
  getJwtRefreshExpirationTime(): number;
}
