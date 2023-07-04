import { Component, OnInit } from '@angular/core';
import { FormGroup,  FormBuilder, FormControl, Validators, AbstractControl  } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { OwlOptions } from 'ngx-owl-carousel-o';


@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotpasswordComponent implements OnInit {
	
	server_url:string;
	
    // error validation message
	error_messages = {
		 'email': [
		  { type: 'required', message: 'Email is required' },
		  { type: 'email', message: 'Valid Email required' },
		]} 

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
	forgotpass_frm: FormGroup;

	banner_slider: OwlOptions = {
		autoplay: true,
		loop: true,
		mouseDrag: true, 
		touchDrag: true,
		pullDrag: false,
		dots: true,
		nav: false,
		navSpeed: 700,
		navText: ['', ''],
		responsive: {
		  0: {
			items: 1
		  },
		  400: {
			items: 1
		  },
		  768: {
			items: 1
		  }
		}
	  }
	

	constructor(
		private formBuilder: FormBuilder,
		private loginService: LoginService
	) {
		this.form_title = "Forgot Password"; 
		this.server_url = this.loginService.getServerUrl();
	}

	ngOnInit(): void {

		this.forgotpass_frm = this.formBuilder.group({
			email: [null, [Validators.required, Validators.email]],
		});

		  this.current_url_array = [
		  {"slug":"","label":"Forgot Password"}
		] 
	}

	get f() { return this.forgotpass_frm.controls; }

	onSubmit(data:any) {
 debugger
	if(this.forgotpass_frm.valid)
	{
		const formData = new FormData();
		formData.append('email', data.email);
	  
		this.closed = true;
		this.progressbar = true;
		/* here email exsit in db and send reset password mail to user if email correct found in db */
		this.loginService.forgotPasswordRequest(formData).subscribe(
		  res =>
		   {
				console.log(res);
				this.progressbar = false;
				if(res.status == 'success')
				{
					this.alertMessage = res.message;
					this.alertClass = 'success'; 
					this.closed = false;
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
			this.validateAllFormFields(this.forgotpass_frm);
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

	  invalidMessage(errorMessage) {
		for(let error  of errorMessage) {
		  if(this.forgotpass_frm.get('email').status == 'INVALID' && (this.forgotpass_frm.get('email').dirty || this.forgotpass_frm.get('email').touched)) {
			return 'border-red'
		  } else {
			return 'border-blue'
		  }
		}
	  }
}
