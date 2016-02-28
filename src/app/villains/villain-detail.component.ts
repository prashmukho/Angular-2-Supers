import {Component} from 'angular2/core';
import {Villain} from './villain';

@Component({
  selector: 'villain-detail',
  template: `
    <div>
      <h3>{{ villain.id }}: {{villain.name }}</h3>
      Nefarious Power: <i>{{ villain.power }}</i>
    </div>
  `,
  inputs: ['villain']
})
export class VillainDetailComponent {
  villain: Villain;
}