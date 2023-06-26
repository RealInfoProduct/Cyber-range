import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild,ElementRef , QueryList, ViewChildren, } from '@angular/core';
import { FormGroup,  FormBuilder, FormArray, FormControl, Validators  } from '@angular/forms';
import { FrontenddbService } from '../../services/frontenddb.service';
import { LoginService } from '../../services/login.service';
import { BackenddbService } from '../../services/backenddb.service';

import { Router, ActivatedRoute } from '@angular/router';
import {noWhitespaceValidator} from '../../helper/validatefun';

import { DatapassService } from '../../services/datapass.service';
import { Subscription } from 'rxjs/Subscription';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { faSort, faRandom, faLaptop ,faArrowCircleRight, faArrowCircleLeft, faUser, faEdit, faTrash, faUsers, faEye,faBars, faCamera,faPlus,faMinus,faCog,faPowerOff,faDesktop,faDownload ,faFileExport,faRedo,faList,faNetworkWired 
  ,faStar, faQuestion, faQuestionCircle, faCircle, faShoppingCart, faFlag, faTasks, faTrophy, faCreditCard, faCartPlus, faUserCircle,faFile} from '@fortawesome/free-solid-svg-icons';
  declare const activesidebar:any;
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-package',
  templateUrl: './package.component.html',
  styleUrls: ['./package.component.css']
})
export class PackageComponent implements OnInit {
  viewProfile : Subject<any> = new Subject<any>();

 //fontasome icon
 faUser = faUser;
 faEdit = faEdit;
 faTrash = faTrash;	
 faUsers = faUsers;	
 faEye = faEye;	
 faBars = faBars;
 faCamera = faCamera;
 faPlus = faPlus;
 faMinus = faMinus;
 faCog = faCog;
 faPowerOff = faPowerOff;
 faDesktop = faDesktop;
 faDownload = faDownload;
 faFile = faFileExport;
 faRedo = faRedo;
 faList = faList;
 faNetworkWired = faNetworkWired;
 faArrowCircleLeft = faArrowCircleLeft;
 faArrowCircleRight = faArrowCircleRight;
 faLaptop = faLaptop;
 faRandom = faRandom;
 faStar = faStar;
 faQuestion = faQuestion;
 faQuestionCircle = faQuestionCircle;
 faCircle = faCircle;
 faShoppingCart = faShoppingCart;
 faFlag = faFlag;
 faTrophy = faTrophy;
 faCreditCard = faCreditCard;
 faCartPlus = faCartPlus;
 faUserCircle = faUserCircle;
 faFileM = faFile;
 faSort = faSort;

	public _opened: boolean = true; 
	public _toggleSidebar() {
		this._opened = !this._opened;
	} 
  subscription: Subscription;
  error: string;
  formdata: FormGroup;
  submitted: boolean = false;
  update_by:string;
  group_id:string;
  id:string;
  form_title:any = 'Add New Exercise Bundle';
  dashboard_url:string;
  credit_system:string = 'Inactive'
  setting:any = []

  /*breadcrumbs array */
  current_url_array = [];
  exercise_array:any = [];
  exeData:any = [];

  /* alert message */
  closed: boolean = true;
  alertMessage: string;
  alertClass: string;
  topicslist:any = [];

  /* flash message */
  messageArray = {  
    type: "",  
    message: "",  
  }; 
  stringifiedData: any; 
  msgalert:any;

  @ViewChild('multiSelect') exercise_dropdown;
  exercise_dropdownList = [];
  exercise_selectedItems = [];
  exercise_dropdownSettings = {};
  ex_detail = [];
  // exercise dropdown
  ex_limit_start:any = 0;
  ex_search:string = '';
  disable:boolean = false;
  roadmap:boolean = false;

  error_messages = {
    'package_exe': [
      { type: 'required', message: 'Exercise is required' },
    ],  
    'package_name': [
      { type: 'required', message: 'Exercise Bundle is required' },
    ],
  }
  
  server_url:string;
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private loginService: LoginService,
    private FrontenddbService: FrontenddbService,
    private BackenddbService: BackenddbService,
    private formBuilder: FormBuilder,
    private ds: DatapassService
    
  ) { 

     this.getFlashMessage();
	 
	   this.server_url = this.loginService.getServerUrl();
     this.dashboard_url = this.loginService.getDashboardUrl();
     this.group_id = this.loginService.getLoginGroup();
     this.update_by = this.loginService.getUserId();
  

  }

  ngOnInit() {
    activesidebar(); 
   
    this.loadData();

    this.id = this.route.snapshot.paramMap.get('id');

    this.getExerciseDropDown();
    if(this.id!=null)
    {
      this.current_url_array = [
          {'slug':"package-list",'label':'Package List'},
          {'slug':"",'label':'Edit Package'}
        ];
      this.form_title = "Edit Package";
      this.getPackage();
    }
	  else
  	{
		  this.current_url_array = [{'slug':"",'label':'Add New Package'}];
    }
	

    /* set form validation */ 
      this.formdata = this.formBuilder.group({
        package_exe: ['', [Validators.required]],
        package_name: ['', [Validators.required,noWhitespaceValidator]]
    });

    this.exercise_selectedItems = [];
    this.exercise_dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      allowRemoteDataSearch:true,
      limitSelection:10
    };
  }
  

  isNoteChecked(e:any)
  {
     this.roadmap = e.target.checked
  }

  loadData()
  {
        var array = ['checkClaim','2',''];
        this.ds.sendData(array);
        this.subscription = this.ds.getData().subscribe(x => { 
          if(x[0]=='set_permission')
          {
            this.set_permission(x[1]);
          }
      });
  }

  getPackage()
  {
    this.ds.Loader(true);
    const formData = new FormData();
    formData.append('id', this.id);
    var api = 'admin-api/get-package';
    this.BackenddbService.postData(api,formData).subscribe(
      res => {
         this.ds.Loader(false);
         if(res.status=='success')
         {
          let data = res.data
          data.ex_id.forEach((exObj:any, index:any) => {
            this.exercise_array.push(exObj.id);
          }); 
            this.getExercise(this.exercise_array);
            this.formdata.patchValue({
                package_exe: data.ex_id,
                package_name: data.group_name,
                roadmap: data.roadmap
            });
            this.disable = data.roadmap
            this.roadmap = data.roadmap
         }else
         {
           this.setFlashMessage('primary',res.message);
           this.router.navigate([this.dashboard_url+'package-list']);
         }
      }
    );
  }  

  getExerciseDropDown()
  {
		const formData = new FormData();
		formData.append('search',this.ex_search);
		formData.append('limit_start','');
		this.BackenddbService.postData('admin-api/get-exercise-dropdown',formData).subscribe((res:any) => {
         this.exercise_dropdownList = Array.from(Object.keys(res), k=>res[k]);
		});
  }

  public onItemSelect(item: any,type:any) 
  {
      this.exercise_array.push(item.id);
      this.getExercise(this.exercise_array);
  }     

  public onItemDeSelect(item: any,type:any) 
  {
    let index = this.exercise_array.findIndex(x => x == item.id);
    this.exercise_array.splice(index,1);
    this.getExercise(this.exercise_array);
  }  

  getExercise(ex_id:any)
  {
    this.ds.Loader(true);
    const formData = new FormData();
    formData.append('ex_id',JSON.stringify(ex_id));
	  var api = 'admin-api/get-exercise';
	  this.BackenddbService.postData(api,formData).subscribe((res:any) => {
      this.ex_detail = Array.from(Object.keys(res), k=>res[k]);
      this.ds.Loader(false);
		});
  }


  onSubmit(data:any) {

      if (this.formdata.valid) {
          this.closed = true;
          this.ds.Loader(true);
          const formData:any = new FormData();
          formData.append('id', this.id);
          formData.append('package_exe', JSON.stringify(data.package_exe));
          formData.append('package_name', data.package_name);
          formData.append('roadmap', this.roadmap);
          formData.append('roadmap_exe', JSON.stringify(this.ex_detail));

          var api = 'admin-api/update-package';
          this.BackenddbService.postData(api,formData).subscribe(
            res => {
                this.ds.Loader(false);
                this.closed = false;
                if(res.status == 'success')
                {
                  this.ds.sendData('notification');
                  this.setFlashMessage('primary',res.message);
                  this.router.navigate([this.dashboard_url+'package/'+res.insert_id]);
                }else if(res.status === 'error')
                {
                  this.alertMessage = res.message;
                  this.alertClass = 'danger'; 
                }
            },
            error => this.error = error
          )
        
      } else {
        this.validateAllFormFields(this.formdata);
      }
    
  }

  onDrop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
       moveItemInArray(event.container.data, 
        event.previousIndex, event.currentIndex);
    } else {
       transferArrayItem(event.previousContainer.data,
       event.container.data,
       event.previousIndex,
       event.currentIndex);
    }
   }

  openExeModal(index:any)
  {
    this.exeData =  this.ex_detail.find((ob,ind) => ind===index);
    (<any>$('#reqModal')).modal('show');
  }

  viewUserProfile(user_id:any)
  {
    this.viewProfile.next(user_id);
  }

  //get setting from header  
get_setting(settings:any)
{
  this.setting = settings;
  this.setting.forEach( (myObject:any, index:any) => {
    if(this.setting[index].skey=='credit_system')
    {
      var svalue = JSON.parse(this.setting[index].svalue);
      if(svalue[0].status=='Active')
      {
        this.credit_system = svalue[0].status;
       // this.dtchange.detectChanges();
      }
    }
   });
}


  
 get f() { return this.formdata.controls; }

 
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
  preloadData()
  {
     this.ds.sendData('get_permission');
  }
  set_permission(data:any)
  {
      if(typeof data.create_exercise != 'undefined' && data.create_team=='false')
      {
         this.router.navigate([this.dashboard_url+'dashboard']);
      }
  }
  

}
