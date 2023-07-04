import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators} from '@angular/forms';
import { FrontenddbService } from '../../services/frontenddb.service';
import {mustMatch} from '../../helper/confirmed.validator';
import { LoginService } from '../../services/login.service';
import { ChatService } from '../../services/chat.service';

import { Router, ActivatedRoute } from '@angular/router';
import {noWhitespaceValidator} from '../../helper/validatefun';
import { OwlOptions } from 'ngx-owl-carousel-o';


@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css']
})
export class VerifyComponent implements OnInit {

  error: string;
  closed: boolean = true;
  checkMail: boolean = true;
  alertMessage: string;
  alertClass: string;
  formdata:any = {};
  public token:string;
  progressbar: boolean = true;
  passwordset:string = 'No';
  email:string = '';
  resetpass_frm: FormGroup;
  loginlink: boolean = false;

  /*breadcrumbs array */
current_url_array = [];
form_title:string = 'Verification';
showPassword:boolean = false
confirmPassword:boolean = false
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
error_messages = {
  'f_name': [
    { type: 'required', message: 'First Name is required.' },
  ],
  'l_name': [
    { type: 'required', message: 'Last Name is required.' },
  ],
  'password': [
    { type: 'required', message: 'Password is required.' },
    { type: 'minlength', message: 'Password length.' },
    { type: 'maxlength', message: 'Password length.' }
    ], 
    'conf_password': [
    { type: 'required', message: 'Confirm Password is required.' },
    ],
} 

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private FrontenddbService: FrontenddbService,
    private route: ActivatedRoute,
    private LoginService: LoginService,
    private ChatService: ChatService

  ) { 

    this.route.queryParamMap.subscribe(queryParams => {
      this.token = queryParams.get("token");
   })
  

   if(this.token!=null)
   {
   const formData = new FormData();
	 formData.append('token', this.token);
   this.closed = true;

   this.FrontenddbService.VerifyToken(formData).subscribe(
    res => {
      console.log(res)
      if(res.status == 'success') {
          this.progressbar = false;
          this.alertMessage = res.message;
          this.alertClass = 'primary';
          this.closed = false;
          this.passwordset = res.passwordset
          this.email = res.email
      }else if(res.status == 'error') 
      {
        this.progressbar = false;
        this.alertMessage = res.message;
        this.alertClass = 'danger';
        this.closed = false;

      }
    },
    error => this.error = error
    );
  }

    //this.token = this.route.snapshot.paramMap.get('token');

    //alert(this.token);
     /* verify user registration here  */
    /* this.FrontenddbService.getCountryList().subscribe((data:any) => {
     });*/

  }

  ngOnInit(): void {
  
		this.resetpass_frm = this.formBuilder.group({
     f_name: [null, [Validators.required,noWhitespaceValidator]],
     l_name: [null, [Validators.required,noWhitespaceValidator]],
			password: [null, Validators.compose([
				Validators.required,
				Validators.minLength(6),
				Validators.maxLength(30)
			  ])],
			  conf_password:  [null, Validators.required]
			}, {
				validator: mustMatch('password', 'conf_password')
			});

	/*breadcrumbs array */
	this.current_url_array = [
		{'slug':"",'label':'Verification'}
	];
  }


	get f() { return this.resetpass_frm.controls; }

	onSubmit(data:any) {

	if(this.resetpass_frm.valid)
	{
		const formData = new FormData();
		formData.append('token', this.token);
    formData.append('f_name', data.f_name);
		formData.append('l_name', data.l_name);
		formData.append('password', data.password);

		this.closed = true;
		this.progressbar = true;
		this.loginlink = false;

		/* here email exsit in db and send reset password mail to user if email correct found in db */
		this.LoginService.resetPasswordRequest(formData).subscribe(
		  res =>
		   {
				this.progressbar = false;
				if(res.status == 'success')
				{
              let userData:any = {
                cyber_user_id:res.id,
                f_name:data.f_name,
                l_name:data.l_name,
                password:data.password,
                mobile:'',
                email:this.email,
                group:3
              }

            this.ChatService.register(userData).subscribe(
            response => {
            //console.log('response')
            //console.log(response)
            });

					this.alertMessage = res.message;
					this.alertClass = 'success'; 
					this.closed = false;
					this.loginlink = true;
          this.passwordset = 'No';
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


    invalidMessage(errorMessage, inputName) {
      for (let error of errorMessage) {
        switch(inputName) {
          case 'firstName':
            if (this.resetpass_frm.get('f_name').status == 'INVALID' &&  (this.resetpass_frm.get('f_name').dirty || this.resetpass_frm.get('f_name').touched)) {
                  return 'border-red'
                } else {
                  return 'border-blue'
                }
            break;
          case 'lastName':
            if (this.resetpass_frm.get('l_name').status == 'INVALID' && (this.resetpass_frm.get('l_name').dirty || this.resetpass_frm.get('l_name').touched)) {
                  return 'border-red'
                } else {
                  return 'border-blue'
                }
            break;
          case 'password':
            if (this.resetpass_frm.get('password').status == 'INVALID' && (this.resetpass_frm.get('password').dirty || this.resetpass_frm.get('password').touched)) {
                  return 'border-red'
                } else {
                  return 'border-blue'
                }
            break;
          case 'confirmPassword':
            if (this.resetpass_frm.get('conf_password').status == 'INVALID' && (this.resetpass_frm.get('conf_password').dirty || this.resetpass_frm.get('conf_password').touched)) {
              return 'border-red'
            } else {
              return 'border-blue'
            }
            break;
          default:
            // code block
        }
        // if(this.error_messages?.f_name){
        //   if (this.resetpass_frm.get('f_name').status == 'INVALID' &&  (this.resetpass_frm.get('f_name').dirty || this.resetpass_frm.get('f_name').touched)) {
        //     return 'border-red'
        //   } else {
        //     return 'border-blue'
        //   }
        // } else if (this.error_messages?.l_name){
        //   if (this.resetpass_frm.get('f_name').status == 'INVALID' && (this.resetpass_frm.get('l_name').dirty || this.resetpass_frm.get('l_name').touched)) {
        //     return 'border-red'
        //   } else {
        //     return 'border-blue'
        //   }
        // } else if (this.error_messages?.password) {
        //   if (this.resetpass_frm.get('password').status == 'INVALID' && (this.resetpass_frm.get('password').dirty || this.resetpass_frm.get('password').touched)) {
        //     return 'border-red'
        //   } else {
        //     return 'border-blue'
        //   }
        // } else if (this.error_messages?.conf_password) {
        //   if (this.resetpass_frm.get('conf_password').status == 'INVALID' && (this.resetpass_frm.get('conf_password').dirty || this.resetpass_frm.get('conf_password').touched)) {
        //     return 'border-red'
        //   } else {
        //     return 'border-blue'
        //   }
        // }
      }
    }

}
