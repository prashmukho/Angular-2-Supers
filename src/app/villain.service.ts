import {Injectable} from 'angular2/core';
import {Villain} from './villain';
import {VILLAINS} from './mock-villains';

@Injectable()
export class VillainService {
  villains: Villain[] = VILLAINS;

  getVillains() {
    return Promise.resolve(this.villains);
  }
}