import { IIDMClient, Options } from './types';

const defaultOptions = {
  baseUrl: 'https://pathways.example.com/',
  fetch: undefined,
};

const createIDMError = (message: string, response?: Response) => ({
  message: `IDM Error: ${message}`,
  response,
});

class IDMClient implements IIDMClient {
  private options: Options;
  private fetch: typeof fetch;

  constructor(private jwt: string, options?: Options) {
    if (!jwt) {
      throw createIDMError('You must specify a JWT');
    }
    if (!options) {
      this.options = defaultOptions;
    } else {
      this.options = { ...defaultOptions, ...options };
      if (!this.options.baseUrl) {
        this.options.baseUrl = defaultOptions.baseUrl;
      }
    }
    this.fetch = this.options.fetch || window.fetch.bind(window);
  }
}

export default IDMClient;
