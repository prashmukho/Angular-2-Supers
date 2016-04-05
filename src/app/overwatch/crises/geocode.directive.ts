import {Directive, ElementRef, OnInit, Input, Output, EventEmitter} from 'angular2/core';
import * as Rx from "rxjs/Rx";

import {GeolocationService, AddressDatum} from './geolocation.service';

@Directive({
  selector: '[geocode]',
  host: { 
    '(keyup)': 'onKeyup()'
  }
})
export class GeocodeDirective implements OnInit {
  @Input('geocode') crisisId: string;
  @Output() geocodeRequest: EventEmitter<number[]> = new EventEmitter();

  constructor(
    private _geolocationService: GeolocationService,
    private _el: ElementRef
  ) {}

  ngOnInit() { 
    this._searchTermStream
      .debounceTime(300)
      .distinctUntilChanged()
      .switchMap((term: string) => this._geolocationService.getLatLng(term))
      .subscribe(
        (data: AddressDatum) => {
          if (data.results.length) {
            let location = data.results[0].geometry.location;
            this.geocodeRequest.emit([location.lng, location.lat]);
          }
        },
        (error) => console.error(error)
      );
  }

  private _searchTermStream = new Rx.Subject<string>();
  onKeyup() {
    this._searchTermStream.next(this._el.nativeElement.value);
  }
}