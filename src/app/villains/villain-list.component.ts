import {Component, OnInit} from 'angular2/core';
import {RouteParams, Router} from 'angular2/router';
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
  selectedId: number;

  constructor(
    private _villainService: VillainService,
    private _routeParams: RouteParams,
    private _router: Router
  ) {}

  ngOnInit() {
    this._villainService.getVillains()
      .then(villains => {
        this.villains = villains
        // only present when redirected from villain-detail-component for bad 'id'
        let id = +this._routeParams.get('id');
        if (id) this.selectedId = this.villains.filter(v => v.id === id)[0].id;
        // only present when coming from new-villain-detail-component upon 'save'
        let newVillain: any = this._routeParams.get('newVillain');
        if (newVillain) {
          newVillain = JSON.parse(decodeURIComponent(newVillain));
          this.villains.push(newVillain);
          this.selectedId = newVillain.id;
        }
      });
  }

  isSelected(id: number): boolean { 
    return this.selectedId === id;
  }
  
  viewVillain(id: number): void {
    this._goTo('VillainDetail', { id: id });
  }

  newVillain() {
    this._goTo('NewVillainDetail', { nextId: this.villains.length + 1 });
  }

  private _goTo(routeName, params) {
    this._router.navigate([routeName, params]);
  }
}
