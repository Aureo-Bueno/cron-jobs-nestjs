export interface IFormatExceptionMessage {
  message: string;
  code_error?: number;
}

export interface IException {
  badRequestException(data: IFormatExceptionMessage): never;
  internalServerErrorException(data?: IFormatExceptionMessage): never;
  forbiddenException(data?: IFormatExceptionMessage): never;
  UnauthorizedException(data?: IFormatExceptionMessage): never;
  notFoundException(data?: IFormatExceptionMessage): never;
}
