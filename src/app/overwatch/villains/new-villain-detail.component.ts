import {Component} from 'angular2/core';
import {NgForm} from 'angular2/common';
import {Router, CanDeactivate, ComponentInstruction} from 'angular2/router';

import {Villain} from './villain';
import {VillainService} from './villain.service'
import {DialogService} from '../../dialog.service';

@Component({
  template: require('./templates/villain-detail-component.html')
})
export class NewVillainDetailComponent implements CanDeactivate {
  model = { 
    name:'', 
    power: { name: '', strength: 3 }, 
    alias:'' 
  };
  edited: boolean = false;
  action: string = 'New';

  constructor(
    private _router: Router,
    private _villainService: VillainService,
    private _dialogService: DialogService
  ) {}

  routerCanDeactivate(next: ComponentInstruction, prev: ComponentInstruction): any {
    if (!this.edited) {
      return true;
    }

    return this._dialogService.confirm('Ignore changes?');
  }

  cancel(edited: boolean) {
    this.edited = edited;
    this._goTo('VillainList', {});
  }

  save(): void {
    this.edited = false;
    this._villainService.addVillain(this.model)
      .subscribe(
        (villain: Villain) => {
          console.log('saved', villain);
          this._goTo('VillainList', { id: villain['_id'] });
        },
        error => console.error(error)
      );
  }

  private _goTo(routeName, params) {
    this._router.navigate([routeName, params]);
  }
}
