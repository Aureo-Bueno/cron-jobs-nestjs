import { Repository, LessThan } from 'typeorm';
import { DatabaseUserRepository } from './user.repository';
import { User } from '../entities/user.entity';
import { UserModel } from '../../domain/models/user.model';

const buildRepository = () => {
  const userEntityRepository: jest.Mocked<Repository<User>> = {
    update: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
  } as unknown as jest.Mocked<Repository<User>>;
  const repository = new DatabaseUserRepository(userEntityRepository);

  return { repository, userEntityRepository };
};

describe('DatabaseUserRepository', () => {
  it('updates refresh token by username', async () => {
    const { repository, userEntityRepository } = buildRepository();

    await repository.updateRefreshToken('alice', 'refresh');

    expect(userEntityRepository.update).toHaveBeenCalledWith(
      { username: 'alice' },
      { hach_refresh_token: 'refresh' },
    );
  });

  it('returns null when user does not exist', async () => {
    const { repository, userEntityRepository } = buildRepository();
    userEntityRepository.findOne.mockResolvedValue(null);

    const result = await repository.getUserByUsername('missing');

    expect(result).toBeNull();
  });

  it('maps user entity to model', async () => {
    const { repository, userEntityRepository } = buildRepository();
    const entity: User = {
      id: 1,
      username: 'demo',
      password: 'hash',
      createdate: new Date('2024-01-01T00:00:00.000Z'),
      updateddate: new Date('2024-01-02T00:00:00.000Z'),
      last_login: new Date('2024-01-03T00:00:00.000Z'),
      hach_refresh_token: 'refresh',
    };
    userEntityRepository.findOne.mockResolvedValue(entity);

    const result = await repository.getUserByUsername('demo');

    expect(result).toEqual<UserModel>({
      id: 1,
      username: 'demo',
      password: 'hash',
      createDate: entity.createdate,
      updatedDate: entity.updateddate,
      lastLogin: entity.last_login,
      hashRefreshToken: 'refresh',
    });
  });

  it('finds users with last login before date', async () => {
    const { repository, userEntityRepository } = buildRepository();
    const date = new Date('2024-01-10T00:00:00.000Z');
    const entity: User = {
      id: 2,
      username: 'stale',
      password: 'hash',
      createdate: new Date('2024-01-01T00:00:00.000Z'),
      updateddate: new Date('2024-01-02T00:00:00.000Z'),
      last_login: new Date('2024-01-03T00:00:00.000Z'),
      hach_refresh_token: 'refresh',
    };
    userEntityRepository.find.mockResolvedValue([entity]);

    const result = await repository.getUsersWithLastLoginBefore(date);

    expect(userEntityRepository.find).toHaveBeenCalledWith({
      where: { last_login: LessThan(date) },
    });
    expect(result).toHaveLength(1);
    expect(result[0].username).toBe('stale');
  });

  it('updates last login with current timestamp', async () => {
    const { repository, userEntityRepository } = buildRepository();

    await repository.updateLastLogin('demo');

    const args = userEntityRepository.update.mock.calls[0];
    expect(args[0]).toEqual({ username: 'demo' });
    const lastLoginValue = args[1].last_login;
    expect(typeof lastLoginValue).toBe('function');
    if (typeof lastLoginValue === 'function') {
      expect(lastLoginValue()).toBe('CURRENT_TIMESTAMP');
    }
  });
});
