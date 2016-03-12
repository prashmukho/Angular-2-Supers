import {Injectable} from 'angular2/core';
import {Http, Response} from 'angular2/http';
import * as Rx from "rxjs/Rx"
import {Headers, RequestOptions} from 'angular2/http';

@Injectable()
export class UserService {
  constructor(private _http: Http) {}

  signIn(user: any): Rx.Observable<any> {
    let body = JSON.stringify({ 
      login: user.username, 
      password: user.password
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

  signUp(newUser: any): Rx.Observable<any> {
    let body = JSON.stringify({ 
      email: newUser.username, 
      password: newUser.password, 
      // stormpath default for non-required fields is 'UNKNOWN'
      givenName: newUser.firstName ? newUser.firstName : 'UNKNOWN',
      surname: newUser.lastName ? newUser.lastName : 'UNKNOWN'
    });
    let headers = new Headers({ 
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });
    let options = new RequestOptions({ headers: headers });

    return this._http.post('/register', body, options)
      .map(res => res.json())
      .catch(this._handleError)
  }

  private _handleError(error: Response) {
    return Rx.Observable.throw(error || 'Server error');
  }
}