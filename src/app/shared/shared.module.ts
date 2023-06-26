import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule,FormGroup, FormControl, Validators,ReactiveFormsModule  } from '@angular/forms';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import {DpDatePickerModule} from 'ng2-date-picker';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';

import { NotificationsComponent } from '../dd-terminal/notifications/notifications.component';
import { BreadcrumbsComponent } from '../breadcrumbs/breadcrumbs.component';
import { ViewnetworkComponent } from '../dd-terminal/viewnetwork/viewnetwork.component';
import { ViewpurchasevoucherlistComponent } from '../dd-terminal/viewpurchasevoucherlist/viewpurchasevoucherlist.component';
import { ViewuserprofileComponent } from '../dd-terminal/viewuserprofile/viewuserprofile.component';
import { ViewwallettransitionlistComponent } from '../dd-terminal/viewwallettransitionlist/viewwallettransitionlist.component';
import { ScheduleComponent } from '../schedule/schedule.component';


@NgModule({
  declarations: [
    NotificationsComponent,
    BreadcrumbsComponent,
    ViewnetworkComponent,
    ViewpurchasevoucherlistComponent,
    ViewuserprofileComponent,
    ViewwallettransitionlistComponent,
    ScheduleComponent
  ],
  exports: [
    NotificationsComponent,
    BreadcrumbsComponent,
    ViewnetworkComponent,
    ViewpurchasevoucherlistComponent,
    ViewuserprofileComponent,
    ViewwallettransitionlistComponent,
    ScheduleComponent,
    FontAwesomeModule,
    DragDropModule,
    FormsModule,
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
    DpDatePickerModule,
    AutocompleteLibModule,

  ],
  imports: [
    CommonModule,
    DataTablesModule,
    FontAwesomeModule,
    DragDropModule,
    RouterModule,
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    DpDatePickerModule,
    AutocompleteLibModule,

  ]
})
export class SharedModule { }
