import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommandDirective, CommandOptions, COMMAND_CONFIG } from './ngx-command/command.directive';
import { OnReturnDirective } from './onReturn.directive';
import { StringsDirective } from './strings.directive';
import { NumbersDirective } from './numbers.directive';
import { NeoAutofocusDirective } from './neo-autofocus.directive';
import { NeoChangeCommandDirective } from './neo-changecommand.directive';
import { NeoDecimalNumbersDirective } from './decimalNumbers.directive';
import { NeoCompositeInputDirective } from './composite-input/composite-input.directive';
import { NeoMatchHeightDirective } from 'projects/ngx-neo-directives/src/public_api';


@NgModule({
  imports: [
  ],
  declarations: [
    CommandDirective,
    OnReturnDirective,
    StringsDirective,
    NumbersDirective,
    NeoAutofocusDirective,
    NeoChangeCommandDirective,
    NeoDecimalNumbersDirective,
    NeoCompositeInputDirective,
    NeoMatchHeightDirective,
  ],
  exports: [
    CommandDirective,
    OnReturnDirective,
    StringsDirective,
    NumbersDirective,
    NeoAutofocusDirective,
    NeoChangeCommandDirective,
    NeoDecimalNumbersDirective,
    NeoCompositeInputDirective,
    NeoMatchHeightDirective
  ]
})
export class NgxNeoDirectivesModule {

  static forRoot(options: CommandOptions = { executingCssClass: 'executing' }): ModuleWithProviders {
    return {
      ngModule: NgxNeoDirectivesModule,
      providers: [
        { provide: COMMAND_CONFIG, useValue: options },
      ]
    };
  }
}
