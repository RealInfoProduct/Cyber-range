import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup,  FormBuilder, FormControl, Validators, AbstractControl  } from '@angular/forms';
import { FrontenddbService } from '../services/frontenddb.service';
import { ChatService } from '../services/chat.service';
import { LoginService } from '../services/login.service';
import { BackenddbService } from '../services/backenddb.service';

import { Router, ActivatedRoute } from '@angular/router';
import {noWhitespaceValidator} from '../helper/validatefun';
import {mustMatch} from '../helper/confirmed.validator';
import { Subscription,Subject, BehaviorSubject,Observable } from 'rxjs';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})



export class RegistrationComponent implements OnInit {
  setting = []
  error_messages = {
    // 'f_name': [
    //   { type: 'required', message: 'First Name is required' },
    // ],
    // 'm_name': [
    //   { type: 'required', message: 'Middle Name is required' },
    // ],
    // 'l_name': [
    //   { type: 'required', message: 'Last Name is required' },
    // ],   
     'email': [
      { type: 'required', message: 'Email is required' },
      { type: 'email', message: 'Valid Email required' },
    ],   
    // 'mobile': [
    //   { type: 'required', message: 'Mobile No is required' },
    //   { type: 'pattern', message: 'Valid mobile no required' },
    // ],   
    // 'language': [
    //   { type: 'required', message: 'Language is required' },
    // ],   
    // 'address': [
    //   { type: 'required', message: 'Address is required' },
    // ],   
    // 'country': [
    //   { type: 'required', message: 'Country is required' },
    // ],   
    // 'state': [
    //   { type: 'required', message: 'State is required' },
    // ],   
    // 'city': [
    //   { type: 'required', message: 'City is required' },
    // ],   
    // 'pin': [
    //   { type: 'required', message: 'Pin is required' },
    // ],   
    // 'sex': [
    //   { type: 'required', message: 'Gender is required' },
    // ],   
    // 'password': [
    //   { type: 'required', message: 'Password is required' },
    //   { type: 'minlength', message: 'Password length' },
    //   { type: 'maxlength', message: 'Password length' }
    // ], 
    // 'conf_password': [
    //   { type: 'required', message: 'Confirm Password is required' },
    // ],    

  }
public captchaResponse: string = '';
public captchaError:boolean = false;
  
user_id:string;
error: string;
closed: boolean = true;
checkMail: boolean = true;
alertMessage: string;
alertClass: string;
public countryList = [];
public stateList = [];
state_country:string;
formdata: FormGroup;
submitted: boolean = false;
progressbar: boolean = false;

private subscription: Subscription;

server_url:string;
ref_code:string = '';

/*breadcrumbs array */
current_url_array = [];
form_title:string = 'Registration';
recaptch:string = 'Inactive'
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
      private router: Router,
      private FrontenddbService: FrontenddbService,
      private BackenddbService: BackenddbService,
      private loginService: LoginService,
      private formBuilder: FormBuilder,
      private  ChatService :ChatService,
      private route: ActivatedRoute,
  ) { 

    this.user_id = this.loginService.getUserId(); 
  	this.server_url = this.loginService.getServerUrl();
    this.ref_code = this.route.snapshot.paramMap.get('id');

    if(this.user_id!=null)
    {
      this.router.navigate(['/exercise-repository']);
    }

    /* get country list  */
    this.FrontenddbService.getCountryList().subscribe((data:any) => {
      this.countryList = Array.from(Object.keys(data), k=>data[k]);
      //console.log(this.countryList);
     });
  } 

  ngOnInit() {

	/*breadcrumbs array */
		this.current_url_array = [
			{'slug':"",'label':'Registration'}
		];
		
  //  window.onload = this.test();

    this.formdata = this.formBuilder.group({
      // f_name: [null, [Validators.required,noWhitespaceValidator]],
      // m_name: [''],
    
      // l_name: [null, [Validators.required,noWhitespaceValidator]],
      email: [null, [Validators.required, Validators.email]],
      // mobile: [null, [Validators.required, Validators.pattern(new RegExp("[0-9 ]{10}"))]],
      // language: ['', Validators.required],
      cyber_user_id:'',
      group:'3',
    //   address: [''],
    //   country: ['', Validators.required],
    //   state: [''],
    //   city: [''],
    //   pin: [''],
    //   sex: [''],
    //   password: [null, Validators.compose([
    //     Validators.required,
    //     Validators.minLength(6),
    //     Validators.maxLength(30)
    //   ])],
    //   conf_password:  [null, Validators.required]
    // }, {
    //     validator: mustMatch('password', 'conf_password')
     });
      
   }


   ngAfterViewInit() {
   }


get f() { return this.formdata.controls; }

public resolved(captchaResponse: string) {
  this.captchaResponse = captchaResponse;
  debugger
  this.onSubmit(this.formdata.value);
}

 changeCountry(event:any) {
    /* get state list by selected country in country dropdown */
    this.progressbar = true;
    this.state_country = event.target.value;
    this.FrontenddbService.getStateList(this.state_country).subscribe((data:any) => {
      this.stateList = Array.from(Object.keys(data), k=>data[k]);
      this.progressbar = false;
     });
 }    

 keyPressAlphanumeric(event) {

  var inp = String.fromCharCode(event.keyCode);

  if (/[a-zA-Z]/.test(inp)) {
    return true;
  } else {
    event.preventDefault();
    return false;
  }
}

 onSubmit(data:any) {
  this.submitted = true;

    if(this.formdata.valid) 
    {

  this.progressbar = true;
      
  const formData = new FormData();
  formData.append('email', data.email);

  if(this.recaptch=='Active')
  {
  		//here check valid captcha
      this.captchaError = false;
      if(this.captchaResponse=="")
      {
        this.captchaError = true;
        this.progressbar = false;
        return true;
      }else
      {
        formData.append('recaptch', this.captchaResponse);
      }
  }
  

  this.closed = true;
  this.progressbar = true;
  /* checking  exsiting email user in addressbook table */
  this.FrontenddbService.checkExsitingEmail(formData).subscribe(
    res => {
       if(res.status == 'success') {
        this.closed = true;
        // formData.append('f_name', data.f_name);
        // formData.append('m_name', data.m_name);
        // formData.append('l_name', data.l_name);
        // formData.append('mobile', data.mobile);
        // formData.append('language', data.language);
        // formData.append('address', data.address);
        // formData.append('country', data.country);
        // formData.append('state', data.state);
        // formData.append('city', data.city);
        // formData.append('pin', data.pin);
        // formData.append('sex', data.sex);
        // formData.append('password', data.password);
        if(this.ref_code !=null)
        {
          formData.append('ref_code', this.ref_code);
        }
        formData.append('force_passwd_change', 'false');

        let api = 'registration-api/new-registration'
        this.BackenddbService.postData(api,formData).subscribe(
          res => {
              if(res.status == 'success')
              {
                // this.formdata.patchValue({
                //   cyber_user_id :res.insert_user_id
                // });
                // this.ChatService.register(this.formdata.value).subscribe(
                //  response => {
                //   console.log('response')

                //   console.log(response)
                //   });

                this.alertMessage = res.message;
                this.alertClass = 'primary'; 
                this.closed = false;
               // this.router.navigate(['/registration/thank-you']);
                this.progressbar = false;

              }else if(res.status === 'error')
              {
                this.alertMessage = res.message;
                this.alertClass = 'danger'; 
                this.closed = false;
                this.progressbar = false;
              }

          },
          error => this.error = error
        )

      }else if(res.status === 'error')
      {
        this.alertMessage = res.message;
        this.alertClass = 'danger'; 
        this.closed = false;
        this.progressbar = false;

     }
    },
    error => this.error = error
    );

    } else {
      this.validateAllFormFields(this.formdata);
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
					this.recaptch = 'Active';
				}
			}
	   });
	}

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


  invalidMessage(errorMessage) {
    for (let error of errorMessage) {
      if (this.formdata.get('email').status == 'INVALID' && (this.formdata.get('email').dirty || this.formdata.get('email').touched)) {
        return 'border-red'
      } else {
        return 'border-blue'
      }
    }
  }

}
