import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from 'angular2/router';
import {HTTP_PROVIDERS}    from 'angular2/http';

import {VillainsComponent} from './villains/villains.component';
import {UsersComponent} from './users/users.component';
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
    EnvService
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
    path: '/users', 
    name: 'UsersCenter',
    component: UsersComponent
  }
])
export class AppComponent { 
  title = 'Seeds of Destruction';
}
