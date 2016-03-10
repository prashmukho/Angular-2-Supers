import {Injectable} from 'angular2/core';

@Injectable()
export class ActiveLinkService {
  switchLink(to) {
    $('nav li.active').removeClass('active');
    $('nav li#' + to + 'Link').addClass('active');
  }
}