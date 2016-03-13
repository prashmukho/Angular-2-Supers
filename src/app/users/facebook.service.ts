import {Injectable, Inject, OnInit} from 'angular2/core';

import {LoginConfig} from '../app.component';
import {EnvService} from '../env.service';

@Injectable()
export class FacebookService {
  constructor(
    private _envService: EnvService,
    @Inject('login.config') private _loginConfig: LoginConfig
  ) {}

  attachSignIn() {
    this._envService.getFbAppID()
      .then(id => require('./fb.js')(id, 'login', this._loginConfig));
  }

  attachSignOut() {
    this._envService.getFbAppID()
      .then(id => require('./fb.js')(id, 'logout', this._loginConfig));
  }
}