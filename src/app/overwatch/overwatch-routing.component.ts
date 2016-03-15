import {Component, OnInit, Inject} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES, Router} from 'angular2/router';

import {LoginConfig} from '../app.component.ts'
import {VillainsComponent} from './villains/villains.component';
import {HeroesRoutingComponent} from './heroes/heroes-routing.component';
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
    component: VillainsComponent,
    useAsDefault: true
  },
  {
    path: '/heroes/...',
    name: 'HeroesCenter',
    component: HeroesRoutingComponent,
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
