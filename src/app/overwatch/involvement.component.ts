import {Component, Input, Output, EventEmitter} from 'angular2/core';

import {VillainsService} from './villains/villains.service';
import {HeroesService} from './heroes/heroes.service';
import {Crisis} from './crises/crisis';

interface EngageEvent {
  heroId: string;
  crisisId: string;
}

@Component({
  selector: 'involvement',
  template: require('./templates/partials/_involvement.html')
})
export class InvolvementComponent {
  @Input() model: any;
  @Input() category: string;
  @Output() involveRequest: EventEmitter<any> = new EventEmitter();

  uninvolvedCrises: Crisis[] = [];
  uninvolvedText = 'Loading...';
  
  constructor(
    private _villainsService: VillainsService,
    private _heroesService: HeroesService
  ) {}

  getUninvolvedCrises(superId: string, event: MouseEvent) {
    this.uninvolvedCrises = [];
    this.uninvolvedText = 'Loading...';
    let $spinner = $(event.target).next().children('.spinner');
    $spinner.show();
    let useService;
    if (this.category === 'villain')
      useService = this._villainsService;
    else if (this.category === 'hero')
      useService = this._heroesService;
    useService.getUninvolvedCrises(superId)
      .subscribe(
        (crises: Crisis[]) => {
          window.setTimeout(() => {
            this.uninvolvedCrises = crises;
            this.uninvolvedText = 'Occupied';
            $spinner.hide();
          }, 1000);
        },
        error => console.error(error)
      );
  }

  involve(superId: string, crisisId: string) { 
    this.involveRequest.emit({ superId: superId, crisisId: crisisId });
  }
}