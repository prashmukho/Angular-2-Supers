import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES, Router} from 'angular2/router';

import {HeroesListComponent} from './heroes-list.component';
import {NewHeroComponent} from './new-hero.component';
import {EditHeroComponent} from './edit-hero.component';
import {ActiveLinkService} from '../../active-link.service';

@Component({
  template: `
    <router-outlet></router-outlet>
  `,
  directives: [ROUTER_DIRECTIVES]
})
@RouteConfig([
  {
    path: '/',
    name: 'HeroesList',
    component: HeroesListComponent,
    useAsDefault: true
  },
  {
    path: '/new',
    name: 'NewHero',
    component: NewHeroComponent,
  },
  {
    path: '/:id',
    name: 'EditHero',
    component: EditHeroComponent,
  }
])
export class HeroesRoutingComponent {
  constructor(private _activeLink: ActiveLinkService) {}

  ngOnInit() {
    this._activeLink.switchLink('HeroesCenter');
  }
}
