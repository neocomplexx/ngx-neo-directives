import { Directive, ElementRef, HostListener, Input, Renderer2, OnInit } from '@angular/core';
import { NgModel } from '@angular/forms';

@Directive({
    selector: '[isNumber]'
})
export class NeoNumbersDirective implements OnInit {
    @Input() isNumber: any;
    @Input('allowNullValue') allowNullValue = false;
    private prev: any;
    private regex: RegExp;

    constructor(private el: ElementRef, private renderer: Renderer2, private model: NgModel) {
    }

    ngOnInit() {
        if (<any>this.allowNullValue === "") this.allowNullValue = true;
        this.regex = new RegExp('^\\d+$');
        this.el.nativeElement.type = "number"
    }

    @HostListener('paste', ['$event']) blockPaste(e: ClipboardEvent) {
        const clipboardData: DataTransfer = e.clipboardData || window['clipboardData'];
        let pastedData: string = clipboardData.getData('text/plain').split(",").join(".");

        let posPoint = pastedData.lastIndexOf('.');
        if (posPoint > -1) {
            pastedData = pastedData.substring(0, posPoint).split(".").join("");
        }

        const onlyNumbers = Array.from(pastedData).map(x => this.isOnlyNumber(x)).reduce((prev, el) => prev && el, true);
        const isCorrect = this.regex.test(pastedData);
        if (isCorrect && this.el.nativeElement.max && pastedData.length > this.el.nativeElement.max.length)
            pastedData = pastedData.substr(0, this.el.nativeElement.max.length);

        setTimeout(() => {
            if (onlyNumbers && isCorrect) {
                this.el.nativeElement.value = pastedData;
            } else {
                this.el.nativeElement.value = '0';
            }
               
        }, 10);
    }

    @HostListener('focus') onfocus() {
        if (this.el.nativeElement.value == "0") {
            this.el.nativeElement.value = null;
        }
    }

    @HostListener('blur') onBlur() {
        let current: string = this.el.nativeElement.value;
        if (current == "") {
            if (this.allowNullValue) {
                this.el.nativeElement.value = null;
                this.model.control.setValue(null);
            } else {
                this.el.nativeElement.value = "0";
                this.model.control.setValue(0);
            }
        } else {
            this.el.nativeElement.type = "text";
            this.el.nativeElement.type = "number";
            if (this.el.nativeElement.max && this.el.nativeElement.valueAsNumber > +this.el.nativeElement.max) {
                this.el.nativeElement.value = this.el.nativeElement.max;
                this.model.control.setValue(this.el.nativeElement.valueAsNumber);
            }
        }
    }

    @HostListener('keyup', ['$event']) onKeyUp(event: KeyboardEvent) {

        console.log(event);
        let current: string = this.el.nativeElement.value;
        current = current.split("-").join("");
        let posPoint = current.indexOf('.');
        if (posPoint > -1) {
            current = current.substring(0, posPoint);
            this.el.nativeElement.value = current;
        }

        if (this.isSpecial(event) || current == "") { 
            if (event.keyCode == 8 || current != "") {
                this.prev = current;
            }
            return; 
        }

        if (!this.isOnlyNumber(event)) { 
            event.preventDefault(); 
            event.stopPropagation(); 
            return false;
        }

        if (this.el.nativeElement.max && this.el.nativeElement.valueAsNumber > +this.el.nativeElement.max) {
            this.el.nativeElement.value = current.substring(0, current.length - 1);
        }
    }

    @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {

        if (this.isSpecial(event)) { return; }

        if (!this.isOnlyNumber(event)) {
            event.preventDefault(); 
            event.stopPropagation(); 
            return false;
        }
        
        let current: string = this.el.nativeElement.value;

        this.prev = current;
    }

    private isSpecial(e: KeyboardEvent): boolean {
        return e.key === 'Delete' || (e.key === 'Tab' || e.keyCode == 9) || (e.key === 'Backspace' || e.keyCode == 8) || e.key === 'ArrowLeft' ||
            e.altKey || e.ctrlKey || e.key === 'Home' || e.key === 'End' || e.key === 'PageDown' || e.key === 'PageUp' ||
            e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'ArrowRight' || e.key === 'Control' || e.key === 'Alt' || e.key === 'Shift' ||
            ((<any>e).keyIdentifier == 'Down' || (<any>e).keyIdentifier == 'Up' || (<any>e).keyIdentifier == 'Left' || (<any>e).keyIdentifier == 'Right');
    }

    private isOnlyNumber(e: KeyboardEvent | string): boolean {
        if (e instanceof KeyboardEvent) {
            return ((e.key >= '0' && e.key <= '9') || (e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105));
        } else {
            return (e >= '0' && e <= '9');
        }
    }
}
