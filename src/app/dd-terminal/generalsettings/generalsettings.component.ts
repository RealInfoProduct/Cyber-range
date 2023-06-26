import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ImageCroppedEvent,ImageTransform,Dimensions,base64ToFile } from 'ngx-image-cropper';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { BackenddbService } from '../../services/backenddb.service';
import { environment } from '../../../environments/environment';
import {noWhitespaceValidator} from '../../helper/validatefun';
import { LoginService } from '../../services/login.service';
import { DatapassService } from '../../services/datapass.service';

declare const activesidebar:any;
@Component({
  selector: 'app-generalsettings',
  templateUrl: './generalsettings.component.html',
  styleUrls: ['./generalsettings.component.css']
})
export class GeneralsettingsComponent implements OnInit {
  imageChangedEvent: any = '';
  croppedImageHeader: any = '';
  croppedImageAdmin: any = '';
  croppedImageReport: any = '';
  canvasRotation = 0;
  mailConfigFrm :FormGroup;
  rotation = 0;
  is_header_logo:boolean=false;
  is_admin_logo:boolean=false;
  is_report_logo:boolean=false;
  logo_type:string='';
  scale = 1;
  close:boolean=false;
  showCropper = false;
  containWithinAspectRatio = false;
  transform: ImageTransform = {};
  step_first:string = "step1";
  step_second:string = '';
  step_third:string = '';
  upload_image:boolean=false;
  modalshow:any='';
  modalfadeclass:string = "";
  generalfrm:FormGroup;
  closed: boolean = false;
  serverUrl = environment.baseUrl;

  emailconfigdata:any='';
  alertClass:any='';
  alertMessage:string='';
  server_url:string;
  current_url_array = [];
  form_title:string = 'General Settings';
  otherconfigdata:any='';
  otherConfigFrm:FormGroup;
  error_messages = {
		'to_email': [
			{ type: 'required', message: 'To Email is Required' },  
		],
		'mobile': [
			{ type: 'required', message: 'Mobile is required' },  
		],
		'from_email': [
			{ type: 'required', message: 'From email  is required' },  
		],
    'from_name': [
			{ type: 'required', message: 'From Name  is required' },  
		],
    'smtp_host': [
			{ type: 'required', message: 'SMTP  Host  is required' },  
		],
    'smtp_port': [
			{ type: 'required', message: 'SMTP  Port  is required' },  
		],
    'smtp_username': [
			{ type: 'required', message: 'SMTP  Username  is required' },  
		],
    'smtp_password': [
			{ type: 'required', message: 'SMTP  Password  is required' },  
		],
	}; 

  error_messages_other = {
		'web_email': [
			{ type: 'required', message: 'To Email is Required' },  
		],

    'web_contact': [
			{ type: 'required', message: 'Contact Number is Required' },  
		],
  }
  constructor(private BackenddbService:BackenddbService,
             private LoginService:LoginService, 
             private formBuilder: FormBuilder,
             private ds: DatapassService
             ) {

    this.server_url = this.LoginService.getServerUrl();
   }

  ngOnInit(): void {
    activesidebar(); 
    this.current_url_array = [
      {'slug':"",'label':'General Settings'}
    ];

    this.mailConfigFrm = this.formBuilder.group({
		  to_email:[null, [Validators.required,noWhitespaceValidator]],
      mobile:[null, [Validators.required,noWhitespaceValidator]],
      to_bcc:'',
      to_cc:'',
     
      from_email:[null, [Validators.required,noWhitespaceValidator]],
      from_name:[null, [Validators.required,noWhitespaceValidator]],
      smtp_host:[null, [Validators.required,noWhitespaceValidator]],
      smtp_port:[null, [Validators.required,noWhitespaceValidator]],
      smtp_username:[null, [Validators.required,noWhitespaceValidator]],
      smtp_password:[null, [Validators.required,noWhitespaceValidator]],
		}); 

    this.otherConfigFrm = this.formBuilder.group({
      web_email:[null, [Validators.required,noWhitespaceValidator]],
      web_contact:[null, [Validators.required,noWhitespaceValidator]],
      chat_status:'',
      request_to_instructor:'',
      credit_system:'',
     
      checkout_status:'',
     google_login:''
    });

    this.getEmailConfigData();
    this.getOtherCongData();
    this.getRequestToInstrctor();
    this.getCreditstatus();
   
    this.getCheckoutStatus();
    
    this.getGoogleStatus();
  }

  getRequestToInstrctor(){
    const requestData = new FormData();
		requestData.append('set_key','request_to_instructor');
		this.BackenddbService.getSetting(requestData).subscribe(
			res => {
        
          const req_ins_status = res.data['2'].svalue;
        
        
         this.otherConfigFrm.patchValue({
          request_to_instructor: req_ins_status,
          
         
          
      });

      });
  }
  getCheckoutStatus(){

    const checkoutData = new FormData();
		checkoutData.append('set_key','checkout');
		this.BackenddbService.getSetting(checkoutData).subscribe(
			res => {
       
          const checkout_stat = res.data['1'].svalue;
       
         this.otherConfigFrm.patchValue({
          checkout_status: checkout_stat,
          
         
          
      });

      });
  }
 
  getCreditstatus(){

    const creditData = new FormData();
		creditData.append('set_key','credit_system');
		this.BackenddbService.getSetting(creditData).subscribe(
			res => {
       
          const credit_status = JSON.parse(res.data['5'].svalue);
         
        
         this.otherConfigFrm.patchValue({
          credit_system: credit_status['0'].status,
         });
         
          
      });

     
  }

 

  getGoogleStatus(){
    const mitreData = new FormData();
		mitreData.append('set_key','google_login');
		this.BackenddbService.getSetting(mitreData).subscribe(
			res => {
       
          const google_status = JSON.parse(res.data['12'].svalue);
         
        
         this.otherConfigFrm.patchValue({
          google_login: google_status['0'].status,
         });
         
          
      });

  }

  
  getOtherCongData(){
    const otherData1 = new FormData();
		otherData1.append('set_key','other_config');
		this.BackenddbService.getSetting(otherData1).subscribe(
			res => {
       
         this.otherconfigdata = JSON.parse(res.data['11'].svalue);

        
         this.otherConfigFrm.patchValue({
          web_email: this.otherconfigdata['0'].email,
          web_contact:this.otherconfigdata['0'].contact,
          chat_status: this.otherconfigdata['0'].chat_status,
         
          
      });

      });
  }
  getEmailConfigData(){
    const formData1 = new FormData();
		formData1.append('set_key','email_config');
		this.BackenddbService.getSetting(formData1).subscribe(
			res => {
         this.emailconfigdata = JSON.parse(res.data['10'].svalue);
        
         this.mailConfigFrm.patchValue({
          to_email: this.emailconfigdata['0'].to_email,
          to_cc:this.emailconfigdata['0'].to_cc,
          to_bcc:this.emailconfigdata['0'].to_bcc,
          mobile:this.emailconfigdata['0'].mobile,
          from_email: this.emailconfigdata['0'].from_email,
          from_name: this.emailconfigdata['0'].from_name,
          smtp_host: this.emailconfigdata['0'].smtp_host,
          smtp_port: this.emailconfigdata['0'].smtp_port,
          smtp_username: this.emailconfigdata['0'].smtp_username,
          smtp_password: '*****',
          
      });

      });
  }


  open_step_form(step:any){
    if(step ==2){
      this.step_second= 'step2';
      this.step_first= '';
    }
    if(step ==1){
      this.step_second= '';
      this.step_first= 'step1';
    }
  }

  openmodal(logo_type:any) {
    if(logo_type =='header-logo'){
     
      this.is_header_logo=true;
      this.is_report_logo=false;
      this.is_admin_logo=false;
    }
    if(logo_type =='report-logo'){

      this.is_header_logo=false;
      this.is_report_logo=true;
      this.is_admin_logo=false;
    }
    if(logo_type =='admin-logo'){

      this.is_header_logo=false;
      this.is_report_logo=false;
      this.is_admin_logo=true;
    }
    this.logo_type=logo_type;
    this.modalshow = 'modal-show';
  }
  
  closemodal()
  {
    this.modalshow = '';
  }


  zoomOut() {
    this.scale -= .1;
    this.transform = {
        ...this.transform,
        scale: this.scale
    };
  }
  
  zoomIn() {
    this.scale += .1;
    this.transform = {
        ...this.transform,
        scale: this.scale
    };
  }

  fileChangeEvent(event: any): void {
    
    this.imageChangedEvent = event;
  }

  loadImageFailed() {
    console.log('Load failed');
  }

  imageCropped(event: ImageCroppedEvent,logo_type) {
    
    if(logo_type == 'header-logo'){
      
      this.croppedImageHeader = event.base64;
      
    }
    else if(logo_type =='admin-logo'){
      this.croppedImageAdmin =event.base64;
    }
    else{
      this.croppedImageReport =event.base64;
    }
    
    this.upload_image = true;
    console.log(event, base64ToFile(event.base64));
  }
  
  imageLoaded() {
    this.showCropper = true;
  }
  
  cropperReady(sourceImageDimensions: Dimensions) {
    console.log('Cropper ready', sourceImageDimensions);
  }

  updateLogos(){
    const formData = new FormData();
    this.ds.Loader(true);
    formData.append('header_logo',this.croppedImageHeader);
    formData.append('report_logo',this.croppedImageReport);
    formData.append('admin_logo',this.croppedImageAdmin);
    this.BackenddbService.headerLogoUpdate(formData).subscribe(
      res => {
        this.ds.Loader(false);
        //alert(JSON.stringify(res));
      });
  }
  get f() { return this.mailConfigFrm.controls; }
	
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
  changechatstatus(event){

  }

  updateEmailConfig(data){
  
   if(this.mailConfigFrm.valid){
    const formData = new FormData();
    formData.append('to_email',data.to_email);
    formData.append('mobile',data.mobile);
    formData.append('to_cc', data.to_cc);
    formData.append('to_bcc',data.to_bcc);
    formData.append('from_email',data.from_email);
    formData.append('from_name', data.from_name);
    formData.append('smtp_host',data.smtp_host);
    formData.append('smtp_port',data.smtp_port);
    formData.append('smtp_username', data.smtp_username);
    formData.append('smtp_password',data.smtp_password);


    this.addEmailConfig(formData);
   }
   else{
     this.validateAllFormFields(this.mailConfigFrm);
   }
  }

  updateConfig(data){
 
    if(this.otherConfigFrm.valid){
      const otherData = new FormData();
      otherData.append('email',data.web_email);
      otherData.append('contact',data.web_contact);
      otherData.append('chat_status',data.chat_status);
      otherData.append('request_to_instructor',data.request_to_instructor);
      otherData.append('credit_system',data.credit_system);
      otherData.append('checkout_status',data.checkout_status);
      otherData.append('google_login',data.google_login);
      
      this.updateConfiguration(otherData);
    }
    else{
      this.validateAllFormFields(this.otherConfigFrm);
    }
  }
  updateConfiguration(formdata:any){
    this.ds.Loader(true);
    this.BackenddbService.updateOtherConfig(formdata).subscribe(
      res => {
      this.ds.Loader(false);
      if(res.status =='success'){
        this.closed=true;
        this.alertClass='success';
        this.alertMessage=res.message;
      }
      });   
  }
  addEmailConfig(formData:any){
    this.ds.Loader(true);
    this.BackenddbService.updateEmailConfig(formData).subscribe(
      res => {
     this.ds.Loader(false);
     if(res.status ==200){
      this.closed=true;
      this.alertClass='success';
      this.alertMessage=res.message;
     }
      });
  }
  
}
