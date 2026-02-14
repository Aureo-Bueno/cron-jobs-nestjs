import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
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
      service.UnauthorizedException({ message: 'unauthorized' }),
    ).toThrow(UnauthorizedException);
  });

  it('throws NotFoundException', () => {
    expect(() =>
      service.notFoundException({ message: 'not found' }),
    ).toThrow(NotFoundException);
  });
});
