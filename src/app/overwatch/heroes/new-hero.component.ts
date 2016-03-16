import {Component} from 'angular2/core';
import {NgForm} from 'angular2/common';
import {Router, CanDeactivate, ComponentInstruction} from 'angular2/router';

import {Hero} from './hero';
import {HeroesService} from './heroes.service'
import {DialogService} from '../../dialog.service';

@Component({
  template: require('../templates/super-detail.html')
})
export class NewHeroComponent implements CanDeactivate {
  model = { 
    name:'', 
    power: { name: '', strength: 3 }, 
    alias:'' 
  };
  edited: boolean = false;
  action: string = 'Add Hero';

  constructor(
    private _router: Router,
    private _heroesService: HeroesService,
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
    this._goTo('HeroesList', {});
  }

  save(): void {
    this.edited = false;
    this._heroesService.addHero(this.model)
      .subscribe(
        (hero: Hero) => {
          console.log('saved', hero);
          this._goTo('HeroesList', { id: hero['_id'] });
        },
        error => console.error(error)
      );
  }

  private _goTo(routeName, params) {
    this._router.navigate([routeName, params]);
  }
}
