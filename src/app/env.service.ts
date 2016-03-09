import {Injectable} from 'angular2/core';
import {Http, Response} from 'angular2/http';

@Injectable()
export class EnvService {
  constructor(private _http: Http) { }

  getFbAppID(): Promise<string> {
    return Promise.resolve(process.env.FB_APP_ID);
  }

  getGoogleClientID(): Promise<string> {
    return Promise.resolve(process.env.GOOGLE_CLIENT_ID);
  }
}