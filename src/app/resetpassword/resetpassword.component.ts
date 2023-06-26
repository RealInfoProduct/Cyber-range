import { Component, OnInit } from '@angular/core';
import { FormGroup,  FormBuilder, FormControl, Validators, AbstractControl  } from '@angular/forms';
import { LoginService } from '../services/login.service';

import {mustMatch} from '../helper/confirmed.validator';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetpasswordComponent implements OnInit {

    // error validation message
	error_messages = {
		'password': [
			{ type: 'required', message: 'Password is required.' },
			{ type: 'minlength', message: 'Password length.' },
			{ type: 'maxlength', message: 'Password length.' }
		  ], 
		  'conf_password': [
			{ type: 'required', message: 'Confirm Password is required.' },
		  ],
	} 

   // progress bar show	
   progressbar: boolean = false;

   // alert box	
   error: string;
   closed: boolean = true;
   alertMessage: string;
   alertClass: string;

   // breadcrumbs
   current_url_array = [];
   form_title:string = '';

   // form group
   resetpass_frm: FormGroup;

   // token
   token:string = '';
   site_url:string = '';
   user_id:string = '';
   loginlink: boolean = false;

   server_url:string;
   
   constructor(
	   private formBuilder: FormBuilder,
	   private LoginService: LoginService,
	   private router: Router,
	   private route: ActivatedRoute,
   ) {
	    this.site_url = this.LoginService.getSiteUrl();
		this.server_url = this.LoginService.getServerUrl();

		this.token = this.route.snapshot.paramMap.get('token');
		
		if(this.token==null)
		{
			this.router.navigate(['login']);
		}else
		{

		  const formData = new FormData();
		  formData.append('token', this.token);
		  this.closed = true;
	   
		  this.LoginService.verifyResetPasswdToken(formData).subscribe(
		   res => {
			 //console.log(res);
			 this.progressbar = false;
 			 if(res.status == 'success') 
			 {
			   //this.alertMessage = res.message;
			   //this.alertClass = 'success';
			   //this.closed = false;
			   this.user_id = res.user_id;
			 }
			 else if(res.status == 'error') 
			 {
			   this.alertMessage = res.message;
			   this.alertClass = 'danger';
			   this.closed = false;
			 }
		   },
		   error => this.error = error
		   );

		}
		this.form_title = "Reset Password";
	}

	ngOnInit(): void {

		this.resetpass_frm = this.formBuilder.group({
			password: [null, Validators.compose([
				Validators.required,
				Validators.minLength(6),
				Validators.maxLength(30)
			  ])],
			  conf_password:  [null, Validators.required]
			}, {
				validator: mustMatch('password', 'conf_password')
			});

		  this.current_url_array = [
		  {"slug":"","label":"Reset Password"}
		] 
	}


	get f() { return this.resetpass_frm.controls; }

	onSubmit(data:any) {

	if(this.resetpass_frm.valid)
	{
		const formData = new FormData();
		formData.append('token', this.token);
		formData.append('password', data.password);
   
		this.closed = true;
		this.progressbar = true;
		this.loginlink = false;

		/* here email exsit in db and send reset password mail to user if email correct found in db */
		this.LoginService.resetPasswordRequest(formData).subscribe(
		  res =>
		   {
				console.log(res);
				this.progressbar = false;
				if(res.status == 'success')
				{
					this.alertMessage = res.message;
					this.alertClass = 'success'; 
					this.closed = false;
					this.loginlink = true;
				}else if(res.status === 'error')
				{
				this.alertMessage = res.message;
				this.alertClass = 'danger'; 
				this.closed = false;
			    }
		    },
			error => this.error = error
			);
		  } else {
			this.validateAllFormFields(this.resetpass_frm);
		  }
	  }

     // validation check here 
	  validateAllFormFields(formGroup: FormGroup) {
		Object.keys(formGroup.controls).forEach(field => {
		  console.log(field);
		  const control = formGroup.get(field);
		  if (control instanceof FormControl) {
			control.markAsTouched({ onlySelf: true });
		  } else if (control instanceof FormGroup) {
			this.validateAllFormFields(control);
		  }
		});
	  }

}
