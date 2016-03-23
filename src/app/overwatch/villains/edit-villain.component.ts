import {Component, OnInit} from 'angular2/core';
import {NgForm} from 'angular2/common';
import {RouteParams, Router, CanDeactivate, ComponentInstruction} from 'angular2/router';

import {Villain} from './villain';
import {VillainsService} from './villains.service';
import {DialogService} from '../../dialog.service';
import {UtilsService} from '../../utils.service';

@Component({
  template: require('../templates/super-detail.html')
})
export class EditVillainComponent implements OnInit, CanDeactivate {
  model: Villain;
  edited: boolean = false;
  action: string = 'Edit Villain';

  constructor(
    private _villainsService: VillainsService,
    private _dialogService: DialogService,
    private _utils: UtilsService,
    private _routeParams: RouteParams,
    private _router: Router
  ) {}

  ngOnInit() {
    let id = this._routeParams.get('id');
    this._villainsService.getVillain(id)
      .subscribe(
        (villain: Villain) => {
          if (!villain) {
            this._utils.goTo(this._router, ['VillainsList']);
            return false;
          }
          this.model = villain;
        },
        error => console.error('Invalid ID!')
      );
  }

  routerCanDeactivate(next: ComponentInstruction, prev: ComponentInstruction): any {
    if (!this.model || !this.edited) return true;
    return this._dialogService.confirm('Ignore changes?');
  }

  cancel(edited: boolean) {
    this.edited = edited;
    this._utils.goTo(this._router, ['VillainsList', { id: this.model['_id'] }]);
  }
      
  save() {
    this.edited = false;
    this._villainsService.updateVillain(this.model)
      .subscribe(
        (villain: Villain) => {
          console.log('updated', villain);
          this._utils.goTo(this._router, ['VillainsList', { id: villain['_id'] }]);
        },
        error => console.error(error)
      );
  }
}