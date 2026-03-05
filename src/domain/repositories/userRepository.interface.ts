import { UserModel } from '../models/user.model';

export interface IUserRepository {
  insertUser(user: UserModel): Promise<void>;
  getUserByUsername(username: string): Promise<UserModel|null>;
  getUsersWithLastLoginBefore(date: Date): Promise<UserModel[]>;
  updateLastLogin(username: string): Promise<void>;
  updateRefreshToken(username: string, refreshToken: string): Promise<void>;
}
