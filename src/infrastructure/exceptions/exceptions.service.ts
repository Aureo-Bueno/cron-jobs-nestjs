import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ServiceUnavailableException,
  UnprocessableEntityException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  IException,
  IFormatExceptionMessage,
} from '../../domain/exception/exceptions.interface';

@Injectable()
export class ExceptionsService implements IException {
  badRequestException(data?: IFormatExceptionMessage): never {
    throw new BadRequestException(data);
  }
  internalServerErrorException(data?: IFormatExceptionMessage): never {
    throw new InternalServerErrorException(data);
  }
  forbiddenException(data?: IFormatExceptionMessage): never {
    throw new ForbiddenException(data);
  }
  unauthorizedException(data?: IFormatExceptionMessage): never {
    throw new UnauthorizedException(data);
  }
  notFoundException(data?: IFormatExceptionMessage): never {
    throw new NotFoundException(data);
  }
  conflictException(data?: IFormatExceptionMessage): never {
    throw new ConflictException(data);
  }
  unprocessableEntityException(data?: IFormatExceptionMessage): never {
    throw new UnprocessableEntityException(data);
  }
  tooManyRequestsException(data?: IFormatExceptionMessage): never {
    throw new HttpException(
      data ?? { message: 'Too many requests' },
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }
  serviceUnavailableException(data?: IFormatExceptionMessage): never {
    throw new ServiceUnavailableException(data);
  }
}
