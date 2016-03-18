import {Component, OnInit} from 'angular2/core';
import {RouteParams, Router} from 'angular2/router';

import {Hero} from './hero';
import {HeroesService} from './heroes.service';

@Component({
  template: require( '../templates/supers-list.html')
})
export class HeroesListComponent implements OnInit {
  title = 'Here, there be saviours...';
  list: Hero[];
  selectedId: string;
  category = 'hero';

  constructor(
    private _heroesService: HeroesService,
    private _routeParams: RouteParams,
    private _router: Router
  ) {}

  ngOnInit() {
    this._heroesService.getHeroes()
      .subscribe(
        list => {
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
    this._goTo('EditHero', { id: id });
  }

  add() {
    this._goTo('NewHero', {});
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

  challenge(id: string) {
    this._heroesService.getUninvolvedCrises(id)
      .subscribe(
        crises => console.log(crises)
      );
  }

  private _goTo(routeName, params) {
    this._router.navigate([routeName, params]);
  }
}
