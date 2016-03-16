import {Component, OnInit} from 'angular2/core';
import {RouteParams, Router} from 'angular2/router';

import {Villain} from './villain';
import {VillainsService} from './villains.service';

@Component({
  template: require('../templates/list.html')
})
export class VillainsListComponent implements OnInit {
  list: Villain[];
  selectedId: string;

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
  
  edit(villain: Villain): void {
    this._goTo('EditVillain', {
      id: villain['_id'],
      // villain: JSON.stringify(villain)
    });
  }

  add() {
    this._goTo('NewVillain', {});
  }

  delete(villain: Villain): void {
    this._villainsService.deleteVillain(villain['_id'])
      .subscribe(
        (villain: Villain) => {
          let index = this.list.indexOf(villain);
          this.list.splice(index, 1);
          console.log('deleted', villain);
        },
        error => console.error(error)
      );
  }

  private _goTo(routeName, params) {
    this._router.navigate([routeName, params]);
  }
}
