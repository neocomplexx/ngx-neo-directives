import { Directive, Input, ElementRef, HostListener } from '@angular/core';
import { ICommand } from './ngx-command/command.directive';


@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[changeCommand]'
})
export class NeoChangeCommandDirective {
    @Input() changeCommand: ICommand;

    private _lastValue: string;

    constructor(private element: ElementRef) {
    }

    @HostListener('keyup', ['$event']) onInputChange(event: KeyboardEvent) {
        const value = this.element.nativeElement.value;

        if (!this._lastValue || this._lastValue !== value) {
            this._lastValue = value;
            this.changeCommand.execute(value);
        }
    }
}
