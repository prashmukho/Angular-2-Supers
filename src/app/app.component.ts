import {Component, provide, Inject} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from 'angular2/router';
import {HTTP_PROVIDERS} from 'angular2/http';

import {OverwatchRoutingComponent} from './overwatch/overwatch-routing.component';
import {LoginComponent} from './users/login.component';
import {DialogService} from './dialog.service';
import {ActiveLinkService} from './active-link.service';

export interface LoginConfig {
  active: boolean,
  email: string,
  provider: string,
  postLogin: Function
}
// const will only prevent changing to another datatype
// properties may still be added
const LOGIN_CONFIG: LoginConfig = {
  active: false,
  email: null,
  provider: null,
  postLogin: (active, email, provider) => {
    window.localStorage.setItem('user', JSON.stringify({
      active: active,
      email: email,
      provider: provider
    }));
  }
};

@Component({
  selector: 'my-app',
  template: require('./app-component.html'),
  directives: [ROUTER_DIRECTIVES],
  providers: [
    ROUTER_PROVIDERS, 
    HTTP_PROVIDERS, 
    DialogService,
    ActiveLinkService,
    provide('login.config', {useValue: LOGIN_CONFIG})
  ]
})
@RouteConfig([
  { 
    path: '/...', 
    name: 'Overwatch', 
    component: OverwatchRoutingComponent,
    useAsDefault: true
  },
  { 
    path: '/signin', 
    name: 'SignIn',
    component: LoginComponent
  }
])
export class AppComponent { 
  title = 'Seeds of Destruction';

  constructor(
    private _activeLinkService: ActiveLinkService,
    @Inject('login.config') public config: LoginConfig
  ) {
    let user = JSON.parse(window.localStorage.getItem('user'));
    if (user) {
      this.config.active = user.active;
      this.config.email = user.email;
    }
  }

  switchLink(linkRef) {
    this._activeLinkService.switchLink(linkRef);
  }
}
