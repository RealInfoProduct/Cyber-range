import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild,ElementRef , QueryList, ViewChildren, ChangeDetectorRef } from '@angular/core';
import { HttpClient,HttpParams  } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BackenddbService } from '../../services/backenddb.service';
import { FrontenddbService } from '../../services/frontenddb.service';

import { LoginService } from '../../services/login.service';
import { ManualService } from '../../services/manual.service';

import { FormGroup,  FormBuilder, FormArray, FormControl, Validators  } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {noWhitespaceValidator} from '../../helper/validatefun';

import { AngularEditorConfig } from '@kolkov/angular-editor';

import { ImageCroppedEvent,ImageTransform,Dimensions,base64ToFile } from 'ngx-image-cropper';
import { faUser, faEdit, faTrash, faUsers, faEye,faBars, faCamera } from '@fortawesome/free-solid-svg-icons';

import { IDropdownSettings } from 'ng-multiselect-dropdown';

import Swal from 'sweetalert2';
import { DatapassService } from '../../services/datapass.service';
import { Subscription } from 'rxjs/Subscription';
declare const collapse:any;

@Component({
  selector: 'app-editexercise',
  templateUrl: './editexercise.component.html',
  styleUrls: ['./editexercise.component.css'],
  })
export class EditexerciseComponent implements OnInit {
  @ViewChild('vmAliasInput') vmAliasInput: ElementRef;
  subscription: Subscription;
	faUser = faUser;
	faEdit = faEdit;
	faTrash = faTrash;	
	faUsers = faUsers;	
	faEye = faEye;	
  faBars = faBars;
  faCamera = faCamera;

  public _opened: boolean = true; 
  public _toggleSidebar() {
    this._opened = !this._opened;
  } 

  @ViewChild('auto') auto:any;
  limit_start:any = 0; // start limit in select query
  keyword = 'name';
  public instructor_list = []; // store instuctor
  dropdown_instruc_id:string = ''; // assign_instructor_id 
  instructor_selected:string = ''; // check dropdown selected or not for valication 
  spinner:boolean = false; // show spinner image when dynamin load instructor from db
  disabled_dropdown:boolean = false; // for disable dropdown
  initial_value:string = ""; //  default selected value

  @ViewChild('multiSelect') manual_dropdown;
  manual_dropdownList = [];
  start_man_selectedItems = [];
  manual_dropdownSettings = {};
  start_manual:any = "";

  // exercise manual for manual drop down
  @ViewChild('multiSelect') multi_manual_dropdown;
  multi_manual_dropdownSettings = {};
  multi_man_selectedItems = [];
  manual_id = [];

  // exercise manual for template drop down
  @ViewChild('multiSelect') template_dropdown;
  template_dropdownList = [];
  template_selectedItems = [];
  template_dropdownSettings = {};

  // vm alias for template drop down
  @ViewChild('multiSelect') vm_als_temp_dp;
  vm_als_temp_dpList = [];
  vm_als_temp_items = [];
  vm_als_temp_dpSettings = {};
  current_vm_alias:string = '';

  @ViewChild('multiSelect') package_dropdown;
  package_list:any = [];
  package_selectedItems = [];
  package_dropdownSettings = {};

  @ViewChild('multiSelect') ex_owner_dp;
  ex_owner_dp_list = [];
  ex_owner_dp_items = [];
  ex_owner_dpSettings = {};
  current_ex_owner:string = '';

  @ViewChild('multiSelect') mit_dp;
  mit_dpList = [];
  mit_items = [];
  mit_dpSettings = {};
  mit_category_list:any = [];

  @ViewChild('multiSelect') mit_tech_dp;
  mit_tech_dpList = [];
  mit_tech_items = [];
  mit_tech_dpSettings = {};
  mit_tech_list:any = [];

  @ViewChild('multiSelect') mit_sub_tech_dp;
  mit_sub_tech_dpList = [];
  mit_sub_tech_items = [];
  mit_sub_tech_dpSettings = {};
  mit_sub_tech_list:any = [];

  mitre_temp:any = [];
  mitre_list:any = [];
  current_mit_category:string = '';

  /* process bar */
  progressbar:boolean = false;
  progress_message:string = '';
  package_id:string = '';

  /*flash message*/
  msgalert:any;

  current_url_array = [];
  form_title:any = 'Edit Exercise';

  dashboard_url:string = '';

  status_array = ['Active','Inactive'];
  visibility_array = ['Public','Private'];

  exefrm: FormGroup;
  group_id:string = '';
  modalfadeclass:string = "";
  modalshow:string = "";
  error: string;
  closed: boolean = true;
  closedpopop: boolean = true;
  alertMessage: string;
  alertClass: string;
  update_by:string;
  closeResult = '';
  serverUrl = environment.baseUrl;

  setting:any = [];
  credit_system:string = 'Inactive';
  default_credit:string = '0';
  total_credit:number = 0;
  wallet_balance:number = 0;

  mitre_system:string = 'Inactive';

  // Keywords input fields
  valid:boolean = false;
  keyword_array = []; 
  exercise_manual = [];
  vm_alias = [];
  permission = [];
  selected_template:any = '';
  selected_vm_als_tmp:any = '';

  closeSelection: boolean = true;
  upload_image: boolean = false;

  placeholder = "Keywords";
  sec_placeholder = "Keywords"; 
  short_desc_placeholder = "Short Description";
  long_desc_placeholder = "Long Description";
  errorMessages = "Keywords required.";

  teamingList = [];
	manual_list:any;
  template_list:any;

  /*assign team to user*/
  ex_id:string = '';
  ex_name:string = '';
  ex_created_by:string = '';
  ex_assign_to:string = '';
  ex_short_desc:string = '';
  ex_long_desc:string = '';
  ex_key_words:string = '';
  ex_difficulty_level:string = '';
  ex_rating:string = '';
  ex_thumb_image:string = '';
  ex_status:string = '';
  ex_created_datetime:string = '';
  ex_last_datetime:string = '';

  ex_alias:string = ''; 

  short_desc:string = '';
  long_desc:string = '';

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: '',
    toolbarHiddenButtons: [
      ['bold'],
      ['insertVideo'],
      ['insertImage']
      ],
    customClasses: []
  };

  imageChangedEvent: any = '';
  croppedImage: any = '';
  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  showCropper = false;
  containWithinAspectRatio = false;
  transform: ImageTransform = {};

 /* validation error messsage */ 
 error_messages = {
    'exe_name': [
    { type: 'required', message: 'Name is required' },
    ],
  'short_desc': [
    { type: 'required', message: 'Short description is required' },
    ],
  'long_desc': [
    { type: 'required', message: 'Long description is required' },
    ],   
  'keyword': [
      { type: 'required', message: 'Keywords is required' },
      ], 
  'difficulty_level': [
    { type: 'required', message: 'Difficulty level is required' },
    ], 
  'exe_type': [
    { type: 'required', message: 'Exercise Type is required' },
    ],    
  'status': [
    { type: 'required', message: 'Status is required' },
    ], 
  'visibility': [
    { type: 'required', message: 'Visibility is required' },
    ],
  'validityinday': [
    { type: 'required', message: 'Validity in Days is required' },
    ],
  'totalhours': [
    { type: 'required', message: 'Total Hours is required' },
    ],
  'start_manual': [
    { type: 'required', message: 'Initial manual is required' },
    ],
  'ex_owner': [
    { type: 'required', message: 'Author is required' },
    ],    
  'credits': [
    { type: 'required', message: 'Credits is required' },
    ],    
}

  server_url:string;
  
  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private BackenddbService: BackenddbService,
    private LoginService: LoginService,   
    private FrontenddbService: FrontenddbService, 
    private ManualService:ManualService,  
    private fb:FormBuilder,
    private dtchange: ChangeDetectorRef,
    private ds: DatapassService
  ) { 
		this.dashboard_url = this.LoginService.getDashboardUrl();
		this.ex_id = this.route.snapshot.paramMap.get('id');
		this.server_url = this.LoginService.getServerUrl();
		this.group_id = this.LoginService.getLoginGroup();

    if(this.group_id=='2')
    {
      this.status_array = ['Inactive'];
    }


	  this.current_url_array = [
        {'slug':"exercise-list",'label':'Exercise List'},
        {'slug':"",'label':'Edit Exercise'}
      ];
    this.dropdown_setting();
    this.getPackageList();
    this.getMitre('0','cate'); // get mitre category
  }

  dropdown_setting()
  {
    this.manual_dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'menual_title',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      allowRemoteDataSearch:true,
      limitSelection:1
    };

    this.template_dropdownSettings = {
      singleSelection: false,
      idField: 'unique_id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      closeDropDownOnSelection: true,
      allowSearchFilter: true,
      allowRemoteDataSearch:true,
      limitSelection:1
    };

    this.multi_manual_dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'menual_title',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      allowRemoteDataSearch:true,
      limitSelection:100
    };

    this.vm_als_temp_dpSettings = {
      singleSelection: false,
      idField: 'unique_id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      closeDropDownOnSelection: true,
      allowSearchFilter: true,
      allowRemoteDataSearch:true,
      limitSelection:1
    };

    this.package_dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'package_name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      allowRemoteDataSearch:true,
      limitSelection:1
    };

    this.ex_owner_dpSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      allowRemoteDataSearch:true,
      limitSelection:1
    };

    this.mit_dpSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'm_title',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      allowRemoteDataSearch:true,
      limitSelection:1
    };

    this.mit_tech_dpSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'm_title',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      allowRemoteDataSearch:true,
      limitSelection:1
    };

    this.mit_sub_tech_dpSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'm_title',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      allowRemoteDataSearch:true,
      limitSelection:1
    };
   
  }

  getMitre(parent_id:any,type:any)
  {
    this.progressbar = true;
    var api = 'admin-api/get-mitre';
    const formData = new FormData();
    formData.append('parent_id',parent_id);
	  this.BackenddbService.postData(api,formData).subscribe((res:any) => {
      this.progressbar = false;
        var result = Array.from(Object.keys(res), k=>res[k]);
        if(type=='cate')
        {
          this.mit_category_list = result
        }else if(type=='tech')
        {
          this.mit_tech_list = result;
        }else if(type=='sub_tech')
        {
          this.mit_sub_tech_list = result;
        }
		});
  }

  getPackageList()
  {
    var api = 'assessment-api/get-package-list';
	  this.BackenddbService.getData(api).subscribe((res:any) => {
      this.package_list = Array.from(Object.keys(res), k=>res[k]);
		});
  }

  ngAfterContentChecked() {
    this.dtchange.detectChanges();
   // alert();
  }

  ngOnInit(): void {
     this.getTeamingList();
     this.getPermission();
     this.getSubData();
     this.getExercise();
     this.setValidRules('');
  }

  getSubData()
  {
    var array = ['checkClaim','',''];
    this.ds.sendData(array);
    this.subscription = this.ds.getData().subscribe(x => { 
      if(x[0]=='setting')
      {
         this.get_setting(x[1]);
      }else if(x[0]=='wallet')
      {
         this.get_wallet(x[1]);
      }
    });
  }

  setValidRules(credits_valid:any)
  {
      this.exefrm = this.fb.group({
        exe_name: ['', [Validators.required,noWhitespaceValidator]],
        short_desc: ['', [Validators.required,noWhitespaceValidator]],
        long_desc: ['', [Validators.required,noWhitespaceValidator]],
        keyword: ['', [Validators.required]],
        difficulty_level: ['', [Validators.required]],
        exe_type: ['', [Validators.required]],
        teaming_array: this.fb.array([]) ,
        permission_array: this.fb.array([]) ,
        status: ['', [Validators.required]],
        visibility: ['', [Validators.required]],
        validityinday: ['', [Validators.required]],
        totalhours: ['', [Validators.required]],
        start_manual: [''],
        credits: [''],
      }); 
  }

  getTeamingList()
  {
    this.progressbar = true;
    this.BackenddbService.getTeamingList().subscribe((data:any) => {
        this.teamingList = Array.from(Object.keys(data), k=>data[k]);
        const nic_fa = (this.exefrm.get('teaming_array')as FormArray);
        this.teamingList.forEach((tmObj:any, nicindex:any) => { 
          nic_fa.push(this.fb.group({teaming: []}));
      });
      this.progressbar = false;
	  });
  }


  getPermission()
  {
    this.progressbar = true;
    var api = 'admin-api/get-vm-permission';
	  this.BackenddbService.getData(api).subscribe((res:any) => {
        this.permission = Array.from(Object.keys(res), k=>res[k]);
        const nic_fa = (this.exefrm.get('permission_array')as FormArray);
        this.permission.forEach((tmObj:any, nicindex:any) => { 
          nic_fa.push(this.fb.group({permission: []}));
      });
      this.progressbar = false;
	  });
  }


  getManualList()
  {
    this.progressbar = true;
    this.ManualService.get_manual_list().subscribe(
			res => {
				this.manual_list = res;
        this.progressbar = false;
			});
  }

  getExercise()
  {
    const formData = new FormData();
    formData.append('ex_id', this.ex_id);      
    this.progressbar = true;

    var api = 'admin-api/edit-exercise';
    this.BackenddbService.postData(api,formData).subscribe(
      res => {
        this.progressbar = false;
        this.instructor_selected = res.assign_to;
        const formData = new FormData();
        formData.append('instructor_id',res.assign_to);
        if(this.group_id=='1')
        {
          formData.append('group_id','1,2');
        }
        this.loadInstructorDropDownData(formData,'Yes');

        this.ex_alias = res.alias;

        this.start_man_selectedItems = Array.from(Object.keys(res.start_manual), k=>res.start_manual[k]);
        this.exercise_manual = Array.from(Object.keys(res.manual), k=>res.manual[k]);
        this.vm_alias = Array.from(Object.keys(res.vm_alias), k=>res.vm_alias[k]);

        this.keyword_array = Array.from(Object.keys(res.key_words), k=>res.key_words[k]);

        var temp = Array.from(Object.keys(res.teaming), k=>res.teaming[k]);
        var temp_per = Array.from(Object.keys(res.permission), k=>res.permission[k]);

        this.template_list = Array.from(Object.keys(res.template), k=>res.template[k]);
        this.mitre_list = Array.from(Object.keys(res.mitre), k=>res.mitre[k]);

        if(res.package_id!=null)
        {
          this.package_selectedItems = Array.from(Object.keys(res.package_id), k=>res.package_id[k]);
          this.package_id = this.package_selectedItems[0].id;
        }

        let teaming_array = this.exefrm.get('teaming_array') as FormArray;
        teaming_array.clear();

        this.teamingList.forEach((tmObj:any, nicindex:any) => { 
          var find = 'No';
          temp.forEach((tempObj:any, index:any) => { 

            if(tmObj == tempObj)
            {
              find = 'Yes';
              teaming_array.push(this.fb.group({
                teaming: [tmObj],
                }));
            }
          }); 

          if(find == 'No')
            {
              teaming_array.push(this.fb.group({
                teaming: [],
                }));
            }
          });

          let permission_array = this.exefrm.get('permission_array') as FormArray;
          permission_array.clear();
  
          this.permission.forEach((tmObj:any, nicindex:any) => { 
            var find = 'No';
            temp_per.forEach((tempObj:any, index:any) => { 
              if(tmObj.id == tempObj)
              {
                find = 'Yes';
                permission_array.push(this.fb.group({
                  permission: [true],
                  }));
              }
            }); 
  
            if(find == 'No')
              {
                permission_array.push(this.fb.group({
                  permission: [],
                  }));
              }
            });

          this.croppedImage = res.thumb_image;
          this.exefrm.patchValue({
              exe_name: res.name,
              short_desc: res.short_desc,
              long_desc: res.long_desc,
              difficulty_level: res.difficulty_level,
              exe_type: res.exe_type,
              status:res.status,
              visibility:res.visibility,
              validityinday:res.validity_days,
              totalhours:res.duration
          });

          if(this.credit_system=='Active')
          {
              var credits_val = '';
              if(res.credits == null)
              {
                credits_val = this.default_credit;
              }else
              {
                credits_val = res.credits;
              }
              this.exefrm.patchValue({
                credits:credits_val
              });
          }
          this.getManualList();
	    });
  }

  getTeamingControls() {
    return (<FormArray>this.exefrm.get('teaming_array')).controls;
  }
  getPermissionControls() {
    return (<FormArray>this.exefrm.get('permission_array')).controls;
  }

  openmodal() {
    this.modalshow = 'modal-show';
  }
  
  closemodal()
  {
    this.modalshow = '';
  }
  
  get f() { return this.exefrm.controls; }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if(control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
      if(this.exefrm.get('status').hasError('required') && (this.exefrm.get('status').dirty || this.exefrm.get('status').touched))
      {
         (<any>$('#collapseTwo')).collapse('show')
      }else if(this.exefrm.get('visibility').hasError('required') && (this.exefrm.get('visibility').dirty || this.exefrm.get('visibility').touched))
      {
        (<any>$('#collapseTwo')).collapse('show')
      }else if(this.exefrm.get('validityinday').hasError('required') && (this.exefrm.get('validityinday').dirty || this.exefrm.get('validityinday').touched))
      {
        (<any>$('#collapseTwo')).collapse('show')
      }else if(this.exefrm.get('totalhours').hasError('required') && (this.exefrm.get('totalhours').dirty || this.exefrm.get('totalhours').touched))
      {
        (<any>$('#collapseTwo')).collapse('show')
      }else if(this.exefrm.get('totalhours').hasError('required') && (this.exefrm.get('totalhours').dirty || this.exefrm.get('totalhours').touched))
      {
        (<any>$('#collapseTwo')).collapse('show')
      }else if(this.exefrm.get('exe_type').hasError('required') && (this.exefrm.get('exe_type').dirty || this.exefrm.get('exe_type').touched))
      {
        (<any>$('#collapseOne')).collapse('show')
      }

  }

  getFlashMessage()
  {
    this.msgalert = this.LoginService.getflashMessage();
    if (typeof this.msgalert.type != "undefined")
    {
      this.alertClass = this.msgalert.type;
      this.alertMessage = this.msgalert.message;
      this.closed = false;
    }
  }

  onSubmit(data:any)
  {
    this.dtchange.detectChanges();
    if(this.exefrm.valid) 
    {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you really want to edit exercise.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel'
      }).then((result) => {
      if(result.value)
      {

      var start_manual:any;
      if(data.start_manual!="")
      {
         start_manual = data.start_manual;
      }else
      {
         start_manual = this.start_man_selectedItems;
      }

      var per_data = data.permission_array;
      var temp_per = [];

      this.permission.forEach((pObj:any, index:any) => {
          if(per_data[index].permission == true)
          {
            temp_per.push(pObj.id);
          }
      }); 

      const formData = new FormData();
      this.closed = true;
      formData.append('ex_id', this.ex_id);
      formData.append('ex_name', data.exe_name);
      formData.append('ex_alias', this.ex_alias);
      formData.append('ex_short_desc', data.short_desc);
      formData.append('ex_long_desc', data.long_desc);
      formData.append('ex_key_words', JSON.stringify(data.keyword));
      formData.append('ex_teaming', JSON.stringify(data.teaming_array));
      formData.append('ex_permission', JSON.stringify(temp_per));
      formData.append('ex_difficulty_level', data.difficulty_level);
      formData.append('ex_exe_type', data.exe_type);
      formData.append('ex_start_manual', JSON.stringify(start_manual));
      formData.append('ex_manual', JSON.stringify(this.exercise_manual));
      formData.append('ex_package_id',this.package_id);
      formData.append('ex_vm_alias', JSON.stringify(this.vm_alias));
      formData.append('ex_validity_days', data.validityinday);
      formData.append('ex_status', data.status);
      formData.append('ex_visibility', data.visibility);
      formData.append('ex_duration', data.totalhours);
      if(typeof data.credits !='undefined')
      {
        formData.append('ex_credits', data.credits);
      }else
      {
        formData.append('ex_credits','');
      }

      if(typeof this.instructor_selected !='undefined')
      {
        formData.append('ex_assign_to', this.instructor_selected);
      }else
      {
        formData.append('ex_assign_to', '');
      }


      if(this.croppedImage!='' && this.upload_image==true)
      {
        formData.append('ex_thumb_image', this.croppedImage);
      }

      if(this.mitre_list.length!=0)
      {
        formData.append('ex_mitre',JSON.stringify(this.mitre_list));
      }
   
      var api = 'admin-api/update-exercise';
      this.progressbar = true;
      this.BackenddbService.postData(api,formData).subscribe(
        res => {
          this.progressbar = false;
           if(res.status=='success')
           {
            this.alertMessage = res.message;
            this.alertClass = 'success'; 
            this.closed = false;

            this.router.navigate([this.dashboard_url+'edit-exercise/'+this.ex_id]);
            return true;
           }else
           {
            this.alertMessage = res.message;
            this.alertClass = 'danger'; 
            this.closed = false;
           }
        });
        }
      });

    }else
    {
      this.validateAllFormFields(this.exefrm); // check validation
    }
  }

  addManual()
  {
    if(this.selected_template=="")
    {
      this.multi_man_selectedItems = [];
      Swal.fire('','Sorry! select assest first!','warning');
      return true;
    }

    if(this.multi_man_selectedItems.length==0)
    {
      this.multi_man_selectedItems = [];
      this.manual_id = [];
      Swal.fire('','Sorry! select manual first!','warning');
      return true;
    } 
    
    this.valid = false;
    this.exercise_manual.forEach((exObj:any, index:any) => { 
        if(this.template_selectedItems[0].unique_id==exObj.template_id[0].unique_id)
        {
          this.valid = true;
        }
    }); 

    if(this.valid)
    {
      Swal.fire('','Sorry! already added','warning');
      return true;
    }

    this.exercise_manual.push({template_id:this.template_selectedItems,manual_id:''});

    this.exercise_manual.forEach((exObj:any, index:any) => { 
      if(this.selected_template==exObj.template_id[0].unique_id)
      {
        this.exercise_manual[index].manual_id = this.multi_man_selectedItems;
      }
    }); 
    
    this.multi_man_selectedItems = [];
    this.template_selectedItems = [];
    this.selected_template = "";
  }

  addVmAlias()
  {
    if(this.selected_vm_als_tmp=="")
    {
      this.vm_als_temp_items = [];
      Swal.fire('','Sorry! select assest first!','warning');
      return true;
    }

    if(this.current_vm_alias=="")
    {
      Swal.fire('','Sorry! add alias first!','warning');
      return true;
    } 
    
    this.valid = false;
    this.vm_alias.forEach((vmalObj:any, index:any) => { 
        if(this.vm_als_temp_items[0].unique_id==vmalObj.template_id[0].unique_id)
        {
          this.valid = true;
        }
    }); 

    if(this.valid)
    {
      Swal.fire('','Sorry! already added','warning');
      return true;
    }

    this.vm_alias.push({template_id:this.vm_als_temp_items,alias:''});

    this.vm_alias.forEach((vmalObj:any, index:any) => { 
      if(this.selected_vm_als_tmp==vmalObj.template_id[0].unique_id)
      {
        this.vm_alias[index].alias = this.current_vm_alias;
      }
    }); 
    
    this.current_vm_alias = '';
    this.vm_als_temp_items = [];
    this.selected_vm_als_tmp = "";
    this.vmAliasInput.nativeElement.value = '';
  }

  vm_alias_store(event:any)
  {
      var temp = event.target.value.trim();
      this.current_vm_alias = temp;
  }

  deleteManual(id:any)
  {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to remove manual.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if(result.value)
      {
          this.exercise_manual.forEach((exObj:any, index:any) => { 
            if(id==index)
            {
              this.exercise_manual.splice(index, 1);    
            }
         });
      }

    });
  }
  
  deleteVmAlias(id:any)
  {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to remove alias.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if(result.value)
      {
        this.vm_alias.forEach((exObj:any, index:any) => { 
          if(id==index)
          {
            this.vm_alias.splice(index, 1);    
          }
        });
      }
    });
  }

  deleteMitre(id:any)
  {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to remove mitre.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if(result.value)
      {
        this.vm_alias.forEach((exObj:any, index:any) => { 
          if(id==index)
          {
            this.mitre_list.splice(index, 1);    
          }
        });
      }
    });
  }

  onItemSelect(item:any,type:any)
  {
     if(type=='start_manual')
     {
       this.start_manual = item.id;
     }else if(type=='template')
     {
      this.valid = false;
      this.exercise_manual.forEach((exObj:any, index:any) => { 

        if(typeof exObj.template_id!= 'undefined' && exObj.template_id[0].unique_id==item.unique_id)
        {
          this.valid = true;
        }
      });

      if(this.valid)
      {
        this.template_selectedItems = [];
        Swal.fire('','Sorry! already added','warning');
        return true;
      }
      this.selected_template = item.unique_id;
     }else if(type=='manual')
     {
      if(this.selected_template=="")
      {
        this.multi_man_selectedItems = [];
        this.manual_id = [];
        Swal.fire('','Sorry! select assest first!','warning');
        return true;
      }
         this.manual_id.push(item.id);
     }else if(type=='vm_als_temp')
     {
        this.valid = false;
        this.vm_alias.forEach((vmalObj:any, index:any) => { 
          if(typeof vmalObj.template_id!= 'undefined' && vmalObj.template_id[0].unique_id==item.unique_id)
          {
            this.valid = true;
          }
        });

        if(this.valid)
        {
          this.vm_als_temp_items = [];
          Swal.fire('','Sorry! already added','warning');
          return true;
        }
        this.selected_vm_als_tmp = item.unique_id;
     }else if(type=='assessment')
     {
       this.package_id = item.id;
     }else if(type=='mit_cate')
     {
        this.current_mit_category = item.id;
        this.getMitre(item.id,'tech');
        this.mit_tech_items = [];
        this.mitre_temp.push({'cate':item.id,'cate_title':item.m_title})
     }else if(type=='mit_sub_tech')
     {
        this.getMitre(item.id,'sub_tech');
        this.mit_sub_tech_items = [];
        this.mitre_temp.forEach((mObj:any, index:any) => {
           if(mObj.cate==this.current_mit_category)
           {
              this.mitre_temp[index]['tech'] = item.id;
              this.mitre_temp[index]['tech_title'] = item.m_title;
           }
        });

     }else if(type=='mit_subs_tech')
     {
        this.mitre_temp.forEach((mObj:any, index:any) => {
          if(mObj.cate==this.current_mit_category)
          {
            this.mitre_temp[index]['sub_tech'] = item.id;
            this.mitre_temp[index]['sub_tech_title'] = item.m_title;
          }
      }); 
     }
  }

  onItemDeSelect(item:any,type:any)
  {
    if(type=='start_manual')
    {
      this.start_manual = "";
    }else if(type=='assessment')
    {
      this.package_id = '';
    }else if(type=='mit_cate')
    {
       this.mit_tech_items = [];
       this.mit_sub_tech_items = [];
       this.current_mit_category = '';
       this.mitre_temp.forEach((mObj:any, index:any) => {
        if(mObj.cate==item.id)
        {
          this.mitre_temp.splice(index, 1);
        }
       }); 
    }else if(type=='mit_sub_tech')
    {
       this.mit_sub_tech_items = [];
       this.mitre_temp.forEach((mObj:any, index:any) => {
        if(mObj.tech==item.id)
        {
          //this.mitre_temp[index].removeAt('technique');
           delete this.mitre_temp[index].tech;
           delete this.mitre_temp[index].tech_title;
           if(typeof this.mitre_temp[index].sub_tech !='undefined')
           {
             delete this.mitre_temp[index].sub_tech;
             delete this.mitre_temp[index].sub_tech_title;
           }
        }
       }); 
    }else if(type=='mit_subs_tech')
    {
      this.mitre_temp.forEach((mObj:any, index:any) => {
        if(mObj.sub_tech==item.id)
        {
          delete this.mitre_temp[index].sub_tech;
          delete this.mitre_temp[index].sub_tech_title;
        }
       });
    }
  }

 // photo crop code start
 fileChangeEvent(event: any): void {
  this.imageChangedEvent = event;
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
        this.dtchange.detectChanges();
      }
    }else if(this.setting[index].skey=='exercise_credit')
    {
      var svalue = JSON.parse(this.setting[index].svalue);
      if(svalue[0].status=='Active')
      {
        this.default_credit = svalue[0].credit;
      }
    }else if(this.setting[index].skey=='mitre')
    {
      var svalue = JSON.parse(this.setting[index].svalue);
      if(svalue[0].status=='Active')
      {
        this.mitre_system = svalue[0].status;
      }
    }
   });
}

get_wallet(wallet:any)
{
   this.wallet_balance = wallet.credit;
}

imageCropped(event: ImageCroppedEvent) {
  this.croppedImage = event.base64;
  this.upload_image = true;
  console.log(event, base64ToFile(event.base64));
}

imageLoaded() {
  this.showCropper = true;
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

addMitre()
{
    if(this.mitre_temp.length==0)
    {
      Swal.fire('','Sorry! select mitre category.','warning');
      return true;
    }
    this.mitre_list.push(this.mitre_temp[0]);
    this.mit_items = [];
    this.mit_tech_items = [];
    this.mit_sub_tech_items = [];
    this.current_mit_category = "";
    this.mitre_temp.splice(0, 1);
}

// photo crop code end

onPackgeSelect(item:any)
{
}

onPackgeDeSelect(item:any)
{  
}

onFilterChange(event:any,type:any)
{
  this.ex_owner_dp_list.push({'id':'1','name':'kamlesh'})
  this.dtchange.detectChanges();
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
          }
        }
      });
      if(res.length>0)
      {
        this.limit_start = this.limit_start+10;
      }
    });
}

selectEvent(item:any) {
     this.instructor_selected = item.id;
}

onFocused(e:any) {
  this.instructor_selected = '';
}

inputCleared(event:any){
  if(typeof(event) ==='undefined')
  {
     this.instructor_selected = '';
  }
}

inputChanged(keyword:any){
  this.instructor_selected = '';
  const formData = new FormData();
  formData.append('search',keyword);
  if(this.group_id=='1')
  {
    formData.append('group_id','1,2');
  }
  this.BackenddbService.getInstructorDropDownList(formData).subscribe(
    res => {
      res.forEach( (myObject:any, index:any) => {
        let abc = this.instructor_list.find(ob => ob['id'] === res[index].U_ID);
        if(typeof(abc) ==='undefined')
        {
          this.instructor_list.push({id:res[index].U_ID,name:res[index].F_Name+" "+res[index].L_Name+" - "+res[index].eMail});
        }
      });
    });
}

scrolledToEnd(item:any) {
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
      this.auto.open();
    });
}

preloadData()
{
  this.ds.sendData('setting');
  this.ds.sendData('resetWallet');
}

}
