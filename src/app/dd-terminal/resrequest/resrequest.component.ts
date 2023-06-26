import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, QueryList, ViewChildren, ChangeDetectorRef, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient,HttpParams  } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BackenddbService } from '../../services/backenddb.service';

import { LoginService } from '../../services/login.service';
import { Router, ActivatedRoute } from '@angular/router';

import { FormGroup,  FormBuilder, FormArray, FormControl, Validators  } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2';
import { faUser, faEdit, faTrash, faUsers, faEye,faCog } from '@fortawesome/free-solid-svg-icons';
import {lessThanZeroValidator} from '../../helper/validatefun';

import { DatapassService } from '../../services/datapass.service';
import { Subscription } from 'rxjs/Subscription';
import { isFormattedError } from '@angular/compiler';
declare const activesidebar:any;
declare const modal:any;

class Team {
  id: number;
  firstName: string;
  lastName: string;
}
class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  param:any;
}
declare var $ : any;
@Component({
  selector: 'app-resrequest',
  templateUrl: './resrequest.component.html',
  styleUrls: ['./resrequest.component.css']
})
export class ResrequestComponent implements OnInit {
  viewProfile : Subject<any> = new Subject<any>();
  subscription: Subscription;
	faUser = faUser;
	faEdit = faEdit;
	faTrash = faTrash;	
	faUsers = faUsers;	
	faEye = faEye;	
  faCog = faCog;

  public _opened: boolean = true; 
	public _toggleSidebar() {
		this._opened = !this._opened;
	} 
	
  /* datatable */
  @ViewChildren(DataTableDirective)
  dtElements: QueryList<DataTableDirective>;
  dtOptions: DataTables.Settings[] = [];
  dtTrigger = new Subject(); 
  teams: Team[];
  serverUrl = environment.baseUrl;

  /*flash message*/
  msgalert:any;
  
  /*breadcrumbs array */
  current_url_array = [];

  formdata: FormGroup;
  group_id:string = '';
  status:string = '';
  current_status:string = '';
  credit_system:string = 'Inactive';
  type:string = '';
  error: string;
  closed: boolean = true;
  closedpopop: boolean = true;
  alertMessage: string;
  alertClass: string;
  update_by:string;
  statusList = [];
  closeResult = '';
  checkArray: FormArray;
  candidate_table:boolean = false;
  v_id:string = '';
  current_id:string = '';
  isDisabled:boolean = false;

  dashboard_url:string; 
 
  responseTableArray = [];  // store return response when team assign to candidate 

  server_url:string;
  id:string = '';
  res_id:string = '';
  res_tab:boolean = true;
  per_tab:boolean = false;
  show_btn:boolean = true;
  claim_id:string = '';

  searchVal = '';

	form_title:any = 'Resource Request List';
  private isClicked = false;

  packagefrm: FormGroup;
  obj:any;
  /* validation error messsage */
  error_messages = {
   'create_team': [
    { type: 'required', message: 'Create Team is required' },
  ],  
  'create_exercise': [
    { type: 'required', message: 'Create Exercise is required' },
  ],
  'exercise_bundle': [
    { type: 'required', message: 'Exercise Bundle is required' },
    ],
    'allocate_exe_user': [
    { type: 'required', message: 'Allocate Exercise to User is required' },
    ],
    'create_manual': [
    { type: 'required', message: 'Create Manual is required' },
    ],
    'chat': [
    { type: 'required', message: 'Chat is required' },
    ],
    'edit_profile': [
    { type: 'required', message: 'Edit Profile is required' },
    ],
    'enroll': [
    { type: 'required', message: 'Enroll is required' },
    ],
    'access_exercise': [
    { type: 'required', message: 'Access Exercise is required' },
    ], 
 } 

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private BackenddbService: BackenddbService,
    private LoginService: LoginService,   
    private formBuilder: FormBuilder,
    private dtchange: ChangeDetectorRef,
    private ds: DatapassService
    ) {
        this.update_by = this.LoginService.getUserId();
        this.group_id = this.LoginService.getLoginGroup();
        this.dashboard_url = this.LoginService.getDashboardUrl();
        this.id = this.route.snapshot.paramMap.get('id');
		    this.server_url = this.LoginService.getServerUrl();

      //  this.obj = this.router.routeReuseStrategy.shouldReuseRoute = function() {
      //     return false;
      //   };
        
    }
	
		ngOnInit(): void {
      activesidebar(); 

    this.resReqList();
      this.packagefrm = this.formBuilder.group({
        exercise: ['', [Validators.required,lessThanZeroValidator]],
        team: ['', [Validators.required,lessThanZeroValidator]],
        users: ['', [Validators.required,lessThanZeroValidator]],
        vm: ['', [Validators.required,lessThanZeroValidator]],
        network: ['', [Validators.required,lessThanZeroValidator]],
        template: ['', [Validators.required,lessThanZeroValidator]],
        disk: ['', [Validators.required,lessThanZeroValidator]],
        storage: ['',[Validators.required,lessThanZeroValidator]],
        vcpu: ['',[Validators.required,lessThanZeroValidator]],
        vram: ['',[Validators.required,lessThanZeroValidator]],
    });

    this.formdata = this.formBuilder.group({
			create_team: ['', [Validators.required]],
			create_exercise: ['', [Validators.required]],
			exercise_bundle: ['', [Validators.required]],
			allocate_exe_user: ['', [Validators.required]],
			create_manual: ['', [Validators.required]],
			chat: ['', [Validators.required]],
			});
		
		this.current_url_array = [
			{'slug':"",'label':'Resource Request List'}
		  ];

      this.loadData();
	}

  ngAfterContentChecked() {
    this.dtchange.detectChanges();
  }

  loadData()
  {
    this.subscription = this.ds.getData().subscribe(x => { 
      if(x[0]=='setting')
      {
        this.get_setting(x[1]);
      }
    });
  }


  resReqList()
  {
       const that = this;
       this.dtOptions[1] = {
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
           params = params.append("search", this.searchVal);
           params = params.append("order_col", dataTablesParameters.order[0].column);
           params = params.append("order_type", dataTablesParameters.order[0].dir);        
           params = params.append("status", this.status);
           params = params.append("type", this.type);
           if(this.id==null)
           {
            this.id = '';
           }

           params = params.append("id", this.id);
   
           let param = params.toString();
           that.http
             .post<DataTablesResponse>(
               this.serverUrl+'datatable-api/get-res-request-list',
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
         columns: [{ data: 's_no' }, { data: 'name' }, { data: 'res_type' }, { data: 'status' },  { data: 'last_datetime' }]
       };
  }

  datatableSearch(event){
    this.searchVal  = event.target.value; 
    this.rerender_datatable('team-table');
  }

  ngAfterViewInit(): void {
   this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    this.ds.clearData();
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

  changeStatus(event:any)
  {
    this.status = event.target.value;
    this.rerender_datatable('team-table');
  }

  changeType(event:any)
  {
    this.type = event.target.value;
    this.rerender_datatable('team-table');
  }


  
  refreshMainTable() {
    this.dtElements.forEach((dtElement: DataTableDirective, index: number) => {
      dtElement.dtInstance.then((dtInstance: any) => {
      });
    })
  }

  openReqModal(id:any,type:any)
  {
    this.res_id = id;
    if(id!='')
    {
        if(type=='1')
        {
          this.res_tab = true;
          this.per_tab = false;
          this.packagefrm.reset();
        }else if(type=='2')
        {
          this.res_tab = false;
          this.per_tab = true;
          this.formdata.reset();
        }
    }else
    {
      this.res_tab = true;
      this.per_tab = false;
      this.packagefrm.reset();

      this.formdata.patchValue({
        create_team: '',
        create_exercise: '',
        exercise_bundle: '',
        allocate_exe_user: '',
        create_manual: '',
        chat: '',
      });
    }

    if(this.group_id=='1')
    {
      this.isDisabled = true; 
    }

    if(this.res_id=='')
    {
      this.current_status = '';
      (<any>$('#reqModal')).modal('show');
    }else
    {
      const formData = new FormData();
      this.closed = true;
      this.ds.Loader(true);
      formData.append('id',this.res_id);
      var api = 'admin-api/get-res-request';
      this.BackenddbService.postData(api,formData).subscribe(
        res => {
          this.ds.Loader(false);
          if(res.status=='success')
          {
              this.current_status = res.data.status;
              if(type=='1')
              {
                this.packagefrm.patchValue({
                  exercise: res.data.exercise,
                  team: res.data.team,
                  users: res.data.users,
                  vm: res.data.vm,
                  network: res.data.network,
                  template: res.data.template,
                  disk: res.data.disk,
                  storage: res.data.storage,
                  vcpu: res.data.vcpu,
                  vram: res.data.vram,
                });
                var frm = this.packagefrm;
              }else
              {
                  this.formdata.patchValue({
                    create_team: res.data.create_team,
                    create_exercise: res.data.create_exercise,
                    exercise_bundle: res.data.exercise_bundle,
                    allocate_exe_user: res.data.allocate_exe_user,
                    create_manual: res.data.create_manual,
                    chat: res.data.chat,
                  });
                  var frm = this.formdata;
              }
              this.show_btn = true;
              this.claim_id = '';

              console.log(res.data);
              if(this.group_id=='1' && this.credit_system=='Active' &&  res.data.credit!='')
              {
                 frm.patchValue({ credit: res.data.credit });
              }else if(res.data.credit!='' && res.data.credit!='null')
              {
                 this.show_btn = false;
                 this.claim_id = res.data.claim_id;
              }
          }
          (<any>$('#reqModal')).modal('show');

        }); 
    }
  }


  setCredit(e:any,type:any)
  {
    if(type=='1')
    {
      this.packagefrm.patchValue({credit: e.target.value});
    }else
    {
      this.formdata.patchValue({credit: e.target.value});
    }  
  }


  resSubmit(data:any,type:any)
  {
      const formData = new FormData();
      this.closed = true;
      this.ds.Loader(true);
      formData.append('id',this.res_id);
      formData.append('res_type',type);
      formData.append('resource', JSON.stringify(data));

      var api = 'admin-api/save-res-request';
      this.BackenddbService.postData(api,formData).subscribe(
        res => {
          //console.log(res);
          this.ds.Loader(false);
          (<any>$('#reqModal')).modal('hide');
          if(res.status=='success')
          {
            this.rerender_datatable('team-table');
            this.alertMessage = res.message;
            this.closed = false;
            this.alertClass = 'success'; 
            this.ds.sendData('notification');
          }
      });
  }

  onSubmit(data:any,type:any) {

    if(type=='1')
    {
        var valid = true;
        for(var key in data) {
          if(data[key] != null && valid==true)
          {
            valid = false;
          }
      }
      if(valid)
      {
        Swal.fire('','Sorry! Please fill at least one resource.','warning');
        return false;
      }

      this.resSubmit(data,type);
    }else if(type=='2')
    {
      if(this.formdata.valid) 
      {
        this.resSubmit(data,type);
       } else {
        this.validateAllFormFields(this.formdata); // check validation
      }
    }
}

get f() { return this.formdata.controls; }

  
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

viewUserProfile(user_id:any)
{
  this.viewProfile.next(user_id);
}

get_setting(settings:any)
{
  settings.forEach( (myObject:any, index:any) => {
    if(settings[index].skey=='credit_system')
    {
      var svalue = JSON.parse(settings[index].svalue);
      if(svalue[0].status=='Active')
      {
        this.credit_system = svalue[0].status;
        if(this.group_id=='1')
        {
          let newCtl = new FormControl('', null);
          this.packagefrm.addControl('credit', newCtl);
          this.formdata.addControl('credit', newCtl);
        }
     }
    }
   });
}
   
preloadData()
{
   this.ds.sendData('setting');
}

redirect(strurl:any)
{
  (<any>$('#reqModal')).modal('hide');
  this.router.navigate([this.dashboard_url+'/'+strurl]);
}
  

}

