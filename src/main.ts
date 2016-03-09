import {provide, enableProdMode} from 'angular2/core';
import {bootstrap, ELEMENT_PROBE_PROVIDERS} from 'angular2/platform/browser';

let ENV_PROVIDERS = [];

if ('production' === process.env.ENV) {
  enableProdMode();
} else {
  ENV_PROVIDERS.push(ELEMENT_PROBE_PROVIDERS);
}

// top level component (routing component)
import {AppComponent} from './app/app.component';
document.addEventListener('DOMContentLoaded', function main() {
  bootstrap(AppComponent, [ENV_PROVIDERS])
    .catch(err => console.error(err));
});

// typescript lint error 'Cannot find name "module"' fix
declare let module: any;

// activate hot module reload
if (module.hot) {
  // bootstrap again when change detected as DOM content has loaded
  bootstrap(AppComponent, [ENV_PROVIDERS])
    .catch(err => console.error(err));

  module.hot.accept();
}

// For vendors for example jQuery, Lodash, angular2-jwt just import them 
// anywhere in your app. Also see custom_typings.d.ts as you also need to 
// do `typings install x` where `x` is your module
