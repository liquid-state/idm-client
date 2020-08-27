import IDMClient from './client';

export interface IIDMClient {
  // private getURL(path: string): string;
  users(page?: number): Promise<Response>;
}

export interface IIDMService {
  idm: IIDMClient;
  getAllUsers(): Promise<IDMUser[]>;
}

export type MethodType = 'DELETE' | 'GET' | 'PATCH' | 'POST';

export type Options = {
  baseUrl?: string;
  fetch?: typeof fetch;
};

export type IDMUser = {
  [key: string]: any;
};
