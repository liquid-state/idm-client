import { IDMUserProfile, IDMUser } from '../types';

export interface IIDMInviteClient {
  consume(code: string, sub: string): Promise<IDMUserProfile>;
  validate(code: string): Promise<IDMUser>;
}
