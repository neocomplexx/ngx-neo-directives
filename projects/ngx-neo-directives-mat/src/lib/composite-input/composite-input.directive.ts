import { Directive, HostListener, ElementRef, Input } from '@angular/core';
import { isCommandKey } from './commandKey.function';

@Directive({
  selector: '[compositeInput]'
})
export class NeoCompositeInputDirective {

  // Next input to move from the current input
  @Input() previousInput: any = null;
  // Previous input to move from the current input
  @Input() nextInput: any = null;

  constructor(private el: ElementRef) {
  }

  @HostListener('keydown', ['$event']) onKeyDown(e: KeyboardEvent) {
    // If the element is selected and the user presses backspace we must clear the input
    if (e.key === 'Backspace' && this.elementIsSelected()) {
      return true;
    }

    // We must move to the previous input if the user presses backspace and he is in the first position of the input
    // or if he presses the left key
    if (((e.key === 'Backspace') && (this.el.nativeElement.selectionStart === 0) || ((e.key === 'ArrowLeft') || (e.key === 'Left')))) {
      if ((this.previousInput) && (this.previousInput instanceof HTMLInputElement) && (!this.previousInput.disabled)) {
        this.previousInput.focus();
        return false;
      }
    }
    // If he presses the right arrow it must move to the next input
    if (e.key === 'ArrowRight' || e.key === 'Right') {
      if ((this.nextInput) && (this.nextInput instanceof HTMLInputElement) && (!this.nextInput.disabled)) {
        this.nextInput.focus();
        return false;
      }
    }
  }

  /**
   *
   * Method called on keyup to check if the pressed key is allow, if it is not it stops the event.
   * If the element reached its maximum length on key pressed it must jump to the next input
   * @param e
   */
  @HostListener('keyup', ['$event']) onKeyUp(e: KeyboardEvent) {
    if (isCommandKey(e)) { return; }
    const value: string = this.el.nativeElement.value;
    if (this.nextInput && (value.length >= this.el.nativeElement.maxLength)) {
      this.nextInput.focus();
    }
  }

  /**
   * On focus we select the entire value of the input
   */
  @HostListener('focus', []) onFocus() {
    this.el.nativeElement.select();
  }

  /**
   * Method to check if the element is selected
   *
   */
  private elementIsSelected(): boolean {
    return this.el.nativeElement.selectionStart === 0 && this.el.nativeElement.selectionEnd !== 0;
  }

}
