import {Component, OnInit} from 'angular2/core';
import {RouteParams, Router} from 'angular2/router';

import {Crisis} from './crisis';
import {CrisesService} from './crises.service';

@Component({
  template: require( './templates/crises-list.html')
})
export class CrisesListComponent implements OnInit {
  title = 'Trouble brewing...';
  crises: Crisis[];

  constructor(
    private _crisesService: CrisesService,
    private _routeParams: RouteParams,
    private _router: Router
  ) {}

  ngOnInit() {
    this._crisesService.getCrises()
      .subscribe(
        crises => this.crises = crises,
        error => console.error(error)
      );
  }

  edit(id: string) {
    this._goTo('EditCrisis', { id: id });
  }

  delete() {}

  private _goTo(routeName, params) {
    this._router.navigate([routeName, params]);
  }
}