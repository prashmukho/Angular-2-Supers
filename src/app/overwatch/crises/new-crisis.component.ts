import {Component} from 'angular2/core';
import {NgForm} from 'angular2/common';
import {RouteParams, Router, CanDeactivate, ComponentInstruction} from 'angular2/router';

import {Crisis} from './crisis';
import {CrisesService} from './crises.service';
import {DialogService} from '../../dialog.service';

@Component({
  template: require('./templates/crisis-detail.html')
})
export class NewCrisisComponent { 
  crisis = { 
    title:'', 
    begin: null
  };
  edited: boolean = false;
  action: string = 'Add Crisis';
  villainId: string;

  constructor(
    private _router: Router,
    private _routeParams: RouteParams,
    private _crisesService: CrisesService,
    private _dialogService: DialogService
  ) {
    this.villainId = this._routeParams.get('id');
    this.crisis.begin = this._dateString(new Date());
  }

  routerCanDeactivate(next: ComponentInstruction, prev: ComponentInstruction): any {
    if (!this.edited) return true;
    return this._dialogService.confirm('Ignore changes?');
  }

  cancel(edited: boolean) {
    this.edited = edited;
    this._goTo('CrisesList', {});
  }

  save(): void {
    this._crisesService.addCrisis(this.crisis, this.villainId)
      .subscribe(
        (crisis: Crisis) => {
          console.log('saved', crisis);
          this.edited = false;
          this._goTo('CrisesList', {});
        },
        error => console.error(error)
      );
  }

  hasCommenced() { 
    return false; 
  }

  private _goTo(routeName, params) {
    this._router.navigate([routeName, params]);
  }

  private _dateString(date: Date) {
    let MM = String(date.getMonth() + 1);
    MM = MM.length === 1 ? '0' + MM : MM;

    let dd = String(date.getDate());
    dd = dd.length === 1 ? '0' + dd : dd;

    return `${date.getFullYear()}-${MM}-${dd}`;
  }
}