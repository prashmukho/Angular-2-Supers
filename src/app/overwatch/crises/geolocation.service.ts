import {Injectable} from 'angular2/core';
import {Http, Response} from 'angular2/http';
import * as Rx from "rxjs/Rx";

export interface AddressDatum {
  results: any[];
  status: string;
}

@Injectable()
export class GeolocationService {
  constructor(private _http: Http) {}

  geolocate(): Promise<number[]> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          resolve([pos.coords.longitude, pos.coords.latitude]);
        }, (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              reject("User denied the request for Geolocation.");
              break;
            case error.POSITION_UNAVAILABLE:
              reject("Location information is unavailable.");
              break;
            case error.TIMEOUT:
              reject("The request to get user location timed out.");
              break;
            default:
              reject("An unknown error occurred.");
          }
        });
      } else reject("Geolocation is not supported by this browser.");
    });
  }

  getAddress(lat: number, lng: number): Rx.Observable<AddressDatum> {
    return this._http.get(`/api/v1/getAddress?lat=${lat}&lng=${lng}`)
      .map(res => res.json().data)
      .catch(this._handleError);
  }

  getLatLng(address: string): Rx.Observable<AddressDatum> {
    return this._http.get(`/api/v1/getLatLng?address=${address}`)
      .map(res => res.json().data)
      .catch(this._handleError);
  }

  private _handleError(error: Response) {
    return Rx.Observable.throw(error || 'Server error');
  }
}