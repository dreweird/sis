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
  autoGroupColumnDef: any;
  components: any;

  code = JSON.parse(localStorage.getItem("code"));

  constructor(private docService: DocumentService) {
    this.columnDefs = [
      {
        headerName: 'Category',
        field: 'category',
        width: 120,
        rowGroup: true,
        hide: true
      },
      {headerName: "Date", field: "date", width: 150, pinned: 'left', cellRendererFramework: DateComponent, unSortIcon: true,},
      {headerName: "Quantity", field: "quantity", width: 120,},
      {headerName: "Received by", field: "receivedBy", width: 200,},
      {headerName: "Position", field: "position", width: 200,},
      {headerName: "Office", field: "office", width: 200,},
   
  ];

  this.autoGroupColumnDef = {
    headerName: 'Category',
    cellRenderer: 'agGroupCellRenderer',
    pinned: 'left',
    width: 200,
    field: 'name',
    cellRendererParams: {
      suppressCount: true, // turn off the row count
      innerRenderer: 'simpleCellRenderer'
    }
    };

    this.components = { simpleCellRenderer: getSimpleCellRenderer() };
   }


   onGridReady(params){
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.docService.issueLogs(this.code).subscribe(res => {
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
