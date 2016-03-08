import {Component, OnInit} from 'angular2/core';
import {Router} from 'angular2/router';
import {UserService} from './user.service';
import {EnvService} from './env.service';

interface Login {
  username: string,
  password: string
}

@Component({
  selector: 'login-form',
  template: require('./user-form.html')
})
export class LoginComponent implements OnInit {
  user: Login = {
    username: '',
    password: ''
  };

  type: string = 'login'; // default

  constructor( 
    private _router: Router,
    private _userService: UserService,
    private _envService: EnvService
  ) {}

  ngOnInit() {
    this._envService.getFbAppID()
      .subscribe(
        data => console.log(data),
        error => console.log(error)
      );

    console.log('Sign in...');
  }

  signIn() {
    this._userService.signIn(this.user)
      .subscribe(
        data => {
          console.log(`logged in as ${data.account.email}`);
          this._router.navigate(['VillainsCenter']);
        },
        error => console.log(error)
      );
  }
}