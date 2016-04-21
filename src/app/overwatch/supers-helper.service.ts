import {Injectable} from 'angular2/core';
import * as Rx from "rxjs/Rx";

import {Crisis} from './crises/crisis';

export class SupersHelperService<T> {
  onSuperDetailInit(target, category: string) {
    let plural = this._pluralize(category);
    if (target.modelId = target._routeParams.get('id')) {
      target.action = `Edit ${this._capitalize(category)}`;
      eval(`target._${plural}Service.get${this._capitalize(category)}(target.modelId)`)
        .subscribe(
          (model: T) => {
            if (!model) {
              target._utils.goTo(target._router, [
                `${this._capitalize(plural)}List`
              ]);
              return false;
            }

            target.model = model;
          },
          error => console.error('Invalid ID!')
        );
    } else {
      target.action = `Add ${this._capitalize(category)}`;
    }
  }

  onSuperListInit(target, category: string) {
    let plural = this._pluralize(category);
    eval(`target._${plural}Service.get${this._capitalize(plural)}()`)
      .subscribe(
        (list: T[]) => {
          target.list = list;

          let id = target._routeParams.get('id');
          if (id) target.selectedId = id;
        },
        error => console.error(error)
      );
  }

  onSuperDetailSave(target, category: string) {
    let plural = this._pluralize(category), toEval;
    if (!target.modelId)
      toEval = `target._${plural}Service.add${this._capitalize(category)}(target.model)`;
    else
      toEval = `target._${plural}Service.update${this._capitalize(category)}(target.model)`;
    
    this._persist(target, eval(toEval), plural);
  }

  onSuperListDelete(target, category: string, id: string) {
    let plural = this._pluralize(category);
    eval(`target._${plural}Service.delete${this._capitalize(category)}(id)`)
      .subscribe(
        (model: T) => {
          let index = target._utils.getDeletedListIndex(model['_id'], target.list);
          target.list.splice(index, 1);
          console.log('deleted', model);
        },
        error => console.error(error)
      );
  }

  onSuperListInvolve(target, category: string, superId: string, crisisId: string)  {
    let plural = this._pluralize(category);
    eval(`target._${plural}Service.involveInCrisis(superId, crisisId)`)
      .subscribe(
        (crisis: Crisis) => target._utils.goTo(target._router.parent, [
          'CrisesCenter', 'EditCrisis', { crisisId: crisis['_id'] }
        ]),
        error => console.error(error)
      );
  }

  private _persist(target, observable: Rx.Observable<T>, collection: string) {
    observable.subscribe(
      (model: T) => {
        console.log('saved', model);
        target.edited = false;
        let routeName = `${this._capitalize(collection)}List`;
        target._utils.goTo(target._router, [
          routeName, { id: model['_id'] }
        ]);
      },
      error => console.error(error)
    );
  }

  private _capitalize(str: string) {
    return str.substr(0, 1).toUpperCase() + str.substr(1);
  }

  private _pluralize(category: string) {
    let plural;
    switch (category) {
      case 'villain':
        plural = 'villains';
        break;
      case 'hero':
        plural = 'heroes';
        break;
    }
    return plural;
  }
}