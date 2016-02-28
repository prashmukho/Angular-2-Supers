import {Injectable} from 'angular2/core';
import {VILLAINS} from './mock-villains';

@Injectable()
export class VillainService {
  getVillains() {
    return Promise.resolve(VILLAINS);
  }
}