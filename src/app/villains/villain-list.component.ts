import {Component, OnInit} from 'angular2/core';
import {RouteParams, Router} from 'angular2/router';
import {Villain} from './villain';
import {VillainService} from './villain.service';

@Component({
  template: `
    <h2>Here, there be baddies:</h2>
    <ul class='villain-list'>
      <li *ngFor="#villain of villains" 
        (click)="viewVillainDetails(villain.id)"
        class="villain-list-item" [class.selected]="isSelected(villain.id)">
        {{ villain.name }}
      </li>
    </ul>
  `,
  styles: [`
    .villain-list { 
      margin: 0 0 2em 0;
      list-style-type: none;
      padding: 0;
      width: 8em; 
    }
    .villain-list-item {
      cursor: pointer;
      position: relative;
      left: 0;
      background-color: #EEE;
      margin: .5em;
      padding: .3em .5em;
      height: 1.6em;
      line-height: 1.6em;
      border-radius: 4px;
    }
    .villain-list-item.selected {
      color: blue;
    }
  `]
})
export class VillainListComponent implements OnInit {
  villains: Villain[];
  selectedId: number; // currently unused

  constructor(
    private _villainService: VillainService,
    private _routeParams: RouteParams,
    private _router: Router
  ) {}

  ngOnInit() {
    let id = +this._routeParams.get('id');
    if (id)
      this._villainService.getVillain(id)
        .then(villain => this.selectedId = villain.id);
    this._villainService.getVillains()
      .then(villains => this.villains = villains);
  }

  viewVillainDetails(id: number): void {
    let link = ['VillainDetail', { id: id }];
    this._router.navigate(link);
  }

  isSelected(id: number): boolean { 
    return this.selectedId === id; // for now
  }
}
