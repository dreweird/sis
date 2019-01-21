import { Component, OnInit } from '@angular/core';
import {DocumentService} from "../_services/document.service";
import {DateComponent} from "./date.component";
import "ag-grid-enterprise";

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnInit {

  columnDefs;
  gridApi;
  gridColumnApi;
  rowData;
  fileName: any;

  constructor(private docService: DocumentService) {
    this.columnDefs = [
      {headerName: "Date", field: "date", width: 150, pinned: 'left', cellRendererFramework: DateComponent, unSortIcon: true,},
      {headerName: "Interventions", field: "name", width: 150, pinned: 'left'},
      {headerName: "Quantity", field: "quantity", width: 120,},
      {headerName: "Received by", field: "receivedBy", width: 200,},
      {headerName: "Position", field: "position", width: 200,},
      {headerName: "Office", field: "office", width: 200,},
   
  ];
   }


   onGridReady(params){
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.docService.issueLogs().subscribe(res => {
      this.rowData = res;
     console.log(this.rowData);
    })
   }

   export(){
    let params = {
      fileName: this.fileName,
      processCellCallback: function(params){
        if(params.column.getColId() === "date") {
          return new Date(params.node.data.date).toISOString().slice(0,10);
        }
        return params.value;
      }
     
    }
    this.gridApi.exportDataAsCsv(params);
  }

  

  ngOnInit() {
  }

}
