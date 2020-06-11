import { Directive, HostListener, Input, ElementRef, Renderer2, OnInit } from '@angular/core';
import { NgModel } from '@angular/forms';

@Directive({
    selector: '[isDecimal]',
})
export class NeoDecimalNumbersDirective implements OnInit {

    @Input('isDecimal') decimals = 2;
    @Input('allowNullValue') allowNullValue = false;
    private prev: any;
    private regex: RegExp;

    private haveDecimalPoint = false;

    constructor(private el: ElementRef, private renderer: Renderer2, private model: NgModel) {
    }

    ngOnInit() {
        this.regex = new RegExp('^[0-9]+(\\.[0-9]{0,' + this.decimals + '})?$');
        if (<any>this.decimals == "") this.decimals = 2;
        if (<any>this.allowNullValue === "") this.allowNullValue = true;
        this.el.nativeElement.type = "number"
    }

    @HostListener('paste', ['$event']) blockPaste(e: ClipboardEvent) {
        const clipboardData: DataTransfer = e.clipboardData || window['clipboardData'];
        let pastedData: string = clipboardData.getData('text/plain').split(",").join(".");

        let posPoint = pastedData.lastIndexOf('.');
        if (posPoint > -1) {
            pastedData = pastedData.substring(0, posPoint).split(".").join("") + pastedData.substring(posPoint);
            posPoint = pastedData.lastIndexOf('.');
            if (posPoint + this.decimals < pastedData.length) {
                pastedData = pastedData.substring(0, posPoint + this.decimals + 1);
            }
        }

        const onlyNumbers = Array.from(pastedData).map(x => this.isNumber(x)).reduce((prev, el) => prev && el, true);
        const a = this.regex.test(pastedData);
        setTimeout(() => {
            if (onlyNumbers && a) {
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

        let current: string = this.el.nativeElement.value;
        current = current.split("-").join("");
        let posPoint = current.indexOf('.');
        if (posPoint > -1) {
            this.el.nativeElement.value = current.substring(0, posPoint + 1) + current.substring(posPoint).split(".").join("");
        }

        if (this.haveDecimalPoint && current == "" && this.prev > "") {
            this.haveDecimalPoint = false;
            this.el.nativeElement.value = this.prev + (this.prev.endsWith(".0") ? "" : ".0");
            this.el.nativeElement.type = "text";
            this.el.nativeElement.selectionStart = this.el.nativeElement.value.length - 1;
            this.el.nativeElement.selectionEnd = this.el.nativeElement.value.length;
            this.el.nativeElement.type = "number";
            return;
        }

        if (this.isSpecial(event) || current == "") { 
            if (event.keyCode == 8 || current != "") {
                this.prev = current;
                const dotIndex = current.toString().indexOf('.');
                if (dotIndex >= 0) this.haveDecimalPoint = false;
            }
            return; 
        }

        if (!this.isNumber(event)) { 
            event.preventDefault(); 
            event.stopPropagation(); 
            return false;
        }

        if (current) {
            current = current.toString();
            const dotIndex = current.indexOf('.');
            if ((dotIndex >= 0) && ((current.length - 1) - dotIndex > this.decimals)) {
                this.renderer.setProperty(this.el.nativeElement, 'value', current.slice(0, dotIndex + this.decimals + 1));
            }
        } else {
            this.renderer.setProperty(this.el.nativeElement, 'value', this.prev);
        }

    }

    @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {

        if (this.isSpecial(event)) { return; }

        if (!this.isNumber(event)) {
            event.preventDefault(); 
            event.stopPropagation(); 
            return false;
        }
        
        let current: string = this.el.nativeElement.value;

        if (this.isDecimalPoint(event)) {
            this.haveDecimalPoint = true;
            if (!current.endsWith(".0")) {
                this.el.nativeElement.value = current + ".0";
                this.el.nativeElement.type = "text";
                this.el.nativeElement.selectionStart = this.el.nativeElement.value.length - 1;
                this.el.nativeElement.selectionEnd = this.el.nativeElement.value.length;
                this.el.nativeElement.type = "number";
            }
        }
        this.prev = current;
    }

    private isSpecial(e: KeyboardEvent): boolean {
        return e.key === 'Delete' || (e.key === 'Tab' || e.keyCode == 9) || (e.key === 'Backspace' || e.keyCode == 8) || e.key === 'ArrowLeft' ||
            e.altKey || e.ctrlKey || e.key === 'Home' || e.key === 'End' || e.key === 'PageDown' || e.key === 'PageUp' ||
            e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'ArrowRight' || e.key === 'Control' || e.key === 'Alt' || e.key === 'Shift' ||
            ((<any>e).keyIdentifier == 'Down' || (<any>e).keyIdentifier == 'Up');
    }

    private isNumber(e: KeyboardEvent | string): boolean {
        if (e instanceof KeyboardEvent) {
            return ((e.key >= '0' && e.key <= '9') || ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105)) || 
                    (e.key === '.' || e.key === ',') || (e.keyCode === 188 || e.keyCode === 190 || e.keyCode === 229));
        } else {
            return ((e >= '0' && e <= '9') || (e === '.' || e === ','));
        }
    }

    private isDecimalPoint(e: KeyboardEvent): boolean {
        return (e.key === '.' || e.key === ',') || (e.keyCode === 188 || e.keyCode === 190 || e.keyCode === 229);
    }
}
