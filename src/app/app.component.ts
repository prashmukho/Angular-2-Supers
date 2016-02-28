import {Component} from 'angular2/core';
import {VillainsComponent} from './villains.component';

@Component({
  selector: 'my-app',
  template: `
    <h1>Seeds of Destruction</h1>
    <villains></villains>
  `,
  directives: [VillainsComponent]
})
export class AppComponent { }
