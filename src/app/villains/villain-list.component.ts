import {Component, OnInit} from 'angular2/core';
import {Villain} from './villain';
import {VillainDetailComponent} from './villain-detail.component';
import {VillainService} from './villain.service';

@Component({
  selector: 'villain-list',
  template: `
    <div>
      <ul class='villain-list'>
        <li *ngFor="#villain of villains" 
          (click)="_selectVillain(villain)"
          class="villain-list-item" [class.selected]="_isSelected(villain)">
          {{ villain.name }}
        </li>
      </ul>
      <div *ngIf="_selectedVillain">
        <villain-detail [villain]="_selectedVillain"></villain-detail>
        <button type="button" (click)="_clearSelection()">Clear</button>
      </div>
    </div>
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
  `],
  directives: [VillainDetailComponent]
})
export class VillainListComponent implements OnInit {
  villains: Villain[];

  constructor(private _villainService: VillainService) {}

  ngOnInit() {
    this._villainService.getVillains()
      .then(villains => this.villains = villains);
  }

  private _selectedVillain: Villain;

  private _selectVillain(villain: Villain) {
    this._selectedVillain = villain;
  }

  private _isSelected(villain: Villain) {
      return this._selectedVillain && 
             this._selectedVillain.id === villain.id;
  }

  private _clearSelection() {
    this._selectedVillain = null;
  }
}