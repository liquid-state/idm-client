import { IIDMClient, IIDMService, IDMUser } from './types';
import { createIDMError } from './utils';

class IDMService implements IIDMService {
  constructor(private client: IIDMClient) {
    if (!client) {
      throw createIDMError('You must provide a pathways admin client');
    }
  }

  private extractPageNumber = (url: string): number => {
    const pageNumberMatch = url.match(/page=([0-9]+)/);
    if (!pageNumberMatch) throw createIDMError('Invalid url');

    return Number(pageNumberMatch[1]);
  };

  idm = this.client;

  getAllUsers = async (): Promise<IDMUser[]> => {
    let response = await this.client.users();
    let body = await response.json();
    let users = [...body.results];
    let nextUrl = body.next;

    while (!!nextUrl) {
      const pageNumber = this.extractPageNumber(nextUrl);
      response = await this.client.users(pageNumber);
      body = await response.json();
      nextUrl = body.next;
      users = [...users, ...body.results];
    }

    return users;
  };
}

export default IDMService;