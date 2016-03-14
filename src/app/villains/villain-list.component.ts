import {Component, OnInit, Inject} from 'angular2/core';
import {RouteParams, Router} from 'angular2/router';

import {Villain} from './villain';
import {VillainService} from './villain.service';

import './villain-list.scss';

@Component({
  template: require('./templates/villain-list-component.html')
})
export class VillainListComponent implements OnInit {
  villains: Villain[];
  selectedId: string;

  constructor(
    private _villainService: VillainService,
    private _routeParams: RouteParams,
    private _router: Router
  ) {}

  ngOnInit() {
    // console.log('villain.component ngOnInit', window.localStorage.getItem('user'));

    this._villainService.getVillains()
      .subscribe(
        villains => {
          this.villains = villains;

          let id = this._routeParams.get('id');
          if (id) this.selectedId = id;
        },
        error => console.error(error)
      );
  }

  isSelected(id: string): boolean { 
    return this.selectedId === id;
  }
  
  viewVillain(villain: Villain): void {
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
        (id: string) => {
          let index = this.villains.indexOf(villain);
          this.villains.splice(index, 1);
          console.log('deleted #', id);
        },
        error => console.error(error)
      );
  }

  private _goTo(routeName, params) {
    this._router.navigate([routeName, params]);
  }
}
