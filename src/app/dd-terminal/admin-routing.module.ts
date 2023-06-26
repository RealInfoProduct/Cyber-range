import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth.guard';

import { AdminComponent } from './admin/admin.component';
import { DdTerminalComponent } from './dd-terminal.component'; 
import { InstructorComponent } from '../dd-instructor/instructor/instructor.component';

import { UserlistComponent } from '../dd-terminal/userlist/userlist.component'; 
import { UserprofileComponent } from '../dd-terminal/userprofile/userprofile.component'; 
import { TeamComponent } from '../dd-terminal/team/team.component';
import { TeamlistComponent } from '../dd-terminal/teamlist/teamlist.component';
import { TeamtypeComponent } from '../dd-terminal/teamtype/teamtype.component';
import { TeamtypelistComponent } from '../dd-terminal/teamtypelist/teamtypelist.component';
import { ResourceComponent } from '../dd-terminal/resource/resource.component';
import { ResourcelistComponent } from '../dd-terminal/resourcelist/resourcelist.component';
// import { RolesComponent } from '../dd-terminal/roles/roles.component';
// import { RoleslistComponent } from '../dd-terminal/roleslist/roleslist.component';
import { ExerciseComponent } from '../dd-terminal/exercise/exercise.component';
import { ExerciselistComponent } from '../dd-terminal/exerciselist/exerciselist.component';
import { AllotmentlistComponent } from '../dd-terminal/allotmentlist/allotmentlist.component';
import { EditexerciseComponent } from '../dd-terminal/editexercise/editexercise.component';
import { ManualComponent } from '../dd-terminal/manual/manual.component';
import { ManuallistComponent } from '../dd-terminal/manuallist/manuallist.component';
import { ChallengeComponent } from './challenge/challenge.component';
import { ChallengelistComponent } from './challengelist/challengelist.component';
import { ExerciseallotmentComponent } from '../dd-terminal/exerciseallotment/exerciseallotment.component';
import { EarningComponent } from '../dd-terminal/earning/earning.component';
import { ContentComponent } from '../dd-terminal/content/content.component';
import { PurchasevoucherlistComponent } from '../dd-terminal/purchasevoucherlist/purchasevoucherlist.component';
import { WallettransitionlistComponent } from '../dd-terminal/wallettransitionlist/wallettransitionlist.component';
import { PackagelistComponent } from '../dd-terminal/packagelist/packagelist.component';
import { PackageComponent } from '../dd-terminal/package/package.component';
import { DemorequestlistComponent } from '../dd-terminal/demorequestlist/demorequestlist.component';
import { GeneralsettingsComponent } from '../dd-terminal/generalsettings/generalsettings.component';
import { PermissionComponent } from '../dd-terminal/permission/permission.component';
import { ReferencelistComponent } from '../dd-terminal/referencelist/referencelist.component';
import { VoucherlistComponent } from '../dd-terminal/voucherlist/voucherlist.component';
import { ArchivelistComponent } from '../dd-terminal/archivelist/archivelist.component';
import { ClaimlistComponent } from '../dd-terminal/claimlist/claimlist.component';
import { ResrequestComponent } from '../dd-terminal/resrequest/resrequest.component';

const routes: Routes =[
  {
    path: 'dd-terminal',
    component: AdminComponent,
    children: [
      {
      path: '',
      children: [
   {path:"dashboard", component:DdTerminalComponent, canActivate: [AuthGuard],data:{role: 'ADMIN'}},
   {path:"users-list/:group_id", component:UserlistComponent, canActivate: [AuthGuard],data:{role: 'ADMIN'}},
   {path:"users-list", component:UserlistComponent, canActivate: [AuthGuard],data:{role: 'ADMIN'}},
   {path:"user-profile/:id", component:UserprofileComponent, canActivate: [AuthGuard],data:{role: 'ADMIN'}},
   {path:"user-profile", component:UserprofileComponent, canActivate: [AuthGuard],data:{role: 'ADMIN'}},
   {path:"team/:id", component:TeamComponent, canActivate: [AuthGuard],data:{role: 'ADMIN'}},
   {path:"team", component:TeamComponent, canActivate: [AuthGuard],data:{role: 'ADMIN'}},
   {path:"team-list", component:TeamlistComponent, canActivate: [AuthGuard],data:{role: 'ADMIN'}},
   {path:"team-type/:id", component:TeamtypeComponent, canActivate: [AuthGuard],data:{role: 'ADMIN'}},
   {path:"team-type", component:TeamtypeComponent, canActivate: [AuthGuard],data:{role: 'ADMIN'}},
   {path:"team-type-list", component:TeamtypelistComponent, canActivate: [AuthGuard],data:{role: 'ADMIN'}},
   {path:"resource/:id", component:ResourceComponent, canActivate: [AuthGuard],data:{role: 'ADMIN'}},
   {path:"resource", component:ResourceComponent, canActivate: [AuthGuard],data:{role: 'ADMIN'}},
   {path:"resource-list", component:ResourcelistComponent, canActivate: [AuthGuard],data:{role: 'ADMIN'}},
   {path:"exercise/:id", component:ExerciseComponent, canActivate: [AuthGuard],data:{role: 'ADMIN'}},
   {path:"exercise", component:ExerciseComponent, canActivate: [AuthGuard],data:{role: 'ADMIN'}},
   {path:"exercise-list", component:ExerciselistComponent, canActivate: [AuthGuard],data:{role: 'ADMIN'}},
   {path:"allotment-list/:id", component:AllotmentlistComponent, canActivate: [AuthGuard],data:{role: 'ADMIN'}},
   {path:"allotment-list", component:AllotmentlistComponent, canActivate: [AuthGuard],data:{role: 'ADMIN'}},
   {path:"edit-exercise/:id", component:EditexerciseComponent, canActivate: [AuthGuard],data:{role: 'ADMIN'}},   
   {path:"challenge", component:ChallengeComponent, canActivate: [AuthGuard],data:{role: 'ADMIN'}},
   {path:"challenge/:id", component:ChallengeComponent, canActivate: [AuthGuard],data:{role: 'ADMIN'}},
   {path:"challenge-list", component:ChallengelistComponent, canActivate: [AuthGuard],data:{role: 'ADMIN'}},
   {path:"manual", component:ManualComponent, canActivate: [AuthGuard],data:{role: 'ADMIN'}},
   {path:"manual/:id", component:ManualComponent, canActivate: [AuthGuard],data:{role: 'ADMIN'}},
   {path:"manual-list", component:ManuallistComponent, canActivate: [AuthGuard],data:{role: 'ADMIN'}},
   {path:"exercise-allotment", component:ExerciseallotmentComponent, canActivate: [AuthGuard],data:{role: 'ADMIN'}},
   {path:"exercise-allotment/:id", component:ExerciseallotmentComponent, canActivate: [AuthGuard],data:{role: 'ADMIN'}},
   {path:"dd-terminal/earning", component:EarningComponent, canActivate: [AuthGuard],data:{role: 'ADMIN'}},
   {path:"content", component:ContentComponent, canActivate: [AuthGuard],data:{role: 'ADMIN'}},
   {path:"content/:id", component:ContentComponent, canActivate: [AuthGuard],data:{role: 'ADMIN'}},
   {path:"content/:id/:content_id", component:ContentComponent, canActivate: [AuthGuard],data:{role: 'ADMIN'}},
   {path:"purchase-voucher-list", component:PurchasevoucherlistComponent, canActivate: [AuthGuard],data:{role: 'ADMIN'}},
   {path:"wallet-transition-list", component:WallettransitionlistComponent, canActivate: [AuthGuard],data:{role: 'ADMIN'}},
   {path:"package-list", component:PackagelistComponent, canActivate: [AuthGuard],data:{role: 'ADMIN'}},
   {path:"package", component:PackageComponent, canActivate: [AuthGuard],data:{role: 'ADMIN'}},
   {path:"package/:id", component:PackageComponent, canActivate: [AuthGuard],data:{role: 'ADMIN'}},
   {path:"demo-request-list", component:DemorequestlistComponent, canActivate: [AuthGuard],data:{role: 'ADMIN'}},
   {path:"general-setting", component:GeneralsettingsComponent, canActivate: [AuthGuard],data:{role: 'ADMIN'}},
   {path:"permission/:id", component:PermissionComponent, canActivate: [AuthGuard],data:{role: 'ADMIN'}},
   {path:"reference-list", component:ReferencelistComponent, canActivate: [AuthGuard],data:{role: 'ADMIN'}},
   {path:"voucher-list", component:VoucherlistComponent, canActivate: [AuthGuard],data:{role: 'ADMIN'}},
   {path:"archive-list", component:ArchivelistComponent, canActivate: [AuthGuard],data:{role: 'ADMIN'}},
   {path:"claim-list/:id", component:ClaimlistComponent, canActivate: [AuthGuard],data:{role: 'ADMIN'}},
   {path:"claim-list", component:ClaimlistComponent, canActivate: [AuthGuard],data:{role: 'ADMIN'}},
   {path:"resource-req-list/:id", component:ResrequestComponent, canActivate: [AuthGuard],data:{role: 'ADMIN'}},
   {path:"resource-req-list", component:ResrequestComponent, canActivate: [AuthGuard],data:{role: 'ADMIN'}},
  ],
}
]
},
{
  path: 'dd-instructor',
  component: AdminComponent,
  children: [
    {
    path: '',
    children: [
      {path:"dashboard", component:InstructorComponent,canActivate: [AuthGuard],data:{role: 'INSTRUCTOR'}},
      {path:"team/:id", component:TeamComponent,canActivate: [AuthGuard],data:{role: 'INSTRUCTOR'}},
      {path:"team", component:TeamComponent,canActivate: [AuthGuard],data:{role: 'INSTRUCTOR'}},
      {path:"team-list", component:TeamlistComponent,canActivate: [AuthGuard],data:{role: 'INSTRUCTOR'}},
      {path:"team-type/:id", component:TeamtypeComponent,canActivate: [AuthGuard],data:{role: 'INSTRUCTOR'}},
      {path:"team-type", component:TeamtypeComponent,canActivate: [AuthGuard],data:{role: 'INSTRUCTOR'}},
      {path:"team-type-list", component:TeamtypelistComponent,canActivate: [AuthGuard],data:{role: 'INSTRUCTOR'}},
      {path:"user-profile/:id", component:UserprofileComponent, canActivate: [AuthGuard],data:{role: 'INSTRUCTOR'}},
      {path:"user-profile", component:UserprofileComponent, canActivate: [AuthGuard],data:{role: 'INSTRUCTOR'}},
      {path:"exercise", component:ExerciseComponent, canActivate: [AuthGuard],data:{role: 'INSTRUCTOR'}},
      {path:"exercise-list", component:ExerciselistComponent, canActivate: [AuthGuard],data:{role: 'INSTRUCTOR'}},
      {path:"edit-exercise/:id", component:EditexerciseComponent, canActivate: [AuthGuard],data:{role: 'INSTRUCTOR'}},   
      {path:"allotment-list/:id", component:AllotmentlistComponent, canActivate: [AuthGuard],data:{role: 'INSTRUCTOR'}},
      {path:"allotment-list", component:AllotmentlistComponent, canActivate: [AuthGuard],data:{role: 'INSTRUCTOR'}},
      {path:"exercise-allotment", component:ExerciseallotmentComponent, canActivate: [AuthGuard],data:{role: 'INSTRUCTOR'}},
      {path:"exercise-allotment/:id", component:ExerciseallotmentComponent, canActivate: [AuthGuard],data:{role: 'INSTRUCTOR'}},
      {path:"manual", component:ManualComponent, canActivate: [AuthGuard],data:{role: 'INSTRUCTOR'}},
      {path:"manual/:id", component:ManualComponent, canActivate: [AuthGuard],data:{role: 'INSTRUCTOR'}},
      {path:"manual-list", component:ManuallistComponent, canActivate: [AuthGuard],data:{role: 'INSTRUCTOR'}},
      {path:"content", component:ContentComponent, canActivate: [AuthGuard],data:{role: 'INSTRUCTOR'}},
      {path:"content/:id/:content_id", component:ContentComponent, canActivate: [AuthGuard],data:{role: 'INSTRUCTOR'}},
      {path:"content/:id", component:ContentComponent, canActivate: [AuthGuard],data:{role: 'INSTRUCTOR'}},      
      {path:"package-list", component:PackagelistComponent, canActivate: [AuthGuard],data:{role: 'INSTRUCTOR'}},
      {path:"package", component:PackageComponent, canActivate: [AuthGuard],data:{role: 'INSTRUCTOR'}},
      {path:"package/:id", component:PackageComponent, canActivate: [AuthGuard],data:{role: 'INSTRUCTOR'}},
      {path:"reference-list", component:ReferencelistComponent, canActivate: [AuthGuard],data:{role: 'INSTRUCTOR'}},
      {path:"users-list", component:UserlistComponent, canActivate: [AuthGuard],data:{role: 'INSTRUCTOR'}},
      {path:"claim-list/:id", component:ClaimlistComponent, canActivate: [AuthGuard],data:{role: 'INSTRUCTOR'}},
      {path:"claim-list", component:ClaimlistComponent, canActivate: [AuthGuard],data:{role: 'INSTRUCTOR'}},
      {path:"resource-req-list/:id", component:ResrequestComponent, canActivate: [AuthGuard],data:{role: 'INSTRUCTOR'}},
      {path:"resource-req-list", component:ResrequestComponent, canActivate: [AuthGuard],data:{role: 'INSTRUCTOR'}},
    ],
}
]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
