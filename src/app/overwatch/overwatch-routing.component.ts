import {Component, OnInit, Inject} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES, Router} from 'angular2/router';

import {LoginConfig} from '../app.component.ts'
import {VillainsRoutingComponent} from './villains/villains-routing.component';
import {HeroesRoutingComponent} from './heroes/heroes-routing.component';
import {CrisesRoutingComponent} from './crises/crises-routing.component';
import {SupersService} from './supers.service.ts'

import './supers-list.scss';

@Component({
  template: `
    <router-outlet></router-outlet>
  `,
  directives: [ROUTER_DIRECTIVES],
  providers: [SupersService]
})
@RouteConfig([
  {
    path: '/villains/...',
    name: 'VillainsCenter',
    component: VillainsRoutingComponent,
    useAsDefault: true
  },
  {
    path: '/heroes/...',
    name: 'HeroesCenter',
    component: HeroesRoutingComponent,
  },
  {
    path: '/...',
    name: 'CrisesCenter',
    component: CrisesRoutingComponent,
  }
])
export class OverwatchRoutingComponent implements OnInit {
  constructor(
    private _router: Router,
    @Inject('login.config') public config: LoginConfig
  ) {}

  ngOnInit() {
    if (!this.config.active) this._router.parent.navigate(['SignIn']);
  }
}
