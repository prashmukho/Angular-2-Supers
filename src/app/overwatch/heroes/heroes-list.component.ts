import {Component, OnInit} from 'angular2/core';
import {RouteParams, Router} from 'angular2/router';

import {Hero} from './hero';
import {Crisis} from '../crises/crisis';
import {InvolvementComponent} from '../involvement.component';
import {HeroesService} from './heroes.service';
import {UtilsService} from '../../utils.service';

@Component({
  template: require( '../templates/supers-list.html'),
  directives: [InvolvementComponent]
})
export class HeroesListComponent implements OnInit {
  title = 'Here, there be saviours...';
  list: Hero[];
  selectedId: string;
  category = 'hero';

  constructor(
    private _heroesService: HeroesService,
    private _utils: UtilsService,
    private _routeParams: RouteParams,
    private _router: Router
  ) {}

  ngOnInit() {
    this._heroesService.getHeroes()
      .subscribe(
        (list: Hero[]) => {
          this.list = list;

          let id = this._routeParams.get('id');
          if (id) this.selectedId = id;
        },
        error => console.error(error)
      );
  }

  isSelected(id: string): boolean { 
    return this.selectedId === id;
  }
  
  edit(id: string) {
    this._utils.goTo(this._router, ['EditHero', { id: id }]);
  }

  add() {
    this._utils.goTo(this._router, ['NewHero']);
  }

  delete(id: string) {
    this._heroesService.deleteHero(id)
      .subscribe(
        (hero: Hero) => {
          let index = this._utils.getDeletedListIndex(hero['_id'], this.list);
          this.list.splice(index, 1);
          console.log('deleted', hero);
        },
        error => console.error(error)
      );
  }

  involve($event) {
    this._heroesService.involveInCrisis($event.superId, $event.crisisId)
      .subscribe(
        (crisis: Crisis) => this._utils.goTo(this._router.parent, [
          'CrisesCenter', 'EditCrisis', { id: crisis['_id'] }
        ]),
        error => console.error(error)
      );
  }
}
