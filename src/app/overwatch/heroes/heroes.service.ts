import {Injectable} from 'angular2/core';
import {Response} from 'angular2/http';
import * as Rx from "rxjs/Rx"

import {Hero} from './hero';
import {SupersService} from '../supers.service';
import {Crisis} from '../crises/crisis';
import {CrisesService} from '../crises/crises.service';

@Injectable()
export class HeroesService {
  constructor (
    private _supersService: SupersService<Hero>,
    private _crisesService: CrisesService
  ) {}

  getHero(id: string): Rx.Observable<Hero> {
    return this._supersService.getSuper('heroes', id)
  }

  getHeroes(): Rx.Observable<Hero[]> {
    return this._supersService.getSupers('heroes');
  }

  addHero(hero: any): Rx.Observable<Hero> {
    return this._supersService.addSuper('heroes', hero);
  }

  updateHero(hero: Hero): Rx.Observable<Hero> {
    return this._supersService.updateSuper('heroes', hero);
  }

  deleteHero(id: string): Rx.Observable<Hero> {
    return this._supersService.deleteSuper('heroes', id);
  }

  getUninvolvedCrises(id: string): Rx.Observable<Crisis[]> {
    return this._crisesService.getUninvolvedCrises('heroes', id);
  }

  involveInCrisis(heroId: string, crisisId: string): Rx.Observable<Crisis> {
    return this._crisesService.involveInCrisis('heroes', heroId, crisisId);
  }

  private _handleError(error: Response) {
    return Rx.Observable.throw(error || 'Server error');
  }
}
