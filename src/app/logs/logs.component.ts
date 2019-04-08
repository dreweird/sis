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
  excelStyles:any;
  months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


  code = JSON.parse(localStorage.getItem("code"));

  constructor(private docService: DocumentService) {
    this.columnDefs = [
      {
        headerName: 'Category',
        field: 'category',
        width: 120,
        rowGroup: true,
        hide: true,
        cellClass: ['data']
      },
      {cellClass: ['data'],headerName: "Date", field: "date", width: 150, pinned: 'left', cellRendererFramework: DateComponent, unSortIcon: true,},
      {cellClass: ['data'],headerName: "Quantity", field: "quantity", width: 120,},
      {cellClass: ['data'],headerName: "Received by", field: "receivedBy", width: 200,},
      {cellClass: ['data'],headerName: "Position", field: "position", width: 200,},
      {cellClass: ['data'],headerName: "Office", field: "office", width: 200,},
      {cellClass: ['data'],headerName: "Purpose", field: "purpose", width: 200,},
   
  ];

  this.excelStyles= [
    {
      id: "data",
      font: { size:11, fontName: "Calibri", },
      borders: {
        borderBottom: { color: "#000000", lineStyle: "Continuous", weight: 1 },
        borderLeft: { color: "#000000", lineStyle: "Continuous", weight: 1 },
        borderRight: { color: "#000000", lineStyle: "Continuous", weight: 1 },
        borderTop: { color: "#000000", lineStyle: "Continuous", weight: 1 },
      }
    },
    { id: "headappend", font: { size:11, fontName: "Calibri", bold: true, }, },
    {
      id: "header",
      font: { size:11, fontName: "Calibri", bold: true, },
      borders: {
        borderBottom: { color: "#000000", lineStyle: "Continuous", weight: 1 },
        borderLeft: { color: "#000000", lineStyle: "Continuous", weight: 1 },
        borderRight: { color: "#000000", lineStyle: "Continuous", weight: 1 },
        borderTop: { color: "#000000", lineStyle: "Continuous", weight: 1 },
      }
    },
  ];

  this.autoGroupColumnDef = {
    headerName: 'Category',
    cellRenderer: 'agGroupCellRenderer',
    pinned: 'left',
    width: 200,
    field: 'name',
    cellClass: ['data'],
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
    const params = {
      fileName: this.fileName,
      sheetName: 'Inventory-Issuance Logs',
      columnGroups: true,
      customHeader: [
        [{styleId:'headappend',data:{type:'String', value:'DEPARTMENT OF AGRICULTURE'}}],
        [{styleId:'headappend',data:{type:'String', value:'Regional Field Office XIII'}}],
        [{styleId:'headappend',data:{type:'String', value:'Rice Seeds Inventory Report'}}],
        [{styleId:'headappend',data:{type:'String', value: 'RPIS v2.0 Generated as of '+this.months[new Date().getMonth()]+' '+new Date().getDate()+', '+new Date().getFullYear()}}],
        []
      ],
      processCellCallback: function(params){
        if(params.column.colDef.field === 'date' && params.node.data){
          return new Date(params.value);
        }else{
          return params.value
        }
      }
    }

    this.gridApi.exportDataAsExcel(params);
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
