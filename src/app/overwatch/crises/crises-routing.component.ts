import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES, Router} from 'angular2/router';

import {CrisesListComponent} from './crises-list.component';
import {CrisisDetailComponent} from './crisis-detail.component';
import {CrisesService} from './crises.service';
import {ActiveLinkService} from '../../active-link.service';
import {GeolocationService} from './geolocation.service';

import './map.scss';

@Component({
  template: '<router-outlet></router-outlet>',
  directives: [ROUTER_DIRECTIVES],
  providers: [GeolocationService]
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
    component: CrisisDetailComponent
  },
  {
    path: '/crises/:crisisId',
    name: 'EditCrisis',
    component: CrisisDetailComponent
  }
])
export class CrisesRoutingComponent {
  constructor(private _activeLink: ActiveLinkService) {}

  ngOnInit() {
    this._activeLink.switchLink('CrisesCenter');
  }
}
