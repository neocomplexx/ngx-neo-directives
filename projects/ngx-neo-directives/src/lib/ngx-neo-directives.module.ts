import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommandDirective, CommandOptions, COMMAND_CONFIG } from './ngx-command/command.directive';
import { OnReturnDirective } from './onReturn.directive';
import { StringsDirective } from './strings.directive';
import { NumbersDirective } from './numbers.directive';
import { NgbTabSetDirective } from './ngb-tabset.directive';
import { NeoAutofocusDirective } from './neo-autofocus.directive';
import { NeoChangeCommandDirective } from './neo-changecommand.directive';


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
    NeoChangeCommandDirective
  ],
  exports: [
    CommandDirective,
    OnReturnDirective,
    StringsDirective,
    NumbersDirective,
    NgbTabSetDirective,
    NeoAutofocusDirective,
    NeoChangeCommandDirective
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
