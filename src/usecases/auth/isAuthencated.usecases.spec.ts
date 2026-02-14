import { IsAuthenticatedUseCases } from './isAuthencated.usecases';
import {
  IException,
  IFormatExceptionMessage,
} from '../../domain/exception/exceptions.interface';
import { IUserRepository } from '../../domain/repositories/userRepository.interface';
import { UserModel } from '../../domain/models/user.model';

describe('IsAuthenticatedUseCases', () => {
  const buildExceptionsService = (): jest.Mocked<IException> => ({
    badRequestException: jest.fn<never, [IFormatExceptionMessage]>(),
    internalServerErrorException: jest.fn<
      never,
      [IFormatExceptionMessage | undefined]
    >(),
    forbiddenException: jest.fn<never, [IFormatExceptionMessage | undefined]>(),
    UnauthorizedException: jest.fn<
      never,
      [IFormatExceptionMessage | undefined]
    >(),
    notFoundException: jest.fn<never, [IFormatExceptionMessage | undefined]>(),
  });

  it('returns user info for authenticated user', async () => {
    const userRepository: jest.Mocked<IUserRepository> = {
      getUserByUsername: jest.fn(),
      getUsersWithLastLoginBefore: jest.fn(),
      updateLastLogin: jest.fn(),
      updateRefreshToken: jest.fn(),
    };
    const exceptionsService = buildExceptionsService();
    const user: UserModel = {
      id: 1,
      username: 'demo',
      password: 'hashed',
      createDate: new Date('2024-01-01T00:00:00.000Z'),
      updatedDate: new Date('2024-01-02T00:00:00.000Z'),
      lastLogin: undefined,
      hashRefreshToken: 'refresh-hash',
    };
    userRepository.getUserByUsername.mockResolvedValue(user);

    const useCase = new IsAuthenticatedUseCases(
      userRepository,
      exceptionsService,
    );
    const result = await useCase.execute('demo');

    expect(userRepository.getUserByUsername).toHaveBeenCalledWith('demo');
    expect(result).toEqual(user);
  });

  it('throws unauthorized when user is missing', async () => {
    const userRepository: jest.Mocked<IUserRepository> = {
      getUserByUsername: jest.fn(),
      getUsersWithLastLoginBefore: jest.fn(),
      updateLastLogin: jest.fn(),
      updateRefreshToken: jest.fn(),
    };
    const exceptionsService = buildExceptionsService();
    userRepository.getUserByUsername.mockResolvedValue(null);
    exceptionsService.UnauthorizedException.mockImplementation(() => {
      throw new Error('Unauthorized');
    });

    const useCase = new IsAuthenticatedUseCases(
      userRepository,
      exceptionsService,
    );

    await expect(useCase.execute('missing')).rejects.toThrow('Unauthorized');
    expect(exceptionsService.UnauthorizedException).toHaveBeenCalledWith({
      message: 'User not found',
    });
  });
});
