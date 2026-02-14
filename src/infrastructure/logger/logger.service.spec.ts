import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { LoggerService } from './logger.service';

describe('LoggerService', () => {
  let service: LoggerService;
  const originalEnv = process.env.NODE_ENV;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoggerService],
    }).compile();

    service = module.get<LoggerService>(LoggerService);
  });

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('logs info messages', () => {
    const spy = jest
      .spyOn(Logger.prototype, 'log')
      .mockImplementation(() => undefined);

    service.log('Ctx', 'hello');

    expect(spy).toHaveBeenCalledWith('[INFO] hello', 'Ctx');
  });

  it('logs warn messages', () => {
    const spy = jest
      .spyOn(Logger.prototype, 'warn')
      .mockImplementation(() => undefined);

    service.warn('Ctx', 'warn');

    expect(spy).toHaveBeenCalledWith('[WARN] warn', 'Ctx');
  });

  it('logs error messages with trace', () => {
    const spy = jest
      .spyOn(Logger.prototype, 'error')
      .mockImplementation(() => undefined);

    service.error('Ctx', 'oops', 'trace');

    expect(spy).toHaveBeenCalledWith('[ERROR] oops', 'trace', 'Ctx');
  });

  it('logs debug when not production', () => {
    process.env.NODE_ENV = 'test';
    const spy = jest
      .spyOn(Logger.prototype, 'debug')
      .mockImplementation(() => undefined);

    service.debug('Ctx', 'debug');

    expect(spy).toHaveBeenCalledWith('[DEBUG] debug', 'Ctx');
  });

  it('does not log debug in production', () => {
    process.env.NODE_ENV = 'production';
    const spy = jest
      .spyOn(Logger.prototype, 'debug')
      .mockImplementation(() => undefined);

    service.debug('Ctx', 'debug');

    expect(spy).not.toHaveBeenCalled();
  });

  it('logs verbose when not production', () => {
    process.env.NODE_ENV = 'test';
    const spy = jest
      .spyOn(Logger.prototype, 'verbose')
      .mockImplementation(() => undefined);

    service.verbose('Ctx', 'details');

    expect(spy).toHaveBeenCalledWith('[VERBOSE] details', 'Ctx');
  });

  it('does not log verbose in production', () => {
    process.env.NODE_ENV = 'production';
    const spy = jest
      .spyOn(Logger.prototype, 'verbose')
      .mockImplementation(() => undefined);

    service.verbose('Ctx', 'details');

    expect(spy).not.toHaveBeenCalled();
  });
});
