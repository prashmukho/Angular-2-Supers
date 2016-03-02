import {Component, OnInit} from 'angular2/core';
import {NgForm} from 'angular2/common';
import {RouteParams, Router, CanDeactivate, ComponentInstruction} from 'angular2/router';
import {Villain} from './villain';
import {DialogService} from '../dialog.service';

@Component({
  template: require('./templates/villain-detail-component.html')
})
export class NewVillainDetailComponent implements CanDeactivate {
  villain: Villain;
  edited: boolean = false;
  action: string = 'New';

  constructor(
    private _routeParams: RouteParams,
    private _router: Router,
    private _dialogService: DialogService
  ) { 
    this.villain = new Villain(0, '', '', '');
    // 'nextId' will be sent with request to /villains/new
    let nextId = +this._routeParams.get('nextId');
    if (nextId) this.villain.id = nextId;
  }

  routerCanDeactivate(next: ComponentInstruction, prev: ComponentInstruction): any {
    if (!this.villain || !this.edited) {
      return true;
    }

    return this._dialogService.confirm('Ignore changes?');
  }

  cancel(ngFormElement) {
    this.edited = ngFormElement.dirty;
    this._goTo('VillainList', {});
  }

  save() {
    this._goTo('VillainList', { newVillain: JSON.stringify(this.villain) });
  }

  private _goTo(routeName, params) {
    this._router.navigate([routeName, params]);
  }
}
