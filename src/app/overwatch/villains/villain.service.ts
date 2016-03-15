import {Injectable} from 'angular2/core';
import {Http, Response} from 'angular2/http';
import * as Rx from "rxjs/Rx"
import {Headers, RequestOptions} from 'angular2/http';
import {Villain} from './villain';

@Injectable()
export class VillainService {
  constructor (private _http: Http) {}

  getVillain(id: string): Rx.Observable<Villain> {
    return this._http.get(`api/v1/villains/${id}`)
      .map(res => res.json().data)
      .catch(this._handleError);
  }

  getVillains(): Rx.Observable<Villain[]> {
    return this._http.get('api/v1/villains')
      .map(res => res.json().data)
      .catch(this._handleError);
  }

  addVillain(villain: any): Rx.Observable<Villain> {
    let body = JSON.stringify({ villain });
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this._http.post('api/v1/villains', body, options)
      .map(res => res.json().data)
      .catch(this._handleError);
  }

  updateVillain(villain: Villain): Rx.Observable<Villain> {
    let body = JSON.stringify({ villain });
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this._http.put(`api/v1/villains/${villain['_id']}`, body, options)
      .map(res => res.json().data)
      .catch(this._handleError);
  }

  deleteVillain(id: string): Rx.Observable<Villain> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this._http.delete(`api/v1/villains/${id}`, options)
      .map(res => res.json().data)
      .catch(this._handleError);
  }

  private _handleError(error: Response) {
    return Rx.Observable.throw(error || 'Server error');
  }
}
