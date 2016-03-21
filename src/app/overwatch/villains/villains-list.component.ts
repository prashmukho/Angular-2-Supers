import {Component, OnInit} from 'angular2/core';
import {RouteParams, Router} from 'angular2/router';

import {Villain} from './villain';
import {VillainsService} from './villains.service';
import {InvolvementComponent} from '../involvement.component';
import {Crisis} from '../crises/crisis';

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
    private _routeParams: RouteParams,
    private _router: Router
  ) {}

  ngOnInit() {
    this._villainsService.getVillains()
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
    this._goTo(this._router, ['EditVillain', { id: id }]);
  }

  add() {
    this._goTo(this._router, ['NewVillain']);
  }

  delete(id: string) {
    this._villainsService.deleteVillain(id)
      .subscribe(
        (villain: Villain) => {
          let index = this.list.indexOf(villain);
          this.list.splice(index, 1);
          console.log('deleted', villain);
        },
        error => console.error(error)
      );
  }

  instigate(id: string) {
    this._goTo(this._router.parent, [
      'CrisesCenter', 'NewCrisis', { id: id }
    ]);
  }

  involve($event)  {
    this._villainsService.involveInCrisis($event.superId, $event.crisisId)
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
