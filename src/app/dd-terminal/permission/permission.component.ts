import { Component, OnInit,OnDestroy,ViewChild,TemplateRef } from '@angular/core';
import { HttpClient,HttpParams  } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BackenddbService } from '../../services/backenddb.service';
import { LoginService } from '../../services/login.service';
import { DatapassService } from '../../services/datapass.service';
import { Subscription } from 'rxjs/Subscription';


import { Subject } from 'rxjs';

import { FormGroup,  FormBuilder, FormArray, FormControl, Validators  } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { faBars } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.css']
})
export class PermissionComponent implements OnInit {

	faBars = faBars;
	subscription: Subscription;

	/* Side Bar */
	public _opened: boolean = true; 
	public _toggleSidebar() {
		this._opened = !this._opened;
	}  	
	
	messageArray = {  
		type: "",  
		message: "",  
	  }; 
	  stringifiedData: any; 
	  msgalert:any;
	
	/*breadcrumbs array */
	current_url_array = [];
	form_title:string = 'Permission';
	formdata: FormGroup;
	formUserData: FormGroup;
	group_id:string;
	id:string;
	server_url:string;
	dashboard_url:string;
	user_name:string;
	/* End breadcrumbs array */

	/* alert message */
	closed: boolean = true;
	alertMessage: string;
	alertClass: string;
	credit_system:string = 'Inactive';
	credit:string = '';   
	
	team:string = '';
	exercise:string = '';
	exe_bundle:string = '';
	allot_user:string = '';
	manual:string = '';
	chat:string = '';

	error_messages = {
		'create_team': [
		  { type: 'required', message: 'Create Team is required' },
		],  
		'create_exercise': [
		  { type: 'required', message: 'Create Exercise is required' },
		],
		'exercise_bundle': [
			{ type: 'required', message: 'Exercise Bundle is required' },
		  ],
		  'allocate_exe_user': [
			{ type: 'required', message: 'Allocate Exercise to User is required' },
		  ],
		  'create_manual': [
			{ type: 'required', message: 'Create Manual is required' },
		  ],
		  'chat': [
			{ type: 'required', message: 'Chat is required' },
		  ],
		  'edit_profile': [
			{ type: 'required', message: 'Edit Profile is required' },
		  ],
		  'enroll': [
			{ type: 'required', message: 'Enroll is required' },
		  ],
		  'access_exercise': [
			{ type: 'required', message: 'Access Exercise is required' },
		  ],  		  		
	  }
	
	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private loginService: LoginService,
		private BackenddbService: BackenddbService,
		private formBuilder: FormBuilder,
		private ds: DatapassService
	) {
		this.id = this.route.snapshot.paramMap.get('id');
		this.server_url = this.loginService.getServerUrl();
		this.dashboard_url = this.loginService.getDashboardUrl();
     }

	ngOnInit() {
		/*breadcrumbs array */
		this.current_url_array = [
			{'slug':"",'label':'Permission'}
		];
		/* End breadcrumbs array */	

		this.formdata = this.formBuilder.group({
			create_team: ['', [Validators.required]],
			create_exercise: ['', [Validators.required]],
			exercise_bundle: ['', [Validators.required]],
			allocate_exe_user: ['', [Validators.required]],
			create_manual: ['', [Validators.required]],
			chat: ['', [Validators.required]],
			});

		this.formUserData = this.formBuilder.group({
			edit_profile: ['', [Validators.required]],
			enroll: ['', [Validators.required]],
			access_exercise: ['', [Validators.required]],
			chat: ['', [Validators.required]]
			});

		this.loadData();
        this.getUser();
	}

	ngOnDestroy(): void {
		this.subscription.unsubscribe();
	}

	loadData()
	{
		this.subscription = this.ds.getData().subscribe(x => { 
			if(x[0]=='setting')
			{
			  this.get_setting(x[1]);
			}else if(x[0]=='setCredit')
			{
			  this.credit = x[1];
			}else if(x[0]=='setResRequest')
			{
			  this.setResRequest(x[1]);
			}
		});
	}

	getRole()
	{
		var array = ['getResRequest',2,this.id];
		this.ds.sendData(array);

		this.team = '';
		this.exercise = '';
		this.exe_bundle = '';
		this.allot_user = '';
		this.manual = '';
		this.chat = ''; 

		this.ds.Loader(true);
		const formData = new FormData();
		formData.append('instructor_id', this.id);
		var api = 'admin-api/get-roles';
		this.BackenddbService.postData(api,formData).subscribe(
		  res => {
			 this.ds.Loader(false);
			 if(res != 'null' )
			 {
				 if(this.group_id=='2')
				 {
					this.formdata.patchValue({
						create_team: res.permission.create_team,
						create_exercise: res.permission.create_exercise,
						exercise_bundle: res.permission.exercise_bundle,
						allocate_exe_user: res.permission.allocate_exe_user,
						create_manual: res.permission.create_manual,
						chat: res.permission.chat,
					});
				 }else
				 {
					this.formUserData.patchValue({
						edit_profile: res.permission.edit_profile,
						enroll: res.permission.enroll,
						access_exercise: res.permission.access_exercise,
						chat: res.permission.chat,
					});
				 }
			 }
		  }
		);
	}


	getUser()
	{
		this.ds.Loader(true);
		const formData = new FormData();
		formData.append('user_id', this.id);
		var api = 'candidate-api/get_profile';
		this.BackenddbService.postData(api,formData).subscribe(
		  res => {
			 this.ds.Loader(false);
			 if(typeof res.status !='undefined' && res.status=='error')
			 {
				this.setFlashMessage('primary',res.message);
				this.router.navigate([this.dashboard_url+'users-list']);
			 }else
			 {
                   this.group_id = res.gid;
				   this.user_name = res.eMail;
				   this.getRole();
			 }
		  }
		);
	}
		
	setFlashMessage(type:any,message:any)
	{
	  this.messageArray.type = type;
	  this.messageArray.message = message;
	  this.stringifiedData = JSON.stringify(this.messageArray);   
	  this.loginService.setflashMessage(this.stringifiedData);
	}

	onSubmit(data:any) {

		if(this.group_id=='2')
		{
			var form = this.formdata;
		}else
        {
			var form = this.formUserData;
		}

		if(form.valid) 
		{
			this.ds.Loader(true);
			const formData = new FormData();
			formData.append('user_id', this.id);
			if(typeof data.credit!='undefined')
			{
				formData.append('credit', data.credit);
			}
			formData.append('permission', JSON.stringify(data));
			var api = 'admin-api/update_permission';
			this.BackenddbService.postData(api,formData).subscribe(
			  res => {
				 this.ds.Loader(false);
				 this.closed = false;
				 this.alertMessage = res.message;
				 if(res.status == 'success')
				 {
					this.alertClass = 'success'; 
				 }else if(res.status === 'error')
				 {
				   this.alertClass = 'danger'; 
				 }
			  }
			);
		}
		else
		{
			this.validateAllFormFields(form);
		}
		
	}

	setResRequest(data:any)
	{
		this.team = "("+data.create_team+")";
		this.exercise = "("+data.create_exercise+")";
		this.exe_bundle = "("+data.create_team+")";
		this.allot_user = "("+data.allocate_exe_user+")";
		this.manual = "("+data.create_manual+")";
		this.chat = "("+data.chat+")";   
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

	get_setting(settings:any)
	{
	    settings.forEach( (myObject:any, index:any) => {
		if(settings[index].skey=='credit_system')
		{
		var svalue = JSON.parse(settings[index].svalue);
		if(svalue[0].status=='Active')
		{
			this.credit_system = svalue[0].status;
			if(this.credit_system=='Active')
			{
			   let newCtl = new FormControl('', null);
			   this.formdata.addControl('credit', newCtl);

			   var array = ['getCredit',2,this.id];
			   this.ds.sendData(array);
			}
		}
		}
	});
	}

	preloadData()
	{
	   this.ds.sendData('setting');
	}

}
