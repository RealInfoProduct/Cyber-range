import { Component, OnInit } from '@angular/core';
import { Subject, BehaviorSubject,Observable } from 'rxjs';

import { FormGroup,  FormBuilder, FormControl, Validators, AbstractControl  } from '@angular/forms';
import { FrontenddbService } from '../services/frontenddb.service';
import { LoginService } from '../services/login.service';
import { OrderService } from '../services/order.service';

import { Router } from '@angular/router';
import {noWhitespaceValidator} from '../helper/validatefun';
import { ImageCroppedEvent,ImageTransform,CropperPosition,Dimensions,base64ToFile } from 'ngx-image-cropper';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { DatapassService } from '../services/datapass.service';
import { Subscription } from 'rxjs/Subscription';

import Swal from 'sweetalert2';

import { faCamera, faCog } from '@fortawesome/free-solid-svg-icons'; 

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
	resetBasket : Subject<any> = new Subject<any>();

  faCamera = faCamera;
  faCog = faCog;
  subscription: Subscription;

  user_id: string;
  update_by: string;
  group_id: string = "";

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
  modalfadeclass:string = "";
  modalshow:string = "";

	t_pin:string = "";
	modalConfgRef:any;

	last_login_date:string = '';
	
	/*breadcrumbs array */
	current_url_array = [];
	form_title:string = 'Profile';	
	

  // flash message 
  messageArray = {  
    type: "",  
    message: "",  
  }; 
  stringifiedData: any; 
  msgalert:any;

  imageChangedEvent: any = '';
  croppedImage: any = '';
  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  showCropper = false;
  containWithinAspectRatio = false;
  transform: ImageTransform = {};
  cropos: CropperPosition = {x1:100,y1:100,x2:100,y2:100};
  credit_system = 'Inactive';

  error_messages = {
    'f_name': [
      { type: 'required', message: 'First Name is required.' },
    ],
    'm_name': [
      { type: 'required', message: 'Middle Name is required.' },
    ],
    'l_name': [
      { type: 'required', message: 'Last Name is required.' },
    ],   
     'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'email', message: 'Valid Email required.' },

    ],   
    'mobile': [
      { type: 'required', message: 'Mobile No is required.' },
      { type: 'pattern', message: 'Valid mobile no required.' },
    ],   
    'language': [
      { type: 'required', message: 'Language is required.' },
    ],   
    'address': [
      { type: 'required', message: 'Address is required.' },
    ],   
    'country': [
      { type: 'required', message: 'Country is required.' },
    ],   
    'state': [
      { type: 'required', message: 'State is required.' },
    ],   
    'city': [
      { type: 'required', message: 'City is required.' },
    ],   
    'pin': [
      { type: 'required', message: 'Pin is required.' },
    ],   
    'sex': [
      { type: 'required', message: 'Gender is required.' },
    ],   
    'password': [
      { type: 'minlength', message: 'Password length.' },
      { type: 'maxlength', message: 'Password length.' }
    ],   

  }

  server_url:string;
  
  constructor(
    private router: Router,
    private loginService: LoginService,
    private FrontenddbService: FrontenddbService,
    private OrderService: OrderService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private ds: DatapassService 
    
  ) { 
    /* get country list  */
    this.FrontenddbService.getCountryList().subscribe((data:any) => {
      this.countryList = Array.from(Object.keys(data), k=>data[k]);
     });
	
  	this.server_url = this.loginService.getServerUrl();
  }

  ngOnInit() {

  this.loadSubcData();

	/*breadcrumbs array */
	this.current_url_array = [
		{'slug':"",'label':'Profile'}
	];
		
    this.user_id = this.loginService.getUserId();
    this.update_by = this.user_id;
    this.group_id = this.loginService.getLoginGroup();
    this.getFlashMessage();

    const formData = new FormData();
    formData.append('user_id', this.user_id);
    formData.append('update_by', this.update_by);
    formData.append('update_by_group', this.group_id);
   
   this.FrontenddbService.getProfile(formData).subscribe(
     res => {
        //console.log(res);
        this.croppedImage = res.Photo;
      this.getStateByCountry(res.Country);
       this.formdata.patchValue({
           f_name: res.F_Name,
           m_name: res.M_Name,
           l_name: res.L_Name,
           email: res.eMail,
           mobile: res.Mobile,
           language: res.Language,
           address: res.Address,
           country: res.Country,
           state: res.State,
           city: res.City,
           pin: res.Pin,
           sex: res.Sex,
       });
       //this.imagePath = res.image;
	   this.last_login_date = res.last_login_date;
     }
   );

      /* set form validation */
      this.formdata = this.formBuilder.group({
      f_name: [null, [Validators.required,noWhitespaceValidator]],
      m_name: [''],
      l_name: [null, [Validators.required,noWhitespaceValidator]],
      email: [null, [Validators.required, Validators.email]],
      mobile: [null, [Validators.required, Validators.pattern(new RegExp("[0-9 ]{10}"))]],
      language: [null, Validators.required],
      address: [null, [Validators.required,noWhitespaceValidator]],
      country: [null, Validators.required],
      state: [null, Validators.required],
      city: [null, [Validators.required,noWhitespaceValidator]],
      pin: [null, [Validators.required,noWhitespaceValidator]],
      sex: [null, Validators.required],
      password: [null, Validators.compose([
        Validators.minLength(6),
        Validators.maxLength(30)
      ])],
    });
  }

  loadSubcData()
  {
    this.subscription = this.ds.getData().subscribe(x => { 
      if(x[0]=='set_permission')
      {
         this.set_permission(x[1]);
      }
    });
  }
  

  onSubmit(data:any) {

    this.submitted = true;
  
      if (this.formdata.valid) {
  
        const formData = new FormData();
  
          this.closed = true;
          this.progressbar = true;
        
          formData.append('user_id', this.user_id);
          formData.append('update_by', this.update_by);
          formData.append('f_name', data.f_name);
          formData.append('m_name', data.m_name);
          formData.append('l_name', data.l_name);
          formData.append('email', data.email);
          formData.append('mobile', data.mobile);
          formData.append('language', data.language);
          formData.append('address', data.address);
          formData.append('country', data.country);
          formData.append('state', data.state);
          formData.append('city', data.city);
          formData.append('pin', data.pin);
          formData.append('sex', data.sex);
          formData.append('password', data.password);

          if(this.croppedImage!='')
          {
            formData.append('photo', this.croppedImage);
          }

  
          this.FrontenddbService.UpdateProfile(formData).subscribe(
            res => {
               //console.log(res);
                if(res.status == 'success')
                {
                  this.alertMessage = res.message;
                  this.alertClass = 'primary'; 
                  this.closed = false;
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
      } else {
        this.validateAllFormFields(this.formdata);
      }
   
  }

  
 get f() { return this.formdata.controls; }

 getStateByCountry(state_country:any)
 {
   this.FrontenddbService.getStateList(state_country).subscribe((data:any) => {
     this.stateList = Array.from(Object.keys(data), k=>data[k]);
    });
 }
 
  changeCountry(event:any) {
   /* get state list by selected country in country dropdown */
   this.state_country = event.target.value;
   this.formdata.controls['state'].reset();
   if(event.target.value!=null)
   {
     this.getStateByCountry(this.state_country);
   }
 }  
  
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

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
}

imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    console.log(event, base64ToFile(event.base64));
}

imageLoaded() {
    this.showCropper = true;
    console.log('Image loaded');
}

cropperReady(sourceImageDimensions: Dimensions) {
    console.log('Cropper ready', sourceImageDimensions);
}

loadImageFailed() {
    console.log('Load failed');
}

rotateLeft() {
    this.canvasRotation--;
    this.flipAfterRotate();
}

rotateRight() {
    this.canvasRotation++;
    this.flipAfterRotate();
}

private flipAfterRotate() {
    const flippedH = this.transform.flipH;
    const flippedV = this.transform.flipV;
    this.transform = {
        ...this.transform,
        flipH: flippedV,
        flipV: flippedH
    };
}


flipHorizontal() {
    this.transform = {
        ...this.transform,
        flipH: !this.transform.flipH
    };
}

flipVertical() {
    this.transform = {
        ...this.transform,
        flipV: !this.transform.flipV
    };
}

resetImage() {
    this.scale = 1;
    this.rotation = 0;
    this.canvasRotation = 0;
    this.transform = {};
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

toggleContainWithinAspectRatio() {
    this.containWithinAspectRatio = !this.containWithinAspectRatio;
}

updateRotation() {
    this.transform = {
        ...this.transform,
        rotate: this.rotation
    };
}


openmodal() {

  this.modalshow = 'modal-show';
}

closemodal()
{
  this.modalshow = '';
}

get_wallet(data:any)
{
   this.t_pin = data.transition_pin;
} 

viewTPin(model:any)
{
  this.modalConfgRef = this.modalService.open(model, {ariaLabelledBy: 'modal-basic-title', size: 'sm'});
}

GeneratePin()
{
      this.progressbar = true;
      this.OrderService.generatePin().subscribe((res:any) => {
        this.progressbar = false;
        if(res.status=='success')
        {
            this.resetBasket.next('resetWallet');
            Swal.fire('',res.message,'success');
         }else
        {
            Swal.fire('',res.message,'warning');
        }
    });
}

set_permission(data:any)
{
  if(data.permission.edit_profile=='Denied')
  {
    this.router.navigate(['/']);
  }
}

get_setting(settings:any)
{
    settings.forEach( (myObject:any, index:any) => {
    if(settings[index].skey=="credit_system")
    {
      var svalue = JSON.parse(settings[index].svalue);
      if(svalue[0].status=='Active')
      {
        this.credit_system = 'Active';
      }
    }
   });
}


preloadData()
{
  this.ds.sendData('get_permission');
}

}
