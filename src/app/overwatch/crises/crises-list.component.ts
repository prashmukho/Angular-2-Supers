import {Component, OnInit} from 'angular2/core';
import {RouteParams, Router} from 'angular2/router';

import {Crisis} from './crisis';
import {CrisesService} from './crises.service';
import {UtilsService} from '../../utils.service';

@Component({
  template: require( './templates/crises-list.html')
})
export class CrisesListComponent implements OnInit {
  title = 'Trouble brewing...';
  crises: Crisis[];
  selectedId: string;

  constructor(
    private _crisesService: CrisesService,
    private _utils: UtilsService,
    private _routeParams: RouteParams,
    private _router: Router
  ) {}

  ngOnInit() {
    let id = this._routeParams.get('id');
    if (id) this.selectedId = id;
    this._crisesService.getCrises()
      .subscribe(
        (crises: Crisis[]) => {
          this.crises = crises;
          let center = this.crises[0].epicenter;
          // default: zoom - 3
          require('./geolocation.js')(center[1], center[0], crises, 3);
        },
        error => console.error(error)
      );
  }

  isSelected(id: string): boolean { 
    return this.selectedId === id;
  }

  edit(id: string) {
    this._utils.goTo(this._router, ['EditCrisis', { crisisId: id }]);
  }

  delete(id: string) {
    this._crisesService.deleteCrisis(id)
      .subscribe(
        (crisis: Crisis) => {
          let index = this._utils.getDeletedListIndex(crisis['_id'], this.crises);
          this.crises.splice(index, 1);
          console.log('deleted', crisis);
          
          window.postMessage({ 
            type: 'deletecrisis', 
            crisisId: crisis['_id'] 
          }, window.location.href);
        },
        error => console.error(error)
      );
  }
}