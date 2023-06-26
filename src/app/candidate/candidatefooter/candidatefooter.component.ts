import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { DataShareService } from '../../services/utils/data-share.service';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { BackenddbService } from '../../services/backenddb.service';
import { DatapassService } from '../../services/datapass.service';
import { Subscription }   from 'rxjs/Subscription';
import { Router } from '@angular/router';
import { FormGroup,  FormBuilder, FormArray, FormControl, Validators  } from '@angular/forms';
import {noWhitespaceValidator} from '../../helper/validatefun';
import { FrontenddbService } from '../../services/frontenddb.service';
import Swal from 'sweetalert2';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

declare const hideshow:any;
declare const showhide2:any;
declare const modal:any;

@Component({
  selector: 'app-candidatefooter',
  templateUrl: './candidatefooter.component.html',
  styleUrls: ['./candidatefooter.component.css']
})
export class CandidatefooterComponent implements OnInit {

  	// google recaptcha
	public captchaResponse: string = '';
	public captchaError:boolean = false;
  recaptcha:string = 'Inactive';
  sitekey:string;
  setting = []
  faHeart = faHeart;
  chat_status:any='';
  chat_access:string = 'Allowed';
  server_url:string;
  site_url:string;
  year:any = '';
  otherconfigdata:any='';
  user_id:any='';
  subscription: Subscription;
  demo_notification:string='';
  demo_status:string='';
  progressbar:boolean=false;
  process_msg:string='';
  notification:boolean=false;
  demoReqFrm: FormGroup;
  error_messages = {
		'candidate_name': [
			{ type: 'required', message: 'User Name is required' },  
		],
		'candidate_email': [
			{ type: 'required', message: 'Email is required' },  
		],
		'candidate_phone': [
			{ type: 'required', message: 'Contact No. is required' },  
		],
	} 

  constructor( private dataShareService: DataShareService, 
              private BackenddbService :BackenddbService,  
              private loginService: LoginService,	
              private ds: DatapassService, 
              private router: Router,
              private frontenddbservice:FrontenddbService,  
              private formBuilder: FormBuilder,
              private modalService: NgbModal,
 
    ) {
    this.user_id = this.dataShareService.getUserId();
    this.server_url = this.loginService.getServerUrl();
    this.site_url = this.loginService.getSiteUrl();
   }

  ngOnInit(): void {
    this.year = new Date().getFullYear();
    this.getOtherCongData();
    this.loadSubcData();
    this.demoReqFrm = this.formBuilder.group({
		  candidate_name:[null, [Validators.required,noWhitespaceValidator]],
      candidate_email:[null, [Validators.required,noWhitespaceValidator]],
      candidate_phone:[null, [Validators.required,noWhitespaceValidator]],
		}); 

  }

  loadSubcData()
  {
  this.subscription = this.ds.getData().subscribe(x => { 
    if(x[0]=='set_permission')
    {
     this.set_permission(x[1]);
    }else if(x[0]=='progressbar')
    {
      this.show_progressbar(x[1]);
    }else if(x[0]=='open_demo_model')
    {
        //$('#demoReqModal').modal('show');
        (<any>$('#demoReqModal')).modal('show');
    }
  });
  }

  show_progressbar(flag:any)
  {
     this.progressbar = flag;
  }

  getOtherCongData(){
    const otherData1 = new FormData();
		otherData1.append('set_key','other_config,google_recaptcha');
		this.BackenddbService.getSetting(otherData1).subscribe(
			res => {
        if(res.status=="success")
        {
          var setting = Array.from(Object.keys(res.data), k=>res.data[k]);
          this.setting = setting
          this.setting.forEach((myObject:any, index:any) => {
            if(myObject.skey=='other_config')
            {
              this.otherconfigdata = JSON.parse(myObject.svalue);
              this.chat_status = this.otherconfigdata['0'].chat_status;
            }
            else if(myObject.skey=='google_recaptcha')
            {
              var recaptcha = JSON.parse(myObject.svalue);
              if(recaptcha['0'].status=='Active')
              {
                 this.recaptcha = recaptcha['0'].status;
                 this.sitekey = recaptcha['0'].sitekey;
              }
            }
        });
      }
      });
  }

  
  submitDemoReq(data:any){
   
    if(this.demoReqFrm.valid){

      const formData = new FormData();
			formData.append('candidate_name',data.candidate_name);
			formData.append('candidate_email', data.candidate_email);
			formData.append('contact_number',data.candidate_phone);

      //here check valid captcha
      if(this.recaptcha=='Active')
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
      
    this.progressbar = true;
    this.frontenddbservice.addDemoRequest(formData).subscribe(
      res => {
          if(res.status ==200){
            this.progressbar=false;
            Swal.fire('',res.message,'success');
            this.demoReqFrm.reset();
          }else{
            this.progressbar=false;
            Swal.fire('',res.message,'error');
          }
      });
    }else{
      this.validateAllFormFields(this.demoReqFrm);
    }
 
}

get f() { return this.demoReqFrm.controls; }
  
	// validation check here 
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

  set_permission(data:any)
  {
    if(data.permission.chat=='Denied')
    {
      this.chat_access = data.permission.chat;
    }
  }

  public resolved(captchaResponse: string) {
		this.captchaResponse = captchaResponse
    this.submitDemoReq(this.demoReqFrm.value);
	  }


}
