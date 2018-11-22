import { BehaviorSubject } from 'rxjs';
import { Component } from '@angular/core';
import { ICommand, Command } from 'ngx-neo-directives';

@Component({
  selector: 'neo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public numberModel: number;
  public testCommand: ICommand = new Command(() => this.test(), new BehaviorSubject(true), false);

  constructor() {
    this.numberModel = 0;
  }

  private test(): void {
    console.log('Command executed');
  }
}
