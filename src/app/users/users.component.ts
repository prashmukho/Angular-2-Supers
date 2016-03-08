import {Component, EventEmitter} from 'angular2/core';
import {LoginComponent} from './login.component';
import {UserService} from './user.service'

@Component({
  template: `
    <login-form></login-form>
  `,
  directives: [LoginComponent],
  providers: [UserService]
})
export class UsersComponent {}