import { BcryptService } from './bcrypt.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('BcryptService', () => {
  it('hashes value with configured rounds', async () => {
    const service = new BcryptService();
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');

    const result = await service.hash('value');

    expect(bcrypt.hash).toHaveBeenCalledWith('value', service.rounds);
    expect(result).toBe('hashed');
  });

  it('compares value against hash', async () => {
    const service = new BcryptService();
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const result = await service.compare('value', 'hash');

    expect(bcrypt.compare).toHaveBeenCalledWith('value', 'hash');
    expect(result).toBe(true);
  });
});
