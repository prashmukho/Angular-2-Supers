import {Component, OnInit} from 'angular2/core';
import {NgForm} from 'angular2/common';
import {RouteParams, Router, CanDeactivate, ComponentInstruction} from 'angular2/router';

import {Hero} from './hero';
import {HeroesService} from './heroes.service';
import {DialogService} from '../../dialog.service';
import {UtilsService} from '../../utils.service';

@Component({
  template: require('../templates/super-detail.html')
})
export class EditHeroComponent {
  model: Hero;
  edited: boolean = false;
  action: string = 'Edit Hero';

  constructor(
    private _heroesService: HeroesService,
    private _dialogService: DialogService,
    private _utils: UtilsService,
    private _routeParams: RouteParams,
    private _router: Router
  ) {}

  ngOnInit() {
    let id = this._routeParams.get('id');
    this._heroesService.getHero(id)
      .subscribe(
        (hero: Hero) => {
          if (!hero) {
            this._utils.goTo(this._router, ['HeroesList']);
            return false;
          }
          this.model = hero;
        },
        error => console.error('Invalid ID!')
      );
  }

  routerCanDeactivate(next: ComponentInstruction, prev: ComponentInstruction): any {
    if (!this.model || !this.edited) return true;
    return this._dialogService.confirm('Ignore changes?');
  }

  cancel(edited: boolean) {
    this.edited = edited;
    this._utils.goTo(this._router, ['HeroesList', { id: this.model['_id'] }]);
  }
      
  save() {
    this.edited = false;
    this._heroesService.updateHero(this.model)
      .subscribe(
        (hero: Hero) => {
          console.log('updated', hero);
          this._utils.goTo(this._router, ['HeroesList', { id: hero['_id'] }]);
        },
        error => console.error(error)
      );
  }
}