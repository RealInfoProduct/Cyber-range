import { Component, OnInit } from '@angular/core';
import { FormGroup,  FormBuilder, FormControl, Validators, AbstractControl  } from '@angular/forms';
import { FrontenddbService } from '../services/frontenddb.service';
import {noWhitespaceValidator} from '../helper/validatefun';
import { LoginService } from '../services/login.service';

import { faMapMarker, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons'; 

@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.component.html',
  styleUrls: ['./contactus.component.css']
})
export class ContactusComponent implements OnInit {
	
	// icon
	faMapMarker = faMapMarker;
	faPhone = faPhone;
	faEnvelope = faEnvelope;

	// google recaptcha
	public captchaResponse: string = '';
	public captchaError:boolean = false;
	 
	// breadcrumbs  
	current_url_array = [];
	form_title:string = ''; 
	recaptch:string = 'Inactive'
	recaptchSiteKey:string = ''
	setting = []

	// error validation message
	error_messages = {
		'name': [
			{ type: 'required', message: 'Name is required' },
			], 
		'email': [
			{ type: 'required', message: 'Email is required' },
			{ type: 'email', message: 'Valid Email required' },
			], 
		'mobile': [
			{ type: 'required', message: 'Phone No is required' },
			{ type: 'pattern', message: 'Valid mobile no required' },
			],
		'subject': [
			{ type: 'required', message: 'Subject is required' },
			], 
		'message': [
			{ type: 'required', message: 'Message is required' },
			], 
        } 
	
	// progress bar show	
	progressbar: boolean = false;

    // disable btn
	disabled_btn: boolean = false;

	// alert box	
	error: string;
	closed: boolean = true;
	alertMessage: string;
	alertClass: string;

	// form group
	contact_frm: FormGroup;

	
	server_url:string;	
	
	constructor(
		private FrontenddbService:FrontenddbService,
		private formBuilder: FormBuilder,
		private loginService: LoginService,
	) {
		this.form_title = "Contact Us";
		this.server_url = this.loginService.getServerUrl();
	}

	ngOnInit(): void {
		  this.current_url_array = [
		  {"slug":"","label":"Contact Us"}
		] 

		this.contact_frm = this.formBuilder.group({
			name: [null, [Validators.required,noWhitespaceValidator]],
			email: [null, [Validators.required, Validators.email]],
			mobile: [null, [Validators.required, Validators.pattern(new RegExp("[0-9 ]{10}"))]],
			subject: [null, [Validators.required, noWhitespaceValidator]],
			message: [null, [Validators.required,noWhitespaceValidator]],
		});

	}

	get f() { return this.contact_frm.controls; }


	public resolved(captchaResponse: string) {
		this.captchaResponse = captchaResponse;
		this.onSubmit(this.contact_frm.value);
	  }

	onSubmit(data:any) {

	if(this.contact_frm.valid)
	{
    	this.progressbar = true;
		const formData = new FormData();
		formData.append('name', data.name);
		formData.append('email', data.email);
		formData.append('mobile', data.mobile);
		formData.append('subject', data.subject);
		formData.append('message', data.message);
		
		//here check valid captcha
		if(this.recaptch=='Active')
		{
			this.captchaError = false;
			if(this.captchaResponse=="")
			{
				this.captchaError = true;
				this.progressbar = false;
				return true;
			}
			formData.append('recaptch', this.captchaResponse);
		}
	  
		this.closed = true;
		this.progressbar = true;

		/* here email exsit in db and send reset password mail to user if email correct found in db */
		this.FrontenddbService.contactUs(formData).subscribe(
		  res =>
		   {
				//console.log(res);
				this.progressbar = false;
				if(res.status == 'success')
				{
					this.alertMessage = res.message;
					this.alertClass = 'success'; 
					this.closed = false;
					this.disabled_btn = true;
					this.contact_frm.reset();
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
			this.validateAllFormFields(this.contact_frm);
		  }
	  }

	  get_setting(settings:any)
	{
		this.setting = settings;
		this.setting.forEach( (myObject:any, index:any) => {
			if(this.setting[index].skey=='google_recaptcha')
			{
                var svalue = JSON.parse(this.setting[index].svalue);
				if(svalue[0].status=='Active')
				{
					this.recaptchSiteKey = svalue[0].sitekey
					this.recaptch = svalue[0].status;
				}
			}
	   });
	}

     // validation check here 
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


	  
	invalidMessage(errorMessage, controlName) {
		for (let error of errorMessage) {
			switch (controlName) {
				case 'name':
					if (this.contact_frm.get('name').status == 'INVALID' && (this.contact_frm.get('name').dirty || this.contact_frm.get('name').touched)) {
						return 'border-red'
					} else {
						return 'border-blue'
					}
					break;
				case 'email':
					if (this.contact_frm.get('email').status == 'INVALID' && (this.contact_frm.get('email').dirty || this.contact_frm.get('email').touched)) {
						return 'border-red'
					} else {
						return 'border-blue'
					}
					break;
				case 'mobile':
					if (this.contact_frm.get('mobile').status == 'INVALID' && (this.contact_frm.get('mobile').dirty || this.contact_frm.get('mobile').touched)) {
						return 'border-red'
					} else {
						return 'border-blue'
					}
					break;
				case 'subject':
					if (this.contact_frm.get('subject').status == 'INVALID' && (this.contact_frm.get('subject').dirty || this.contact_frm.get('subject').touched)) {
						return 'border-red'
					} else {
						return 'border-blue'
					}
					break;
				case 'message':
					if (this.contact_frm.get('message').status == 'INVALID' && (this.contact_frm.get('message').dirty || this.contact_frm.get('message').touched)) {
						return 'border-red'
					} else {
						return 'border-blue'
					}
					break;
				default:
					break;
			}

		}
	}

}
