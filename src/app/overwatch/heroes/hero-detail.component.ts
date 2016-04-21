import {Component, OnInit} from 'angular2/core';
import {NgForm} from 'angular2/common';
import {RouteParams, Router, CanDeactivate, ComponentInstruction} from 'angular2/router';
import * as Rx from "rxjs/Rx";

import {Hero} from './hero';
import {HeroesService} from './heroes.service';
import {DialogService} from '../../dialog.service';
import {UtilsService} from '../../utils.service';
import {SupersHelperService} from '../supers-helper.service';

@Component({
  template: require('../templates/super-detail.html')
})
export class HeroDetailComponent implements OnInit, CanDeactivate {
  modelId: string;
  model: Hero = {
    _id: undefined, 
    name: undefined, 
    power: { name: undefined, strength: 3 }, 
    alias: undefined 
  };
  edited: boolean = false;
  action: string;

  constructor(
    private _heroesService: HeroesService,
    private _dialogService: DialogService,
    private _utils: UtilsService,
    private _routeParams: RouteParams,
    private _router: Router,
    private _handle: SupersHelperService<Hero>
  ) {}

  ngOnInit() {
    this._handle.onSuperDetailInit(this, 'hero');
  }

  routerCanDeactivate(next: ComponentInstruction, prev: ComponentInstruction): any {
    if (!this.edited) return true;
    return this._dialogService.confirm('Ignore changes?');
  }

  cancel(edited: boolean) {
    this.edited = edited;

    let routePath = ( this.model['_id'] ? 
                      ['HeroesList', { id: this.model['_id'] }] : 
                      ['HeroesList'] );
    this._utils.goTo(this._router, routePath);
  }

  save() {
    this._handle.onSuperDetailSave(this, 'hero');
  }
}