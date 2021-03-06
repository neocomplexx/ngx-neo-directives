import { Directive, ElementRef, Input } from '@angular/core';
import { OnInit, AfterViewInit } from '@angular/core';
import { Subscription, timer } from 'rxjs';

@Directive({
  selector: '[neoAutofocus]'
})
export class NeoAutofocusDirective implements OnInit, AfterViewInit {

  @Input('neoAutofocus') neoAutofocus: boolean;

  private subscription: Subscription;

  constructor(private el: ElementRef) {
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.subscription = timer(100).subscribe(() => {
      if (this.neoAutofocus) {
        this.setFocus();
      }
      this.subscription.unsubscribe();
    });
  }

  private setFocus() {
    if (this.el) {
      if (this.el instanceof HTMLInputElement ||
        this.el instanceof HTMLButtonElement ||
        this.el instanceof HTMLSelectElement ||
        this.el instanceof HTMLSelectElement) {
        if (!this.el.disabled) {
          this.el.focus();
        }
      } else {
        if (this.el && this.el.nativeElement instanceof HTMLInputElement ||
          this.el.nativeElement instanceof HTMLButtonElement ||
          this.el.nativeElement instanceof HTMLSelectElement) {
          if (!this.el.nativeElement.disabled) {
            this.el.nativeElement.focus();
          }
        } else {
          let input = this.el['ctrInput'];
          if (input) {
            input = input['nativeElement'];
            if (input && input instanceof HTMLInputElement) {
              if (!input.disabled) { input.focus(); }
            }
          }
        }
      }
    }
  }

}
