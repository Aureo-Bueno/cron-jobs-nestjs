import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
  ServiceUnavailableException,
  UnprocessableEntityException,
  UnauthorizedException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ExceptionsService } from './exceptions.service';

describe('ExceptionsService', () => {
  let service: ExceptionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExceptionsService],
    }).compile();

    service = module.get<ExceptionsService>(ExceptionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('throws BadRequestException', () => {
    expect(() =>
      service.badRequestException({ message: 'bad request' }),
    ).toThrow(BadRequestException);
  });

  it('throws InternalServerErrorException', () => {
    expect(() =>
      service.internalServerErrorException({ message: 'internal' }),
    ).toThrow(InternalServerErrorException);
  });

  it('throws ForbiddenException', () => {
    expect(() =>
      service.forbiddenException({ message: 'forbidden' }),
    ).toThrow(ForbiddenException);
  });

  it('throws UnauthorizedException', () => {
    expect(() =>
      service.unauthorizedException({ message: 'unauthorized' }),
    ).toThrow(UnauthorizedException);
  });

  it('throws NotFoundException', () => {
    expect(() =>
      service.notFoundException({ message: 'not found' }),
    ).toThrow(NotFoundException);
  });

  it('throws ConflictException', () => {
    expect(() =>
      service.conflictException({ message: 'conflict' }),
    ).toThrow(ConflictException);
  });

  it('throws UnprocessableEntityException', () => {
    expect(() =>
      service.unprocessableEntityException({ message: 'unprocessable' }),
    ).toThrow(UnprocessableEntityException);
  });

  it('throws TooManyRequestsException', () => {
    expect(() =>
      service.tooManyRequestsException({ message: 'too many requests' }),
    ).toThrow(HttpException);
  });

  it('throws TooManyRequestsException with default message', () => {
    try {
      service.tooManyRequestsException();
    } catch (error) {
      const exception = error as HttpException;
      expect(exception).toBeInstanceOf(HttpException);
      expect(exception.getStatus()).toBe(429);
      expect(exception.getResponse()).toEqual({
        message: 'Too many requests',
      });
    }
  });

  it('throws ServiceUnavailableException', () => {
    expect(() =>
      service.serviceUnavailableException({ message: 'service unavailable' }),
    ).toThrow(ServiceUnavailableException);
  });
});
