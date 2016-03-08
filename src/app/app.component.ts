import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from 'angular2/router';
import {HTTP_PROVIDERS}    from 'angular2/http';

import {VillainsComponent} from './villains/villains.component';
import {LoginComponent} from './login.component';
import {UserService} from './user.service';
import {DialogService} from './dialog.service';
import {EnvService} from './env.service';

@Component({
  selector: 'my-app',
  template: require('./app-component.html'),
  // styles: [require(./app-component.scss)],
  directives: [ROUTER_DIRECTIVES],
  providers: [
    ROUTER_PROVIDERS, 
    HTTP_PROVIDERS, 
    DialogService,
    EnvService,
    UserService
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
}
