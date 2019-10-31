import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommandDirective, CommandOptions, COMMAND_CONFIG } from './ngx-command/command.directive';
import { OnReturnDirective } from './onReturn.directive';
import { StringsDirective } from './strings.directive';
import { NumbersDirective } from './numbers.directive';
import { NgbTabSetDirective } from './ngb-tabset.directive';
import { NeoAutofocusDirective } from './neo-autofocus.directive';
import { NeoChangeCommandDirective } from './neo-changecommand.directive';
import { NeoDecimalNumbersDirective } from './decimalNumbers.directive';
import { NeoCompositeInputDirective } from './composite-input/composite-input.directive';


@NgModule({
  imports: [
  ],
  declarations: [
    CommandDirective,
    OnReturnDirective,
    StringsDirective,
    NumbersDirective,
    NgbTabSetDirective,
    NeoAutofocusDirective,
    NeoChangeCommandDirective,
    NeoDecimalNumbersDirective,
    NeoCompositeInputDirective
  ],
  exports: [
    CommandDirective,
    OnReturnDirective,
    StringsDirective,
    NumbersDirective,
    NgbTabSetDirective,
    NeoAutofocusDirective,
    NeoChangeCommandDirective,
    NeoDecimalNumbersDirective,
    NeoCompositeInputDirective
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
