import { Component, OnInit } from '@angular/core';
import { FormGroup,  FormBuilder, FormControl, Validators  } from '@angular/forms';
import { FrontenddbService } from '../../services/frontenddb.service';
import { LoginService } from '../../services/login.service';
import { BackenddbService } from '../../services/backenddb.service';
import { Subject } from 'rxjs';

import { ChatService } from '../../services/chat.service';

import { Router, ActivatedRoute } from '@angular/router';
import {noWhitespaceValidator} from '../../helper/validatefun';
import { faBars } from '@fortawesome/free-solid-svg-icons'; 

import { DatapassService } from '../../services/datapass.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {
  viewProfile : Subject<any> = new Subject<any>();

  faBars = faBars;

	public _opened: boolean = true; 
	public _toggleSidebar() {
		this._opened = !this._opened;
	} 
  subscription: Subscription;
  error: string;
  teamTypeList = [];
  instructorList = [];
  statusList = [];
  formdata: FormGroup;
  submitted: boolean = false;
  update_by:string;
  group_id:string;
  team_id:string;
  form_title:any = 'Add New Team';
  dashboard_url:string;


  /*  team details */
  team_name:string = "";
  team_instructor_name:string = "";
  team_created_by:string = "";
  team_instructor_id:string = "";
  team_created_by_id:string = "";
  team_create_datetime:string = "";
  team_last_datetime:string = "";


  /*breadcrumbs array */
  current_url_array = [];

  /* alert message */
  closed: boolean = true;
  alertMessage: string;
  alertClass: string;

  /* flash message */
  messageArray = {  
    type: "",  
    message: "",  
  }; 
  stringifiedData: any; 
  msgalert:any;

  error_messages = {
    'team_type': [
      { type: 'required', message: 'Team Type is required' },
    ],  
    'instructor': [
      { type: 'required', message: 'Instructor is required' },
    ],  
    'status': [
      { type: 'required', message: 'Status is required' },
    ],
    'team_name': [
      { type: 'required', message: 'Team Name is required' },
    ],
  }
  
  server_url:string;
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private loginService: LoginService,
    private FrontenddbService: FrontenddbService,
    private BackenddbService: BackenddbService,
    private formBuilder: FormBuilder,
    private ChatService :ChatService,
    private ds: DatapassService
    
  ) { 

     this.getFlashMessage();
	 
	 this.server_url = this.loginService.getServerUrl();

     this.dashboard_url = this.loginService.getDashboardUrl();
     this.group_id = this.loginService.getLoginGroup();
     this.update_by = this.loginService.getUserId();

     /* get user status list from CI */   
         if(this.group_id=='1')
         {
            this.BackenddbService.getInstuctorList().subscribe((data:any) => {
                this.instructorList = Array.from(Object.keys(data), k=>data[k]);
            });  
         }else if(this.group_id=='2')
         {
            /* Here get roles of instructor */
            const formData = new FormData();
            formData.append('instructor_id', this.update_by);    //login instructor id
            this.BackenddbService.getRoles(formData).subscribe(
              res => {
                //console.log(res);
                if(res == null || res.create_team=="false")  // check instrutor have create team role
                {
                   this.setFlashMessage('danger',"Sorry! you don't have permission to create or edit team.");
                   this.router.navigate([this.dashboard_url+'team-list/']);
                   return true;
                }
              });

            formData.append('user_id', this.update_by);    //login instructor id
            this.BackenddbService.getCurrentInstuctorList(formData).subscribe((data:any) => {
              this.instructorList = Array.from(Object.keys(data), k=>data[k]);
              this.formdata.patchValue({
                instructor: this.update_by,
             });
          }
          );  
           
         }

        /* here get status list form db */
         this.BackenddbService.getStatusList().subscribe((data:any) => {
          this.statusList = Array.from(Object.keys(data), k=>data[k]);
         });  

        /* here get team type list form db */
         this.BackenddbService.getTeamTypeList('Active').subscribe((data:any) => {
          this.teamTypeList = Array.from(Object.keys(data), k=>data[k]);
         });          
         
         

  }

  ngOnInit() {

    this.preloadData();

    this.team_id = this.route.snapshot.paramMap.get('id');

    const formData = new FormData();
    formData.append('team_id', this.team_id);
    formData.append('update_by', this.update_by);
    if(this.team_id!=null)
    {
		this.current_url_array = [
        {'slug':"team-list",'label':'Team List'},
        {'slug':"",'label':'Edit Team'}
      ];
	  
      this.form_title = "Edit Team";
      this.ds.Loader(true);

      this.BackenddbService.getTeam(formData).subscribe(
        res => {
         //console.log(res);
         if(res==null)
         {
          this.router.navigate([this.dashboard_url+'team-list/']);
          return true;
         }

         if(this.group_id=='2' && res.team_assign_instructor!=this.update_by)
         {
            this.setFlashMessage('danger',"Sorry you don't have permission to edit this team.");
            this.router.navigate([this.dashboard_url+'team-list/']);
         }

        // this.team_name = res.team_name // for team assign model in show team name
          this.formdata.patchValue({
               instructor: res.team_assign_instructor,
               status: res.team_status,
               team_type: res.team_type_id,
               team_name: res.team_name,
               team_limit_allocated: res.team_limit_allocated
          });

          this.team_name = res.team_name;

          const formData = new FormData();
          formData.append('user_id', res.team_assign_instructor);
          this.BackenddbService.getAddressBook(formData).subscribe(
            res => {
              this.team_instructor_name = res.F_Name+" "+res.L_Name;
            });
  
            formData.append('user_id', res.team_created_by);
            this.BackenddbService.getAddressBook(formData).subscribe(
              res => {
                this.team_created_by = res.F_Name+" "+res.L_Name;
                this.ds.Loader(false);
              });      
              
          this.team_instructor_id = res.team_assign_instructor;
          this.team_created_by_id = res.team_created_by;

          this.team_create_datetime = res.team_create_datetime;
          this.team_last_datetime = res.team_datetime;
        }
      );     

    }
	else
	{
		this.current_url_array = [{'slug':"",'label':'Add New Team'}];
  }
	

    /* set form validation */ 
      this.formdata = this.formBuilder.group({
        team_type: ['', [Validators.required,noWhitespaceValidator]],
        team_id:'',
        instructor: [''],
        status: ['', [Validators.required,noWhitespaceValidator]],
        team_name: ['', [Validators.required,noWhitespaceValidator]],
        team_limit_allocated: [''],
    });
  }

  loadData()
  {
      var array = ['checkClaim',''];
      this.ds.sendData(array);
      this.subscription = this.ds.getData().subscribe(x => { 
        if(x[0]=='set_permission')
        {
          this.set_permission(x[1]);
        }
    });
  }
  
  addNewTeam(formData:any)
  {
    this.BackenddbService.addNewTeam(formData).subscribe(
      res => {
          this.ds.Loader(false);
          this.closed = false;
          console.log(res)
          if(res.status == 'success')
          {
            this.formdata.patchValue({
              team_id :res.insert_team_id
            });
            this.ChatService.addTeam(this.formdata.value);
            this.setFlashMessage('primary',res.message);
            this.router.navigate([this.dashboard_url+'team/'+res.insert_team_id]);
          }else if(res.status === 'error')
          {
            this.alertMessage = res.message;
            this.alertClass = 'danger'; 
          }
      },
      error => this.error = error
    )
  }

  updateTeam(formData:any)
  {
    this.BackenddbService.UpdateTeam(formData).subscribe(
      res => {
           this.ds.Loader(false);
           this.closed = false;
           this.alertMessage = res.message;
          if(res.status == 'success')
          {
            this.alertClass = 'primary'; 
          }else if(res.status === 'error')
          {
            this.alertClass = 'danger'; 
          }
      },
      error => this.error = error
    )

  }

  onSubmit(data:any) {

    this.submitted = true;
  
      if (this.formdata.valid) {
          const formData = new FormData();
          this.closed = true;
          this.ds.Loader(true);
          formData.append('team_id', this.team_id);
          formData.append('update_by', this.update_by);
          formData.append('update_by_group', this.group_id);
          
          formData.append('team_type', data.team_type);
          formData.append('instructor', data.instructor);
          formData.append('status', data.status);
          formData.append('team_name', data.team_name);
          formData.append('team_limit_allocated', data.team_limit_allocated);

          /* check if user_id null then insert new user */
          if(this.team_id==null)  
          {
            this.addNewTeam(formData);  /*insert new user*/
          }else
          { 
            this.updateTeam(formData);  /*update existing user*/
          }
        
      } else {
        this.validateAllFormFields(this.formdata);
      }
    
  }
 
 get f() { return this.formdata.controls; }
 
  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }
   
  setFlashMessage(type:any,message:any)
  {
    this.messageArray.type = type;
    this.messageArray.message = message;
    this.stringifiedData = JSON.stringify(this.messageArray);   
    this.loginService.setflashMessage(this.stringifiedData);
  }

  getFlashMessage()
  {
    this.msgalert = this.loginService.getflashMessage();
    if (typeof this.msgalert.type != "undefined")
    {
      this.alertClass = this.msgalert.type;
      this.alertMessage = this.msgalert.message;
      this.closed = false;
    }
  }
  preloadData()
  {
     this.ds.sendData('get_permission');
  }
  set_permission(data:any)
  {
     if(data.permission.create_team=='Denied')
     {
         this.router.navigate([this.dashboard_url+'dashboard']);
     }
  }

  viewUserProfile(user_id:any)
  {
    this.viewProfile.next(user_id);
  }

  

}
