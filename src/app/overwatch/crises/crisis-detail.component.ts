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
export class CrisisDetailComponent implements OnInit, CanDeactivate { 
  villainId: string;
  crisisId: string;
  crisis: Crisis = {
    _id: undefined,
    title: undefined,
    begin: undefined,
    epicenter: undefined // [lng, lat]
  };
  
  action: string;
  edited: boolean = false;
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
    if (this.villainId = this._routeParams.get('villainId')) {
      this.action = 'Add Crisis';
      this.crisis.begin = this._utils.dateString(new Date());
      this._geolocationService
        .geolocate()
        .then(
          (epicenter: number[]) => this.crisis.epicenter = epicenter,
          (message: string) => {
            console.warn(message, "\n", "Defaults will be set...");
            return this.crisis.epicenter = [77.1662735, 28.561450999999998];
          }
        ).then((epicenter: number[]) => this._setLocation(epicenter));
    } else if (this.crisisId = this._routeParams.get('crisisId')) {
      this.action = 'Edit Crisis';
      this._crisesService
        .getCrisis(this.crisisId)
        .subscribe(
          (crisis: Crisis) => {
            if (!crisis) {
              this._utils.goTo(this._router, ['CrisesList']);
              return false;
            }

            this.crisis = crisis;
            this.crisis.begin = crisis.begin.match(/^(\d{4}-\d{2}-\d{2})/)[1];
            this._setLocation(this.crisis.epicenter);
          },
          error => console.error('Invalid ID!')
        );
    }

    window.addEventListener('message', (e) => { 
      if (e.data.type === 'newepicenter')
        this.newEpicenter = e.data.epicenter;
    }, false);
  }

  routerCanDeactivate(next: ComponentInstruction, prev: ComponentInstruction): any {
    if (!this.edited) return true;
    return this._dialogService.confirm('Ignore changes?');
  }

  cancel(edited: boolean) {
    this.edited = edited || !!this.newEpicenter;

    let routePath = ( this.crisis['_id'] ? 
                      ['CrisesList', { id: this.crisis['_id'] }] : 
                      ['CrisesList'] );
    this._utils.goTo(this._router, routePath);
  }

  save() {
    if (this.newEpicenter) this.crisis.epicenter = this.newEpicenter;
    
    if (!this.crisisId)
      this._persistCrisis(this._crisesService.addCrisis(this.crisis, this.villainId));
    else
      this._persistCrisis(this._crisesService.updateCrisis(this.crisis));
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

  private _setLocation(epicenter) {
    require('./geolocation.js')(epicenter[1], epicenter[0], [this.crisis]);
    this._geolocationService
      .getAddress(epicenter[1], epicenter[0])
      .subscribe(
        (data: AddressDatum) => this.location = ( data.results.length ? 
                                                  data.results[0].formatted_address : 
                                                  'Please enter...' ),
        (error) => console.error(error)
      );
  }

  private _persistCrisis(observable: Rx.Observable<Crisis>, type?: string) {
    observable.subscribe(
      (crisis: Crisis) => {
        console.log('saved', crisis);
        this.edited = false;
        this._utils.goTo(this._router, ['CrisesList', { id: crisis['_id'] }]);
      },
      error => console.error(error)
    );
  }
}