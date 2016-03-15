import {Component, OnInit} from 'angular2/core';
import {RouteParams, Router} from 'angular2/router';

import {Villain} from './villain';
import {VillainService} from './villain.service';

@Component({
  template: require('./templates/villain-list-component.html')
})
export class VillainListComponent implements OnInit {
  list: Villain[];
  category: string = window.location.pathname.match(/^\/(.*)\/?/)[1];
  selectedId: string;

  constructor(
    private _villainService: VillainService,
    private _routeParams: RouteParams,
    private _router: Router
  ) {}

  ngOnInit() {
    this._villainService.getVillains()
      .subscribe(
        list => {
          this.list = list;

          let id = this._routeParams.get('id');
          if (id) this.selectedId = id;
        },
        error => console.error(error)
      );

    console.log(this.category);
  }

  isSelected(id: string): boolean { 
    return this.selectedId === id;
  }
  
  editVillain(villain: Villain): void {
    this._goTo('VillainDetail', {
      id: villain['_id'],
      // villain: JSON.stringify(villain)
    });
  }

  newVillain() {
    this._goTo('NewVillainDetail', {});
  }

  deleteVillain(villain: Villain): void {
    this._villainService.deleteVillain(villain['_id'])
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
