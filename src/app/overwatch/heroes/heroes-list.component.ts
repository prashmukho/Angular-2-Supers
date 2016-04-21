import {Component, OnInit} from 'angular2/core';
import {RouteParams, Router} from 'angular2/router';

import {Hero} from './hero';
import {Crisis} from '../crises/crisis';
import {InvolvementComponent, InvolvementEvent} from '../involvement.component';
import {HeroesService} from './heroes.service';
import {UtilsService} from '../../utils.service';
import {SupersHelperService} from '../supers-helper.service';

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
    private _router: Router,
    private _handle: SupersHelperService<Hero>
  ) {}

  ngOnInit() {
    this._handle.onSuperListInit(this, 'hero');
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
    this._handle.onSuperListDelete(this, 'hero', id);
  }

  involve($event: InvolvementEvent) {
    this._handle.onSuperListInvolve(this, 'hero', $event.superId, $event.crisisId);
  }
}
