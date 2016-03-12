import {Component, provide, Inject} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from 'angular2/router';
import {HTTP_PROVIDERS} from 'angular2/http';

import {VillainsComponent} from './villains/villains.component';
import {LoginComponent} from './users/login.component';
import {DialogService} from './dialog.service';
import {EnvService} from './env.service';
import {ActiveLinkService} from './active-link.service';

export interface LoginConfig {
  active: boolean,
  email: string,
  postLogin: Function
}
// const will only prevent changing to another datatype i.e. not an Object
// properties may still be added
export const LOGIN_CONFIG: LoginConfig = {
  active: false,
  email: null,
  postLogin: (active, email) => {
    window.localStorage.setItem('user', JSON.stringify({
      active: active,
      email: email
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
    EnvService,
    ActiveLinkService,
    provide('login.config', {useValue: LOGIN_CONFIG})
  ]
})
@RouteConfig([
  { 
    path: '/villains/...', 
    name: 'VillainsCenter', 
    component: VillainsComponent,
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

  constructor(@Inject('login.config') public config: LoginConfig) {
    // for now
    let user = JSON.parse(window.localStorage.getItem('user'));
    if (user) {
      this.config.active = user.active;
      this.config.email = user.email;
    }
  }
}
