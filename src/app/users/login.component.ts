import {Component, Inject, OnInit} from 'angular2/core';
import {Router} from 'angular2/router';

import {UserService} from './user.service';
import {ValidationDirective, Validator} from './validation.directive';
import {LoginConfig} from '../app.component';
import {ActiveLinkService} from '../active-link.service';

import './user-form.scss';

interface Login {
  username: string,
  password: string,
  // when registering, these fields may be populated
  firstName?: string,
  lastName?: string
}

@Component({
  template: require('./user-form.html'),
  directives: [ValidationDirective],
  providers: [UserService]
})
export class LoginComponent implements OnInit {
  user: Login = {
    username: '',
    password: ''
  };

  action: string = 'Sign In'; // default
  formDataError: string;
  // simple email regex
  emailRules: Validator = {
    rules: [
      // need better matcher for emails
      { regExp: /\w+@\w+\.\w{2,4}/, message: 'Invalid email address' }
    ]
  }
  // Stormpath password rules
  passwordRules: Validator = {
    rules: [
      { regExp: /[A-Z]+/, message: 'Must contain an uppercase letter' },
      { regExp: /[a-z]+/, message: 'Must contain a lowercase letter' },
      { regExp: /[0-9]+/, message: 'Must contain a digit' },
      { regExp: /\w{8,100}/, message: 'Must be 8 characters long' }
    ]
  }

  constructor(
    private _router: Router,
    private _userService: UserService,
    private _activeLink: ActiveLinkService,
    @Inject('login.config') public config: LoginConfig
  ) {}

  ngOnInit() {
    this._activeLink.switchLink('SignIn');
    // load Facebook SDK
    require('./fb.js')(this.config);
    // load Google SDK
    require('./google.js')(this.config);
  }

  signIn(btn) {
    btn.disabled = true;
    this.formDataError = null;

    this._userService.signIn(this.user)
      .subscribe(
        data => {
          this.config.postLogin(
            this.config.active = true, 
            this.config.email = data.account.email
          );
          this._router.navigate(['VillainsCenter']);
        },
        error => {
          if (!this._errors()) {
            let msg = JSON.parse(error._body).message;
            this.formDataError = msg;
          }
          btn.disabled = false;
        }
      );
  }

  signUp(btn) {
    btn.disabled = true;
    this.formDataError = null;

    this._userService.signUp(this.user)
      .subscribe(
        data => { 
          console.log('Created account for', data.account.email);
          this.action = 'Sign In';
          btn.disabled = false;
        },
        error => {
          if (!this._errors()) {
            let msg = JSON.parse(error._body).message;
            this.formDataError = msg;
          }
          btn.disabled = false;
        }
      );
  }

  socialSignIn() {
    this.config.postLogin(
      this.config.active,
      this.config.email
    );
    // switch route after login dialog closes
    setTimeout(() => this._router.navigate(['VillainsCenter']), 200)
  }

  private _errors(): boolean {
    // class 'panel-danger' added to div.errors if validations fail
    if ($('.errors.panel-danger').length) {
      // class 'show-errors' added to trigger display
      $('.errors.panel-danger').addClass('show-errors');
      return true;
    }
    return false
  }
}