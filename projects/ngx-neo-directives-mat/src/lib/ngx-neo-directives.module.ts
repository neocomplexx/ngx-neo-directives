import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommandDirective, CommandOptions, COMMAND_CONFIG } from './ngx-command/command.directive';
import { OnReturnDirective } from './onReturn.directive';
import { StringsDirective } from './strings.directive';
import { NeoNumbersDirective } from './neo-numbers.directive';
import { NeoAutofocusDirective } from './neo-autofocus.directive';
import { NeoChangeCommandDirective } from './neo-changecommand.directive';
import { NeoDecimalNumbersDirective } from './neo-decimalNumbers.directive';
import { NeoCompositeInputDirective } from './composite-input/composite-input.directive';
import { NeoMatchHeightDirective } from './neo-matchheight.directive';
import { NgbTabSetDirective } from './ngb-tabset.directive';


@NgModule({
  imports: [
  ],
  declarations: [
    CommandDirective,
    OnReturnDirective,
    StringsDirective,
    NeoNumbersDirective,
    NeoAutofocusDirective,
    NeoChangeCommandDirective,
    NeoDecimalNumbersDirective,
    NeoCompositeInputDirective,
    NeoMatchHeightDirective,
    NgbTabSetDirective
  ],
  exports: [
    CommandDirective,
    OnReturnDirective,
    StringsDirective,
    NeoNumbersDirective,
    NeoAutofocusDirective,
    NeoChangeCommandDirective,
    NeoDecimalNumbersDirective,
    NeoCompositeInputDirective,
    NeoMatchHeightDirective,
    NgbTabSetDirective
  ]
})
export class NgxNeoDirectivesModule {

  static forRoot(options: CommandOptions = { executingCssClass: 'executing' }): ModuleWithProviders<NgxNeoDirectivesModule> {
    return {
      ngModule: NgxNeoDirectivesModule,
      providers: [
        { provide: COMMAND_CONFIG, useValue: options },
      ]
    };
  }
}
