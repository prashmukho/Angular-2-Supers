import {Component, OnInit} from 'angular2/core';
import {RouteParams, Router} from 'angular2/router';

import {Hero} from './hero';
import {HeroesService} from './heroes.service';
import {InvolvementComponent} from '../involvement.component';
import {Crisis} from '../crises/crisis';

@Component({
  template: require( '../templates/supers-list.html'),
  directives: [InvolvementComponent]
})
export class HeroesListComponent implements OnInit {
  title = 'Here, there be saviours...';
  list: Hero[];
  selectedId: string;
  category = 'hero';
  uninvolvedCrises: Crisis[] = [];
  uninvolvedText: string = 'Loading...';

  constructor(
    private _heroesService: HeroesService,
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
    this._goTo(this._router, ['EditHero', { id: id }]);
  }

  add() {
    this._goTo(this._router, ['NewHero']);
  }

  delete(id: string) {
    this._heroesService.deleteHero(id)
      .subscribe(
        (hero: Hero) => {
          let index = this.list.indexOf(hero);
          this.list.splice(index, 1);
          console.log('deleted', hero);
        },
        error => console.error(error)
      );
  }

  involve($event) {
    this._heroesService.involveInCrisis($event.superId, $event.crisisId)
      .subscribe(
        (crisis: Crisis) => this._goTo(this._router.parent, [
          'CrisesCenter', 'EditCrisis', { id: crisis['_id'] }
        ]),
        error => console.error(error)
      );
  }

  private _goTo(router, routeArray) {
    router.navigate(routeArray);
  }
}
