import { UseCaseProxy } from './usecases-proxy';

describe('UseCaseProxy', () => {
  it('returns the provided instance', () => {
    const useCase = { run: jest.fn() };
    const proxy = new UseCaseProxy(useCase);

    expect(proxy.getInstance()).toBe(useCase);
  });
});
