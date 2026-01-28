import { JwtService } from '@nestjs/jwt';
import { JwtTokenService } from './jwt.service';

describe('JwtTokenService', () => {
  it('verifies token and returns decoded payload', async () => {
    const jwtService = {
      verifyAsync: jest.fn().mockResolvedValue({ sub: 'demo' }),
      sign: jest.fn(),
    } as unknown as JwtService;
    const service = new JwtTokenService(jwtService);

    const result = await service.checkToken('token');

    expect(jwtService.verifyAsync).toHaveBeenCalledWith('token');
    expect(result).toEqual({ sub: 'demo' });
  });

  it('signs payload with secret and expiration', () => {
    const jwtService = {
      verifyAsync: jest.fn(),
      sign: jest.fn().mockReturnValue('signed'),
    } as unknown as JwtService;
    const service = new JwtTokenService(jwtService);

    const result = service.createToken({ username: 'demo' }, 'secret', 3600);

    expect(jwtService.sign).toHaveBeenCalledWith(
      { username: 'demo' },
      { secret: 'secret', expiresIn: 3600 },
    );
    expect(result).toBe('signed');
  });
});
