import { LoginUseCases } from './login.usecases';
import { IBcryptService } from '../../domain/adapters/bcrypt.interface';
import { IJwtService } from '../../domain/adapters/jwt.interface';
import { JWTConfig } from '../../domain/config/jwt.interface';
import { ILogger } from '../../domain/logger/logger.interface';
import { UserRepository } from '../../domain/repositories/userRepository.interface';
import { UserModel } from '../../domain/models/user.model';

const buildUseCase = () => {
  const logger: jest.Mocked<ILogger> = {
    debug: jest.fn(),
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    verbose: jest.fn(),
  };
  const jwtTokenService: jest.Mocked<IJwtService> = {
    checkToken: jest.fn(),
    createToken: jest.fn(),
  };
  const jwtConfig: jest.Mocked<JWTConfig> = {
    getJwtSecret: jest.fn(),
    getJwtExpirationTime: jest.fn(),
    getJwtRefreshSecret: jest.fn(),
    getJwtRefreshExpirationTime: jest.fn(),
  };
  const userRepository: jest.Mocked<UserRepository> = {
    getUserByUsername: jest.fn(),
    getUsersWithLastLoginBefore: jest.fn(),
    updateLastLogin: jest.fn(),
    updateRefreshToken: jest.fn(),
  };
  const bcryptService: jest.Mocked<IBcryptService> = {
    hash: jest.fn(),
    compare: jest.fn(),
  };

  const useCase = new LoginUseCases(
    logger,
    jwtTokenService,
    jwtConfig,
    userRepository,
    bcryptService,
  );

  return {
    useCase,
    logger,
    jwtTokenService,
    jwtConfig,
    userRepository,
    bcryptService,
  };
};

const buildUser = (): UserModel => ({
  id: 1,
  username: 'demo',
  password: 'hashed',
  createDate: new Date('2024-01-01T00:00:00.000Z'),
  updatedDate: new Date('2024-01-02T00:00:00.000Z'),
  lastLogin: undefined,
  hashRefreshToken: 'refresh-hash',
});

describe('LoginUseCases', () => {
  it('creates auth cookie with JWT token', async () => {
    const { useCase, logger, jwtTokenService, jwtConfig } = buildUseCase();
    jwtConfig.getJwtSecret.mockReturnValue('secret');
    jwtConfig.getJwtExpirationTime.mockReturnValue(3600);
    jwtTokenService.createToken.mockReturnValue('token');

    const result = await useCase.getCookieWithJwtToken('alice');

    expect(logger.log).toHaveBeenCalledWith(
      'LoginUseCases execute',
      'The user alice have been logged.',
    );
    expect(jwtTokenService.createToken).toHaveBeenCalledWith(
      { username: 'alice' },
      'secret',
      3600,
    );
    expect(result).toBe('Authentication=token; HttpOnly; Path=/; Max-Age=3600');
  });

  it('creates refresh cookie and stores hashed refresh token', async () => {
    const { useCase, jwtTokenService, jwtConfig, bcryptService, userRepository } =
      buildUseCase();
    jwtConfig.getJwtRefreshSecret.mockReturnValue('refresh-secret');
    jwtConfig.getJwtRefreshExpirationTime.mockReturnValue(7200);
    jwtTokenService.createToken.mockReturnValue('refresh-token');
    bcryptService.hash.mockResolvedValue('hashed-refresh');

    const result = await useCase.getCookieWithJwtRefreshToken('bob');

    expect(jwtTokenService.createToken).toHaveBeenCalledWith(
      { username: 'bob' },
      'refresh-secret',
      7200,
    );
    expect(bcryptService.hash).toHaveBeenCalledWith('refresh-token');
    expect(userRepository.updateRefreshToken).toHaveBeenCalledWith(
      'bob',
      'hashed-refresh',
    );
    expect(result).toBe('Refresh=refresh-token; HttpOnly; Path=/; Max-Age=7200');
  });

  it('returns null for local strategy when user is missing', async () => {
    const { useCase, userRepository, bcryptService } = buildUseCase();
    userRepository.getUserByUsername.mockResolvedValue(null);

    const result = await useCase.validateUserForLocalStragtegy(
      'missing',
      'pass',
    );

    expect(result).toBeNull();
    expect(bcryptService.compare).not.toHaveBeenCalled();
  });

  it('returns user for local strategy when password matches', async () => {
    const { useCase, userRepository, bcryptService } = buildUseCase();
    const user = buildUser();
    userRepository.getUserByUsername.mockResolvedValue(user);
    bcryptService.compare.mockResolvedValue(true);

    const result = await useCase.validateUserForLocalStragtegy(
      'demo',
      'pass',
    );

    expect(result).toEqual(user);
    expect(userRepository.updateLastLogin).toHaveBeenCalledWith('demo');
  });

  it('returns null for local strategy when password does not match', async () => {
    const { useCase, userRepository, bcryptService } = buildUseCase();
    const user = buildUser();
    userRepository.getUserByUsername.mockResolvedValue(user);
    bcryptService.compare.mockResolvedValue(false);

    const result = await useCase.validateUserForLocalStragtegy(
      'demo',
      'wrong',
    );

    expect(result).toBeNull();
    expect(userRepository.updateLastLogin).not.toHaveBeenCalled();
  });

  it('returns user for JWT strategy when present', async () => {
    const { useCase, userRepository } = buildUseCase();
    const user = buildUser();
    userRepository.getUserByUsername.mockResolvedValue(user);

    const result = await useCase.validateUserForJWTStragtegy('demo');

    expect(result).toEqual(user);
  });

  it('returns null for JWT strategy when missing', async () => {
    const { useCase, userRepository } = buildUseCase();
    userRepository.getUserByUsername.mockResolvedValue(null);

    const result = await useCase.validateUserForJWTStragtegy('missing');

    expect(result).toBeNull();
  });

  it('updates login time via repository', async () => {
    const { useCase, userRepository } = buildUseCase();

    await useCase.updateLoginTime('demo');

    expect(userRepository.updateLastLogin).toHaveBeenCalledWith('demo');
  });

  it('hashes and stores refresh token', async () => {
    const { useCase, bcryptService, userRepository } = buildUseCase();
    bcryptService.hash.mockResolvedValue('hashed');

    await useCase.setCurrentRefreshToken('refresh', 'demo');

    expect(bcryptService.hash).toHaveBeenCalledWith('refresh');
    expect(userRepository.updateRefreshToken).toHaveBeenCalledWith(
      'demo',
      'hashed',
    );
  });

  it('returns user when refresh token matches', async () => {
    const { useCase, userRepository, bcryptService } = buildUseCase();
    const user = buildUser();
    userRepository.getUserByUsername.mockResolvedValue(user);
    bcryptService.compare.mockResolvedValue(true);

    const result = await useCase.getUserIfRefreshTokenMatches(
      'refresh',
      'demo',
    );

    expect(result).toEqual(user);
  });

  it('returns null when refresh token does not match', async () => {
    const { useCase, userRepository, bcryptService } = buildUseCase();
    const user = buildUser();
    userRepository.getUserByUsername.mockResolvedValue(user);
    bcryptService.compare.mockResolvedValue(false);

    const result = await useCase.getUserIfRefreshTokenMatches(
      'refresh',
      'demo',
    );

    expect(result).toBeNull();
  });

  it('returns null when refresh token user is missing', async () => {
    const { useCase, userRepository, bcryptService } = buildUseCase();
    userRepository.getUserByUsername.mockResolvedValue(null);

    const result = await useCase.getUserIfRefreshTokenMatches(
      'refresh',
      'demo',
    );

    expect(result).toBeNull();
    expect(bcryptService.compare).not.toHaveBeenCalled();
  });
});
