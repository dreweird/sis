import { Component } from '@angular/core';


@Component({
  selector: 'app-bold-component',
  template: `{{params.value | date:'MMM dd, yyyy; h:mm a'}}`

})
export class DateComponent {

  params: any;

  constructor() {}


  agInit(params: any): void {
      this.params = params;
  }
}