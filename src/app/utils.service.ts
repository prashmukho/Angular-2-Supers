import {Injectable} from 'angular2/core';

export class UtilsService {
  goTo(router, routeArray) {
    router.navigate(routeArray);
  }

  getDeletedListIndex(id: string, list: any[]) {
    return list.map((villain) => villain['_id']).indexOf(id);
  }

  dateString(date: Date) {
    let MM = String(date.getMonth() + 1);
    MM = MM.length === 1 ? '0' + MM : MM;

    let dd = String(date.getDate());
    dd = dd.length === 1 ? '0' + dd : dd;

    return `${date.getFullYear()}-${MM}-${dd}`;
  }
}