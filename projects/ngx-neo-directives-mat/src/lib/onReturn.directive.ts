import { Directive, ElementRef, HostListener, Input } from '@angular/core';
@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[onReturn]'
})
export class OnReturnDirective {
    private el: ElementRef;
    @Input() onReturn: any;
    @Input() setEnabled = true;

    constructor(private _el: ElementRef) {
        this.el = this._el;
    }

    @HostListener('keydown', ['$event']) onKeyDown(e) {
        if ((e.which === 13 || e.keyCode === 13)) {
            e.preventDefault();
            OnReturnDirective.setNextFocus(this.onReturn, this.setEnabled);
            return;
        }
    }

    // tslint:disable-next-line:member-ordering
    public static setNextFocus(onReturn: any, setEnabled = true): void {
        if (onReturn instanceof Array) {
            let termine = false;
            let i = 0;
            while (!termine && i < onReturn.length) {
                let element = onReturn[i];
                if (element) {
                    if (element instanceof HTMLInputElement ||
                        element instanceof HTMLButtonElement ||
                        element instanceof HTMLSelectElement ||
                        element instanceof HTMLSelectElement) {
                        if (!element.disabled) {
                            element.focus(); termine = true;
                        }
                    } else {
                        if (element && element.nativeElement instanceof HTMLInputElement ||
                            element.nativeElement instanceof HTMLButtonElement ||
                            element.nativeElement instanceof HTMLSelectElement) {
                            if (!element.nativeElement.disabled) {
                                element.nativeElement.focus(); termine = true;
                            }
                        } else {
                            let input = element['ctrInput'];
                            if (input) {
                                input = input['nativeElement'];
                                if (input && input instanceof HTMLInputElement) {
                                    if (!input.disabled) { input.focus(); termine = true; }
                                }
                            } else {
                                element = document.getElementById(element);
                                if (element) {
                                    if (element.disabled && setEnabled) {
                                        element.disabled = false;
                                    }
                                    if (!element.disabled) {
                                        element.focus();
                                        termine = true;
                                    }
                                }
                            }
                        }
                    }
                }
                i++;
            }
        } else if (onReturn) {
            let element = onReturn;
            if (element instanceof HTMLInputElement || element instanceof HTMLButtonElement || element instanceof HTMLSelectElement) {
                if (element.disabled) {
                    element.disabled = false;
                }
                element.focus();
            } else {
                let input = element['ctrInput'];
                if (input) {
                    input = input['nativeElement'];
                    if (input && input instanceof HTMLInputElement) {
                        if (input.disabled) {
                            input.disabled = false;
                        }
                        input.focus();
                    }
                } else {
                    element = document.getElementById(onReturn);
                    if (element) {
                        if (element.disabled && setEnabled) {
                            element.disabled = false;
                        }
                        element.focus();
                    }
                }
            }
        }
    }
}
