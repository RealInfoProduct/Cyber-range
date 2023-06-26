import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup,  FormBuilder, FormControl, Validators  } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { BackenddbService } from '../../services/backenddb.service';
import { DatapassService } from '../../services/datapass.service';
import { Router, ActivatedRoute } from '@angular/router';
import {lessThanZeroValidator} from '../../helper/validatefun';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs/Subscription';

declare const slidebar:any;
declare const activesidebar:any;

@Component({
  selector: 'app-resource',
  templateUrl: './resource.component.html',
  styleUrls: ['./resource.component.css']
})
export class ResourceComponent implements OnInit {
	
  subscription: Subscription;

	faBars = faBars;	
	
	public _opened: boolean = true; 

  /*instructor dropdown */
  @ViewChild('auto') auto:any;
  limit_start:any = 0; // start limit in select query
  keyword = 'name';
  public instructor_list = []; // store instuctor
  temp_id = [];
  dropdown_instruc_id:string = ''; // assign_instructor_id 
  instructor_selected:boolean = false; // check dropdown selected or not for valication 
  spinner:boolean = false; // show spinner image when dynamin load instructor from db
  disabled_dropdown:boolean = false; // for disable dropdown
  initial_value:string = ""; //  default selected value
  credit_system:string = 'Inactive';

  /*breadcrumbs array */
  current_url_array = [];

  /* for show alert message */
  closed: boolean = true;
  alertMessage: string;
  alertClass: string;

  /* for show flash message  */
  messageArray = {  
    type: "",  
    message: "",  
  }; 
  stringifiedData: any; 
  msgalert:any;

  error: string;
  packagefrm: FormGroup;
  submitted: boolean = false;
  update_by:string;
  update_by_group:string;
  resource_id:string = "";
  form_title:any;
  dashboard_url:string;
  site_url:string;

  //Request Resource
  req_exercise:string = ''; 
  req_team:string = ''; 
  req_users:string = ''; 
  req_vm:string = '';
  req_network:string = '';
  req_template:string = '';
  req_disk:string = ''; 
  req_storage:string = '';     
  req_vcpu:string = '';     
  req_vram:string = ''; 

  /* Used Resource */
  urs_exercise:string = '0'; 
  urs_team:string = '0'; 
  urs_users:string = '0'; 
  urs_vm:string = '0';
  urs_network:string = '0';
  urs_template:string = '0';
  urs_disk:string = '0'; 
  urs_max_vcpu:string = '0'; 
  urs_max_vram:string = '0';
  urs_max_storage:string = '0';
  urs_storage:string = '0';     
  urs_vcpu:string = '0';     
  urs_vram:string = '0';     

  credit:string = '';     

  /* validation error messsage */
  error_messages = {
     'credit': [
      { type: 'required', message: 'Credit required' },
    ],
    'exercise': [
      { type: 'required', message: 'No. of Exercise is required' },
    ],
    'team': [
      { type: 'required', message: 'No. of Team is required' },
    ], 
    'users': [
      { type: 'required', message: 'No. of Users is required' },
    ],   
    'vm': [
      { type: 'required', message: 'No. of Virtual Machine is required' },
    ],    
    'network': [
      { type: 'required', message: 'No. of Network is required' },
    ],
    'disk': [
      { type: 'required', message: 'No. of Disk is required' },
    ],   
    'template': [
      { type: 'required', message: 'No. of Template is required' },
    ],     
    'max_vcpu': [
      { type: 'required', message: 'Max No. of Virtual CPU is required' },
    ], 
    'max_vram': [
      { type: 'required', message: 'Max Virtual RAM is required' },
    ],  
    'max_storage': [
      { type: 'required', message: 'Max Storage is required' },
    ], 
	'storage': [
      { type: 'required', message: 'Storage is required' },
    ], 
    'vcpu': [
      { type: 'required', message: 'No. of Virtual CPU is required' },
    ], 
    'vram': [
      { type: 'required', message: 'Virtual RAM is required' },
    ]  
  } 

  server_url:string
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private loginService: LoginService,
    private BackenddbService: BackenddbService,
    private ds: DatapassService,
    private formBuilder: FormBuilder    
  ) { 
     this.getFlashMessage();
     this.dashboard_url = this.loginService.getDashboardUrl();
     this.site_url = this.loginService.getSiteUrl();
	   this.server_url = this.loginService.getServerUrl();
     this.resource_id = this.route.snapshot.paramMap.get('id');
     this.update_by = this.loginService.getUserId();
     this.update_by_group = this.loginService.getLoginGroup();

     this.loadData();

     const formData = new FormData();
     formData.append('resource_id', this.resource_id);
    
     if(this.resource_id!=null)
     {

      this.current_url_array = [
        {'slug':"resource-list",'label':'Resource List'},
        {'slug':"",'label':'Edit Resource'}
      ];

      this.disabled_dropdown = true;

      this.form_title = "Edit Resource";
      this.ds.Loader(true);
        this.BackenddbService.postData('admin-api/get-resource',formData).subscribe(
          res => {
            this.ds.Loader(false);
             if(res == null)  // check instrutor have create team role
             {
                this.setFlashMessage('danger',"Sorry! didn't get any resource.");
                this.router.navigate([this.dashboard_url+'resource-list/']);
                return true;
             }

             const formData = new FormData();
             formData.append('instructor_id',res.assign_instructor);
             this.loadInstructorDropDownData(formData,'Yes');
             this.getUsedReource(res.id); // get used resource of instructor
             this.packagefrm.patchValue({
               exercise: res.exercise,
               team: res.team,
               users: res.users,
               vm: res.vm,
               network: res.network,
               template: res.template,
               disk: res.disk,
               max_vcpu: res.max_vcpu,
               max_vram: res.max_vram,
               max_storage: res.max_storage,			   
               storage: res.storage,
               vcpu: res.vcpu,
               vram: res.vram,
             });
             var array = ['getResRequest',1,res.assign_instructor];
             this.ds.sendData(array);

          });
         }else
         {
          this.current_url_array = [{'slug':"",'label':'Allocate Resources'}];
            this.form_title = "Allocate Resources";
            formData.append('limit_start',this.limit_start);
            this.loadInstructorDropDownData(formData,'No');
         }
  }

  ngOnInit() {
    activesidebar(); 

    this.packagefrm = this.formBuilder.group({
      exercise: ['', [Validators.required,lessThanZeroValidator]],
      team: ['', [Validators.required,lessThanZeroValidator]],
      users: ['', [Validators.required,lessThanZeroValidator]],
      vm: ['', [Validators.required,lessThanZeroValidator]],
      network: ['', [Validators.required,lessThanZeroValidator]],
      template: ['', [Validators.required,lessThanZeroValidator]],
      disk: ['', [Validators.required,lessThanZeroValidator]],
      max_vcpu: ['',[Validators.required,lessThanZeroValidator]],
      max_vram: ['',[Validators.required,lessThanZeroValidator]],
      max_storage: ['',[Validators.required,lessThanZeroValidator]],
      storage: ['',[Validators.required,lessThanZeroValidator]],
      vcpu: ['',[Validators.required,lessThanZeroValidator]],
      vram: ['',[Validators.required,lessThanZeroValidator]],
  });
  }
  
  action_sidebar(){
    slidebar();
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

  getUsedReource(resource_id:any) // get used resource of instructor
  {
    const formData = new FormData();
    formData.append('resource_id',resource_id);
    this.BackenddbService.postData('admin-api/get-used-resource',formData).subscribe(
      res => {
       /*here set view package data*/
       this.urs_exercise= res.exercise;
       this.urs_team= res.team;
       this.urs_users= res.users;
       this.urs_vm= res.vm;
       this.urs_network= res.network;
       this.urs_template= res.template;
       this.urs_disk= res.disk;
       this.urs_max_vcpu= res.max_vcpu;
       this.urs_max_vram= res.max_vram;
       this.urs_max_storage= res.max_storage;	   
       this.urs_storage= res.storage;
       this.urs_vcpu= res.vcpu;
       this.urs_vram= res.vram;
      }
    );  
  }

  loadInstructorDropDownData(formData:any,selected:any)
  {

    this.BackenddbService.getInstructorDropDownList(formData).subscribe(
      res => {
        res.forEach( (myObject:any, index:any) => {
          let abc = this.instructor_list.find(ob => ob['id'] === res[index].U_ID);
          if(typeof(abc) ==='undefined')
          {
            this.instructor_list.push({id:res[index].U_ID,name:res[index].F_Name+" "+res[index].L_Name+" - "+res[index].eMail});
            if(selected=='Yes')
            {
              this.initial_value = res[index].F_Name+" "+res[index].L_Name+" - "+res[index].eMail;
              this.dropdown_instruc_id = res[index].U_ID;
            }
          }
        });
        if(res.length>0)
        {
          this.limit_start = this.limit_start+10;
        }
      });
  }
  
  addNewResource(formData:any)
  {
    this.BackenddbService.postData('admin-api/add-new-resource',formData).subscribe(
      res => {
          this.ds.Loader(false);
          this.closed = false;
          if(res.status == 'success')
          {
            this.setFlashMessage('primary',res.message);
            this.router.navigate([this.dashboard_url+'resource/'+res.insert_resource_id]);
          }else if(res.status === 'error')
          {
            this.alertMessage = res.message;
            this.alertClass = 'danger'; 
          }
      },
      error => this.error = error
    )
  }

  updateResource(formData:any)
  {
    this.BackenddbService.postData('admin-api/update-resource',formData).subscribe(
      res => {
          this.ds.Loader(false);
          this.alertMessage = res.message;
          this.closed = false;
          if(res.status == 'success')
          {
            this.alertClass = 'primary'; 
            this.ds.sendData('notification');
          }else if(res.status === 'error')
          {
            this.alertClass = 'danger'; 
          }
      },
      error => this.error = error
    )
  }

  onSubmit(data:any) {

    this.submitted = true;
  
      if (this.packagefrm.valid) {
          const formData = new FormData();
          this.closed = true;
          this.ds.Loader(true);
          if(typeof data.credit != 'undefined')
          {
            formData.append('credit', data.credit);
          }
          if(this.resource_id!=null)
          {
           formData.append('rs_id', this.resource_id);
          }
          formData.append('rs_exercise', data.exercise);
          formData.append('rs_team', data.team);
          formData.append('rs_users', data.users);
          formData.append('rs_vm', data.vm);
          formData.append('rs_network', data.network);
          formData.append('rs_template', data.template);
          formData.append('rs_disk', data.disk);
          formData.append('rs_vcpu', data.vcpu);
          formData.append('rs_vram', data.vram);		  
          formData.append('rs_storage', data.storage);
          formData.append('rs_max_vcpu', data.max_vcpu);
          formData.append('rs_max_vram', data.max_vram);
          formData.append('rs_max_storage', data.max_storage);
		  
          if(this.resource_id==null)
          {
            formData.append('rs_assign_instructor', this.dropdown_instruc_id);
            formData.append('rs_created_by', this.update_by);
          } 

          /* check if package_id null then insert new package*/
          if(this.resource_id==null)  
          {
            this.addNewResource(formData);  /*insert new package*/
          }else
          { 
            this.updateResource(formData);  /*update existing package*/
          }
      } else {

        if(this.dropdown_instruc_id=="")  // validation for instructor dropdown
        {
          this.instructor_selected = true;
        }
        this.validateAllFormFields(this.packagefrm); // check validation
      }
    
  }

  
 get f() { return this.packagefrm.controls; }

  
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


    //get setting from header  
get_setting(settings:any)
{
  settings.forEach( (myObject:any, index:any) => {
    if(settings[index].skey=='credit_system')
    {
      var svalue = JSON.parse(settings[index].svalue);
      if(svalue[0].status=='Active')
      {
        this.credit_system = svalue[0].status;
        let newCtl = new FormControl('', null);
        this.packagefrm.addControl('credit', newCtl);

        if(this.resource_id!=null)
        {
          var array = ['getCredit',1,this.resource_id];
          this.ds.sendData(array);
        }
      }
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

  setResRequest(data:any)
  {
    this.req_exercise = "("+data.exercise+")"; 
    this.req_team = "("+data.team+")";  
    this.req_users = "("+data.users+")"; 
    this.req_vm = "("+data.vm+")";  
    this.req_network = "("+data.network+")";  
    this.req_template = "("+data.template+")";  
    this.req_disk = "("+data.disk+")";  
    this.req_storage = "("+data.storage+")";    
    this.req_vcpu = "("+data.vcpu+")";      
    this.req_vram = "("+data.vram+")";   
  }

  selectEvent(item:any) {

    this.req_exercise = '';  
    this.req_team = '';  
    this.req_users = '';  
    this.req_vm = '';   
    this.req_network = '';  
    this.req_template = '';  
    this.req_disk = '';  
    this.req_storage = '';    
    this.req_vcpu = '';      
    this.req_vram = ''; 

    this.dropdown_instruc_id = item.id; //assign instructor id when choose in instructor dropdown
    this.instructor_selected = false;
    this.ds.Loader(true);
    const formData = new FormData();
    formData.append('instructor_id',item.id);
    this.BackenddbService.postData('admin-api/get-used-resource',formData).subscribe(
      res => {
        this.ds.Loader(false);
         if(res.length != 0)
         {
          this.resource_id = res.resource.id; 
          this.packagefrm.patchValue({
            exercise: res.resource.exercise,
            team: res.resource.team,
            users: res.resource.users,
            vm: res.resource.vm,
            network: res.resource.network,
            template: res.resource.template,
            disk: res.resource.disk,
            max_vcpu: res.resource.max_vcpu,
            max_vram: res.resource.max_vram,
            max_storage: res.resource.max_storage,			   
            storage: res.resource.storage,
            vcpu: res.resource.vcpu,
            vram: res.resource.vram,
          });

          this.urs_exercise= res.used_resource.exercise;
          this.urs_team= res.used_resource.team;
          this.urs_users= res.used_resource.users;
          this.urs_vm= res.used_resource.vm;
          this.urs_network= res.used_resource.network;
          this.urs_template= res.used_resource.template;
          this.urs_disk= res.used_resource.disk;
          this.urs_max_vcpu= res.used_resource.max_vcpu;
          this.urs_max_vram= res.used_resource.max_vram;
          this.urs_max_storage= res.used_resource.max_storage;	   
          this.urs_storage= res.used_resource.storage;
          this.urs_vcpu= res.used_resource.vcpu;
          this.urs_vram= res.used_resource.vram;

          var array = ['getResRequest',1,item.id];
          this.ds.sendData(array);
        
         }else
         {
            this.clearForm();
         }

      });  

  }

  clearForm()
  {
          this.resource_id=null;
          this.packagefrm.patchValue({
            exercise: '',
            team: '',
            users: '',
            vm: '',
            network: '',
            template: '',
            disk: '',
            max_vcpu: '',
            max_vram: '',
            max_storage: '',		   
            storage: '',
            vcpu: '',
            vram: '',
          });

          this.urs_exercise = '0';
          this.urs_team= '0';
          this.urs_users= '0';
          this.urs_vm= '0';
          this.urs_network= '0';
          this.urs_template= '0';
          this.urs_disk= '0';
          this.urs_max_vcpu= '0';
          this.urs_max_vram= '0';
          this.urs_max_storage= '0';   
          this.urs_storage= '0';
          this.urs_vcpu= '0';
          this.urs_vram= '0';
  }

  onFocused(e:any) {
    this.instructor_selected = false;
  }

  inputCleared(event:any){
    if(typeof(event) ==='undefined')
    {
      this.dropdown_instruc_id = '';
      this.instructor_selected = false;
      this.clearForm();
    }

  }

  inputChanged(keyword:any){
    this.spinner = true;
    this.instructor_selected = false;

    const formData = new FormData();
    formData.append('search',keyword);
    this.BackenddbService.getInstructorDropDownList(formData).subscribe(
      res => {
        res.forEach( (myObject:any, index:any) => {
          let abc = this.instructor_list.find(ob => ob['id'] === res[index].U_ID);
          if(typeof(abc) ==='undefined')
          {
            this.instructor_list.push({id:res[index].U_ID,name:res[index].F_Name+" "+res[index].L_Name+" - "+res[index].eMail});
          }
        });
        this.spinner = false;
      });
  }

  scrolledToEnd(item:any) {
        this.spinner = true;
        this.instructor_selected = false;
        const formData = new FormData();
        formData.append('search','');
        formData.append('limit_start',this.limit_start);
        this.BackenddbService.getInstructorDropDownList(formData).subscribe(
          res => {
            res.forEach( (myObject:any, index:any) => {
              let abc = this.instructor_list.find(ob => ob['id'] === res[index].U_ID);
              if(typeof(abc) ==='undefined')
              {
                this.instructor_list.push({id:res[index].U_ID,name:res[index].F_Name+" "+res[index].L_Name+" - "+res[index].eMail});
              }
            });
            if(res.length>0)
            {
              this.limit_start = this.limit_start+10;
            }
            this.spinner = false;
            this.auto.open();
          });
   
 }

 preloadData()
{
   this.ds.sendData('setting');
}

}

