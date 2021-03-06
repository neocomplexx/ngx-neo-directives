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
  public inputDigital: number;
  public facturarBehavior: BehaviorSubject<boolean> = new BehaviorSubject(true);
  public testCommand: ICommand = new Command(() => this.test(), new BehaviorSubject(true), false);
  public testCommandWithDelay: ICommand = new Command((value) => this.testWithDelay(value), new BehaviorSubject(true), false, 200);
  public testAsyncCommand: ICommand = new Command(() => this.testAsync(), this.facturarBehavior, true);

  constructor(private http: HttpClient) {
    this.numberModel = 0;
  }

  public test(): void {
    console.log('Command executed');
    // this.facturarBehavior.next(!this.facturarBehavior.value);
    // console.log('facturarBehavior value: ' + this.facturarBehavior.value);
  }
  private testWithDelay(value: any): void {
    console.log('Command: ', value);
  }

  private async testAsync(): Promise<void> {
    // const res: any = await this.http.post('http://localhost:8181/auth/', { username: "test", password: "123456"}).toPromise();
    // const res: any = await this.http.get('https://jsonplaceholder.typicode.com/users/1').toPromise();
    const res: any = await this.delay(3000);
    console.log('Command Async executed: ' + (res?.fullName ?? res?.name ?? ''));
  }

  private delay(delay: number) {
    return new Promise(resolve => setTimeout(resolve, delay));
  }
}
