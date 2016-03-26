import {Component} from 'angular2/core';
import {NgForm} from 'angular2/common';
import {Router, CanDeactivate, ComponentInstruction} from 'angular2/router';

import {Villain} from './villain';
import {VillainsService} from './villains.service';
import {DialogService} from '../../dialog.service';
import {UtilsService} from '../../utils.service';

@Component({
  template: require('../templates/super-detail.html')
})
export class NewVillainComponent implements CanDeactivate {
  model = { 
    name: '', 
    power: { name: '', strength: 3 }, 
    alias: '' 
  };
  edited: boolean = false;
  action: string = 'Add Villain';

  constructor(
    private _villainsService: VillainsService,
    private _dialogService: DialogService,
    private _utils: UtilsService,
    private _router: Router
  ) {}

  routerCanDeactivate(next: ComponentInstruction, prev: ComponentInstruction): any {
    if (!this.edited) return true;
    return this._dialogService.confirm('Ignore changes?');
  }

  cancel(edited: boolean) {
    this.edited = edited;
    this._utils.goTo(this._router, ['VillainsList']);
  }

  save(): void {
    this._villainsService.addVillain(this.model)
      .subscribe(
        (villain: Villain) => {
          console.log('saved', villain);
          this.edited = false;
          this._utils.goTo(this._router, ['VillainsList', { id: villain['_id'] }]);
        },
        error => console.error(error)
      );
  }
}