// import { 
//   it, 
//   describe, 
//   expect, 
//   injectAsync, 
//   beforeEachProviders 
// } from 'angular2/testing';

// import {Villain} from '../app/villains/villain';
// import {VillainService} from '../app/villains/villain.service';
// import {VILLAINS} from '../app/villains/mock-villains'

// describe('villain service', () => {
//   beforeEachProviders(() => [VillainService])

//   describe('#getVillains()', () => {
//     it('should retrieve an array of Villian objects', injectAsync([VillainService], (service) => { 
//       return service.getVillains().then(villains => {
//         expect(villains).toEqual(VILLAINS);
//       });
//     }));
//   });

//   describe('#getVillain(id)', () => {
//     it('should retrieve a Villain object with the given id', injectAsync([VillainService], (service) => { 
//       return service.getVillain(VILLAINS[0].id).then(villain => {
//         expect(villain).toEqual(VILLAINS[0]);
//       });
//     }));
//   });
// });