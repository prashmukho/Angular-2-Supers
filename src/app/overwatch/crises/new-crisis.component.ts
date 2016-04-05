import {Component, OnInit} from 'angular2/core';
import {NgForm} from 'angular2/common';
import {RouteParams, Router, CanDeactivate, ComponentInstruction} from 'angular2/router';
import * as Rx from "rxjs/Rx";

import {Crisis} from './crisis';
import {CrisesService} from './crises.service';
import {DialogService} from '../../dialog.service';
import {UtilsService} from '../../utils.service';
import {GeolocationService, AddressDatum} from './geolocation.service';
import {GeocodeDirective} from './geocode.directive';

@Component({
  template: require('./templates/crisis-detail.html'),
  directives: [GeocodeDirective]
})
export class NewCrisisComponent implements OnInit { 
  crisis = { 
    title: '', 
    begin: null,
    epicenter: null // [lng, lat]
  };
  edited: boolean = false;
  action: string = 'Add Crisis';
  villainId: string;
  location: string;
  newEpicenter: number[] = null; // [lng, lat]

  constructor(
    private _crisesService: CrisesService,
    private _dialogService: DialogService,
    private _geolocationService: GeolocationService,
    private _utils: UtilsService,
    private _routeParams: RouteParams,
    private _router: Router
  ) {}

  ngOnInit() {
    this.villainId = this._routeParams.get('id');
    this.crisis.begin = this._utils.dateString(new Date());
    this._geolocationService.geolocate()
      .then(
        (epicenter: number[]) => this.crisis.epicenter = epicenter,
        (message: string) => {
          console.warn(message, "\n", "Defaults will be set...");
          return this.crisis.epicenter = [77.1662735, 28.561450999999998];
        }
      ).then((epicenter) => {
        require('./geolocation.js')(epicenter[1], epicenter[0], [this.crisis]);
        this._geolocationService.getAddress(epicenter[1], epicenter[0])
          .subscribe(
            (data: AddressDatum) => {
              this.location = ( data.results.length ? 
                                data.results[0].formatted_address : 
                                'Please enter...' );
            },
            (error) => console.error(error)
          );
      });
  }

  routerCanDeactivate(next: ComponentInstruction, prev: ComponentInstruction): any {
    if (!this.edited) return true;
    return this._dialogService.confirm('Ignore changes?');
  }

  cancel(edited: boolean) {
    this.edited = edited;
    this._utils.goTo(this._router, ['CrisesList']);
  }

  save() {
    if (this.newEpicenter) this.crisis.epicenter = this.newEpicenter;
    this._crisesService.addCrisis(this.crisis, this.villainId)
      .subscribe(
        (crisis: Crisis) => {
          console.log('saved', crisis);
          this.edited = false;
          this._utils.goTo(this._router, ['CrisesList', { id: crisis['_id'] }]);
        },
        error => console.error(error)
      );
  }

  hasCommenced() { 
    return false; 
  }

  updateEpicenter($event) {
    this.newEpicenter = $event;
    window.postMessage({
      type: 'geocoderequest',
      coords: { lat: $event[1], lng: $event[0] }
    }, window.location.href);
  }
  
  private _searchTermStream = new Rx.Subject<string>();
  search(term: string) {
    this._searchTermStream.next(term);
  }
}