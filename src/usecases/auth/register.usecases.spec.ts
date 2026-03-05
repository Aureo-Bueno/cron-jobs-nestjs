import { IBcryptService } from '../../domain/adapters/bcrypt.interface';
import {
  IException,
  IFormatExceptionMessage,
} from '../../domain/exception/exceptions.interface';
import { ILogger } from '../../domain/logger/logger.interface';
import { UserModel } from '../../domain/models/user.model';
import { IUserRepository } from '../../domain/repositories/userRepository.interface';
import { RegisterUseCases } from './register.usecases';

const buildUseCase = () => {
  const logger: jest.Mocked<ILogger> = {
    debug: jest.fn(),
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    verbose: jest.fn(),
  };
  const userRepository: jest.Mocked<IUserRepository> = {
    insertUser: jest.fn(),
    getUserByUsername: jest.fn(),
    getUsersWithLastLoginBefore: jest.fn(),
    updateLastLogin: jest.fn(),
    updateRefreshToken: jest.fn(),
  };
  const bcryptService: jest.Mocked<IBcryptService> = {
    hash: jest.fn(),
    compare: jest.fn(),
  };
  const exceptionService: jest.Mocked<IException> = {
    badRequestException: jest.fn<never, [IFormatExceptionMessage | undefined]>(),
    internalServerErrorException: jest.fn<
      never,
      [IFormatExceptionMessage | undefined]
    >(),
    forbiddenException: jest.fn<never, [IFormatExceptionMessage | undefined]>(),
    unauthorizedException: jest.fn<
      never,
      [IFormatExceptionMessage | undefined]
    >(),
    notFoundException: jest.fn<never, [IFormatExceptionMessage | undefined]>(),
    conflictException: jest.fn<never, [IFormatExceptionMessage | undefined]>(),
    unprocessableEntityException: jest.fn<
      never,
      [IFormatExceptionMessage | undefined]
    >(),
    tooManyRequestsException: jest.fn<
      never,
      [IFormatExceptionMessage | undefined]
    >(),
    serviceUnavailableException: jest.fn<
      never,
      [IFormatExceptionMessage | undefined]
    >(),
  };

  const useCase = new RegisterUseCases(
    logger,
    userRepository,
    bcryptService,
    exceptionService,
  );

  return {
    useCase,
    logger,
    userRepository,
    bcryptService,
    exceptionService,
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

describe('RegisterUseCases', () => {
  it('creates user with hashed password', async () => {
    const { useCase, userRepository, bcryptService, logger } = buildUseCase();
    userRepository.getUserByUsername.mockResolvedValue(null);
    bcryptService.hash.mockResolvedValue('hashed-password');

    await useCase.execute('new_user', 'plain');

    expect(userRepository.getUserByUsername).toHaveBeenCalledWith('new_user');
    expect(bcryptService.hash).toHaveBeenCalledWith('plain');
    expect(userRepository.insertUser).toHaveBeenCalledWith(
      expect.objectContaining({
        username: 'new_user',
        password: 'hashed-password',
      }),
    );
    expect(logger.log).toHaveBeenCalledWith(
      'RegisterUseCases execute',
      'The user new_user have been registered.',
    );
  });

  it('throws conflict when username already exists', async () => {
    const { useCase, userRepository, exceptionService, bcryptService } =
      buildUseCase();
    userRepository.getUserByUsername.mockResolvedValue(buildUser());
    exceptionService.conflictException.mockImplementation(() => {
      throw new Error('conflict');
    });

    await expect(useCase.execute('demo', 'plain')).rejects.toThrow('conflict');

    expect(exceptionService.conflictException).toHaveBeenCalledWith({
      message: 'User demo already exists',
    });
    expect(bcryptService.hash).not.toHaveBeenCalled();
    expect(userRepository.insertUser).not.toHaveBeenCalled();
  });

  it('throws internal server error when insert fails with unknown code', async () => {
    const { useCase, userRepository, bcryptService, exceptionService } =
      buildUseCase();
    userRepository.getUserByUsername.mockResolvedValue(null);
    bcryptService.hash.mockResolvedValue('hashed-password');
    userRepository.insertUser.mockRejectedValue(new Error('db down'));
    exceptionService.internalServerErrorException.mockImplementation(() => {
      throw new Error('internal');
    });

    await expect(useCase.execute('demo', 'plain')).rejects.toThrow('internal');
    expect(exceptionService.internalServerErrorException).toHaveBeenCalledWith({
      message: 'Could not create user',
    });
  });

  it('throws conflict when insert fails with unique violation', async () => {
    const { useCase, userRepository, bcryptService, exceptionService } =
      buildUseCase();
    userRepository.getUserByUsername.mockResolvedValue(null);
    bcryptService.hash.mockResolvedValue('hashed-password');
    userRepository.insertUser.mockRejectedValue({ code: '23505' });
    exceptionService.conflictException.mockImplementation(() => {
      throw new Error('conflict');
    });

    await expect(useCase.execute('demo', 'plain')).rejects.toThrow('conflict');
    expect(exceptionService.conflictException).toHaveBeenCalledWith({
      message: 'User demo already exists',
    });
  });
});
