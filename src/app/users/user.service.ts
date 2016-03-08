import {Injectable} from 'angular2/core';
import {Http, Response} from 'angular2/http';
import * as Rx from "rxjs/Rx"
import {Headers, RequestOptions} from 'angular2/http';

@Injectable()
export class UserService {
  constructor(private _http: Http) {}

  signIn(username: string, password: string) {
    let body = JSON.stringify({ 
      login: username, 
      password: password
    });
    let headers = new Headers({ 
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });
    let options = new RequestOptions({ headers: headers });

    return this._http.post('/login', body, options)
      .map(res => res.json())
      .catch(this._handleError)
  }

  private _handleError(error: Response) {
    return Rx.Observable.throw(error || 'Server error');
  }
}