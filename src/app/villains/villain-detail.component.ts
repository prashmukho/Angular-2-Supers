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
    // let villain = this._routeParams.get('villain');
    // if (villain) {
    //   return this.villain = JSON.parse(decodeURIComponent(villain));
    // }

    let id = this._routeParams.get('id');
    this._villainService.getVillain(id)
      .subscribe(
        villain => {
          if (!villain) {
            this._goTo('VillainList', {});
            return false;
          }
          this.villain = villain;
        },
        error => console.error('Invalid ID!')
    );
  }

  routerCanDeactivate(next: ComponentInstruction, prev: ComponentInstruction): any {
    if (!this.villain || !this.edited) {
      return true;
    }

    return this._dialogService.confirm('Ignore changes?');
  }

  cancel(edited: boolean) {
    this.edited = edited;
    this._goTo('VillainList', { id: this.villain['_id'] });
  }
      
  save() {
    this.edited = false;
    this._villainService.updateVillain(this.villain)
      .subscribe(
        (id: string) => {
          console.log('updated #', id);
          this._goTo('VillainList', { id: id });
        },
        error => console.error(error)
      );
  }

  private _goTo(routeName, params) {
    this._router.navigate([routeName, params]);
  }
}
