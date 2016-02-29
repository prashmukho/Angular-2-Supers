import {Injectable} from 'angular2/core'

@Injectable()
export class DialogService {
  confirm(message?: string) {
    return new Promise<boolean>(resolve => resolve(window.confirm(message || 'Are you sure?')));
  }
}