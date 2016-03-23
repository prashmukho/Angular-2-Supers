import {Component, OnInit} from 'angular2/core';
import {NgForm} from 'angular2/common';
import {RouteParams, Router, CanDeactivate, ComponentInstruction} from 'angular2/router';

import {Crisis} from './crisis';
import {CrisesService} from './crises.service';
import {DialogService} from '../../dialog.service';
import {UtilsService} from '../../utils.service';

@Component({
  template: require('./templates/crisis-detail.html')
})
export class EditCrisisComponent implements OnInit { 
  crisis: Crisis;
  edited: boolean = false;
  action: string = 'Edit Crisis';

  constructor(
    private _crisesService: CrisesService,
    private _dialogService: DialogService,
    private _utils: UtilsService,
    private _routeParams: RouteParams,
    private _router: Router
  ) {}

  ngOnInit() {
    let id = this._routeParams.get('id');
    this._crisesService.getCrisis(id)
      .subscribe(
        (crisis: Crisis) => {
          if (!crisis) {
            this._utils.goTo(this._router, ['CrisesList']);
            return false;
          }
          this.crisis = crisis;
          this.crisis.begin = crisis.begin.match(/^(\d{4}-\d{2}-\d{2})/)[1];
        },
        error => console.error('Invalid ID!')
      );
  }

  routerCanDeactivate(next: ComponentInstruction, prev: ComponentInstruction): any {
    if (!this.edited) return true;
    return this._dialogService.confirm('Ignore changes?');
  }

  cancel(edited: boolean) {
    this.edited = edited;
    this._utils.goTo(this._router, ['CrisesList', { id: this.crisis['_id'] }]);
  }

  save(): void {
    this._crisesService.updateCrisis(this.crisis)
      .subscribe(
        (crisis: Crisis) => {
          console.log('saved', crisis);
          this.edited = false;
          this._utils.goTo(this._router, ['CrisesList', { id: crisis['_id'] }]);
        },
        error => console.error(error)
      );
  }

  hasCommenced() {
    return true;
  }
}