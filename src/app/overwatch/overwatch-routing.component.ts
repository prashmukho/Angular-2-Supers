import {Component, OnInit, Inject} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES, Router} from 'angular2/router';

import {LoginConfig} from '../app.component.ts'
import {VillainsRoutingComponent} from './villains/villains-routing.component';
import {HeroesRoutingComponent} from './heroes/heroes-routing.component';
import {CrisesRoutingComponent} from './crises/crises-routing.component';
import {SupersService} from './supers.service.ts';
import {VillainsService} from './villains/villains.service';
import {HeroesService} from './heroes/heroes.service';
import {CrisesService} from './crises/crises.service.ts';

import './my-lists.scss';

@Component({
  template: `
    <router-outlet></router-outlet>
  `,
  directives: [ROUTER_DIRECTIVES],
  providers: [
    SupersService,
    VillainsService,
    HeroesService,
    CrisesService
  ]
})
@RouteConfig([
  {
    path: '/villains/...',
    name: 'VillainsCenter',
    component: VillainsRoutingComponent
  },
  {
    path: '/heroes/...',
    name: 'HeroesCenter',
    component: HeroesRoutingComponent
  },
  {
    path: '/...',
    name: 'CrisesCenter',
    component: CrisesRoutingComponent,
    useAsDefault: true
  }
])
export class OverwatchRoutingComponent implements OnInit {
  constructor(
    private _router: Router,
    @Inject('login.config') public config: LoginConfig
  ) {
    require('../users/fb.js')(this.config);
    require('../users/google.js')(this.config);
  }

  ngOnInit() {
    if (!this.config.active) this._router.parent.navigate(['SignIn']);
  }
}
