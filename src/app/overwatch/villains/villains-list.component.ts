import {Component, OnInit} from 'angular2/core';
import {RouteParams, Router} from 'angular2/router';

import {Villain} from './villain';
import {Crisis} from '../crises/crisis';
import {InvolvementComponent, InvolvementEvent} from '../involvement.component';
import {VillainsService} from './villains.service';
import {UtilsService} from '../../utils.service';
import {SupersHelperService} from '../supers-helper.service';

@Component({
  template: require('../templates/supers-list.html'),
  directives: [InvolvementComponent]
})
export class VillainsListComponent implements OnInit {
  title = 'Here, there be baddies...';
  list: Villain[];
  selectedId: string;
  category = 'villain';

  constructor(
    private _villainsService: VillainsService,
    private _utils: UtilsService,
    private _routeParams: RouteParams,
    private _router: Router,
    private _handle: SupersHelperService<Villain>
  ) {}

  ngOnInit() {
    this._handle.onSuperListInit(this, 'villain');
  }

  isSelected(id: string): boolean { 
    return this.selectedId === id;
  }
  
  edit(id: string) {
    this._utils.goTo(this._router, ['EditVillain', { id: id }]);
  }

  add() {
    this._utils.goTo(this._router, ['NewVillain']);
  }

  delete(id: string) {
    this._handle.onSuperListDelete(this, 'villain', id);
  }

  involve($event: InvolvementEvent) {
    this._handle.onSuperListInvolve(this, 'villain', $event.superId, $event.crisisId);
  }

  instigate(id: string) {
    this._utils.goTo(this._router.parent, [
      'CrisesCenter', 'NewCrisis', { villainId: id }
    ]);
  }
}
