import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild,ElementRef , QueryList, ViewChildren, } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient,HttpParams  } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {IDatePickerConfig,ISelectionEvent, DatePickerComponent} from 'ng2-date-picker'; 
import * as moment from 'moment';

import { BackenddbService } from '../../services/backenddb.service';
import { FrontenddbService } from '../../services/frontenddb.service';

import { LoginService } from '../../services/login.service';
import { ManualService } from '../../services/manual.service';

import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

import { FormGroup,  FormBuilder, FormArray, FormControl, Validators  } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2';
import {noWhitespaceValidator} from '../../helper/validatefun';

import { faRedoAlt, faRandom, faLaptop ,faArrowCircleRight, faArrowCircleLeft, faUser, faEdit, faTrash, faUsers, faEye,faBars, faCamera,faPlus,faMinus,faCog,faPowerOff,faDesktop,faDownload ,faFileExport,faRedo,faList,faNetworkWired 
  ,faStar, faQuestion, faQuestionCircle, faCircle, faShoppingCart, faFlag, faTasks, faTrophy, faCreditCard, faCartPlus, faUserCircle,faFile} from '@fortawesome/free-solid-svg-icons';

import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { VmcontrolfilterPipe } from '../../modal/vmcontrolfilter.pipe';
import { DatapassService } from '../../services/datapass.service';
import { Subscription } from 'rxjs/Subscription';
import { Constants } from 'src/constants';

class Person {
  id: number;
  firstName: string;
  lastName: string;
}

class DataTablesResponseUser {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  param:any;
}

class Team {
  id: number;
  firstName: string;
  lastName: string;
}

class TeamDataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  param:any;
}

declare var $ : any;
declare const activesidebar:any;

@Component({
  selector: 'app-exerciseallotment',
  templateUrl: './exerciseallotment.component.html',
  styleUrls: ['./exerciseallotment.component.css']
})
export class ExerciseallotmentComponent implements OnInit {
  @ViewChild('dtpicker') sdate : ElementRef;
  subscription: Subscription;

  @ViewChild('multiSelect') exercise_dropdown;
  exercise_dropdownList = [];
  exercise_selectedItems = [];
  exercise_dropdownSettings = {};

  @ViewChild('multiSelect') train_gp_dropdown;
  train_gp_dropdownList = [];
  train_gp_selectedItems = [];
  train_gp_dropdownSettings = {};

  vm_dropdownSettings = {};
  vm_access_dropdownSettings = {};
  selectedVmItems = [];
  selectedControlItems = [];

  @ViewChild('multiSelect') manual_dp;
  manual_dp_list = [];
  manual_sel_items = [];
  manual_dp_set = {};

  // store value when choose allocation dropdown
  exercise_array:any = [];
  train_gp_array:any = [];

  // store final allotment step data
  exercise_data:any = [];
  user_data:any = [];
  team_data:any = [];

  ex_detail = [];

  //allocation dropdown show
  exercise_dropdown_area:boolean = true;
  train_gp_dropdown_area:boolean = false;

  //allocation step
  step1:boolean = true;
  step2:boolean = false;
  step3:boolean = false;

  //allocation type
  individual_allot_area:boolean = true;
  team_allot_area:boolean = false;
  team_allot_hide:boolean = false

  //fontasome icon
  faRedoAlt = faRedoAlt;
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
    
  public _opened: boolean = true; 
	public _toggleSidebar() {
		this._opened = !this._opened;
	}  

  /* datatable */
  @ViewChildren(DataTableDirective)
  dtElements: QueryList<DataTableDirective>;
  dtOptions: DataTables.Settings[] = [];
  dtUserOptions: DataTables.Settings[] = [];

  dtUserTrigger = new Subject();
  persons: Person[];
  user_searchVal:string = '';

  dtTeamTrigger = new Subject();
  teams: Team[];
  team_searchVal:string = '';


  serverUrl = environment.baseUrl;

  /*flash message*/
  msgalert:any;
  
  /*breadcrumbs array */
  current_url_array = [];

  readonly_start_date:boolean = false;

  alloted_status:string = "";

  // model popup object 
  allocation_modal_ref:any;
  modalConfgRef:any;
  vmPopUpConfgRef:any;
  t_pin:string = "";

  allotment_id:string;

  // current updating allotment
  current_allote_id:string = '';
  current_allote_status:string = '';

  status_array = ['publish','unpublish'];

  formdata: FormGroup;
  tpinfrm: FormGroup;
  userfrm: FormGroup;
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
  checkArray: FormArray;
  defaultControl = []

  dashboard_url:string; 
  my_team:string = '';

  form_title:string = 'Exercise Allotment';

  searchVal = '';

  server_url:string;

  // exercise dropdown
  ex_limit_start:any = 0;
  ex_search:string = '';

  // vm access option
  vm_access_dropdown:any = [];
  // store vm access of user
  vm_access:any = [];
  manual_list:any = [];
  default_manual:any = [];

  current_ex_id:string = "";
  // allocation type team or individual
  current_allot_type:string = "";
  // exercise or traning group assign type
  current_allocation:string = ""
  current_user_id:any = [];
  current_team_id:string = "";
  current_vm_unique_id:any = [];

  // store vm option when click on user config
  current_vm_dropdown:any = [];
  selectedUserID:any = []

  //store protal setting info
  setting:any = [];
  credit_system:string = 'Inactive';
  exe_bundle:string = 'Allowed';
  //store exercise start and end date
  ex_dates:any = [];

  valid:boolean = false;

  placeholder:string = 'DD-MM-YYYY HH:mm:ss';

  total_credit:number = 0;
  wallet_balance:number = 0;
  multiple:number = 0;

  return_type:boolean = false;
  extend_req:string = '';
  exeBundleId:string = '';
  from:string = ''

  /* flash message */
  messageArray = {  
    type: "",  
    message: "",  
  }; 
  stringifiedData: any; 

  error_messages = {
		't_pin': [
		{ type: 'required', message: 'TPIN is required' },
		] 
    };
    
  config: IDatePickerConfig = {
    format: 'DD-MM-YYYY HH:mm:ss',
    disableKeypress:true,
  };  
   
  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private BackenddbService: BackenddbService,
    private LoginService: LoginService,   
    private FrontenddbService: FrontenddbService,   
    private ManualService: ManualService,   
    private fb:FormBuilder,
    private modalService: NgbModal,
    private ds: DatapassService
    ) {
        this.update_by = this.LoginService.getUserId();
        this.group_id = this.LoginService.getLoginGroup();
        this.dashboard_url = this.LoginService.getDashboardUrl();
        this.server_url = this.LoginService.getServerUrl();
        this.allotment_id = this.route.snapshot.paramMap.get('id');
        this.getFlashMessage();
        if(this.allotment_id != null)
        {
           this.form_title = 'Exercise Allotment - '+this.allotment_id;
           this.readonly_start_date = true;
        }
    }

		ngOnInit() {
      activesidebar(); 
      this.loadData();      
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

      this.vm_dropdownSettings = {
        singleSelection: false,
        idField: 'unique_id',
        textField: 'asset_name',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit: 100,
        allowSearchFilter: true,
        allowRemoteDataSearch:true,
        limitSelection:100
      };

      this.manual_dp_set = {
        singleSelection: false,
        idField: 'id',
        textField: 'menual_title',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit: 3,
        allowSearchFilter: true,
        allowRemoteDataSearch:true,
        limitSelection:5
      };

      this.vm_access_dropdownSettings = {
        singleSelection: false,
        idField: 'id',
        textField: 'name',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit: 100,
        allowSearchFilter: true,
        allowRemoteDataSearch:true,
        limitSelection:100
      };

      this.train_gp_selectedItems = [];
        this.train_gp_dropdownSettings = {
          singleSelection: false,
          idField: 'id',
          textField: 'group_name',
          selectAllText: 'Select All',
          unSelectAllText: 'UnSelect All',
          itemsShowLimit: 3,
          allowSearchFilter: true,
          allowRemoteDataSearch:true,
          limitSelection:1
        };

		/*breadcrumbs array */
		this.current_url_array = [
			{'slug':"",'label':'Exercise Allotment'}
		];
    /* End breadcrumbs array */	

    
    this.userfrm = this.fb.group({
      allocation: ['Exercise', []],
      allocation_type: ['Individual', []],
      user: this.fb.array([]),
      team: this.fb.array([]),
      valid_start_date: this.fb.array([]),
      valid_end_date: this.fb.array([]),
		})

    this.tpinfrm = this.fb.group({
			t_pin: ['', [Validators.required,noWhitespaceValidator]],
		});
     
    if(this.allotment_id == null)
    {
      this.getExerciseDropDown();
      this.getTrainGPDropDown();
      this.drawUserList();
      this.drawTeamList();
    }else
    {
      this.loadAllottedExercise();
    }
    this.getManualList();
    this.getPermission();
  }

  getManualList()
  {
    this.ManualService.get_manual_list().subscribe(
			res => {
				this.manual_list = res;
			});
  }

  loadData()
  {
    var array = ['checkClaim','2',''];
    this.ds.sendData(array);
    this.subscription = this.ds.getData().subscribe(x => { 
      if(x[0]=='wallet')
      {
         this.get_wallet(x[1]);
      }else if(x[0]=='setting')
      {
         this.get_setting(x[1]);
      }else if(x[0]=='set_permission')
      {
        this.set_permission(x[1]);
      }
    });
  }

  // load data when edit allotted exercise
  loadAllottedExercise()
  {
      this.ds.Loader(true);
      const formData = new FormData();
      formData.append('allotment_id',this.allotment_id);
     
      this.BackenddbService.loadAllottedExercise(formData).subscribe((res:any) => {
        this.ds.Loader(false);
        this.user_data = [];
        this.team_data = [];
        this.exercise_data = [];
        if(res.status=='success')
        {
          this.step2 = false;
          this.step3 = true;
          this.step1 = false;

          this.exercise_data = res.data.exercise;
          this.multiple = 1;

          if(res.data.allocation_type=='Individual')
          {
            this.user_data = res.data.user;
            this.multiple = this.user_data.length;
          }else if(res.data.allocation_type=='Team')
          {
            this.team_data = res.data.team_data;
          }
          this.current_allot_type = res.data.allocation_type;
          this.current_allocation = res.data.allocation;
          this.extend_req = res.data.extend_req;

          this.exercise_data.forEach((exObj:any, index:any) => {

            var credits = Number(exObj.cal_credits);
            this.total_credit = this.total_credit+(credits*this.multiple);

            this.ex_dates.push({ex_id:exObj.id,start_date:exObj.valid_start,end_date:exObj.valid_end});

             var exe_data = JSON.parse(exObj.exe_data);
             var tmp_array:any = [];
             exe_data.forEach((myObject:any, ind:any) => {
               if(exe_data[ind].asset_type=='Template')
               {
                  var tmp:any = { 
                                  unique_id: exe_data[ind].asset_unique_id,
                                  asset_name: exe_data[ind].asset_name
                                };
                  tmp_array.push(tmp);
               }
             });
             this.exercise_data[index]['vm_dropdown'] = tmp_array;
         });

        }else if(res.status=='error')
        {
          this.exercise_data = [];
          this.user_data = [];
          this.team_data = [];
          Swal.fire('',res.message,'warning');
          this.router.navigate([this.dashboard_url+'allotment-list']);
        }
      });
  }

  checkedUser(teamId:any,userId:any)
  {
      if(this.selectedUserID.length!=0)
      {
        if(typeof this.selectedUserID[teamId] != 'undefined')
        {
            if(this.selectedUserID[teamId].includes(userId))
            {
              return true
            }
        }
        return false
      }else
      {
        return false
      }
  }
  
  selectUser(event:any,teamId:any,userId:any,ind:any)
  {
     if(event.currentTarget.checked)
     {
        this.selectedUserID[teamId].push(userId)
     }else
     {
      let indx = this.selectedUserID[teamId].indexOf(userId)
      if(indx>=0)
      {
         this.selectedUserID[teamId].splice(indx,1)
      }
    }
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

  getTrainGPDropDown()
  {
		const formData = new FormData();
		formData.append('search',this.ex_search);
		formData.append('limit_start','');
		this.BackenddbService.postData('admin-api/get-traning-group-dropdown',formData).subscribe((res:any) => {
         this.train_gp_dropdownList = Array.from(Object.keys(res), k=>res[k]);
		});
  }

  getPermission()
  {
    this.ds.Loader(true);
    var api = 'admin-api/get-vm-permission';
	  this.BackenddbService.getData(api).subscribe((res:any) => {
        this.vm_access_dropdown = Array.from(Object.keys(res), k=>res[k]);
        this.ds.Loader(false);
	  });
  }

  drawUserList()
  {
    /* user data table */
	  const that = this;
	  this.dtOptions[2] = {
      dom: '<"top">tr<"bottom"ilp><"clear">',
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      order: [[ 0, "desc" ]],
      ajax: (dataTablesParameters: any, callback) => {

        let params = new HttpParams();
        let startNumber: any;

        startNumber = dataTablesParameters.start;
        if (startNumber != 0) {
          startNumber = startNumber + 1
        } else {
          startNumber = startNumber;
        }
        params = params.append("start", startNumber);
        params = params.append("length", dataTablesParameters.length);
        params = params.append("draw", dataTablesParameters.draw);
        params = params.append("search", this.user_searchVal);
        params = params.append("order_col", dataTablesParameters.order[0].column);
        params = params.append("order_type", dataTablesParameters.order[0].dir);  
        params = params.append("group_id", '3');
        params = params.append("user_status", 'Active');

        let param = params.toString();
        that.http
          .post<DataTablesResponseUser>(
            this.serverUrl+'datatable-api/get-user-list',
            params, {}
          ).subscribe(resp => {
            that.persons = resp.data;
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: []
            });
          });
      },
      columns: [{ data: 's_no' }, { data: 'User_Unique_ID' },  { data: 'Name' }, { data: 'email' }, { data: 'mobile' }]
    };
  }

  drawTeamList()
  {
    /* Team data table */
    const that = this;
    this.dtOptions[3] = {
      dom: '<"top">tr<"bottom"ilp><"clear">',
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      order: [[ 0, "desc" ]],
      ajax: (dataTablesParameters: any, callback:any ) => {

        let params = new HttpParams();
        let startNumber: any;

        startNumber = dataTablesParameters.start;
        if (startNumber != 0) {
          startNumber = startNumber + 1
        } else {
          startNumber = startNumber;
        }

        params = params.append("start", startNumber);
        params = params.append("length", dataTablesParameters.length);
        params = params.append("draw", dataTablesParameters.draw);
        params = params.append("search", this.team_searchVal);
        params = params.append("order_col", dataTablesParameters.order[0].column);
        params = params.append("order_type", dataTablesParameters.order[0].dir);        
        params = params.append("status", 'Active');
        params = params.append("team_type", '');

        var assign = '';
        if(this.group_id=='3')
        {
          var assign = 'my-team';
        }

        params = params.append("team_assign_instructor",assign);

        let param = params.toString();
        that.http
          .post<TeamDataTablesResponse>(
            this.serverUrl+'datatable-api/get-team-list',
            params, {}
          ).subscribe(resp => {

            that.teams = resp.data;

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: []
            });
          });
      },
      columns: [{ data: 's_no' }, { data: 'team_unique_id' }, { data: 'team_name' },  { data: 'team_type' } ]
    };
  }  

  datatableSearch(event:any,type:any){
    if(type=='user')
    {
      this.user_searchVal  = event.target.value; 
      this.rerender_datatable('user-table');
    }else if(type=='team')
    {
      this.team_searchVal  = event.target.value; 
      this.rerender_datatable('team-table');
    }
  }

  ngAfterViewInit(): void {
   this.dtUserTrigger.next();
   this.dtTeamTrigger.next();
  }

  ngOnDestroy(): void {
    this.dtUserTrigger.unsubscribe();
    this.dtTeamTrigger.unsubscribe();
  }

  rerender_datatable(datatableName:any) {
    this.dtElements.forEach((dtElement: DataTableDirective, index: number) => {
      dtElement.dtInstance.then((dtInstance: any) => {
        if(dtInstance.table().node().id == datatableName) {
           dtInstance.draw();
        }
      });
    });
  }

  refreshMainTable() {
    this.dtElements.forEach((dtElement: DataTableDirective, index: number) => {
      dtElement.dtInstance.then((dtInstance: any) => {
      });
    })
  }
  
  ex_allocation()
  {
    this.openmodal();
    this.refreshMainTable();
    this.step1 = true;
    this.step2 = false;
    this.step3 = false;

    this.exercise_dropdown_area = true;
    this.train_gp_dropdown_area = false;
  }

  ExerciseFilter(vm_control:any[], id: any[])
  {
    this.return_type = true;
    if(vm_control.length!=0)
    {
      vm_control.forEach((myObject:any, index:any) => {
          if(vm_control[index].ex_id == id[0] && myObject.team_id == id[1])
          {
            this.return_type = false;
          }
      });
      return this.return_type;
    }else
    {
      return this.return_type;
    }
  }

  SubmitAllotment(modal:any)
  {
      var allocation_type = this.userfrm.value.allocation_type;
      if(allocation_type=="Individual")
      {
        this.valid = false;
        this.exercise_data.forEach((exObj:any, index:any) => {
          this.user_data.forEach((usObj:any, index:any) => {
              if(typeof usObj.vm_control=='undefined' && this.valid==false)
              {
                this.valid = true;
              }else if(this.valid==false)
              {
                this.valid = this.ExerciseFilter(usObj.vm_control, [exObj.id,usObj.team_id]);
              }
          }); 
      }); 

      if(this.valid)
      {
         Swal.fire('','Sorry! Please configure Vm access for all users.','warning');
         return true;
      }

    }else if(allocation_type=="Team")
    {
      this.valid = false;
      this.exercise_data.forEach((exObj:any, index:any) => {
        this.team_data.forEach((tmObj:any, index:any) => {
          tmObj.user_data.forEach((usObj:any, index:any) => {
              if(typeof usObj.vm_control=='undefined' && this.valid==false)
              {
                this.valid = true;
              }else if(this.valid==false)
              {
                this.valid = this.ExerciseFilter(usObj.vm_control, [exObj.id,usObj.team_id]);
              }
          });
        });
      });

      if(this.valid)
      {
         Swal.fire('','Sorry! Please configure access for all users.','warning');
         return true;
      }

    }

    Swal.fire({
      title: 'Are you sure?',
      text: Constants.ALERT_ALLOT_EXE,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if(result.value)
      {
          if(this.credit_system=='Active')
          {
              if(this.wallet_balance < this.total_credit)
              {
                  Swal.fire('',Constants.WALLET_NOT_CREDIT,'warning');
                  return true;
              }
              this.modalConfgRef = this.modalService.open(modal, {ariaLabelledBy: 'modal-basic-title', size: 'sm'});
          }else
          {
            this.final_allot_Submit('');
          }
      }
   });
  
  }

  final_allot_Submit(t_pin:any)
  {
    const formData = new FormData();
    formData.append('allocation',this.userfrm.value.allocation);
    formData.append('exeBundleId',this.exeBundleId);
    formData.append('exercise_data',JSON.stringify(this.exercise_data));
		formData.append('user_data',JSON.stringify(this.user_data));
		formData.append('team_data',JSON.stringify(this.team_data));
		formData.append('allocation_type',this.userfrm.value.allocation_type);
    formData.append('operation_mode','Insert');
		formData.append('t_pin',t_pin);
    this.ds.Loader(true);
    
    var api = 'redhatrest-api/final-allot-submit';
    this.BackenddbService.postData(api,formData).subscribe((res:any) => {
      this.ds.Loader(false);
      if(res.status=="success")
         {
            this.setFlashMessage('success',res.message);
            this.router.navigate([this.dashboard_url+'allotment-list/']);
         }else if(res.status=="error")
         {
            Swal.fire('',res.message,'warning');
         }
     });
  }

  update_allotment(t_pin:any)
  {
          const formData = new FormData();
          formData.append('allocation',this.current_allocation);
          formData.append('exercise_data',JSON.stringify(this.exercise_data));
          formData.append('user_data',JSON.stringify(this.user_data));
          formData.append('team_data',JSON.stringify(this.team_data));
          formData.append('allocation_type',this.current_allot_type);
          formData.append('operation_mode','Edit');
          formData.append('allotment_id',this.allotment_id);
          formData.append('extend_request',this.extend_req);
          formData.append('t_pin',t_pin);
          this.ds.Loader(true);

          var api = 'redhatrest-api/final-allot-submit';
          this.BackenddbService.postData(api,formData).subscribe((res:any) => {
              this.ds.Loader(false);
              if(res.status=="success")
              {
                  this.setFlashMessage('success',res.message);
                  this.router.navigate([this.dashboard_url+'allotment-list/']);
              }else if(res.status=="error")
              {
                Swal.fire('',res.message,'warning');
              }
          });
  }

  update_allotted_exercise(modal:any)
  {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to update allotment.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if(result.value)
      {
        if(this.credit_system=='Active')
        {
          if(this.allotment_id==null || this.extend_req=='Yes')
          {
              if(this.wallet_balance < this.total_credit)
              {
                  Swal.fire('',Constants.WALLET_NOT_CREDIT,'warning');
                  return true;
              }
              this.modalConfgRef = this.modalService.open(modal, {ariaLabelledBy: 'modal-basic-title', size: 'sm'});
          }else
          {
            this.update_allotment('');
          }
        }else
        {
           this.update_allotment('');
        }
      }
    });
  }
  
  submit_tpin(data:any)
  {
    if(this.tpinfrm.valid)
		{
		  this.modalConfgRef.close();	
      if(this.allotment_id == null)
      {
        this.final_allot_Submit(data.t_pin);
      }else
      {
        this.update_allotment(data.t_pin);
      }  
		  
		}else
		{
		  this.validateAllFormFields(this.tpinfrm); // check validation
		}
  }
 
 // call when choose allocation radio button
  AllocationChange(event:any)
  {
    if(event.target.checked && event.target.value=="Exercise") {
      this.exercise_dropdown_area = true;
      this.train_gp_dropdown_area = false;
    }else if(event.target.checked && event.target.value=="Training_Group")
    {
      this.exercise_dropdown_area = false;
      this.train_gp_dropdown_area = true;
    } 
  }

  ExtendChange(event:any)
  {
    if(event.target.checked && event.target.value=="Yes") {
      this.extend_req = event.target.value;
    }else
    {
      this.extend_req = '';
    } 
  }

 // call when choose allocation type radio button
 AllocationTypeChange(event:any)
 {
   if(event.target.checked && event.target.value=="Individual") {
     this.individual_allot_area = true;
     this.team_allot_area = false;
     this.drawUserList();
   }else if(event.target.checked && event.target.value=="Team")
   {
     this.individual_allot_area = false;
     this.team_allot_area = true;
   } 
 }

 UserCheckboxChange(user_id:string, isChecked: boolean)
 {
      const userFormArray = <FormArray>this.userfrm.controls.user;
      if (isChecked) {
        userFormArray.push(new FormControl(user_id));
      } else {
       let index = userFormArray.controls.findIndex(x => x.value == user_id)
       userFormArray.removeAt(index);
      } 
 }

 TeamCheckboxChange(team_id:string, isChecked: boolean)
 {
      const teamFormArray = <FormArray>this.userfrm.controls.team;
      if (isChecked) {
       teamFormArray.push(new FormControl(team_id));
      } else {
       let index = teamFormArray.controls.findIndex(x => x.value == team_id)
       teamFormArray.removeAt(index);
      } 
 }

  setAllotmentData()
  {
    this.ds.Loader(true);
    const formData = new FormData();

		formData.append('allocation',this.userfrm.value.allocation);
    formData.append('exercise',this.exercise_array);
		formData.append('train_gp',this.train_gp_array);
		formData.append('allocation_type',this.userfrm.value.allocation_type);
		formData.append('user',this.userfrm.value.user);
		formData.append('team',this.userfrm.value.team);

    this.current_allot_type = this.userfrm.value.allocation_type;
	  this.BackenddbService.postData('admin-api/set-allotment-data',formData).subscribe((res:any) => {
          this.ds.Loader(false);
          this.user_data = [];
          this.team_data = [];
          this.exercise_data = [];

          if(res.status=='success')
          {
            this.exercise_data = res.data.exercise;
            if(res.manual!="")
            {
              this.default_manual = res.manual;
            }
            this.multiple = 1;
            if(res.data.allocation_type=='Individual')
            {
              this.user_data = res.data.user;
              this.multiple = this.user_data.length;
            }else if(res.data.allocation_type=='Team')
            {
              this.selectedUserID = {}
              this.team_data = res.data.team_data;
                this.team_data.forEach((teamObj:any, index:any) => {
                let userIds = teamObj.user_data.map(function(value:any,index:any) {
                  return value['U_ID'];
                })
                this.selectedUserID[teamObj.id] = userIds
              })
            }
            this.current_allot_type = res.data.allocation_type;
              
            this.exercise_data.forEach((exObj:any, index:any) => {
              var credits = Number(exObj.cal_credits);
              this.total_credit = this.total_credit+(credits*this.multiple);
              this.ex_dates.push({ex_id:exObj.id,start_date:exObj.valid_start,end_date:exObj.valid_end});
               var exe_data = JSON.parse(exObj.exe_data);
               var tmp_array:any = [];
               exe_data.forEach((myObject:any, ind:any) => {
                 if(exe_data[ind].asset_type=='Template')
                 {
                    var tmp:any = { 
                                    unique_id: exe_data[ind].asset_unique_id,
                                    asset_name: exe_data[ind].asset_name
                                  };
                    tmp_array.push(tmp);
                 }
               });
               this.exercise_data[index]['vm_dropdown'] = tmp_array;
           });

          }else if(res.status=='error')
          {
            this.exercise_data = [];
            this.user_data = [];
            this.team_data = [];
            Swal.fire('',res.message,'warning');
            if(typeof res.step != 'undefined')
            {
               this.change_step(res.step);
            }
          }
			});
  } 

  change_step(step:any)
  { 
    if(step==2)
    {
      if(this.userfrm.value.allocation=='Exercise' && this.exercise_array.length==0)
      {
        Swal.fire('',Constants.ALERT_EXE_FIRST,'warning');
        return true;
      }else if(this.userfrm.value.allocation=='Training_Group' && this.train_gp_array.length==0)
      {
        Swal.fire('',Constants.ALERT_TRAIN_GP_FIRST,'warning');
        return true;
      }

      this.step2 = true;
      this.step3 = false;
      this.step1 = false;
      this.total_credit = 0;
    }else if(step==3)
    {
      const teamFormArray = <FormArray>this.userfrm.controls.team;
      const userFormArray = <FormArray>this.userfrm.controls.user;

      if(this.userfrm.value.allocation_type=='Individual' && userFormArray.length==0)
      {
        Swal.fire('',Constants.ALERT_USER_FIRST,'warning');
        return true;
      }else if(this.userfrm.value.allocation_type=='Team' && teamFormArray.length==0)
      {
        Swal.fire('',Constants.ALERT_TEAM_FIRST,'warning');
        return true;
      }
      this.setAllotmentData();
      
      this.step2 = false;
      this.step3 = true;
      this.step1 = false;
    }else if(step==1)
    {
      this.step2 = false;
      this.step3 = false;
      this.step1 = true;
    }
  }

  public onFilterChange(item: any,type:any) {
    if(type=="Exercise")
    {
        this.ex_search = item.name;
    }
  }
  public onDropDownClose(item: any) 
  {
  }

  getExercise(ex_id:any)
  {
    this.ds.Loader(true);
    const formData = new FormData();
    if(this.train_gp_dropdown_area==false)
    {
      formData.append('ex_id',JSON.stringify(ex_id));
    }else
    {
      formData.append('pk_id',ex_id);
    }
	  var api = 'admin-api/get-exercise';
	  this.BackenddbService.postData(api,formData).subscribe((res:any) => {
      this.ex_detail = Array.from(Object.keys(res), k=>res[k]);
      this.ds.Loader(false);
		});
  }

  public onItemSelect(item: any,type:any) 
  {
    if(type=="Exercise")
    {
      this.exercise_array.push(item.id);
      this.getExercise(this.exercise_array);
    }else if(type=="Train_Gp")
    {
      this.exeBundleId = item.id
      this.getExercise(item.id);
      this.train_gp_array.push(item.id);
    }
  }
  public onItemDeSelect(item: any,type:any) {
      if(type=="Exercise")
      {
        let index = this.exercise_array.findIndex(x => x == item.id);
        this.exercise_array.splice(index,1);
        this.getExercise(this.exercise_array);
      }else if(type=="Train_Gp")
      {
        let index = this.train_gp_array.findIndex(x => x == item.id);
        this.train_gp_array.splice(index, 1);    
      }
  }

  public onVMSelect(item: any,type:any) 
  {
    if(type=='Vm')
    {
      this.valid = false;
      if(this.current_allot_type=="Individual")
      {
          this.user_data.forEach((myObject:any, index:any) => {
            if(typeof this.user_data[index].vm_control !='undefined')
            {
              //if team empty then search for specify user else search for all user
              this.user_data[index].vm_control.forEach((usObj:any, ind:any) => {
                    let indx = this.current_user_id.indexOf(usObj.U_ID)
                    if(indx >=0 && this.current_ex_id==usObj.ex_id && this.current_team_id==usObj.team_id && item.unique_id == usObj.unique_id)
                    {
                      this.valid = true;
                    }
              });   
            }
          });
      }else
      {
        this.team_data.forEach((teamObj:any, tindex:any) => {
          teamObj.user_data.forEach((teamUsObj:any, index:any) => {
          if(typeof teamUsObj.vm_control !='undefined')
          {
                 //if team empty ththis.current_user_iden search for specify user else search for all user
                 teamUsObj.vm_control.forEach((usObj:any, ind:any) => {
                      let sIndx = this.current_user_id.indexOf(teamUsObj.U_ID)
                      if(sIndx >= 0 && this.current_ex_id==usObj.ex_id && this.current_team_id==usObj.team_id && item.unique_id == usObj.unique_id)
                      {
                        this.valid = true;
                      }
                });   
          }
        });
      });
      } 
      
      if(this.valid)
      {
         this.selectedVmItems = [];
         Swal.fire("",Constants.ALERT_VM_CONFIGURED,"warning");
         return true;
      }
       this.current_vm_unique_id.push(item.unique_id);
       var temp = {ex_id:this.current_ex_id,team_id:this.current_team_id,unique_id:item.unique_id,control:this.defaultControl};
       this.vm_access.push(temp);
    }else if(type=='Control')
    {
      if(this.selectedVmItems.length==0)
      {
          this.selectedControlItems = []; 
          Swal.fire("",Constants.ALERT_VM_FIRST,"warning");
          return true;
      }

      this.vm_access.forEach((obj:any, index:any) => {
        if(obj.ex_id==this.current_ex_id && obj.team_id==this.current_team_id && this.current_vm_unique_id.includes(obj.unique_id))
        {
          if(typeof obj.control == 'undefined')
          {
            var tmp:any = [item.id];
            this.vm_access[index].control = tmp;
          }else
          {
             let indx = obj.control.indexOf(item.id)
             if(indx<0)
             {
               let tmp:any = obj.control;
               tmp.push(item.id);
               tmp = tmp.sort(); 
               this.vm_access[index].control = tmp;
             }
          }
        }
      });

      let indx = this.defaultControl.indexOf(item.id)
      if(indx<0)
      {
        this.defaultControl.push(item.id)
      }
  }else if(type=='Manual')
  {
      if(this.selectedVmItems.length==0)
      {
        this.selectedControlItems = [];
        this.manual_sel_items = [];
        Swal.fire("",Constants.ALERT_VM_FIRST,"warning");
        return true;
      }
      this.vm_access.forEach((obj:any, index:any) => {
        if(obj.ex_id==this.current_ex_id && obj.team_id==this.current_team_id && this.current_vm_unique_id.includes(obj.unique_id)) 
        {
          if(typeof obj.manual == 'undefined' )
          {
            this.vm_access[index].manual = [];
          }
          this.vm_access[index].manual.push(item.id);
        }
      });
  }
  }
  public onVMDeSelect(item: any,type:any) {
    if(type=='Vm')
    {
       this.vm_access.forEach((obj:any, index:any) => {
          if(obj.ex_id==this.current_ex_id && obj.team_id==this.current_team_id && obj.unique_id==item.unique_id)
          {
            this.vm_access.splice(index, 1);    
          }
      });
      if(this.vm_access.length==0)
      {
        this.selectedControlItems = [];
      }
    }else if(type='control')
    {
      this.vm_access.forEach((vmaccObj:any, index:any) => {
          if(typeof vmaccObj.control != 'undefined')
          {
            let ind = vmaccObj.control.indexOf(item.id)
            if(ind>=0)
            {
              this.vm_access[index].control.splice(ind, 1);
             }            
          }
      });
    }
  }

  public onSelectAll(items: any) {
  }
  public onDeSelectAll(items: any) {
  }

  setExerciseData(ex_id:any,date_type:any,date:any)
  {
    this.ds.Loader(true);
    const formData = new FormData();
    formData.append('exercise_data',JSON.stringify(this.exercise_data));
    formData.append('ex_dates',JSON.stringify(this.ex_dates));
    formData.append('ex_id',ex_id);
    formData.append('date_type',date_type);
    formData.append('date',date);

    this.BackenddbService.setAllotExerciseData(formData).subscribe((res:any) => {
          this.ds.Loader(false);
          if(typeof res.data.exercise != 'undefined')
          {
              this.exercise_data = [];
              this.ex_dates = [];
              this.total_credit = 0;
              this.exercise_data = res.data.exercise;
              this.exercise_data.forEach((exObj:any, index:any) => {
                var credits = Number(exObj.cal_credits);
                this.total_credit = this.total_credit+(credits*this.multiple);
  
                this.ex_dates.push({ex_id:exObj.id,start_date:exObj.valid_start,end_date:exObj.valid_end});
  
                 var exe_data = JSON.parse(exObj.exe_data);
                 var tmp_array:any = [];
                 exe_data.forEach((myObject:any, ind:any) => {
                   if(exe_data[ind].asset_type=='Template')
                   {
                      var tmp:any = { 
                                      unique_id: exe_data[ind].asset_unique_id,
                                      asset_name: exe_data[ind].asset_name
                                    };
                      tmp_array.push(tmp);
                   }
                 });
                 this.exercise_data[index]['vm_dropdown'] = tmp_array;
             });
          }

          if(res.status=='error')
          {
             Swal.fire("",res.message,"warning");
          }
    }); 
  }

  //store exercise dates in ex_dates array when select date
  setDatetime(data: ISelectionEvent,type:any,ex_id:any)
  {
     if(data.date!="")
     {
        this.ex_dates.forEach((exDateObj:any, index:any) => {
                  if(exDateObj.ex_id==ex_id && type=='start_date' && exDateObj.start_date!=data.date)
                  {
                      this.setExerciseData(ex_id,type,data.date);
                  }else if(exDateObj.ex_id==ex_id && type=='end_date' && exDateObj.end_date!=data.date)
                  {
                      this.setExerciseData(ex_id,type,data.date);
                  }
        });  
     }
 } 

  openVmPopUp(ex_id:any,user_id:any,team_id:any,model:any,from:any="")
  {
    this.current_vm_dropdown = []
    this.selectedVmItems = []
    this.selectedControlItems = []
    this.vm_access = []
    this.current_vm_unique_id = []
    this.defaultControl = []
    this.exercise_data.forEach((obj:any, index:any) => {
      if(obj.id==ex_id)
      {
         this.current_vm_dropdown = obj.vm_dropdown;
         obj.permission.forEach((per_obj:any, pindex:any) => {
           var target=this.vm_access_dropdown.find(temp=>temp.id==per_obj);
           this.defaultControl.push(Number(per_obj))
           this.selectedControlItems.push(target);
        });
      }
    });
    this.from = from
    this.current_ex_id = ex_id
    if(this.current_allot_type=='Team' && this.selectedUserID[team_id].length==0)
    {
      Swal.fire("",Constants.ALERT_TEAM_MEM_FIRST,"warning")
      return true
    }else
    {
      if(from=='teamBulkAssign')
      {
        this.current_user_id = this.selectedUserID[team_id]
      }else
      {
        this.current_user_id = []
        this.current_user_id.push(user_id)
      }
      this.current_team_id = team_id
    }
    this.vmPopUpConfgRef = this.modalService.open(model, {ariaLabelledBy: 'modal-basic-title', size: 'lg'});
  }

  onAccessChange(ex_id:any,user_id:any,access:string, isChecked: boolean)
	{
  }

  SubmitUserConfig()
  {
    if(this.selectedVmItems.length==0)
    {
      Swal.fire("",Constants.ALERT_VM_FIRST,"warning")
      return true
    }
    if(this.selectedControlItems.length==0)
    {
      Swal.fire("",Constants.ALERT_SELT_CONTROL,"warning");
      return true
    }

    this.ds.Loader(true);
    const formData = new FormData();
		formData.append('user_data',JSON.stringify(this.user_data));
		formData.append('team_data',JSON.stringify(this.team_data));
    formData.append('vm_access',JSON.stringify(this.vm_access));
    formData.append('current_user_id',JSON.stringify(this.current_user_id));
    formData.append('current_team_id',this.current_team_id);
    formData.append('current_allot_type',this.current_allot_type);

		this.BackenddbService.postData('admin-api/set-user-vmcontrol',formData).subscribe((res:any) => {
          this.ds.Loader(false);
          this.vm_access = [];
          this.manual_sel_items = [];
          if(this.current_allot_type=='Individual')
          {
            this.user_data = res.data.user_data;
          }else if(this.current_allot_type=='Team')
          {
            this.team_data = res.data.team_data;
          }
          Swal.fire("","VM config added successfully","success");
          this.vmPopUpConfgRef.close();
    }); 
  }

  setUserVmControl(user_id:any,team_id:any,tmp_control:any)
  {
      const formData = new FormData();
      formData.append('user_data',JSON.stringify(this.user_data));
      formData.append('team_data',JSON.stringify(this.team_data));
      formData.append('vm_access',JSON.stringify(tmp_control));
      formData.append('current_user_id',JSON.stringify([user_id]));
      formData.append('current_team_id',team_id);
      formData.append('current_allot_type',this.current_allot_type);
      formData.append('action','remove');
      this.BackenddbService.postData('admin-api/set-user-vmcontrol',formData).subscribe((res:any) => {
              this.ds.Loader(false);
              this.vm_access = [];
              if(this.current_allot_type=='Individual')
              {
                this.user_data = res.data.user_data;
              }else if(this.current_allot_type=='Team')
              {
                this.team_data = res.data.team_data;
              }
            Swal.fire("","VM config removed successfully","success");
      }); 
}

  deleteVmControl(user_id:any,ex_id:any,team_id:any,unique_id:any)
  {
    Swal.fire({
      title: 'Are you sure?',
      text: Constants.ALERT_DEL_CONTROL,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if(result.value) {
        var tmpControl = [];
        this.ds.Loader(true);
        if(this.current_allot_type=="Individual")
        {
          this.user_data.forEach((usObj:any, index:any) => {
            if(usObj.U_ID==user_id)
            {
              usObj.vm_control.forEach((vmObj:any, vm_index:any) => {
                  if(vmObj.ex_id==ex_id && vmObj.unique_id==unique_id)
                  {
                    tmpControl = this.user_data[index].vm_control;
                    tmpControl.splice(vm_index,1);
                    this.setUserVmControl(usObj.U_ID,usObj.team_id,tmpControl);
                  }
              });
            }
          });
        }else if(this.current_allot_type=="Team")
        {
          this.team_data.forEach((tmObj:any, index:any) => {
            if(tmObj.id==team_id)
            {
              tmObj.user_data.forEach((usObj:any, vm_index:any) => {
              if(usObj.U_ID==user_id)
              {  
                    usObj.vm_control.forEach((vmObj:any, vm_index:any) => {
                    if(vmObj.ex_id==ex_id && vmObj.unique_id==unique_id)
                    {
                        tmpControl = usObj.vm_control;
                        tmpControl.splice(vm_index,1);
                        this.setUserVmControl(usObj.U_ID,usObj.team_id,tmpControl);
                    }
                    });
              }
              });
            }
          });
      }
      }
    })
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
      }
    }
   });
}

get_wallet(wallet:any)
{
   this.wallet_balance = wallet.credit;
}

  get f() { return this.tpinfrm.controls; }

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

  setFlashMessage(type:any,message:any)
  {
    this.messageArray.type = type;
    this.messageArray.message = message;
    this.stringifiedData = JSON.stringify(this.messageArray);   
    this.LoginService.setflashMessage(this.stringifiedData);
  }

  preloadData()
  {
     this.ds.sendData('get_permission');
     this.ds.sendData('setting');
     this.ds.sendData('resetWallet');
  }

  set_permission(data:any)
  {
      if(data.permission.allocate_exe_user=='Denied')
      {
         this.router.navigate([this.dashboard_url+'dashboard']);
      }
      if(data.permission.exercise_bundle=='Denied')
      {
         this.exe_bundle = data.permission.exercise_bundle;
      } 
  }

  openmodal() {
    this.modalshow = 'modal-show';
  }

  closemodal()
  {
    this.modalshow = "";
    this.closedpopop = true;
  }

  /*this function close model popup*/
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }  
}


