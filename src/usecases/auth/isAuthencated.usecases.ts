import { UserWithoutPassword } from '../../domain/models/user.model';
import { IException } from '../../domain/exception/exceptions.interface';
import { IUserRepository } from '../../domain/repositories/userRepository.interface';

export class IsAuthenticatedUseCases {
  constructor(
    private readonly adminUserRepo: IUserRepository,
    private readonly exceptionService: IException,
  ) {}

  async execute(username: string): Promise<UserWithoutPassword> {
    const user = await this.adminUserRepo.getUserByUsername(
      username,
    );
    if (!user) {
      this.exceptionService.UnauthorizedException({
        message: 'User not found',
      });
    }
    const { ...info } = user;
    return info;
  }
}
