import IDMClient from './client';

const fetchImpl: any = (response: any, valid: boolean = true) => {
  return jest.fn().mockImplementation((url: string, init: object) => {
    return {
      ok: valid,
      json: () => response,
    };
  });
};

describe('IDM client', () => {
  it('Should throw if JWT is missing', () => {
    try {
      new IDMClient('');
    } catch (e) {
      expect(e).toBe('Pathways Error: You must specify a JWT');
    }
  });
});
