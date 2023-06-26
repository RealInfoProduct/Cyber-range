import { Component, OnInit } from '@angular/core';

import { FormGroup,  FormBuilder, FormControl, Validators  } from '@angular/forms';
import { FrontenddbService } from '../../services/frontenddb.service';
import { LoginService } from '../../services/login.service';
import { BackenddbService } from '../../services/backenddb.service';
import { OrderService } from '../../services/order.service';
import { ChatService } from '../../services/chat.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

import { Router, ActivatedRoute } from '@angular/router';

import {noWhitespaceValidator} from '../../helper/validatefun';
import {mustMatch} from '../../helper/confirmed.validator';

import { ImageCroppedEvent,ImageTransform,Dimensions,base64ToFile } from 'ngx-image-cropper';
import { faBars, faCamera } from '@fortawesome/free-solid-svg-icons'; 
import Swal from 'sweetalert2';
import { DatapassService } from '../../services/datapass.service';
import { Subscription } from 'rxjs/Subscription';
declare const activesidebar:any;

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css']
})
export class UserprofileComponent implements OnInit {

	faBars = faBars;
	faCamera = faCamera;
  subscription: Subscription;

	public _opened: boolean = true; 
	public _toggleSidebar() {
		this._opened = !this._opened;
	}  	 
	/*open() {}
	close() {}
	triggerRerender() {}*/
	
  error: string;
  closed: boolean = true;
  checkMail: boolean = true;
  alertMessage: string;
  alertClass: string;
  public countryList = [];
  public stateList = [];
  public userStatusList = [];
  public groupList = [];
  state_country:string;
  formdata: FormGroup;
  frmcommission: FormGroup;
  submitted: boolean = false;
  update_by:string;
  update_by_group:string;
  user_id:string;
  modal_type:string="tpin";
  isCheckedPassChange:boolean = false;
  user_role:string = '';
  // flash message
  messageArray = {  
    type: "",  
    message: "",  
  }; 
  stringifiedData: any; 
  msgalert:any;

  form_title:any;
  modalfadeclass:string = "";
  modalshow:string = "";
  current_gp_id:string = "";

  imageChangedEvent: any = '';
  croppedImage: any = '';
  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  showCropper = false;
  containWithinAspectRatio = false;
  transform: ImageTransform = {};

  last_login_date:string = '';

  //transcation pin popup 
  modalConfgRef:any;

  //transaction pin
  t_pin:string = "";

  credit_system:string = "Inactive";
  setting = [];

   /*breadcrumbs array */
  current_url_array = [];

  error_messages = {
    'group': [
      { type: 'required', message: 'User Role required' },
    ],
    'user_status': [
      { type: 'required', message: 'User Status is required' },
    ],    
    'f_name': [
      { type: 'required', message: 'First Name is required' },
    ],
    'm_name': [
      { type: 'required', message: 'Middle Name is required' },
    ],
    'l_name': [
      { type: 'required', message: 'Last Name is required' },
    ],   
     'email': [
      { type: 'required', message: 'Email is required' },
      { type: 'email', message: 'Valid Email required' },
    ],   
    'mobile': [
      { type: 'required', message: 'Mobile No is required' },
      { type: 'pattern', message: 'Valid mobile no required' },
    ],   
    'language': [
      { type: 'required', message: 'Language is required' },
    ],   
    'address': [
      { type: 'required', message: 'Address is required' },
    ],   
    'country': [
      { type: 'required', message: 'Country is required' },
    ],   
    'state': [
      { type: 'required', message: 'State is required' },
    ],   
    'city': [
      { type: 'required', message: 'City is required' },
    ],   
    'pin': [
      { type: 'required', message: 'Pin is required' },
    ],   
    'sex': [
      { type: 'required', message: 'Gender is required' },
    ],   
    'password': [
      { type: 'required', message: 'Password is required' },
      { type: 'minlength', message: 'Password length.' },
      { type: 'maxlength', message: 'Password length.' }
    ],   
    'confirm_password': [
      { type: 'required', message: 'Confirm Password is required' },
    ], 
    'commission': [
      { type: 'required', message: 'Commission is required' },
    ],
  }
  
  server_url:string;

  dashboard_url:string = "";

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private loginService: LoginService,
    private FrontenddbService: FrontenddbService,
    private BackenddbService: BackenddbService,
    private OrderService: OrderService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,   
    private  ChatService :ChatService,
    private ds: DatapassService 
  ) { 
		this.dashboard_url = this.loginService.getDashboardUrl();
		this.getFlashMessage();
		this.server_url = this.loginService.getServerUrl();

    this.user_id = this.route.snapshot.paramMap.get('id');
    this.update_by = this.loginService.getUserId();
    this.update_by_group = this.loginService.getLoginGroup();

    if(this.update_by_group=='2')
    {
      this.user_id=this.update_by;
    }
   
    
    /* get country list from db */
    this.FrontenddbService.getCountryList().subscribe((data:any) => {
      this.countryList = Array.from(Object.keys(data), k=>data[k]);
     });

     /* get user status list from CI */   
     this.BackenddbService.getStatusList().subscribe((data:any) => {
      this.userStatusList = Array.from(Object.keys(data), k=>data[k]);
     });    
     
      /* get user list form db */   
    this.BackenddbService.getUserGroupList().subscribe((data:any) => {
      this.groupList = Array.from(Object.keys(data), k=>data[k]);
    // console.log(this.groupList);
    });  

  }

  ngOnInit() {
    activesidebar();
    this.subscription = this.ds.getData().subscribe(x => { 
      if(x[0]=='setting')
      {
         this.get_setting(x[1]);
      }else if(x[0]=='wallet')
      {
         this.get_wallet(x[1]);
      }
    });

    const formData = new FormData();
    formData.append('user_id', this.user_id);
    formData.append('update_by', this.update_by);
    

if(this.user_id!=null)
{
	if(this.update_by_group == '1') 
	{
		this.current_url_array = [
			{'slug':"users-list",'label':'Users List'},
			{'slug':"",'label':'Edit Profile'}
		];
	}
	else
	{
		this.current_url_array = [			
			{'slug':"",'label':'Edit Profile'}
		];
	}
	
	  
   this.form_title = "Edit Profile";
   this.ds.Loader(true);
   this.FrontenddbService.getProfile(formData).subscribe(
     res => {
      this.ds.Loader(false);
      this.croppedImage = res.Photo;
      this.getStateByCountry(res.Country);

      if(res.force_passwd_change=='true')
      {
        this.isCheckedPassChange = true; 
      }

      this.current_gp_id = res.gid; 
     
       this.formdata.patchValue({
           group: res.gid,
           user_status: res.user_status,
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
           force_passwd_change: this.isCheckedPassChange
       });

       this.last_login_date = res.last_login_date;
     }
   );
   
    }else
    {
		this.current_url_array = [{'slug':"",'label':'Add New User'}];
		
       this.form_title = "Add New User";
    }

    this.frmcommission = this.formBuilder.group({
      commission: [null, Validators.required],
    }) 

    if(this.user_id!=null)
    {
      /* set form validation */
      this.formdata = this.formBuilder.group({
      group: [null, Validators.required],
      user_status: [null, Validators.required],
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
      force_passwd_change: [''],
      password: [null, Validators.compose([
        Validators.minLength(6),
        Validators.maxLength(30)
      ])],
      confirm_password:  [null]
    }, {
        validator: mustMatch('password', 'confirm_password')
    });

  }else
  {

/* set form validation */
this.formdata = this.formBuilder.group({
  group: [null, Validators.required],
  user_status: [null, Validators.required],
  f_name: [null, [Validators.required,noWhitespaceValidator]],
  
  m_name: [''],
  l_name: [null, [Validators.required,noWhitespaceValidator]],
  cyber_user_id:'',
  email: [null, [Validators.required, Validators.email]],
  mobile: [null, [Validators.required, Validators.pattern(new RegExp("[0-9 ]{10}"))]],
  language: [null, Validators.required],
  address: [null, [Validators.required,noWhitespaceValidator]],
  country: [null, Validators.required],
  state: [null, Validators.required],
  city: [null, [Validators.required,noWhitespaceValidator]],
  pin: [null, [Validators.required,noWhitespaceValidator]],
  sex: [null, Validators.required],
  force_passwd_change: [''],
  password: [null, Validators.compose([
    Validators.required,
    Validators.minLength(6),
    Validators.maxLength(30)
  ])],
  confirm_password:  [null, Validators.required]
}, {
    validator: mustMatch('password', 'confirm_password')
});
  

  }

  }
  
  addNewUserProfile(formData:any)
  {
    this.ds.Loader(true);
    this.FrontenddbService.RegistrationSubmit(formData).subscribe(
      res => {
          this.ds.Loader(false);
          this.closed = false;
          if(res.status == 'success')
          {
            this.formdata.patchValue({
              cyber_user_id :res.insert_user_id
            });
           
            this.ChatService.register(this.formdata.value).subscribe(
              response => {
               // console.log(JSON.stringify(response));
               // localStorage.setItem('userid', response.userId);
               });


             //end   chat registration 
            this.setFlashMessage('primary',res.message);
            this.router.navigate(['/dd-terminal/user-profile/'+res.insert_user_id]);
          }else if(res.status === 'error')
          {
            this.alertMessage = res.message;
            this.alertClass = 'danger'; 
          }
      },
      error => this.error = error
    )
  }

  updateUserProfile(formData:any)
  {

    this.FrontenddbService.UpdateProfile(formData).subscribe(
      res => {
          this.ds.Loader(false);
          this.closed = false;
          this.alertMessage = res.message;
          if(res.status == 'success')
          {
         this.ChatService.updateProfile(this.formdata.value).subscribe(
              response => {
                   // alert(JSON.stringify(response.message));
                   // localStorage.setItem('userid', response.userId);
               });

            this.alertClass = 'primary'; 
          }else if(res.status === 'error')
          {
            this.alertClass = 'danger'; 
          }
      },
      error => this.error = error
    )

  }

  EditCommission(data:any)
  { 
    if (this.frmcommission.valid) {
      this.ds.Loader(true);
      const formData = new FormData();
      formData.append('user_id', this.user_id);
      formData.append('commission', data.commission);
      var api_url = 'admin-api/update-commission';
      this.BackenddbService.postData(api_url,formData).subscribe(
        res => {
              this.ds.Loader(false);
              if(res.status=='success')
              {
                this.modalConfgRef.close();
                Swal.fire('',res.message,'success');
              }else if(res.status=='error')
              {
                 Swal.fire('',res.message,'warning');
              }
      });
    } else {
      this.validateAllFormFields(this.frmcommission);
    }  
  }

  onSubmit(data:any) {

    this.submitted = true;
  
      if (this.formdata.valid) {
  
        const formData = new FormData();
  
          this.closed = true;
          this.ds.Loader(true);
          var user_group = '';
          if(this.update_by_group=='2')
          {
              user_group = this.update_by_group;
          }else
          {
              user_group = data.group;
          }
          formData.append('user_id', this.user_id);
          formData.append('update_by', this.update_by);
          formData.append('update_by_group', this.update_by_group);
          formData.append('group', user_group);
          formData.append('user_status', data.user_status);
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
          formData.append('force_passwd_change', data.force_passwd_change);

          if(this.croppedImage!='')
          {
            formData.append('photo', this.croppedImage);
          }

          /* check if user_id null then insert new user */
          if(this.user_id==null)  
          {
            this.addNewUserProfile(formData);  /*insert new user*/
          }else
          { 
            this.updateUserProfile(formData);  /*update existing user*/
          }
        
      } else {
        this.validateAllFormFields(this.formdata);
      }
    
  }
  
 get f() { return this.formdata.controls; }

 /*  get state list of select country */
 getStateByCountry(state_country:any)
 {
   this.FrontenddbService.getStateList(state_country).subscribe((data:any) => {
     this.stateList = Array.from(Object.keys(data), k=>data[k]);
     //console.log(data);
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
//get setting from header  
get_setting(settings:any)
{
  this.setting = settings;
  console.log(settings);
  this.setting.forEach( (myObject:any, index:any) => {
    if(this.setting[index].skey=='credit_system')
    {
      var svalue = JSON.parse(this.setting[index].svalue);
      if(svalue[0].status=='Active')
      {
         this.credit_system = svalue[0].status;
      }
    }
   });
}
get_wallet(data:any)
{
   this.t_pin = data.transition_pin;
} 
viewTPin(model:any)
{
  this.modal_type = "tpin";
  this.modalConfgRef = this.modalService.open(model, {ariaLabelledBy: 'modal-basic-title', size: 'sm'});
}
getCommission()
{
  this.ds.Loader(true);
   const formData = new FormData();
   formData.append('user_id', this.user_id);
   var api_url = 'admin-api/get-commission';
   this.BackenddbService.postData(api_url,formData).subscribe(
     res => {
      this.ds.Loader(false);
      if(res.commission!='')
      {
        this.frmcommission.patchValue({
          commission :res.commission
        });        
      }

    });  

}
viewCommission(model:any)
{
  this.getCommission()
  this.modal_type = "commission";
  this.modalConfgRef = this.modalService.open(model, {ariaLabelledBy: 'modal-basic-title', size: 'sm'});
}

GeneratePin()
{
      this.ds.Loader(true);
      this.OrderService.generatePin().subscribe((res:any) => {
        this.ds.Loader(false);
        if(res.status=='success')
        {
            this.ds.sendData('resetWallet');
            Swal.fire('',res.message,'success');
         }else
        {
            Swal.fire('',res.message,'warning');
        }
    });
}

preloadData()
{
  this.ds.sendData('setting');
  this.ds.sendData('resetWallet');
}

}
