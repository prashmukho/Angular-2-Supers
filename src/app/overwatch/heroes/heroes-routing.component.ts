import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES, Router} from 'angular2/router';

import {HeroesListComponent} from './heroes-list.component';
// import {NewHeroComponent} from './new-hero.component';
// import {ViewHeroComponent} from './view-hero.component';
// import {HeroesService} from './heroes.service';
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
  // {
  //   path: '/new',
  //   name: 'NewHero',
  //   component: NewHeroComponent,
  // },
  // {
  //   path: '/:id',
  //   name: 'ViewHero',
  //   component: ViewHeroComponent,
  // }
])
export class HeroesRoutingComponent {
  constructor(private _activeLink: ActiveLinkService) {}

  ngOnInit() {
    this._activeLink.switchLink('HeroesCenter');
  }
}
