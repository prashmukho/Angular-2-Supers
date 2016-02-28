import {Injectable} from 'angular2/core';
import {Villain} from './villain'
import {VILLAINS} from './mock-villains';

@Injectable()
export class VillainService {
  getVillains() {
    return Promise.resolve(VILLAINS);
  }

  getVillain(id: number) {
    return Promise.resolve(VILLAINS).then(
      villains => villains.filter(villain => villain.id === id)[0]
    );
  }
}