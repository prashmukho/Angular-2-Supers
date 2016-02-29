import {Component, OnInit} from 'angular2/core';
import {RouteParams, Router, CanDeactivate, ComponentInstruction} from 'angular2/router';
import {Villain} from './villain';
import {VillainService} from './villain.service';
import {DialogService} from '../dialog.service';

@Component({
  template: `
    <div *ngIf="villain">
      <h3>"{{editName}}"</h3>
      <div>
        <label>Id: </label>
        {{villain.id}}
      </div>
      <div>
        <label>Name: </label>
        <input [(ngModel)]="editName" placeholder="name"/>
      </div>
      <button (click)="save()">Save</button>
      <button (click)="cancel()">Cancel</button>
    </div>
  `
})
export class VillainDetailComponent implements OnInit, CanDeactivate {
  villain: Villain;
  editName: string;

  constructor(
    private _villainService: VillainService,
    private _routeParams: RouteParams,
    private _router: Router,
    private _dialogService: DialogService
  ) {}

  ngOnInit() {
    let id = +this._routeParams.get('id');
    this._villainService.getVillain(id)
      .then(villain => {
        if (!villain) {
          this.goTo('VillainList', {});
          return false;
        }
        this.villain = villain;
        this.editName = this.villain.name;
      });
  }

  goTo(routeName, params) {
    this._router.navigate([routeName, params]);
  }

  cancel() {
    this.goTo('VillainList', { id: this.villain.id });
  }

  save() {
    this.villain.name = this.editName;
    this.goTo('VillainList', { id: this.villain.id });
  }

  routerCanDeactivate(next: ComponentInstruction, prev: ComponentInstruction): any {
    if (!this.villain || this.villain.name === this.editName) {
      return true;
    }

    return this._dialogService.confirm('Ignore changes?');
  }
}