import {Component, OnInit} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';

import {VillainsListComponent} from './villains-list.component';
import {EditVillainComponent} from './edit-villain.component';
import {NewVillainComponent} from './new-villain.component';
import {VillainService} from './villains.service';
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
    name: 'VillainsList', 
    component: VillainsListComponent,
    useAsDefault: true
  },
  {
    path: '/:id', 
    name: 'EditVillain', 
    component: EditVillainComponent,
  },
  {
    path: '/new', 
    name: 'NewVillain', 
    component: NewVillainComponent,
  }
])
export class VillainsRoutingComponent implements OnInit {
  constructor(private _activeLink: ActiveLinkService) {}

  ngOnInit() {
    this._activeLink.switchLink('VillainsCenter');
  }
}
