import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES, Router} from 'angular2/router';

import {CrisesListComponent} from './crises-list.component';
import {NewCrisisComponent} from './new-crisis.component';
import {EditCrisisComponent} from './edit-crisis.component';
import {CrisesService} from './crises.service';
import {ActiveLinkService} from '../../active-link.service';

@Component({
  template: `
    <router-outlet></router-outlet>
  `,
  directives: [ROUTER_DIRECTIVES],
  providers: [CrisesService]
})
@RouteConfig([
  {
    path: '/crises',
    name: 'CrisesList',
    component: CrisesListComponent,
    useAsDefault: true
  },
  {
    path: '/villains/:villainId/crises/new',
    name: 'NewCrisis',
    component: NewCrisisComponent
  },
  {
    path: '/crises/:id',
    name: 'EditCrisis',
    component: EditCrisisComponent
  }
])
export class CrisesRoutingComponent {
  constructor(private _activeLink: ActiveLinkService) {}

  ngOnInit() {
    this._activeLink.switchLink('CrisesCenter');
  }
}
