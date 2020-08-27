import IDMClient from './client';

export interface IIDMClient {
  createUser(newUser: CreateUser): Promise<Response>;
  users(page?: number): Promise<Response>;
}

export interface IIDMService {
  createUser(newUser: CreateUser): Promise<IDMUser>;
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

export type CreateUser = {
  email: string;
  organisation: number;
  profile: {
    [key: string]: any;
  };
  role: string;
};
