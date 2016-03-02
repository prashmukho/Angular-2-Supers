import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from 'angular2/router';
import {VillainsComponent} from './villains/villains.component';
import {DialogService} from './dialog.service';

@Component({
  selector: 'my-app',
  template: require('./app-component.html'),
  // styles: [require(./app-component.scss)],
  directives: [ROUTER_DIRECTIVES],
  providers: [ROUTER_PROVIDERS, DialogService]
})
@RouteConfig([
  { 
    path: '/villains/...', 
    name: 'VillainsCenter', 
    component: VillainsComponent,
    useAsDefault: true
  }
])
export class AppComponent { 
  title = 'Seeds of Destruction';
}
