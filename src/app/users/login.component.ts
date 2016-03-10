import {Component, OnInit, Inject} from 'angular2/core';
import {Router} from 'angular2/router';

import {LoginConfig} from '../app.component';
import {UserService} from './user.service';
import {EnvService} from '../env.service';

import './user-form.scss';

interface Login {
  username: string,
  password: string
}

@Component({
  template: require('./user-form.html'),
  providers: [UserService]
})
export class LoginComponent implements OnInit {
  user: Login = {
    username: '',
    password: ''
  };

  action: string = 'Login'; // default

  constructor( 
    private _router: Router,
    private _userService: UserService,
    private _envService: EnvService,
    @Inject('login.config') public config: LoginConfig
  ) {}

  ngOnInit() {
    console.log('Please sign in...');

    this._envService.getFbAppID()
      .then(
        id => require('./fb.js')(id, this.config),
        error => console.log(error)
      );

    this._envService.getGoogleClientID()
      .then(
        id => require('./google.js')(id),
        error => console.log(error)
      );
  }

  signIn(btn) {
    btn.disabled = true;

    this._userService.signIn(this.user)
      .subscribe(
        data => {
          console.log(`logged in as ${data.account.email}`);
          this._router.navigate(['VillainsCenter']);
        },
        error => {
          console.log(error);
          btn.disabled = false;
        }
      );
  }
}