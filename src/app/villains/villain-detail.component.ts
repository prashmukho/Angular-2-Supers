import {Component, OnInit} from 'angular2/core';
import {NgForm} from 'angular2/common';
import {RouteParams, Router, CanDeactivate, ComponentInstruction} from 'angular2/router';
import {Villain} from './villain';
import {VillainService} from './villain.service';
import {DialogService} from '../dialog.service';

@Component({
  template: require('./templates/villain-detail-component.html')
})
export class VillainDetailComponent implements OnInit, CanDeactivate {
  villain: Villain;
  edited: boolean = false;
  action: string = 'Edit';

  constructor(
    private _villainService: VillainService,
    private _routeParams: RouteParams,
    private _router: Router,
    private _dialogService: DialogService
  ) {}

  ngOnInit() {
    let id = +this._routeParams.get('id');
    this._villainService.getVillain(id)
      .then(villain => {
        if (!villain) {
          this._goTo('VillainList', {});
          return false;
        }
        this.villain = villain;
      });
  }

  routerCanDeactivate(next: ComponentInstruction, prev: ComponentInstruction): any {
    if (!this.villain || !this.edited) {
      return true;
    }

    return this._dialogService.confirm('Ignore changes?');
  }

  cancel(ngFormElement) {
    this.edited = ngFormElement.dirty;
    this._goTo('VillainList', { id: this.villain.id });
  }
      
  save() {
    this._goTo('VillainList', { id: this.villain.id });
  }

  private _goTo(routeName, params) {
    this._router.navigate([routeName, params]);
  }
}
