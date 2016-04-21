import {Component, OnInit} from 'angular2/core';
import {NgForm} from 'angular2/common';
import {RouteParams, Router, CanDeactivate, ComponentInstruction} from 'angular2/router';
import * as Rx from "rxjs/Rx";

import {Villain} from './villain';
import {VillainsService} from './villains.service';
import {DialogService} from '../../dialog.service';
import {UtilsService} from '../../utils.service';
import {SupersHelperService} from '../supers-helper.service';

@Component({
  template: require('../templates/super-detail.html')
})
export class VillainDetailComponent implements OnInit, CanDeactivate {
  modelId: string;
  model: Villain = {
    _id: undefined, 
    name: undefined, 
    power: { name: undefined, strength: 3 }, 
    alias: undefined 
  };
  edited: boolean = false;
  action: string;

  constructor(
    private _villainsService: VillainsService,
    private _dialogService: DialogService,
    private _utils: UtilsService,
    private _routeParams: RouteParams,
    private _router: Router,
    private _handle: SupersHelperService<Villain>
  ) {}

  ngOnInit() {
    this._handle.onSuperDetailInit(this, 'villain');
  }
        
  routerCanDeactivate(next: ComponentInstruction, prev: ComponentInstruction): any {
    if (!this.edited) return true;
    return this._dialogService.confirm('Ignore changes?');
  }

  cancel(edited: boolean) {
    this.edited = edited;
    
    let routePath = ( this.model['_id'] ? 
                      ['VillainsList', { id: this.model['_id'] }] : 
                      ['VillainsList'] );
    this._utils.goTo(this._router, routePath);
  }

  save() {
    this._handle.onSuperDetailSave(this, 'villain');
  }
}