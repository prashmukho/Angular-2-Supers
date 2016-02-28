import {Component, OnInit} from 'angular2/core';
import {Villain} from './villain'
import {VillainService} from './villain.service';

@Component({
  selector: 'villain-list',
  template: `
    <ul>
      <li *ngFor="#villain of villains">
        <b>{{ villain.name }}</b><br>
        <i>{{ villain.power }}</i>
      </li>
    </ul>
  `
})
export class VillainListComponent implements OnInit {
  villains: Villain[];

  constructor(private _villainService: VillainService) {}

  ngOnInit() {
    this._villainService.getVillains()
      .then(villains => this.villains = villains);
  }
}