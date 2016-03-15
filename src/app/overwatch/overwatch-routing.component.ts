import {Component, OnInit, Inject} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES, Router} from 'angular2/router';

import {LoginConfig} from '../app.component';
import {SupersComponent} from './villains/supers.component';

import './supers-list.scss';

@Component({
  template: `
    <router-outlet></router-outlet>
  `,
  directives: [ROUTER_DIRECTIVES]
})
@RouteConfig([
  {
    path: '/villains/...',
    name: 'VillainsCenter',
    component: SupersComponent,
    useAsDefault: true
  },
  {
    path: '/heroes/...',
    name: 'HeroesCenter',
    component: SupersComponent,
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
