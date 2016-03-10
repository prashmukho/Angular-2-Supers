import {Component, OnInit, Inject} from 'angular2/core';
import {RouteParams, Router} from 'angular2/router';

import {LoginConfig} from '../app.component';
import {Villain} from './villain';
import {VillainService} from './villain.service';

@Component({
  template: require('./templates/villain-list-component.html'),
  styles: [`
    .selected {
      color: blue;
    }
  `]
})
export class VillainListComponent implements OnInit {
  villains: Villain[];
  selectedId: string;

  constructor(
    private _villainService: VillainService,
    private _routeParams: RouteParams,
    private _router: Router,
    @Inject('login.config') public config: LoginConfig
  ) {}

  toggle() {
    this.config.active = !this.config.active;
  }

  ngOnInit() {
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

  private _goTo(routeName, params) {
    this._router.navigate([routeName, params]);
  }
}
