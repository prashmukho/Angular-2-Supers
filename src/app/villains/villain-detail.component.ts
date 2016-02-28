import {Component, OnInit} from 'angular2/core';
import {RouteParams, Router} from 'angular2/router';
import {Villain} from './villain';
import {VillainService} from './villain.service'

@Component({
  template: `
    <div *ngIf="villain">
      <h3>{{ villain.id }}: {{villain.name }}</h3>
      Nefarious Power: <i>{{ villain.power }}</i>
    </div>
    <button type='button' (click)="goBack()">Back</button>
  `
})
export class VillainDetailComponent implements OnInit {
  villain: Villain;

  constructor(
    private _villainService: VillainService,
    private _routeParams: RouteParams,
    private _router: Router
  ) {}

  ngOnInit() {
    let id = +this._routeParams.get('id');
    this._villainService.getVillain(id)
      .then(villain => this.villain = villain);
  }

  goBack() {
    this._router.navigate(['VillainList', { id: this.villain.id }]);
  }
}