import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule,FormGroup, FormControl, Validators,ReactiveFormsModule  } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';

import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SidebarModule } from 'ng-sidebar';

import { ToastrModule } from 'ngx-toastr';
import { DataTablesModule } from 'angular-datatables';
import { ImageCropperModule } from 'ngx-image-cropper';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { TagInputModule } from 'ngx-chips';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
//import { NgbdModalBasic } from '../modal-basic';
//import { NgbdProgressbarConfig } from '../bootstrap-tool/progressbar-config';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgApexchartsModule } from "ng-apexcharts";
import { RecaptchaModule } from 'ng-recaptcha';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AdminRoutingModule } from './admin-routing.module';

//import { NotificationsComponent } from './notifications/notifications.component';
import { SharedModule } from '../shared/shared.module';

import { AdminComponent } from './admin/admin.component';

import { HeaderComponent } from './header/header.component';
import { AsidebarComponent } from './asidebar/asidebar.component';
import { DdTerminalComponent } from './dd-terminal.component';
import { FooterComponent } from './footer/footer.component';

import { InstructorComponent } from '../dd-instructor/instructor/instructor.component';

import { UserlistComponent } from './userlist/userlist.component';
import { UserprofileComponent } from './userprofile/userprofile.component';
import { TeamComponent } from './team/team.component';
import { TeamlistComponent } from './teamlist/teamlist.component';
import { TeamtypeComponent } from './teamtype/teamtype.component';
import { TeamtypelistComponent } from './teamtypelist/teamtypelist.component';
import { ContentComponent } from './content/content.component';
import { ContentlistComponent } from './contentlist/contentlist.component';
import { ResourceComponent } from './resource/resource.component';
import { ResourcelistComponent } from './resourcelist/resourcelist.component';
// import { RolesComponent } from './roles/roles.component';
// import { RoleslistComponent } from './roleslist/roleslist.component';
import { ExerciseComponent } from './exercise/exercise.component';
import { ExerciselistComponent } from './exerciselist/exerciselist.component';
import { AllotmentlistComponent } from './allotmentlist/allotmentlist.component';
import { EditexerciseComponent } from './editexercise/editexercise.component';
import { ManualComponent } from './manual/manual.component';
import { ManuallistComponent } from './manuallist/manuallist.component';

import { ExerciseallotmentComponent } from './exerciseallotment/exerciseallotment.component';
import { EarningComponent } from './earning/earning.component';
import { AdminchatComponent } from './adminchat/adminchat.component';

import { FilterbgprocessPipe } from '../modal/filterbgprocess.pipe';
import { VmcontrolfilterPipe } from '../modal/vmcontrolfilter.pipe';
import { ExercisefilterPipe } from '../modal/exercisefilter.pipe';
import { VmrowscountfilterPipe } from '../modal/vmrowscountfilter.pipe';
import { VmarrayfilterPipe } from '../modal/vmarrayfilter.pipe';
import { ManualfilterPipe } from '../modal/manualfilter.pipe';
import { PurchasevoucherlistComponent } from './purchasevoucherlist/purchasevoucherlist.component';
import { WallettransitionlistComponent } from './wallettransitionlist/wallettransitionlist.component';
import { PackagelistComponent } from './packagelist/packagelist.component';
import { PackageComponent } from './package/package.component';
import { DemorequestlistComponent } from './demorequestlist/demorequestlist.component';
import { GeneralsettingsComponent } from './generalsettings/generalsettings.component';
import { PermissionComponent } from '../dd-terminal/permission/permission.component';
import { ReferencelistComponent } from './referencelist/referencelist.component';
import { VoucherlistComponent } from './voucherlist/voucherlist.component';
import { ArchivelistComponent } from './archivelist/archivelist.component';
import { CommonComponent } from './common/common.component';
import { ClaimlistComponent } from './claimlist/claimlist.component';
import { ResrequestComponent } from './resrequest/resrequest.component';
import { ChallengeComponent } from './challenge/challenge.component';
import { ChallengelistComponent } from './challengelist/challengelist.component';

@NgModule({
  declarations: [
    AdminComponent,
    DdTerminalComponent,
    HeaderComponent,
    AsidebarComponent,
    FooterComponent,
    UserlistComponent,
    UserprofileComponent,
    TeamComponent,
    TeamlistComponent,
    TeamtypeComponent,
    TeamtypelistComponent,
    ContentComponent, 
    ContentlistComponent,
    ResourceComponent,
    ResourcelistComponent,
    // RolesComponent,
    // RoleslistComponent,
    ExerciseComponent,
    ExerciselistComponent,
    AllotmentlistComponent,
    EditexerciseComponent,
    ManualComponent,
    ManuallistComponent,
    ExerciseallotmentComponent,
    EarningComponent, 
    AdminchatComponent,
    InstructorComponent,
    
    FilterbgprocessPipe, 
    VmcontrolfilterPipe,
    ExercisefilterPipe,
    VmrowscountfilterPipe,
    VmarrayfilterPipe,
    ManualfilterPipe,
    PurchasevoucherlistComponent,
    WallettransitionlistComponent,
    PackagelistComponent,
    PackageComponent,
    DemorequestlistComponent,
    GeneralsettingsComponent,
    PermissionComponent,
    ReferencelistComponent,
    VoucherlistComponent,
    ArchivelistComponent,
    CommonComponent,
    ClaimlistComponent,
    ResrequestComponent,
    ChallengeComponent,
    ChallengelistComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule, 
    SidebarModule.forRoot(),
    AdminRoutingModule,
    ToastrModule,
    DataTablesModule,
    ImageCropperModule,
    AngularEditorModule,
    TagInputModule,
    ToastrModule.forRoot({
      closeButton:true,
      tapToDismiss:true,
      disableTimeOut:true,
      preventDuplicates: true,
      autoDismiss: false,
    }),
    NgMultiSelectDropDownModule.forRoot(),
    NgbModule,
    //NgbdModalBasic,
    //NgbdProgressbarConfig,
    FontAwesomeModule,
    NgApexchartsModule,
    RecaptchaModule,
    BrowserAnimationsModule,
    SharedModule,
      ],
      providers: [DatePipe],

})
export class AdminModule { }
