import IDMClient from './client';

type ISOString = string;
type URL = string;
type UUID = string;

export interface IIDMClient {
  createInvitation(invitation: CreateInvitation): Promise<Response>;
  createUser(newUser: CreateUser): Promise<Response>;
  users(page?: number): Promise<Response>;
}

export interface IIDMService {
  createInvitation(invitation: CreateInvitation): Promise<IDMInvitation>;
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
  default_role: string;
  default_role_uri: string;
  email: string;
  organisation: string;
  profile: { [key: string]: any };
  url: string;
  username: string;
};

export type IDMInvitation = {
  expires: ISOString;
  organisation: URL;
  sent_by: URL;
  status: 'pending' | 'sent' | 'accepted' | 'expired' | 'cancelled';
  token: UUID;
  url: URL;
  user: URL;
};

export type CreateInvitation = {
  organisation: string;
  userId: string;
};

export type CreateUser = {
  email: string;
  organisation: string;
  profile: {
    [key: string]: any;
  };
  role: string;
};
