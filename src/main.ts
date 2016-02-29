/*
 * Providers provided by Angular
 */
import {provide, enableProdMode} from 'angular2/core';
import {bootstrap, ELEMENT_PROBE_PROVIDERS} from 'angular2/platform/browser';
import {HTTP_PROVIDERS} from 'angular2/http';

const ENV_PROVIDERS = [];

if ('production' === process.env.ENV) {
  enableProdMode();
} else {
  ENV_PROVIDERS.push(ELEMENT_PROBE_PROVIDERS);
}

/*
 * App Component
 * our top level component that holds all of our components
 */
import {AppComponent} from './app/app.component';

/*
 * Bootstrap our Angular app with a top level component `AppComponent` and
 * inject our Services and Providers into Angular's dependency injection
 */
document.addEventListener('DOMContentLoaded', function main() {
  bootstrap(AppComponent, [
    ENV_PROVIDERS
  ])
  .catch(err => console.error(err));
});


/*
 * Modified for using hot module reload
 */

// typescript lint error 'Cannot find name "module"' fix
declare let module: any;

// activate hot module reload
if (module.hot) {
// bootstrap must not be called after DOMContentLoaded,
// otherwise it cannot be rerenderd after module replacement
//
// for testing, comment the bootstrap function,
// open the dev tools and you'll see the reloader is replacing the 
// module but cannot rerender it
  bootstrap(AppComponent, [
    ENV_PROVIDERS
  ])
  .catch(err => console.error(err));

  module.hot.accept();
}

// For vendors for example jQuery, Lodash, angular2-jwt just import them 
// anywhere in your app. Also see custom_typings.d.ts as you also need to 
// do `typings install x` where `x` is your module