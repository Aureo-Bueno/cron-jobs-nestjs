import { UserWithoutPassword } from '../../domain/models/user.model';
import { UserRepository } from '../../domain/repositories/userRepository.interface';

export class IsAuthenticatedUseCases {
  constructor(private readonly adminUserRepo: UserRepository) {}

  async execute(username: string): Promise<UserWithoutPassword> {
    const user = await this.adminUserRepo.getUserByUsername(
      username,
    );
    const { ...info } = user;
    return info;
  }
}
