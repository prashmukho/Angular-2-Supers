import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {VillainListComponent} from './villain-list.component';
import {VillainDetailComponent} from './villain-detail.component';
import {VillainService} from './villain.service';

@Component({
  selector: 'villains',
  template: `
    <router-outlet></router-outlet>
  `,
  directives: [VillainListComponent, ROUTER_DIRECTIVES],
  providers: [VillainService]
})
@RouteConfig([
  {
    path: '/', 
    name: 'VillainList', 
    component: VillainListComponent,
    useAsDefault: true
  },
  {
    path: '/:id', 
    name: 'VillainDetail', 
    component: VillainDetailComponent,
  }
])
export class VillainsComponent {}
