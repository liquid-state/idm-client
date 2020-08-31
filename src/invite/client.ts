import { IIDMInviteClient } from './types';
import { Options } from '../types';

const defaultOptions = {
  baseUrl: 'https://idm.example.com',
  fetch: undefined,
};

const pathMap: { [key: string]: string } = {
  consume: 'consume/',
  validate: 'validate/',
};

class IDMInviteClient implements IIDMInviteClient {
  private options: Options;
  private fetch: typeof fetch;

  constructor(options: Options) {
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
    return `${this.options.baseUrl}api/v1/invitations/${pathMap[path]}`;
  }

  consume = async (code: string, sub: string) => {
    const response = await this.fetch(this.getURL('consume'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, sub }),
    });

    const body = await response.json();

    return body;
  };

  validate = async (code: string) => {
    const response = await this.fetch(this.getURL('validate'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    const body = await response.json();

    return body;
  };
}

export default IDMInviteClient;
