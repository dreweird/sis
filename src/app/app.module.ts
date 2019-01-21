import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { DocumentService, AuthService } from './_services/index';
import { SharedModule } from '@app/shared';

import { AppComponent } from './app.component';
import { AgGridModule } from 'ag-grid-angular';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AppRoutingModule, routedComponents } from './app-routing.module';


import { InventoryComponent, AddItemDialog, DetailsDialog, AddIssueDialog } from './inventory/inventory.component';
import { LogsComponent } from './logs/logs.component';
import { DateComponent } from './logs/date.component';
import { ActionComponent, EditDialog, DeleteDialog } from './inventory/action.component';
import { RemoveComponent } from './inventory/issue-remove.component';
import 'ag-grid-enterprise';
import {AnimationsService } from './_animations/index';





@NgModule({
  declarations: [
    AppComponent,


    HomeComponent,
    LoginComponent,
    routedComponents,
    InventoryComponent,
    LogsComponent,
    AddItemDialog,
    DetailsDialog,
    AddIssueDialog,
    DateComponent,
    ActionComponent,
    EditDialog,
    DeleteDialog,
    RemoveComponent

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    HttpModule,
    AgGridModule.withComponents([DateComponent, ActionComponent, RemoveComponent]),
    SharedModule
  
  ],
  entryComponents: [AddItemDialog, DetailsDialog, AddIssueDialog, EditDialog, DeleteDialog],
  providers: [AuthService, DocumentService, AnimationsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
