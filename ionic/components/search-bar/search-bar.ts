import {ElementRef, Pipe, NgControl, Renderer, View, FORM_DIRECTIVES, NgIf, NgClass} from 'angular2/angular2';

import {Ion} from '../ion';
import {IonicConfig} from '../../config/config';
import {ConfigComponent} from '../../config/decorators';

/**
 * @name Search Bar
 * @description
 * The Search Bar service adds an input field which can be used to search or filter items.
 *
 * @usage
 * ```html
 * <ion-search-bar ng-control="searchQuery"></ion-search-bar>
 * ```
 */
@ConfigComponent({
  selector: 'ion-search-bar',
  inputs: [
    'list',
    'query'
  ],
  defaultInputs: {
    'showCancel': false,
    'cancelText': 'Cancel',
    'placeholder': 'Search',
    'cancelAction': function() {
      // TODO user will override this if they pass a function
      // need to allow user to call these
      console.log('Default Cancel');
      this.isFocused = false;
      this.shouldLeftAlign = this.value.trim() != '';
      this.element = this.elementRef.nativeElement.querySelector('input');
      this.element.blur();
    }
  }
})
@View({
  template: `
  <div class="search-bar-input-container" [class.left-align]="shouldLeftAlign">
    <div class="search-bar-search-icon"></div>
    <input (focus)="inputFocused()" (blur)="inputBlurred()"
    (input)="inputChanged($event)" class="search-bar-input" type="search" [attr.placeholder]="placeholder" [(ng-model)]="value">
    <div class="search-bar-close-icon" (click)="clearInput()"></div>
  </div>
  <button *ng-if="showCancel" (click)="cancelAction()" class="search-bar-cancel" [class.left-align]="shouldLeftAlign">{{cancelText}}</button>`,
  directives: [FORM_DIRECTIVES, NgIf, NgClass]
})

export class SearchBar extends Ion {
  /**
   * TODO
   * @param {ElementRef} elementRef  TODO
   * @param {IonicConfig} config  TODO
   */
  constructor(
    elementRef: ElementRef,
    config: IonicConfig,
    ngControl: NgControl,
    renderer: Renderer
  ) {
    super(elementRef, config);
    this.renderer = renderer;
    this.elementRef = elementRef;
    if(!ngControl) {
      // They don't want to do anything that works, so we won't do anything that breaks
      return;
    }

    this.ngControl = ngControl;

    ngControl.valueAccessor = this;

    this.query = '';
  }

  // Add the margin for iOS
  afterViewInit() {
    this.cancelButton = this.elementRef.nativeElement.querySelector('.search-bar-cancel');

    if (this.cancelButton) {
      this.cancelWidth = this.cancelButton.offsetWidth;
      this.cancelButton.style.marginRight = "-" + this.cancelWidth + "px";
    }
  }

  /**
   * Much like ngModel, this is called from our valueAccessor for the attached
   * ControlDirective to update the value internally.
   */
  writeValue(value) {
    this.value = value;
    this.renderer.setElementProperty(this.elementRef, 'value', this.value);

  }

  registerOnChange(val) {
  }

  registerOnTouched(val) {
  }

  inputChanged(event) {
    this.value = event.target.value;
    this.ngControl.valueAccessor.writeValue(this.value);
    this.ngControl.control.updateValue(this.value);
  }

  inputFocused() {
    this.isFocused = true;
    this.shouldLeftAlign = true;

    if (this.cancelButton) {
      this.cancelButton.style.marginRight = "0px";
    }
  }
  inputBlurred() {
    this.isFocused = false;
    this.shouldLeftAlign = this.value.trim() != '';

    if (this.cancelButton) {
      this.cancelButton.style.marginRight = "-" + this.cancelWidth + "px";
    }
  }

  clearInput() {
    this.value = '';
    this.ngControl.control.updateValue('');
  }
}

/*
export class SearchPipe extends Pipe {
  constructor() {
    super();
    this.state = 0;
  }

  supports(newValue) {
    return true;
  }

  transform(value, ...args) {
    return value;
    //return `${value} state:${this.state ++}`;
  }

  create(cdRef) {
    return new SearchPipe(cdRef);
  }
}
*/
