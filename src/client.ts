import { IIDMClient, MethodType, Options, CreateUser } from './types';
import { createIDMError } from './utils';

const defaultOptions = {
  baseUrl: 'https://pathways.example.com',
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

  private getURL(path: string): string {
    return `${this.options.baseUrl}api/v1/${pathMap[path]}`;
  }

  private apiRequest = async (
    pathKey: string,
    errorMessage: string,
    requestMethod: MethodType,
    queryStringParameters?: { [key: string]: any },
    postData?: { [key: string]: any },
    // pathParameters?: { [key: string]: string },
  ): Promise<Response> => {
    const url = `${this.getURL(pathKey)}${
      queryStringParameters
        ? Object.keys(queryStringParameters).reduce(
            (acc, key) => `${acc}${key}=${queryStringParameters[key]}&`,
            '?',
          )
        : ''
    }`;

    let body = undefined;
    if (postData) {
      body = new FormData();
      for (let key in postData) {
        body.append(key, postData[key]);
      }
    }

    const resp = await this.fetch(url, {
      method: requestMethod,
      headers: {
        Authorization: `Bearer ${this.jwt}`,
      },
      body,
    });
    if (!resp.ok) {
      throw createIDMError(errorMessage, resp);
    }

    return resp;
  };

  createUser = (newUser: CreateUser) => {
    return this.apiRequest(
      'users',
      'Failed to create IDM user',
      'POST',
      {},
      { ...newUser, username: newUser.email },
    );
  };

  users = (page: number = 1) => {
    return this.apiRequest('users', 'Failed to get list of IDM Users', 'GET', { page });
  };
}

export default IDMClient;
