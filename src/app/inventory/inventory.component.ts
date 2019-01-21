import { Component, OnInit, Inject } from '@angular/core';
import {DocumentService} from "../_services/document.service";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {ActionComponent} from "./action.component";
import {RemoveComponent} from "./issue-remove.component";
import { GridOptions } from "ag-grid-community";
import { ROUTE_ANIMATIONS_ELEMENTS } from '../_animations/index';


class Items {
  category: string;
  name: string;
  unit: string;
  taguibo: number;
  trento: number;
  delmonte: number;
  apcoads: number;
  id: number;
}

class Issue {
  name: Array<any>; 
  location: string;
  quantity: number;
  issueFor: string;
  issueForPos: string;
  issueBy: string;
  issueByPos: string;
  receivedBy: string;
  position: string;
  office: string;
  contact: string;
  approvedBy: string;
  approvedByPos: string;
}

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {

  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;


  private gridOptions: GridOptions;
  private columnDefs: any[];
  private rowData: any[];
  components: any;

  gridApi: any;
  gridColumnApi: any;
  getRowNodeId: any;
  fileName: any;
  user_id: any;
  rowSelection: any;
  autoGroupColumnDef: any;
  name = JSON.parse(localStorage.getItem("name"));

  onGridReady(params: any){
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi; 
   }

   private createRowData() {
    this.docService.getItem().subscribe(res => {
      this.rowData = res;
     console.log(this.rowData);
    })
  }


  private createColumnDefs(){
    let hide = true;
    this.user_id = localStorage.getItem('currentUser');
    if(this.user_id === '1') hide = false;
    this.columnDefs = [
      {
        headerName: 'Category',
        field: 'category',
        width: 120,
        rowGroup: true,
        hide: true
      },
      {headerName: "Interventions", field: "name", width: 120, pinned: 'left', hide: true},
      {headerName: "Unit", field: "unit", width: 70,},
      {headerName: "Taguibo", 
      children:[
        {headerName: "On-Hand", field: "taguibo", width: 70, type: "numericColumn", valueFormatter: this.taguibo},
        {headerName: "Issued", field: "qty.0", width: 70, type: "numericColumn", cellStyle: {color: 'black', 'background-color': '#80CBC4'}, aggFunc: 'sum'},
      ]},
      {headerName: "Del Monte", 
      children:[ 
        {headerName: "On-Hand", field: "delmonte", width: 70, type: "numericColumn", valueFormatter: this.delmonte},
        {headerName: "Issued", field: "qty.1", width: 70, type: "numericColumn", cellStyle: {color: 'black', 'background-color': '#80CBC4'}},
      ]},
      {headerName: "Trento", 
      children:[
        {headerName: "On-Hand", field: "trento", width: 70, type: "numericColumn", valueFormatter: this.trento},
        {headerName: "Issued", field: "qty.2", width: 70, type: "numericColumn", cellStyle: {color: 'black', 'background-color': '#80CBC4'}},
      ]},
      {headerName: "APCO-ADS", 
      children:[
        {headerName: "On-Hand", field: "apcoads", width: 70, type: "numericColumn", valueFormatter: this.apcoads},
        {headerName: "Issued", field: "qty.3", width: 70, type: "numericColumn", cellStyle: {color: 'black', 'background-color': '#80CBC4'}},
      ]},
      {headerName: "TOTAL", 
      children:[
        {headerName: "On-Hand",  width: 70, type: "numericColumn", valueFormatter: this.totalOnhand},
        {headerName: "Issued",  width: 70, type: "numericColumn", valueFormatter: this.totalIssued},
      ]},

   
      {headerName: "Actions",  width: 200, cellRendererFramework: ActionComponent, hide: hide}
    ];
  }

  constructor(private docService: DocumentService, public dialog: MatDialog)
   { 
      // we pass an empty gridOptions in, so we can grab the api out
      this.gridOptions = <GridOptions>{};
      this.createRowData();
      this.createColumnDefs();
      this.rowSelection = 'single';
      this.gridOptions.defaultColDef = {
        resizable: true,
        sortable: true,
        filter: true
    }
    this.autoGroupColumnDef = {
      headerName: 'Category',
      cellRenderer: 'agGroupCellRenderer',
      pinned: 'left',
      width: 300,
      field: 'name',
      cellRendererParams: {
        suppressCount: true, // turn off the row count
        innerRenderer: 'simpleCellRenderer'
      }
    };
    this.components = { simpleCellRenderer: getSimpleCellRenderer() };
  }




  private taguibo(params: any) {
    if( params.value !== undefined){
      let number = parseFloat(params.value);
      let issue = parseFloat(params.data.qty[0]);
      let onhand = number - issue;
      return onhand;
    }

  }

  private delmonte(params: any) {
    if( params.value !== undefined){
      let number = parseFloat(params.value);
      let issue = parseFloat(params.data.qty[1]);
      let onhand = number - issue;
      return onhand;
    }

  }

  private trento(params:any) {
    if( params.value !== undefined){
      let number = parseFloat(params.value);
      let issue = parseFloat(params.data.qty[2]);
      let onhand = number - issue;
      return onhand;
    }

  }

  private apcoads(params: any) {
    if( params.value !== undefined){
      let number = parseFloat(params.value);
      let issue = parseFloat(params.data.qty[3]);
      let onhand = number - issue;
      return onhand;
    }

  }

  private totalOnhand(params: any) {
    if( params.data !== undefined){
      let number = parseFloat(params.data.taguibo) + parseFloat(params.data.delmonte) + parseFloat(params.data.trento) + parseFloat(params.data.apcoads);
      let issue = parseFloat(params.data.qty[0]) + parseFloat(params.data.qty[1]) + parseFloat(params.data.qty[2]) + parseFloat(params.data.qty[3]);
      let onhand = number - issue;
      return onhand;
    }
   
  }

  private totalIssued(params) {
    if( params.data !== undefined){
      let issue = parseFloat(params.data.qty[0]) + parseFloat(params.data.qty[1]) + parseFloat(params.data.qty[2]) + parseFloat(params.data.qty[3]);
      return issue;
    }

  }

  openDialog() {
    let dialogRef = this.dialog.open(AddItemDialog, {
      height: '400px',
      width: '300px',
      data: {gridApi: this.gridApi }
    });

  }
  
  onCellClicked(event){
   // console.log(event);
    if(event.colDef.field === 'qty.0'){
      let dialogRef = this.dialog.open(DetailsDialog, {
        width: '850px',
        data: {id: event.data.id, loc: 'Taguibo' }
      });
  
    }
    if(event.colDef.field === 'qty.1'){
      let dialogRef = this.dialog.open(DetailsDialog, {
        width: '850px',
        data: {id: event.data.id, loc: 'Del Monte' }
      });
  
    }
    if(event.colDef.field === 'qty.2'){
      let dialogRef = this.dialog.open(DetailsDialog, {
        width: '850px',
        data: {id: event.data.id, loc: 'Trento' }
      });
  
    }
    if(event.colDef.field === 'qty.3'){
      let dialogRef = this.dialog.open(DetailsDialog, {
        width: '850px',
        data: {id: event.data.id, loc: 'APCO-ADS' }
      });
  
    }
    //console.log(event);
  }

  issueDialog(){
    let dialogRef = this.dialog.open(AddIssueDialog, {
      height: '400px',
      width: '300px',
      data: {items: this.rowData }
    });
  }


   export(){
     let params = {
       fileName: this.fileName,
       columnGroups: true,
       processCellCallback: function(params){
         if(params.column.getColId() === "taguibo") {
          let number = parseFloat(params.node.data.taguibo);
          let issue = parseFloat(params.node.data.qty[0]);
          let onhand = number - issue;
          return onhand;
         }
         if(params.column.getColId() === "delmonte") {
          let number = parseFloat(params.node.data.delmonte);
          let issue = parseFloat(params.node.data.qty[1]);
          let onhand = number - issue;
          return onhand;
         }
         if(params.column.getColId() === "trento") {
          let number = parseFloat(params.node.data.trento);
          let issue = parseFloat(params.node.data.qty[2]);
          let onhand = number - issue;
          return onhand;
         }
         if(params.column.getColId() === "4") {
          let number = parseFloat(params.node.data.taguibo) + parseFloat(params.node.data.delmonte) + parseFloat(params.node.data.trento);
          let issue = parseFloat(params.node.data.qty[0]) + parseFloat(params.node.data.qty[1]) + parseFloat(params.node.data.qty[2]);
          let onhand = number - issue;
          return onhand;
         }
         if(params.column.getColId() === "5") {
          let issue = parseFloat(params.node.data.qty[0]) + parseFloat(params.node.data.qty[1]) + parseFloat(params.node.data.qty[2]);
          return issue;
         }
      console.log(params.column);   
         return params.value
       }
     }
     this.gridApi.exportDataAsCsv(params);
   }

   refresh(){
    let params = { force: true };
    this.gridApi.refreshCells(params);

  }

  ngOnInit() {
  }

}

@Component({
  selector: 'add-item-dialog',
  templateUrl: 'add-item.component.html',
  styles: [`.example-full-width {
    width: 100%;
  }`]
})
export class AddItemDialog{
  newItem: Items;
  selectCategory = [{name: "RICE"}, {name: "CORN"}, {name: "HVCDP"}, {name: "OA"}];
  selectOptions = [{name: "kilogram"}, {name: "bag"}, {name: "liter"}];
  constructor(
    public dialogRef: MatDialogRef<AddItemDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,private docService: DocumentService) {
      this.newItem = new Items();
      console.log(data.gridApi);
     }

  onNoClick(): void {
    this.dialogRef.close();
  }

  save(){
    console.log(this.newItem);
    let item = {
      name: this.newItem.name, 
      unit: this.newItem.unit,
      taguibo: this.newItem.taguibo,
      delmonte: this.newItem.delmonte,
      trento: this.newItem.trento,
      apcoads: this.newItem.apcoads,
      qty: [0,0,0,0]
    }
    this.docService.addItem(this.newItem).subscribe(res => {
      if(res){
        console.log(res);
        this.dialogRef.close();
        this.data.gridApi.updateRowData({ add: [item]});

      }

  });
 

  }


}

@Component({
  selector: 'details-item-dialog',
  templateUrl: 'details-item.component.html',
  styles: [`.example-full-width {
    width: 100%;
  }`]
})
export class DetailsDialog{

  rowData;
  columnDefs;
  gridApi;


  constructor(
    public dialogRef: MatDialogRef<DetailsDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,private docService: DocumentService) {
      this.columnDefs = [
        {headerName: "Issued By", field: "issueBy", width: 200, pinned: 'left'},
        {headerName: "Position", field: "issueByPos", width: 100,},
        {headerName: "Issued For", field: "issueFor", width: 100,},
        {headerName: "Position", field: "issueForPos", width: 100,},
        {headerName: "Received By", field: "receivedBy", width: 100,},
        {headerName: "Quantity", field: "quantity", width: 100,},
        {headerName: "Position", field: "position", width: 100,},
        {headerName: "Action",  width: 100, cellRendererFramework: RemoveComponent},

  
    ];

     }
  onGridReady(params){
    this.gridApi = params.api;
    this.docService.issueDetails(this.data.id, this.data.loc).subscribe(res => {
      this.rowData = res;
     console.log(this.rowData);
    })
   }



  onNoClick(): void {
    this.dialogRef.close();
  }




 

  }

  @Component({
    selector: 'issue-item-dialog',
    templateUrl: 'issue-item.component.html',
    styles: [`.example-full-width {
      width: 100%;
    }`]
  })
  export class AddIssueDialog{

    newIssue: Issue;
    items;
    warehouse = [{name: "Taguibo"}, {name: "Del Monte"}, {name: "Trento"}, {name: "APCO-ADS"}];
  
    constructor(
      public dialogRef: MatDialogRef<AddIssueDialog>,
      @Inject(MAT_DIALOG_DATA) public data: any,private docService: DocumentService) {
        this.newIssue = new Issue();
        console.log(data.items);
        for (var key in data.items) {
          var total_array = data.items.length - 1;
          let number = parseFloat(data.items[key].taguibo) + parseFloat(data.items[key].delmonte) + parseFloat(data.items[key].trento);
          let issue = parseFloat(data.items[key].qty[0]) + parseFloat(data.items[key].qty[1]) + parseFloat(data.items[key].qty[2]);
          let onhand = number - issue;
          data.items[key].onhand = onhand;
          console.log(onhand);
          console.log(total_array);
          console.log(key);
          if(parseInt(key) == total_array){
            console.log(data.items);
            this.items = data.items;
          }
          
        }

       }

    onNoClick(): void {
      this.dialogRef.close();
    }
  
  issue(item){
    let my_date=new Date();
    let monthname=new Array("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec");
  
      let my_window = window.open('', 'mywindow', 'status=1,width=auto,height=100%');
      my_window.document.write(`
      <html>
      <head>
        <title>Issuance Printing</title>
      <style>
      img {
    display: block;
    margin: auto;
    width: 10%;
  }
  th {
    text-align: left;
    }
  p {
      text-indent: 50px;
  }

      </style>
      <body onafterprint="self.close()">
      <img src="../../assets/bg/da-logo.png">
      <h2 style="text-align: center;">Field Operations Division </h2>
     <hr>
     <h3 style="text-align: center;">Withdrawal Slip</h3><br>
     <table style="width:100%">
     <tr>
     <th width="15%">Date:</th>
     <td width="60%"> ${monthname[my_date.getMonth()]}  ${my_date.getDate()}, ${my_date.getFullYear()}</td> 
     <td width="15%"></td><td width="10%"></td>
     </tr>
     <tr>
     <th>For:</th>
     <td> ${item.issueFor} - ${item.issueForPos}</td> 
     <td></td><td></td>
     </tr>
     <tr>
     <th>Item:</th>
     <td>   ${item.name.name}</td> 
     <th>Quantity:</th><td>${item.quantity}</td>
     </tr>
     <tr>
     <th> Recipient:</th>
     <td> ${item.receivedBy}</td> 
     <td></td><td></td>
     </tr>
     <tr>
     <th>   Position: </th>
     <td> ${item.position}</td> 
     <td></td><td></td>
     </tr>
     <tr>
     <th> Office:  </th>
     <td>  ${item.office}</td> 
     <td></td><td></td>
     </tr>
    </table>
    <br>

    <table style="width:100%">
    <tr>
    <td width="75%">Issued by:</td>
    <td width="25%">Approved by</td>
    </tr>
    <tr>
    <td><br><br></td>
    <td><br><br></td>
    </tr>
    <tr>
    <td> <br><strong><u>${item.issueBy}</u></strong></td>
  <td> <br><strong><u>${item.approvedBy}</u></strong></td>
    </tr>
    <tr>
    <td> ${item.issueByPos}</td>
   <td> ${item.approvedByPos}</td>
    </tr>
    </table>
    <br><br>
 


    <hr style="border-top: dotted 2px;" /><br><br>
     <img src="../../assets/bg/da-logo.png">
      <h2 style="text-align: center;">Field Operations Division</h2>
    <hr>
    Date: ${monthname[my_date.getMonth()]}  ${my_date.getDate()}, ${my_date.getFullYear()} <br>

    <h3 style="text-align: center;">Cerftificate of Acceptance</h3>
    <p>I hereby certify and accept <strong><i>${item.quantity}  ${item.name.unit} </i></strong>of  <strong><i>${item.name.name} </i></strong>provided by the Department of Agriculture 
    - Caraga Region Capitol Site, Imadejas, Butuan City. I fully understand the importance of the list of
    beneficiaries, hence said documents will be submitted one (1) month after the
    date of issuance</p><br><br>

 Received by:
 <br><br></br>
 <strong> <u>${item.receivedBy}</u>  </strong><br>
    <i>${item.position}, ${item.office}</i><br> ${item.contact} `);
 
   my_window.document.write('</body></html>'); 

   item.item_id = item.name.id;
   item.date = my_date;
   delete item.name; 
    console.log(item);
    this.docService.addIssue(item).subscribe( res => {
      if(res){
        console.log(res);
        this.dialogRef.close();
      }
    })  
  
    }
  }


  function getSimpleCellRenderer() {
    function SimpleCellRenderer() {}
    SimpleCellRenderer.prototype.init = function(params) {
      const tempDiv = document.createElement('div');
    if (params.node.group) {
        tempDiv.innerHTML =
          '<span style="font-weight: bold">' + params.value + '</span>';
      } else {
        // console.log(params);
        tempDiv.innerHTML = '<span>' + params.value + '</span>';
      }
      this.eGui = tempDiv.firstChild;
    };
    SimpleCellRenderer.prototype.getGui = function() {
      return this.eGui;
    };
    return SimpleCellRenderer;
  }

