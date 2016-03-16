import {Component, OnInit} from 'angular2/core';
import {NgForm} from 'angular2/common';
import {RouteParams, Router, CanDeactivate, ComponentInstruction} from 'angular2/router';

import {Hero} from './hero';
import {HeroesService} from './heroes.service';
import {DialogService} from '../../dialog.service';

@Component({
  template: require('../templates/super-detail.html')
})
export class EditHeroComponent {
  model: Hero;
  edited: boolean = false;
  action: string = 'Edit Hero';

  constructor(
    private _heroesService: HeroesService,
    private _routeParams: RouteParams,
    private _router: Router,
    private _dialogService: DialogService
  ) {}

  ngOnInit() {
    let id = this._routeParams.get('id');
    this._heroesService.getHero(id)
      .subscribe(
        (hero: Hero) => {
          if (!hero) {
            this._goTo('HeroesList', {});
            return false;
          }
          this.model = hero;
        },
        error => console.error('Invalid ID!')
      );
  }

  routerCanDeactivate(next: ComponentInstruction, prev: ComponentInstruction): any {
    if (!this.model || !this.edited) {
      return true;
    }

    return this._dialogService.confirm('Ignore changes?');
  }

  cancel(edited: boolean) {
    this.edited = edited;
    this._goTo('HeroesList', { id: this.model['_id'] });
  }
      
  save() {
    this.edited = false;
    this._heroesService.updateHero(this.model)
      .subscribe(
        (hero: Hero) => {
          console.log('updated', hero);
          this._goTo('HeroesList', { id: hero['_id'] });
        },
        error => console.error(error)
      );
  }

  private _goTo(routeName, params) {
    this._router.navigate([routeName, params]);
  }
}