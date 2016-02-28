import {Component} from 'angular2/core';
import {VillainListComponent} from './villain-list.component'
import {VillainService} from './villain.service';

@Component ({
  selector: 'villains',
  template: `
    <h2>Here there be baddies:</h2>
    <villain-list></villain-list>
  `,
  directives: [VillainListComponent],
  providers: [VillainService]
})
export class VillainsComponent {}