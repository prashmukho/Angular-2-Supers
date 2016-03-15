import {Injectable} from 'angular2/core';
import {Http, Response} from 'angular2/http';
import * as Rx from "rxjs/Rx";
import {Headers, RequestOptions} from 'angular2/http';
import {Super} from './super';

@Injectable()
export class SupersService<I> {
  constructor(private _http: Http) {}

  getSuper(collection: string, id: string): Rx.Observable<I> {
    return this._http.get(`api/v1/${collection}/${id}`)
      .map(res => res.json().data)
      .catch(this._handleError);
  }

  getSupers(collection: string): Rx.Observable<I[]> {
    return this._http.get(`api/v1/${collection}`)
      .map(res => res.json().data)
      .catch(this._handleError);
  }

  addSuper(collection: string, model: any): Rx.Observable<I> {
    let body = JSON.stringify({ model });
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this._http.post(`api/v1/${collection}`, body, options)
      .map(res => res.json().data)
      .catch(this._handleError);
  }

  updateSuper(collection: string, model: Super): Rx.Observable<I> {
    let body = JSON.stringify({ model });
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this._http.put(`api/v1/${collection}/${model['_id']}`, body, options)
      .map(res => res.json().data)
      .catch(this._handleError);
  }

  deleteSuper(collection: string, id: string): Rx.Observable<I> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this._http.delete(`api/v1/${collection}/${id}`, options)
      .map(res => res.json().data)
      .catch(this._handleError);
  }

  private _handleError(error: Response) {
    return Rx.Observable.throw(error || 'Server error');
  }
}