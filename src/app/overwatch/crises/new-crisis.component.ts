import {Component, OnInit} from 'angular2/core';
import {NgForm} from 'angular2/common';
import {RouteParams, Router, CanDeactivate, ComponentInstruction} from 'angular2/router';

import {Crisis} from './crisis';
import {CrisesService} from './crises.service';
import {DialogService} from '../../dialog.service';

@Component({
  template: require('./templates/crisis-detail.html')
})
export class NewCrisisComponent implements OnInit { 
  crisis = { 
    title:'', 
    begin: Date.now()
  };
  edited: boolean = false;
  villainId: string;

  constructor(
    private _router: Router,
    private _routeParams: RouteParams,
    private _crisesService: CrisesService,
    private _dialogService: DialogService
  ) {}

  ngOnInit() {
    this.villainId = this._routeParams.get('villainId');
  }

  routerCanDeactivate(next: ComponentInstruction, prev: ComponentInstruction): any {
    if (!this.edited) {
      return true;
    }

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

  private _goTo(routeName, params) {
    this._router.navigate([routeName, params]);
  }
}