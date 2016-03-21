import {Injectable} from 'angular2/core';
import {Response} from 'angular2/http';
import * as Rx from "rxjs/Rx"

import {Villain} from './villain';
import {SupersService} from '../supers.service';
import {Crisis} from '../crises/crisis';
import {CrisesService} from '../crises/crises.service';

@Injectable()
export class VillainsService {
  constructor (
    private _supersService: SupersService<Villain>,
    private _crisesService: CrisesService
  ) {}

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
  
  getUninvolvedCrises(id: string): Rx.Observable<Crisis[]> {
    return this._crisesService.getUninvolvedCrises('villains', id);
  }

  involveInCrisis(villainId: string, crisisId: string): Rx.Observable<Crisis> {
    return this._crisesService.involveInCrisis('villains', villainId, crisisId);
  }

  private _handleError(error: Response) {
    return Rx.Observable.throw(error || 'Server error');
  }
}
