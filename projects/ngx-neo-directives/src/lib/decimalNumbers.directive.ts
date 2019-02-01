import { Directive, HostListener, Input, OnInit } from '@angular/core';
import { NgModel } from '@angular/forms';
@Directive({
    selector: '[ngModel][neoDecimalsDirective]',
    providers: [NgModel]
})
export class NeoDecimalNumbersDirective implements OnInit {

    // tslint:disable-next-line:no-input-rename
    @Input('neoDecimalsDirective') decimals = 2;
    private prev: any;
    private regex: RegExp;

    constructor(private ngModel: NgModel) {
    }

    ngOnInit() {
        this.regex = new RegExp('^[0-9]+(\\.[0-9]{0,' + this.decimals + '})?$');
    }

    @HostListener('paste', ['$event']) blockPaste(e: ClipboardEvent) {
        e.stopPropagation();
        e.preventDefault();
        const clipboardData = e.clipboardData || window['clipboardData'];
        const pastedData: string = clipboardData.getData('Text');
        const onlyNumbers = Array.from(pastedData).map(x => this.isNumber(x)).reduce((prev, el) => prev && el, true);
        const a = this.regex.test(pastedData);
        if (onlyNumbers && a) {
            this.ngModel.control.setValue(pastedData);
        }
    }

    @HostListener('keyup', ['$event']) onKeyUp(event: KeyboardEvent) {
        let current: string = this.ngModel.value;

        if (this.isSpecial(event)) { return; }

        if (!this.isNumber(event.key)) { event.preventDefault(); return; }

        if (current) {
            current = current.toString();
            const dotIndex = current.indexOf('.');
            if ((dotIndex >= 0) && ((current.length - 1) - dotIndex > this.decimals)) {
                this.ngModel.control.setValue(current.slice(0, dotIndex + this.decimals + 1));
            }
        } else {
            this.ngModel.control.setValue(this.prev);
        }

    }

    @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {

        if (this.isSpecial(event)) { return; }

        if (!this.isNumber(event.key)) { event.preventDefault(); return; }

        if (event.key === '.') {
            if (this.ngModel.value.toString().indexOf('.') !== -1) {
                event.preventDefault();
                event.stopPropagation();
            }
        }
        this.prev = this.ngModel.value;
    }

    private isSpecial(e: KeyboardEvent): boolean {
        return e.key === 'Delete' || e.key === 'Tab' || e.key === 'Backspace' || e.key === 'ArrowLeft' ||
            e.altKey || e.ctrlKey || e.key === 'Home' || e.key === 'End' || e.key === 'PageDown' || e.key === 'PageUp' ||
            e.key === 'ArrowRight' || e.key === 'Control' || e.key === 'Alt' || e.key === 'Shift';
    }

    private isNumber(e: string): boolean {
        return (e >= '0' && e <= '9' || e === '.');
    }

}
