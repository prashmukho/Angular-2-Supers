import {Component, EventEmitter} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES, Location} from 'angular2/router';
import {LoginComponent} from './login.component';
import {UserService} from './user.service'

@Component({
  template: `
    <login-form></login-form>
  `,
  directives: [ROUTER_DIRECTIVES, LoginComponent],
  providers: [UserService]
})
// @RouteConfig([
//   {
//     path: '/signin', 
//     name: 'SignIn', 
//     component: LoginComponent,
//     useAsDefault: true
//   }
// ])
export class UsersComponent {}