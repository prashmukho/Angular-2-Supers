import {Injectable} from 'angular2/core';
import {Http, Response} from 'angular2/http';
import * as Rx from "rxjs/Rx";
import {Headers, RequestOptions} from 'angular2/http';

import {Crisis} from './crisis';

@Injectable()
export class CrisesService {
  constructor(private _http: Http) {}

  getCrises(): Rx.Observable<Crisis[]> {
    return this._http.get('api/v1/crises')
      .map(res => res.json().data)
      .catch(this._handleError);
  }

  addCrisis(crisis: any, villainId: string): Rx.Observable<Crisis> {
    let body = JSON.stringify({ crisis });
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this._http.post(`api/v1/villains/${villainId}/crises`, body, options)
      .map(res => res.json().data)
      .catch(this._handleError);
  }

  private _handleError(error: Response) {
    return Rx.Observable.throw(error || 'Server error');
  }
}