import IDMClient from './client';

type ISOString = string;
type URL = string;
type UUID = string;

export interface IIDMClient {
  createInvitation(invitation: CreateInvitation): Promise<Response>;
  createUser(newUser: CreateUser): Promise<Response>;
  deleteInvitation(id: string): Promise<Response>;
  solutions(page?: number): Promise<Response>;
  updateUser(id: string, user: { [key: string]: any }): Promise<Response>;
  updateUserProfile(id: string, profile: { [key: string]: any }): Promise<Response>;
  users(page?: number): Promise<Response>;
}

export interface IIDMService {
  createInvitation(invitation: CreateInvitation): Promise<IDMInvitation>;
  createUser(newUser: CreateUser): Promise<IDMUser>;
  deleteInvitation(id: string): Promise<boolean>;
  getAllUsers(): Promise<IDMUser[]>;
  idm: IIDMClient;
  solutions(): Promise<IDMSolutionConfigurations[]>;
  updateUser(id: string, user: { [key: string]: any }): Promise<IDMUser>;
  updateUserProfile(id: string, profile: { [key: string]: any }): Promise<IDMUser>;
}

export type MethodType = 'DELETE' | 'GET' | 'PATCH' | 'POST' | 'PUT';

export type Options = {
  baseUrl?: string;
  fetch?: typeof fetch;
};

export type IDMUserProfile = { [key: string]: any };

export type IDMUser = {
  default_role: string;
  default_role_uri: string;
  email: string;
  invitations: string[];
  is_active: boolean;
  organisation: string;
  profile: IDMUserProfile;
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

export type IDMSolutionConfigurations = {
  configurations: IDMSolution[];
  name: string;
  url: string;
};

export type IDMSolution = {
  body: {
    app_token: string;
    hospital_id: string;
    organisation_slug: string;
    ubiquity_app_id: number;
    ubiquity_organisation_id: number;
    ubiquity_organisation_slug: string;
  };
  organisation: {
    pk: number;
    slug: string;
    name: string;
  };
  solution_name: string;
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
