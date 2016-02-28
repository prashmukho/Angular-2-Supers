import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from 'angular2/router';
import {VillainsComponent} from './villains/villains.component';

@Component({
  selector: 'my-app',
  template: `
    <h1>{{ title }}</h1>
    <nav>
      <a [routerLink]="['VillainsCenter']">Villains Center</a>
    </nav>
    <router-outlet></router-outlet>
  `,
  directives: [ROUTER_DIRECTIVES],
  providers: [ROUTER_PROVIDERS]
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
