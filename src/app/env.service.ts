import {Injectable} from 'angular2/core';
import {Http, Response} from 'angular2/http';
import * as Rx from "rxjs/Rx";

@Injectable()
export class EnvService {
  constructor(private _http: Http) { }

  getFbAppID(): Rx.Observable<any> {
    return this._http.get('/env/fbAppID')
      .map(res => res.json())
      .catch(this._handleError);
  }

  getGoogleClientID(): Rx.Observable<any> {
    return this._http.get('/env/googleClientID')
      .map(res => res.json())
      .catch(this._handleError);
  }

  private _handleError(error: Response) {
    return Rx.Observable.throw(error || 'Server error');
  }
}