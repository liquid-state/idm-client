import { IIDMClient, Options } from './types';
import { createIDMError } from './utils';

const defaultOptions = {
  baseUrl: 'https://pathways.example.com/',
  fetch: undefined,
};

const pathMap: { [key: string]: string } = {
  users: 'users/',
};

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

  private getURL(path: string) {
    return `${this.options.baseUrl}/api/v1/${pathMap[path]}`;
  }

  users = (page: number = 1) => {
    return this.fetch(`${this.getURL('users')}/page=${page}`);
  };
}

export default IDMClient;
