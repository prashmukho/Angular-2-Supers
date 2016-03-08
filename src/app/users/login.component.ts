import {Component, Output, EventEmitter, OnInit} from 'angular2/core';
import {Http, Response} from 'angular2/http';
import * as Rx from "rxjs/Rx"
import {Headers, RequestOptions} from 'angular2/http';
import {Router} from 'angular2/router'
import {UserService} from './user.service'

interface Login {
  username: string,
  password: string
}

@Component({
  selector: 'login-form',
  template: require('./templates/user-form.html')
})
export class LoginComponent implements OnInit {
  user: Login = {
    username: '',
    password: ''
  };

  constructor(private _userService: UserService, private _router: Router) { }

  ngOnInit() {
    console.log('Sign in...');
  }

  signIn() {
    this._userService.signIn(this.user.username, this.user.password)
      .subscribe(
        data => {
          console.log(`logged in as ${data.account.email}`);
          this._router.navigate(['VillainsCenter']);
        },
        error => console.log(error)
      );
  }
}