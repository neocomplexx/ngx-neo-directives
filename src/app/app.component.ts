import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ICommand, Command } from 'ngx-neo-directives';

@Component({
  selector: 'neo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public numberModel: number;
  public inoputDigital: number;
  public facturarBehavior: BehaviorSubject<boolean> = new BehaviorSubject(true);
  public testCommand: ICommand = new Command(() => this.test(), new BehaviorSubject(true), false);
  public testCommandTwo: ICommand = new Command(() => this.testTwo(), new BehaviorSubject(true), false);
  public testAsyncCommand: ICommand = new Command(() => this.testAsync(), this.facturarBehavior, true);

  constructor(private http: HttpClient) {
    this.numberModel = 0;
  }

  private test(): void {
    console.log('Command executed');
    // this.facturarBehavior.next(!this.facturarBehavior.value);
    // console.log('facturarBehavior value: ' + this.facturarBehavior.value);
  }
  private testTwo(): void {
    console.log('Command two executed');
  }

  private async testAsync(): Promise<void> {
    const res: any = await this.http.post('http://localhost:8181/auth/', { username: "test", password: "123456"}).toPromise();
    console.log('Command Async executed' + res.fullName);
  }
}
