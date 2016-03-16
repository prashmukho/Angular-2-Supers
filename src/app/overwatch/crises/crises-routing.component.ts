import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES, Router} from 'angular2/router';

import {CrisesListComponent} from './crises-list.component';
import {NewCrisisComponent} from './new-crisis.component';
import {ActiveLinkService} from '../../active-link.service';

@Component({
  template: `
    <router-outlet></router-outlet>
  `,
  directives: [ROUTER_DIRECTIVES]
})
@RouteConfig([
  {
    path: '/crises',
    name: 'CrisesList',
    component: CrisesListComponent,
    useAsDefault: true
  },
  {
    path: '/villains/:id/crises/new',
    name: 'NewCrisis',
    component: NewCrisisComponent
  }
])
export class CrisesRoutingComponent {
  constructor(private _activeLink: ActiveLinkService) {}

  ngOnInit() {
    this._activeLink.switchLink('CrisesCenter');
  }
}
