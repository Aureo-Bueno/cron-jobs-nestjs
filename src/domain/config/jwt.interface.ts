export interface IJWTConfig {
  getJwtSecret(): string;
  getJwtExpirationTime(): number;
  getJwtRefreshSecret(): string;
  getJwtRefreshExpirationTime(): number;
}
