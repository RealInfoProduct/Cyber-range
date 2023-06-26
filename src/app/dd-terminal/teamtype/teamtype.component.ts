import { Component, OnInit } from '@angular/core';
import { FormGroup,  FormBuilder, FormControl, Validators  } from '@angular/forms';
import { FrontenddbService } from '../../services/frontenddb.service';
import { LoginService } from '../../services/login.service';
import { BackenddbService } from '../../services/backenddb.service';
import { Router, ActivatedRoute } from '@angular/router';
import {noWhitespaceValidator} from '../../helper/validatefun';
import { faBars } from '@fortawesome/free-solid-svg-icons';

import { DatapassService } from '../../services/datapass.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-teamtype',
  templateUrl: './teamtype.component.html',
  styleUrls: ['./teamtype.component.css']
})
export class TeamtypeComponent implements OnInit {
  subscription: Subscription;
  faBars = faBars;

	public _opened: boolean = true; 
	public _toggleSidebar() {
		this._opened = !this._opened;
	} 
	 
  error: string;
  closed: boolean = true;
  checkMail: boolean = true;
  alertMessage: string;
  alertClass: string;
  teamTypeList = [];
  instructorList = [];
  statusList = [];
  formdata: FormGroup;
  submitted: boolean = false;
  update_by:string;
  group_id:string;
  team_type_id:string;
  messageArray = {  
    type: "",  
    message: "",  
  }; 
  stringifiedData: any; 
  msgalert:any;
  form_title:any = 'Add New Team Type';
  dashboard_url:string;  
  
  /*breadcrumbs array */
  current_url_array = [];

  error_messages = {
    'team_type': [
      { type: 'required', message: 'Team Type is required' },
    ],  
    'instructor': [
      { type: 'required', message: 'Instructor is required' },
    ],  
    'status': [
      { type: 'required', message: 'Status is required' },
    ]
  }
  
  server_url:string;
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private loginService: LoginService,
    private FrontenddbService: FrontenddbService,
    private BackenddbService: BackenddbService,
    private formBuilder: FormBuilder,
    private ds: DatapassService    
  ) { 
		this.getFlashMessage();

		this.dashboard_url = this.loginService.getDashboardUrl();

		this.team_type_id = this.route.snapshot.paramMap.get('id');
		this.update_by = this.loginService.getUserId();
		this.group_id = this.loginService.getLoginGroup();
		
		this.server_url = this.loginService.getServerUrl();

         /* get user status list from CI */  
         if(this.group_id=='1')
         {
            this.BackenddbService.getInstuctorList().subscribe((data:any) => {
                this.instructorList = Array.from(Object.keys(data), k=>data[k]);
            });  
         }else if(this.group_id=='2')
         {
            const formData = new FormData();
            formData.append('user_id', this.update_by);    //login instructor id
            this.BackenddbService.getCurrentInstuctorList(formData).subscribe((data:any) => {
              this.instructorList = Array.from(Object.keys(data), k=>data[k]);
              this.formdata.patchValue({
                instructor: this.update_by,
           });
          });  
           
         }
         this.BackenddbService.getStatusList().subscribe((data:any) => {
          this.statusList = Array.from(Object.keys(data), k=>data[k]);
         });  
         status='Active'; 
         this.BackenddbService.getTeamTypeList(status).subscribe((data:any) => {
          this.teamTypeList = Array.from(Object.keys(data), k=>data[k]);
         });          
         
         

  }

  ngOnInit() {

    this.subscription = this.ds.getData().subscribe(x => { 
      if(x[0]=='set_permission')
      {
        this.set_permission(x[1]);
      }
  });

    const formData = new FormData();
    formData.append('team_type_id', this.team_type_id);
    formData.append('update_by', this.update_by);
   
    if(this.team_type_id!=null)
    {
		this.current_url_array = [
        {'slug':"team-type-list",'label':'Team Type List'},
        {'slug':"",'label':'Edit Team Type'}
      ];
	  
      this.form_title = "Edit Team Type";
      this.ds.Loader(true);
      this.BackenddbService.getTeamType(formData).subscribe(
        res => {
          this.ds.Loader(false);
          if(res==null)
          {
           this.router.navigate([this.dashboard_url+'team-type-list/']);
           return true;
          }

          if(this.group_id=='2' && res.assign_instructor!=this.update_by)
          {
             this.setFlashMessage('danger',"Sorry you don't have permission to edit this team type.");
             this.router.navigate([this.dashboard_url+'team-type-list/']);
          }
           
          // for team assign model in show team name
          this.formdata.patchValue({
               instructor: res.assign_instructor,
               status: res.status,
               team_type: res.team_type,
          });
        }
      );     

    }
	else
	{
		this.current_url_array = [{'slug':"",'label':'Add New Team Type'}];
    }

    /* set form validation */ 
      this.formdata = this.formBuilder.group({
        instructor: [''],
        status: ['', [Validators.required,noWhitespaceValidator]],
        team_type: [null, [Validators.required,noWhitespaceValidator]],
    });

  

  }
  
  addNewTeamType(formData:any)
  {
    this.BackenddbService.addNewTeamType(formData).subscribe(
      res => {
          this.ds.Loader(false);
          this.closed = false;
          if(res.status == 'success')
          {
            this.setFlashMessage('primary',res.message);
            this.router.navigate([this.dashboard_url+'team-type/'+res.insert_team_type_id]);
          }else if(res.status === 'error')
          {
            this.alertClass = 'danger'; 
            this.alertMessage = res.message;
          }
      },
      error => this.error = error
    )
  }

  updateTeamType(formData:any)
  {
    this.BackenddbService.updateTeamType(formData).subscribe(
      res => {
           this.ds.Loader(false);
           this.alertMessage = res.message;
           this.closed = false;
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
          formData.append('team_type_id', this.team_type_id);
          formData.append('update_by', this.update_by);
          formData.append('update_by_group', this.group_id);
          formData.append('instructor', data.instructor);
          formData.append('status', data.status);
          formData.append('team_type', data.team_type);

          /* check if user_id null then insert new user */
          if(this.team_type_id==null)  
          {
            this.addNewTeamType(formData);  /*insert new user*/
          }else
          { 
            this.updateTeamType(formData);  /*update existing user*/
          }
        
      } else {
        this.validateAllFormFields(this.formdata);
      }
    
  }

  
 get f() { return this.formdata.controls; }

 
  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      //console.log(field);
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
      if(typeof data.create_exercise != 'undefined' && data.create_team=='false')
      {
         this.router.navigate([this.dashboard_url+'dashboard']);
      }
  }
}
