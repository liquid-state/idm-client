import IDMClient from './client';

export interface IIDMClient {
  users(page?: number): Promise<Response>;
}

export interface IIDMService {
  idm: IIDMClient;
  getAllUsers(): Promise<IDMUser[]>;
}

export type Options = {
  baseUrl?: string;
  fetch?: typeof fetch;
};

export type IDMUser = {
  [key: string]: any;
};
