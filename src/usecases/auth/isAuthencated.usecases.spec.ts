import { IsAuthenticatedUseCases } from './isAuthencated.usecases';
import { UserRepository } from '../../domain/repositories/userRepository.interface';
import { UserModel } from '../../domain/models/user.model';

describe('IsAuthenticatedUseCases', () => {
  it('returns user info for authenticated user', async () => {
    const userRepository: jest.Mocked<UserRepository> = {
      getUserByUsername: jest.fn(),
      getUsersWithLastLoginBefore: jest.fn(),
      updateLastLogin: jest.fn(),
      updateRefreshToken: jest.fn(),
    };
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

    const useCase = new IsAuthenticatedUseCases(userRepository);
    const result = await useCase.execute('demo');

    expect(userRepository.getUserByUsername).toHaveBeenCalledWith('demo');
    expect(result).toEqual(user);
  });
});
