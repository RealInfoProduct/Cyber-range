import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth.guard';

//frontend start
import { LoginComponent } from './login/login.component'; 
import { ContactusComponent } from './contactus/contactus.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { RegistrationComponent } from './registration/registration.component'; 
import { ThankyouComponent } from './registration/thankyou/thankyou.component'; 
import { VerifyComponent } from './registration/verify/verify.component'; 
import { CandidateComponent } from './candidate/candidate.component'; 
import { ExerciserepositoryComponent } from './candidate/exerciserepository/exerciserepository.component'; 
import { ProfileComponent } from './profile/profile.component'; 
import { BasketComponent } from './candidate/basket/basket.component';
import { ActivityComponent } from './candidate/activity/activity.component';
import { ExercisedescriptionComponent } from './candidate/exercisedescription/exercisedescription.component';
import { UserexercisesComponent } from './candidate/userexercises/userexercises.component';
import { VoucherComponent } from './candidate/voucher/voucher.component';
import { PurchasevoucherComponent } from './candidate/purchasevoucher/purchasevoucher.component';
import { BuyvoucherComponent } from './candidate/buyvoucher/buyvoucher.component';
import { SettingsComponent } from './candidate/settings/settings.component';
import { WallettransactionComponent } from './candidate/wallettransaction/wallettransaction.component';
import { LabusagesComponent } from './candidate/labusages/labusages.component';
import { ExerciseconsoleComponent } from './candidate/exerciseconsole/exerciseconsole.component';
import { TopologyComponent } from './candidate/topology/topology.component';
import { DisclaimerComponent } from './disclaimer/disclaimer.component';
import { OurteamComponent } from './ourteam/ourteam.component';
import { TeamprofileComponent } from './teamprofile/teamprofile.component';
import { MitreComponent } from './mitre/mitre.component';
import { FaqsComponent } from './faqs/faqs.component';
import { KnowledgebaseComponent } from './knowledgebase/knowledgebase.component';
import { CalendarComponent } from './calendar/calendar.component';
import { UsertestimonialComponent } from './usertestimonial/usertestimonial.component';

//frontend end



//instructor start
//import { InstructorComponent } from './dd-instructor/instructor/instructor.component';
//instructor end

import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

import { HomeComponent } from './home/home.component';

const routes: Routes = [
   //{path:"", component:HomeComponent,canActivate: [AuthGuard],data:{role: 'CHECK'}},
   {path:"", component:HomeComponent,canActivate: [AuthGuard],data:{role: 'CHECK'}},
   {path:"login", component:LoginComponent,canActivate: [AuthGuard],data:{role: 'CHECK'}},
   {path:"home", component:HomeComponent,canActivate: [AuthGuard],data:{role: 'CHECK'}},
   {path:"my-calendar", component:CalendarComponent,canActivate: [AuthGuard],data:{role: 'CHECK_LOGIN'}},

   // frontend start
   {path:"contact-us", component:ContactusComponent,canActivate: [AuthGuard],data:{role: 'CHECK'}},
   {path:"FAQs", component:FaqsComponent,canActivate: [AuthGuard],data:{role: 'CHECK'}},
   {path:"knowledge-base", component:KnowledgebaseComponent,canActivate: [AuthGuard],data:{role: 'CHECK'}},
   {path:"users-testimonial", component:UsertestimonialComponent,canActivate: [AuthGuard],data:{role: 'CHECK'}},
   
   
   {path:"forgot-password", component:ForgotpasswordComponent,canActivate: [AuthGuard],data:{role: 'CHECK'}},
   {path:"reset-password/:token", component:ResetpasswordComponent,canActivate: [AuthGuard],data:{role: 'CHECK'}},
   {path:"registration/thank-you", component:ThankyouComponent,canActivate: [AuthGuard],data:{role: 'CHECK'}},
   {path:"registration/verify", component:VerifyComponent,canActivate: [AuthGuard],data:{role: 'CHECK'}},
   {path:"registration/:id", component:RegistrationComponent,canActivate: [AuthGuard],data:{role: 'CHECK'}},
   {path:"registration", component:RegistrationComponent,canActivate: [AuthGuard],data:{role: 'CHECK'}},
    {path:"candidate", component:CandidateComponent,canActivate: [AuthGuard],data:{role: 'CHECK'}},
   {path:"exercise-repository", component:ExerciserepositoryComponent,canActivate: [AuthGuard],data:{role: 'CHECK'}},
   {path:"exercise-description/:alias", component:ExercisedescriptionComponent,canActivate: [AuthGuard],data:{role: 'CHECK'}},
   
   {path:"profile", component:ProfileComponent,canActivate: [AuthGuard],data:{role: 'USER'}},
   {path:"basket", component:BasketComponent,canActivate: [AuthGuard],data:{role: 'USER'}},
   {path:"user-exercises", component:UserexercisesComponent,canActivate: [AuthGuard],data:{role: 'USER'}},
   {path:"voucher", component:VoucherComponent,canActivate: [AuthGuard],data:{role: 'CHECK_LOGIN'}},
   {path:"my-voucher", component:PurchasevoucherComponent,canActivate: [AuthGuard],data:{role: 'CHECK_LOGIN'}},
   {path:"my-voucher/:id", component:PurchasevoucherComponent,canActivate: [AuthGuard],data:{role: 'CHECK_LOGIN'}},

   {path:"buy-voucher/:id", component:BuyvoucherComponent,canActivate: [AuthGuard],data:{role: 'CHECK'}},
   {path:"topology/:id", component:TopologyComponent,canActivate: [AuthGuard],data:{role: 'USER'}},
   
   {path:"settings", component:SettingsComponent,canActivate: [AuthGuard],data:{role: 'CHECK'}},
   {path:"my-transactions", component:WallettransactionComponent,canActivate: [AuthGuard],data:{role: 'CHECK_LOGIN'}},
   {path:"my-transactions/:id", component:WallettransactionComponent,canActivate: [AuthGuard],data:{role: 'CHECK_LOGIN'}},

   {path:"my-activity", component:ActivityComponent,canActivate: [AuthGuard],data:{role: 'USER'}},
   {path:"my-exercises-stats", component:LabusagesComponent,canActivate: [AuthGuard],data:{role: 'CHECK'}},
   {path:"exercise-console/:id/:extraid", component:ExerciseconsoleComponent,canActivate: [AuthGuard],data:{role: 'CHECK'}},
   
   {path:"disclaimer", component:DisclaimerComponent,canActivate: [AuthGuard],data:{role: 'CHECK'}},
   {path:"team", component:OurteamComponent,canActivate: [AuthGuard],data:{role: 'CHECK'}},
   {path:"team-profile/:id", component:TeamprofileComponent,canActivate: [AuthGuard],data:{role: 'CHECK'}},  
   {path:"mitre/:id", component:MitreComponent,canActivate: [AuthGuard],data:{role: 'CHECK'}},
   {path:"mitre", component:MitreComponent,canActivate: [AuthGuard],data:{role: 'CHECK'}},

   //backend start
   {path: 'dd-terminal', redirectTo: '', pathMatch: 'full'},
   {path: 'dd-instructor', redirectTo: 'dd-terminal', pathMatch: 'full'},
   {path: '**', component: PageNotFoundComponent}
];
@NgModule({
   imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })], 
   exports: [RouterModule] 
})
export class AppRoutingModule { } //export const 
//RoutingComponent = [DdTerminalComponent];
