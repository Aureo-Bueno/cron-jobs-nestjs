import { IBcryptService } from '../../domain/adapters/bcrypt.interface';
import { IException } from '../../domain/exception/exceptions.interface';
import { ILogger } from '../../domain/logger/logger.interface';
import { UserModel } from '../../domain/models/user.model';
import { IUserRepository } from '../../domain/repositories/userRepository.interface';

interface IPostgresError {
  code?: string;
}

export class RegisterUseCases {
  constructor(
    private readonly logger: ILogger,
    private readonly userRepository: IUserRepository,
    private readonly bcryptService: IBcryptService,
    private readonly exceptionService: IException,
  ) {}

  async execute(username: string, password: string): Promise<void> {
    const user = await this.userRepository.getUserByUsername(username);
    if (user) {
      this.exceptionService.conflictException({
        message: `User ${username} already exists`,
      });
    }

    const newUser = new UserModel();
    newUser.username = username;
    newUser.password = await this.bcryptService.hash(password);

    try {
      await this.userRepository.insertUser(newUser);
    } catch (error) {
      if ((error as IPostgresError).code === '23505') {
        this.exceptionService.conflictException({
          message: `User ${username} already exists`,
        });
      }
      this.exceptionService.internalServerErrorException({
        message: 'Could not create user',
      });
    }

    this.logger.log(
      'RegisterUseCases execute',
      `The user ${username} have been registered.`,
    );
  }
}
