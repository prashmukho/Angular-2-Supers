import {Component, OnInit} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';

import {VillainsListComponent} from './villains-list.component';
import {VillainDetailComponent} from './villain-detail.component';
import {ActiveLinkService} from '../../active-link.service';

@Component({
  template: '<router-outlet></router-outlet>',
  directives: [ROUTER_DIRECTIVES]
})
@RouteConfig([
  {
    path: '/', 
    name: 'VillainsList', 
    component: VillainsListComponent,
    useAsDefault: true
  },
  {
    path: '/:id', 
    name: 'EditVillain', 
    component: VillainDetailComponent,
  },
  {
    path: '/new', 
    name: 'NewVillain', 
    component: VillainDetailComponent,
  }
])
export class VillainsRoutingComponent implements OnInit {
  constructor(private _activeLink: ActiveLinkService) {}

  ngOnInit() {
    this._activeLink.switchLink('VillainsCenter');
  }
}
