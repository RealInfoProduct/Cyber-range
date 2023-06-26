import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule,FormGroup, FormControl, Validators,ReactiveFormsModule  } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { saveAs } from 'file-saver';

import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { CarouselModule } from 'ngx-owl-carousel-o';

import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FlatpickrModule } from 'angularx-flatpickr';

import { AppComponent } from './app.component';

import { ToastrModule } from 'ngx-toastr';
import { DataTablesModule } from 'angular-datatables';
import { ImageCropperModule } from 'ngx-image-cropper';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalBasic } from './modal-basic';
import { NgbdProgressbarConfig } from './bootstrap-tool/progressbar-config';
import { RecaptchaModule } from 'ng-recaptcha';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSliderModule } from '@angular-slider/ngx-slider';

import { SharedModule } from './shared/shared.module';

import { AdminModule } from './dd-terminal/admin.module';


import { LoginComponent } from './login/login.component';
import { LoginService } from './services/login.service';
import { RegistrationComponent } from './registration/registration.component';
import { CandidateComponent } from './candidate/candidate.component';
import { ThankyouComponent } from './registration/thankyou/thankyou.component';
import { VerifyComponent } from './registration/verify/verify.component';
import { CandidateheaderComponent } from './candidate/candidateheader/candidateheader.component';
import { CandidatefooterComponent } from './candidate/candidatefooter/candidatefooter.component';
import { CandidateprofileComponent } from './candidate/candidateprofile/candidateprofile.component';

import { ProfileComponent } from './profile/profile.component';

//import { InstructorComponent } from './dd-instructor/instructor/instructor.component';


import { BasketComponent } from './candidate/basket/basket.component';
import { ExercisedescriptionComponent } from './candidate/exercisedescription/exercisedescription.component';
import { UserexercisesComponent } from './candidate/userexercises/userexercises.component';
import { ContactusComponent } from './contactus/contactus.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { ExerciserepositoryComponent } from './candidate/exerciserepository/exerciserepository.component';


import { httpInterceptorProviders } from './http-interceptors/index';

import { VoucherComponent } from './candidate/voucher/voucher.component';
import { PurchasevoucherComponent } from './candidate/purchasevoucher/purchasevoucher.component';
import { SettingsComponent } from './candidate/settings/settings.component';

import { WallettransactionComponent } from './candidate/wallettransaction/wallettransaction.component';
import { LabusagesComponent } from './candidate/labusages/labusages.component';
import { ExerciseconsoleComponent } from './candidate/exerciseconsole/exerciseconsole.component';


import { ChatComponent } from './chat/chat.component';
import { TopologyComponent } from './candidate/topology/topology.component';
import { DisclaimerComponent } from './disclaimer/disclaimer.component';
import { OurteamComponent } from './ourteam/ourteam.component';
import { TeamprofileComponent } from './teamprofile/teamprofile.component';
import { ExcercisecomComponent } from './candidate/excercisecom/excercisecom.component';

import { ActivityComponent } from './candidate/activity/activity.component';
import { ChatListComponent } from './chat/chat-list/chat-list.component';
import { ConversationComponent } from './chat/conversation/conversation.component';

import { FilterPipe } from './modal/filter.pipe';
import { AllotmentstatusPipe } from './modal/allotmentstatus.pipe';
import { BuyvoucherComponent } from './candidate/buyvoucher/buyvoucher.component';
import { HomeComponent } from './home/home.component';
import { MitreComponent } from './mitre/mitre.component';
import { FaqsComponent } from './faqs/faqs.component';
import { KnowledgebaseComponent } from './knowledgebase/knowledgebase.component';
import { CalendarComponent } from './calendar/calendar.component';
import { UsertestimonialComponent } from './usertestimonial/usertestimonial.component';
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import {
  GoogleLoginProvider,
  FacebookLoginProvider
} from 'angularx-social-login';

@NgModule({
  declarations: [
    AppComponent,
    NgbdModalBasic,
    NgbdProgressbarConfig,
    LoginComponent,
    RegistrationComponent,
    CandidateComponent,
    ThankyouComponent,
    VerifyComponent,
    CandidateheaderComponent,
    CandidatefooterComponent,
    CandidateprofileComponent,
    ProfileComponent,
    BasketComponent,
    ExercisedescriptionComponent,
    UserexercisesComponent,
    ContactusComponent,
    ForgotpasswordComponent,
    ResetpasswordComponent,
    ExerciserepositoryComponent,
    VoucherComponent,
    PurchasevoucherComponent,
    SettingsComponent,
    WallettransactionComponent,
    LabusagesComponent,
    ExerciseconsoleComponent,
    ExerciseconsoleComponent,
    TopologyComponent,
    ChatComponent, 
    DisclaimerComponent, 
    OurteamComponent, 
    TeamprofileComponent, 
    ExcercisecomComponent,
    ActivityComponent,
    ChatListComponent, 
    ConversationComponent,
    FilterPipe,
    AllotmentstatusPipe,
    BuyvoucherComponent,
    HomeComponent,
    MitreComponent,
    FaqsComponent,
    KnowledgebaseComponent,
    CalendarComponent,
    UsertestimonialComponent,
    
  ],
  imports: [
    BrowserModule,
    SharedModule,
    AdminModule,
    AppRoutingModule,
    RouterModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    DataTablesModule,
    ImageCropperModule,
    RecaptchaModule,
    BrowserAnimationsModule,   
    NgxSliderModule,
    HttpClientModule, 
    CarouselModule,
    FlatpickrModule,
    ToastrModule.forRoot({
      closeButton:true,
      tapToDismiss:true,
      disableTimeOut:true,
      preventDuplicates: true,
      autoDismiss: true,
    }),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }), 
    SocialLoginModule,
    
  ],
  providers: [{
    provide: 'SocialAuthServiceConfig',
    useValue: {
      autoLogin: false,
      
      providers: [
        {
          id: GoogleLoginProvider.PROVIDER_ID,
          provider: new GoogleLoginProvider(
            '265501000713-9p2upkdrospespves1ec6tggsu161sdt.apps.googleusercontent.com'
          )
        },
        {
          id: FacebookLoginProvider.PROVIDER_ID,
          provider: new FacebookLoginProvider('335286974136999')
        }
      ]
    } as SocialAuthServiceConfig,


  },httpInterceptorProviders,LoginService ,DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
