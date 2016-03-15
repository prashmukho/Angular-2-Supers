import {Injectable} from 'angular2/core';
import {Response} from 'angular2/http';
import * as Rx from "rxjs/Rx"

import {Villain} from './villain';
import {SupersService} from '../supers.service.ts'

@Injectable()
export class VillainService {
  constructor (private _supersService: SupersService<Villain>) {}

  getVillain(id: string): Rx.Observable<Villain> {
    return this._supersService.getSuper('villains', id)
  }

  getVillains(): Rx.Observable<Villain[]> {
    return this._supersService.getSupers('villains');
  }

  addVillain(villain: any): Rx.Observable<Villain> {
    return this._supersService.addSuper('villains', villain);
  }

  updateVillain(villain: Villain): Rx.Observable<Villain> {
    return this._supersService.updateSuper('villains', villain);
  }

  deleteVillain(id: string): Rx.Observable<Villain> {
    return this._supersService.deleteSuper('villains', id);
  }

  private _handleError(error: Response) {
    return Rx.Observable.throw(error || 'Server error');
  }
}
