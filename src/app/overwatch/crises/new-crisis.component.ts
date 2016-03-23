import {Component} from 'angular2/core';
import {NgForm} from 'angular2/common';
import {RouteParams, Router, CanDeactivate, ComponentInstruction} from 'angular2/router';

import {Crisis} from './crisis';
import {CrisesService} from './crises.service';
import {DialogService} from '../../dialog.service';
import {UtilsService} from '../../utils.service';

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
    private _crisesService: CrisesService,
    private _dialogService: DialogService,
    private _utils: UtilsService,
    private _routeParams: RouteParams,
    private _router: Router
  ) {
    this.villainId = this._routeParams.get('id');
    this.crisis.begin = this._utils.dateString(new Date());
  }

  routerCanDeactivate(next: ComponentInstruction, prev: ComponentInstruction): any {
    if (!this.edited) return true;
    return this._dialogService.confirm('Ignore changes?');
  }

  cancel(edited: boolean) {
    this.edited = edited;
    this._utils.goTo(this._router, ['CrisesList']);
  }

  save(): void {
    this._crisesService.addCrisis(this.crisis, this.villainId)
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
    return false; 
  }
}