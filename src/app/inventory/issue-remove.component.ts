import { Component, Inject } from '@angular/core';
import {DocumentService} from "../_services/document.service";


@Component({
  selector: 'app-remove-component',
  template: `
  <button mat-button color="warn" (click)="delete_issue()">DELETE</button>
  `

})
export class RemoveComponent {

  private params: any;

  constructor(private docService: DocumentService) {}

    delete_issue(){
        let r = confirm("Are you sure you want to delete this issued item?");
        if (r == true) {
            this.params.api.updateRowData({ remove: [this.params.data]});
            this.docService.deleteIssue(this.params.data.id).subscribe(res => {
                if(res){
                  console.log(res);
                }
          
            });
        }
    }

  agInit(params: any): void {
      this.params = params;
      console.log(this.params);
  }
}
