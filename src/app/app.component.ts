import {Component, provide, Inject} from 'angular2/core';
import {RouteConfig, Router, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from 'angular2/router';
import {HTTP_PROVIDERS} from 'angular2/http';

import {OverwatchRoutingComponent} from './overwatch/overwatch-routing.component';
import {LoginComponent} from './users/login.component';
import {DialogService} from './dialog.service';
import {ActiveLinkService} from './active-link.service';
import {UtilsService} from './utils.service';

interface Provider {
  wasLoggedIn: boolean;
  name: string;  
}

export interface LoginConfig {
  active: boolean;
  email: string;
  provider: Provider;
  postLogin: Function;
}
// const will only prevent changing to another datatype
// properties may still be added
const LOGIN_CONFIG: LoginConfig = {
  active: false,
  email: null,
  provider: { wasLoggedIn: false, name: null },
  postLogin: (active: boolean, email: string, provider: Provider) => {
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
    UtilsService,
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
    private _router: Router,
    @Inject('login.config') public config: LoginConfig
  ) {
    let user = JSON.parse(window.localStorage.getItem('user'));
    if (user) {
      this.config.active = user.active;
      this.config.email = user.email;
      this.config.provider = user.provider;
    }
  }

  signOut() {
    this.config.active = false;
    this.config.email = null;
    this.config.provider = { name: null, wasLoggedIn: false };
    window.localStorage.removeItem('user');
    this._router.navigate(['SignIn']);
  }
}
