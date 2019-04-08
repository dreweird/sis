import { Component, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';
import {DocumentService} from "../_services/document.service";
class Items {
    category: string;
    name: string;
    unit: string;
    taguibo: number;
    trento: number;
    delmonte: number;
    id: number;
    qty: [0,0,0]
  }

@Component({
  selector: 'app-action-component',
  template: `
  <button mat-button color="accent" (click)="editDialog()">EDIT</button>
  <button mat-button color="warn" (click)="deleteDialog()">DELETE</button>
  `

})
export class ActionComponent {

  private params: any;

  constructor(public dialog: MatDialog) {}

  editDialog(){
    let dialogRef = this.dialog.open(EditDialog, {
      height: '400px',
      width: '300px',
        data: { data: this.params.data, gridApi: this.params.api}
      });
  
  }

  deleteDialog(){
    let dialogRef = this.dialog.open(DeleteDialog, {
      width: '600px',
      data: { data: this.params.data, gridApi: this.params.api}
    });
  }

  agInit(params: any): void {
      this.params = params;
  }
}

@Component({
    selector: 'dialog-overview-example-dialog',
    templateUrl: 'add-item.component.html',
    styles: [`.example-full-width {
      width: 100%;
    }`]
  })
  export class EditDialog{

    newItem: Items;
    selectCategory = [{name: "RICE"}, {name: "CORN"}, {name: "HVCDP"}, {name: "OA"}];
    selectOptions = [{name: "kilogram"}, {name: "bag"}, {name: "liter"}];

    constructor(
        public dialogRef: MatDialogRef<EditDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any, private docService: DocumentService,
        private snackBar: MatSnackBar) {
            console.log(data.data);
            this.newItem = data.data;
       
         }
    save(){

        console.log(this.newItem);
        this.data.gridApi.updateRowData({ update: [this.newItem]});
        this.docService.addItem(this.newItem).subscribe(res => {
          if(res){
            console.log(res);
            this.dialogRef.close(); 
            this.snackBar.open('Successfully Updated Data', 'Ok', {
              duration: 2000,
            }); 
          }
    
      });
        
    }
  }

  @Component({
    selector: 'dialog-overview-example-dialog',
    templateUrl: 'delete-item.component.html',
  })
  export class DeleteDialog{
  cantDelete = false;

    constructor(
        public dialogRef: MatDialogRef<DeleteDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any, private docService: DocumentService) {
            console.log(data.data);
            if(data.data.qty[0] != 0 || data.data.qty[1] != 0 || data.data.qty[2] != 0 ){
              this.cantDelete = true;
            }   
         }
    delete(){
      this.data.gridApi.updateRowData({ remove: [this.data.data]});
      this.docService.deleteItem(this.data.data.id).subscribe(res => {
        if(res) {
          console.log(res);
          this.dialogRef.close();  
        }
      })
    }

  }