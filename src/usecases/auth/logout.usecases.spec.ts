import { LogoutUseCases } from './logout.usecases';

describe('LogoutUseCases', () => {
  it('returns cookie clearing headers', async () => {
    const useCase = new LogoutUseCases();

    const result = await useCase.execute();

    expect(result).toEqual([
      'Authentication=; HttpOnly; Path=/; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; Max-Age=0',
    ]);
  });
});
