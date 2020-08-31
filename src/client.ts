import { IIDMClient, MethodType, Options, CreateUser, CreateInvitation } from './types';
import { createIDMError } from './utils';

const defaultOptions = {
  baseUrl: 'https://pathways.example.com',
  fetch: undefined,
};

const pathMap: { [key: string]: string } = {
  deleteInvitation: 'invitations/{{id}}',
  invitations: 'invitations/',
  updateUserProfile: 'users/{{id}}',
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

  private buildPath(pathTemplate: string, pathParameters?: { [key: string]: string }): string {
    if (!pathParameters) return pathTemplate;
    const re = /{{([A-Za-z]+)}}/;

    let path = pathTemplate;
    let match;
    while ((match = re.exec(path)) !== null) {
      path = path.replace(match[0], pathParameters[match[1]]);
    }

    return path[path.length - 1] === '/' ? path : `${path}/`;
  }

  private apiRequest = async (
    pathKey: string,
    errorMessage: string,
    requestMethod: MethodType,
    queryStringParameters?: { [key: string]: any },
    body?: { [key: string]: any },
    pathParameters?: { [key: string]: string },
  ): Promise<Response> => {
    const url = `${this.buildPath(this.getURL(pathKey), pathParameters)}${
      queryStringParameters
        ? Object.keys(queryStringParameters).reduce(
            (acc, key) => `${acc}${key}=${queryStringParameters[key]}&`,
            '?',
          )
        : ''
    }`;

    const resp = await this.fetch(url, {
      method: requestMethod,
      headers: {
        Authorization: `Bearer ${this.jwt}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!resp.ok) {
      throw createIDMError(errorMessage, resp);
    }

    return resp;
  };

  createInvitation = (invitation: CreateInvitation) => {
    return this.apiRequest('invitations', 'Failed to invite IDM user', 'POST', undefined, {
      organisation: invitation.organisation,
      user: invitation.userId,
    });
  };

  createUser = (newUser: CreateUser) => {
    return this.apiRequest('users', 'Failed to create IDM user', 'POST', undefined, {
      ...newUser,
      profile: newUser.profile,
      username: newUser.email,
    });
  };

  deleteInvitation = (id: string) => {
    return this.apiRequest(
      'deleteInvitation',
      "Failed to delete IDM user's invitation",
      'DELETE',
      undefined,
      undefined,
      { id },
    );
  };

  updateUserProfile = (id: string, profile: { [key: string]: any }) => {
    return this.apiRequest(
      'updateUserProfile',
      "Failed to update IDM user's profile",
      'PATCH',
      undefined,
      profile,
      { id },
    );
  };

  users = (page: number = 1) => {
    return this.apiRequest('users', 'Failed to get list of IDM Users', 'GET', { page });
  };
}

export default IDMClient;
