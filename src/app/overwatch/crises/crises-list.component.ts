import {Component, OnInit} from 'angular2/core';

import {Crisis} from './crisis';
import {CrisesService} from './crises.service';

@Component({
  template: require( './templates/crises-list.html')
})
export class CrisesListComponent implements OnInit {
  title = 'Trouble brewing...';
  crises: Crisis[];

  constructor(private _crisesService: CrisesService) {}

  ngOnInit() {
    this._crisesService.getCrises()
      .subscribe(
        crises => this.crises = crises,
        error => console.error(error)
      );
  }
}