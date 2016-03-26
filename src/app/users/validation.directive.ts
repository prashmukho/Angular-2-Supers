import {Directive, ElementRef, Input} from 'angular2/core';

interface ValidatorRule {
  regExp: RegExp,
  message: string,
}
export interface Validator {
  rules: ValidatorRule[]
}

@Directive({
  selector: '[validate]',
  host: { '(input)': 'onInput()' }
})
export class ValidationDirective {
  @Input('validate') validator: Validator;

  constructor(private _el: ElementRef) {}

  onInput() {
    let element = this._el.nativeElement,
        value = element.value, 
        innerHtml = '';
    let errors = $(element).next('.errors');
    $(element).removeClass('has-errors');
    errors.removeClass('panel-danger').removeClass('panel');
    
    let list = errors.find('ul');
    list.html('');

    let result = this.validator.rules
      .filter(rule => !rule.regExp.test(value));
    if (result.length) {
      $(element).addClass('has-errors');
      errors.addClass('panel').addClass('panel-danger');
      result
        .map(rule => rule.message)
        .forEach(message => innerHtml += `
          <li>
            <span class="glyphicon glyphicon-exclamation-sign text-danger" aria-hidden="true"></span>
            <span class="sr-only">Error:</span>
            ${message}
          </li>
        `);
      list.html(innerHtml);
    }
  }
}
