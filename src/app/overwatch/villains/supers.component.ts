import {Component, OnInit} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';

import {VillainListComponent} from './villain-list.component';
import {VillainDetailComponent} from './villain-detail.component';
import {NewVillainDetailComponent} from './new-villain-detail.component';
import {VillainService} from './villain.service';
import {ActiveLinkService} from '../../active-link.service';

@Component({
  template: `
    <router-outlet></router-outlet>
  `,
  directives: [ROUTER_DIRECTIVES],
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
  },
  {
    path: '/new', 
    name: 'NewVillainDetail', 
    component: NewVillainDetailComponent,
  }
])
export class SupersComponent implements OnInit {
  constructor(private _activeLink: ActiveLinkService) {}

  ngOnInit() {
    if (/villains/.test(window.location.pathname)) {
      this._activeLink.switchLink('VillainsCenter');
    } else if (/heroes/.test(window.location.pathname)) {
      this._activeLink.switchLink('HeroesCenter');
    }
  }
}
