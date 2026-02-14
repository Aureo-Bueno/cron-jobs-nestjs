import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { IException, IFormatExceptionMessage } from '../../domain/exception/exceptions.interface';

@Injectable()
export class ExceptionsService implements IException {
  badRequestException(data: IFormatExceptionMessage): never {
    throw new BadRequestException(data);
  }
  internalServerErrorException(data?: IFormatExceptionMessage): never {
    throw new InternalServerErrorException(data);
  }
  forbiddenException(data?: IFormatExceptionMessage): never {
    throw new ForbiddenException(data);
  }
  UnauthorizedException(data?: IFormatExceptionMessage): never {
    throw new UnauthorizedException(data);
  }
  notFoundException(data?: IFormatExceptionMessage): never {
    throw new NotFoundException(data);
  }
}
