import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild,ElementRef , QueryList, ViewChildren,ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient,HttpParams  } from '@angular/common/http';
import { environment } from '../../../environments/environment';

import { BackenddbService } from '../../services/backenddb.service';
import { FrontenddbService } from '../../services/frontenddb.service';

import { LoginService } from '../../services/login.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

import { FormGroup,  FormBuilder, FormArray, FormControl, Validators  } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2';
import {noWhitespaceValidator} from '../../helper/validatefun';
import {Constants} from '../../../constants';

import { faPlusCircle,faUser, faEdit, faTrash, faUsers, faEye,faBars, faCamera,faPlus,faMinus,faCog,faPowerOff,faDesktop,faDownload ,faFileExport,faRedo,faList,faNetworkWired } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { DatapassService } from '../../services/datapass.service';
import { Subscription } from 'rxjs/Subscription';
import Stepper from 'bs-stepper';

declare const activesidebar:any;

class Allotment {
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
  selector: 'app-allotmentlist',
  templateUrl: './allotmentlist.component.html',
  styleUrls: ['./allotmentlist.component.css']
})
export class AllotmentlistComponent implements OnInit {

  subscription: Subscription;
  viewProfile : Subject<any> = new Subject<any>();
  private stepper: Stepper;

  //fontasome icon
  faPlusCircle = faPlusCircle;
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
    
  public _opened: boolean = true; 
	public _toggleSidebar() {
		this._opened = !this._opened;
	}  

  /* datatable */
  @ViewChildren(DataTableDirective)
  dtElements: QueryList<DataTableDirective>;
  dtOptions: DataTables.Settings[] = [];
  dtUserOptions: DataTables.Settings[] = [];

  dtAllotmentTrigger = new Subject();
  allotment: Allotment[];
  allotment_searchVal:string = '';

  serverUrl = environment.baseUrl;

  setting:any = [];
  credit_system:string = 'Inactive';
  total_credit:number = 0;
  wallet_balance:number = 0;

  /*flash message*/
  msgalert:any;
  
  /*breadcrumbs array */
  current_url_array = [];
  allotRoadmap = [];

  alloted_status:string = "";
  status_list = [];
  roadmapStatusList = ['Pending','Completed'];
  currentRoadmapStatus = [];
  bg_process = [];
  bg_task = [{'task':'delete_admin_allotted_exe'},{'task':'exercise_allotment'}];

  // model popup object 
  modalConfgRef:any;
  modalRoadmap:any;

  t_pin:string = "";

  // current updating allotment
  current_allote_id:string = '';
  current_allote_status:string = '';

  status_array = ['publish','unpublish'];

  extend_status:string = '';
  allotmentfrm: FormGroup;
  tpinfrm: FormGroup;
  group_id:string = '';
  error: string;
  closed: boolean = true;
  closedpopop: boolean = true;
  alertMessage: string;
  alertClass: string;
  update_by:string;
  closeResult = '';
  checkArray: FormArray;

  dashboard_url:string; 
  
  form_title:string = 'Allotment List';

  searchVal = '';

  server_url:string;

  valid:boolean = false;

  current_action:string = '';
  current_index:string = '';
  allotment_id:string = '';

  allotment_detail:any;

  error_messages = {
		't_pin': [
		{ type: 'required', message: 'TPIN is required' },
		] 
    };
       
  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private BackenddbService: BackenddbService,
    private LoginService: LoginService,   
    private FrontenddbService: FrontenddbService,   
    private fb:FormBuilder,
    private modalService: NgbModal,
    private ds: DatapassService,
    private dtchange: ChangeDetectorRef,
    ) {
        this.update_by = this.LoginService.getUserId();
        this.group_id = this.LoginService.getLoginGroup();
        this.dashboard_url = this.LoginService.getDashboardUrl();
        this.server_url = this.LoginService.getServerUrl();
        this.allotment_id = this.route.snapshot.paramMap.get('id');

        this.getFlashMessage();
    }

    next() {
      this.stepper.next();
    }

		ngOnInit() {
      activesidebar(); 
    this.subscription = this.ds.getData().subscribe(x => { 
     
      if(x[0]=='set_process_array')
      {
        this.set_process_array(x[1]);
      }else if(x[0]=='setting')
      {
        this.get_setting(x[1]);
      }else if(x[0]=='wallet')
      {
        this.get_wallet(x[1]);
      }else if(x[0]=='set_permission')
      {
        this.set_permission(x[1]);
      }
   });


    this.drawAllotmentList();
		/*breadcrumbs array */
		this.current_url_array = [
			{'slug':"",'label':'Allotment List'}
		];
    /* End breadcrumbs array */	

    this.tpinfrm = this.fb.group({
			t_pin: ['', [Validators.required,noWhitespaceValidator]],
		});

    this.allotmentfrm = this.fb.group({
			sel_action: [''],
		});
    
    /* get allotment status list from CI */   
    this.BackenddbService.getAllotmentStatusList().subscribe((data:any) => {
      this.status_list = Array.from(Object.keys(data), k=>data[k]);
      });
 }


 ngAfterContentChecked() {
  this.dtchange.detectChanges();
}

 stepperProgressBar()
 {
   this.stepper = new Stepper(document.querySelector('#stepper1'), {
     linear: false,
     animation: true
   })
 }
  
  drawAllotmentList()
  {
       /* user data table */
       const that = this;
       this.dtOptions[1] = {
         dom: '<"top">tr<"bottom"ilp><"clear">',
         pagingType: 'full_numbers',
         pageLength: 10,
         serverSide: true,
         processing: true,
         order: [[ 0, "desc" ]],
         ajax: (dataTablesParameters: any, callback:any ) => {

          this.current_action = '';
          this.current_index = '';      

           let params = new HttpParams();
           let startNumber: any;
   
           startNumber = dataTablesParameters.start;
           if (startNumber != 0) {
             startNumber = startNumber + 1
           } else {
             startNumber = startNumber;
           }

           if(this.allotment_searchVal=='' && this.allotment_id!=null)
           {
             this.allotment_searchVal = this.allotment_id;
           }

           params = params.append("start", startNumber);
           params = params.append("length", dataTablesParameters.length);
           params = params.append("draw", dataTablesParameters.draw);
           params = params.append("search", this.allotment_searchVal);
           params = params.append("extend_status", this.extend_status);
           params = params.append("order_col", dataTablesParameters.order[0].column);
           params = params.append("order_type", dataTablesParameters.order[0].dir);   
           
           if(this.alloted_status=='null')
           {
            var alloted_status = '';
           }else
           {
            var alloted_status = this.alloted_status; 
           }
           params = params.append("status",alloted_status);
           let param = params.toString();
           that.http
             .post<DataTablesResponse>(
               this.serverUrl+'datatable-api/get-allotment-list',
               params, {}
             ).subscribe(resp => {
   
               that.allotment = resp.data;
   
               callback({
                 recordsTotal: resp.recordsTotal,
                 recordsFiltered: resp.recordsFiltered,
                 data: []
               });
               document.querySelector('.table-responsive').scrollIntoView({ behavior: 'smooth', block: 'end' });

             });
         },
         columns: [{ data: 's_no' }, { data: 'a_id' }, { data: 'name' },  { data: 'user_name' }, { data: 'allocated_by' }, { data: 'status' }, { data: 'allotment_type' }, { data: 'last_datetime' }]
      
        };
  }

  
  datatableSearch(event:any,type:any){
    if(type=='allotment')
    {
      this.allotment_searchVal  = event.target.value; 
      this.rerender_datatable('allotment-table');
    }
  }

  onChange(event:any)
	{
		if(event.target.checked) {
			this.extend_status = '1';
		}else
		{
      this.extend_status = '';
 		}	
    this.rerender_datatable('allotment-table');
	}

  ngAfterViewInit(): void {
   this.dtAllotmentTrigger.next();
  }

  ngOnDestroy(): void {
    this.dtAllotmentTrigger.unsubscribe();
  }

  rerender_datatable(datatableName:any) {
    this.dtElements.forEach((dtElement: DataTableDirective, index: number) => {
      dtElement.dtInstance.then((dtInstance: any) => {
        //console.log(dtInstance.table().node().id);
        if(dtInstance.table().node().id == datatableName) {
           dtInstance.draw();
        }
      });
    });
  }

  changeStatus(event:any)
  {
    this.alloted_status = event.target.value;
    this.rerender_datatable('allotment-table');
  }

  changeRoadmapStatus(event:any,index:any)
  {
    this.currentRoadmapStatus[index] = event.target.value;
  }  

  refreshMainTable() {
    this.dtElements.forEach((dtElement: DataTableDirective, index: number) => {
      dtElement.dtInstance.then((dtInstance: any) => {
      });
    })
  }

  selAction(event:any,index:any)
  {
    this.current_action = event.target.value;;
    this.current_index = index;    
  }

  action(allot_id:any,index:any,model_tpin:any)
  {
      if(this.current_index!=index || this.current_index==="")
      {
        Swal.fire("","Select action first!","warning");
      }

      if(this.current_action=="Rejected")
      {
         this.SubmitStatusUpdate(allot_id);
      }   
      else if(this.current_action=="Allotted") 
      {
         if(this.credit_system=="Active")
         {
            this.deduct_creadit(allot_id,'Allocated',model_tpin)
         }else
         {
            this.SubmitStatusUpdate(allot_id);
         }
      }else if(this.current_action=="Edit")
      {
        this.router.navigate([this.dashboard_url+'/exercise-allotment/'+allot_id]);
      }else if(this.current_action=="Delete")
      {
          const formData = new FormData();
          formData.append('process','delete_admin_allotted_exe');  
          formData.append('asset_unique_id', allot_id);  
          formData.append('label','Deleting allotment('+allot_id+')');

          Swal.fire({
            title: 'Are you sure?',
            text: 'Do you really want to delete this allotment?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel'
          }).then((result) => {
            if(result.value) {
              this.rabbitMQSubmitProcess(formData);
            }
          })

      }else
      {
         //setTimeout( () => { this.router.navigate([`/user-exercises`]); }, 2000 );
      }
  }
  
  
  submit_tpin(data:any)
  {
    if(this.tpinfrm.valid)
		{
		  this.modalConfgRef.close();	
      this.t_pin = data.t_pin;
		  this.SubmitStatusUpdate(this.current_allote_id);
		}else
		{
		  this.validateAllFormFields(this.tpinfrm); // check validation
		}
  }
  
  SubmitStatusUpdate(allote_id:any)
  {
    this.ds.Loader(true);
		const formData = new FormData();
		formData.append('allot_id',allote_id);
		formData.append('status',this.current_action);
    formData.append('t_pin',this.t_pin);

    var api = 'admin-api/update-allotment-status';
		this.BackenddbService.postData(api,formData).subscribe((res:any) => {
      this.ds.Loader(false);
			this.t_pin = '';
			if(res.status=='success')
			{
        if(this.current_action=='Allotted')
        {
          this.ds.sendData('resetWallet');
        }

				Swal.fire('',res.message,'success');
        this.rerender_datatable('allotment-table');
			}else if(res.status=='error')
			{
				Swal.fire('',res.message,'warning');
			}
			});
  }

  updateRoadmapStatus(id:any,pkag_gp_id:any,index:any)
  {
    this.ds.Loader(true);
		const formData = new FormData();
		formData.append('id',id);
    formData.append('pkag_gp_id',pkag_gp_id);
		formData.append('status',this.currentRoadmapStatus[index]);
    var api = 'admin-api/update-allot-roadmap-status';
		this.BackenddbService.postData(api,formData).subscribe((res:any) => {
      this.ds.Loader(false);
			if(res.status=='success')
			{
        (<any>$('#steeperProgress')).modal('hide');
				Swal.fire('',res.message,'success');
        this.rerender_datatable('allotment-table');
			}else if(res.status=='error')
			{
				Swal.fire('',res.message,'warning');
			}
			});
  }

  deduct_creadit(id:any,status:any,model:any)
  {
     var msg = "";
     if(status=='Allocated')
     {
        var msg = "Do you really want to allote?";
     }else if(status=='Rejected')
     {
        var msg = "Do you really want to reject?";
     }
      
      Swal.fire({
        title: 'Are you sure?',
        text: msg,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if(result.value) {
          this.current_allote_id = id;
          this.current_allote_status = status;
          if(this.t_pin=="" && status=='Allocated')
          {
              this.modalConfgRef = this.modalService.open(model, {ariaLabelledBy: 'modal-basic-title', size: 'sm'});
              return true;
          }

        }
      })
  }

  rabbitMQSubmitProcess(formData:any)
  {
    this.ds.Loader(true);
    this.BackenddbService.rabbitmqSubmitProcess(formData).subscribe(
      res => {
        this.ds.Loader(false);
        if(res.status == 'success')
        {
             this.ds.sendData('background_process');
            Swal.fire('',res.message,'success');
        }else 
        {
            Swal.fire('',Constants.ERROR,'warning');
        }
      }
    );
  }

  set_process_array(data:any)
  {
    this.bg_process = data;
    data.forEach((dobj:any, dataindex:any) => { 
      var result = this.bg_task.find(bgt => bgt.task == dobj.process_type);
      if(typeof(result) !='undefined' && (dobj.status=='success' || dobj.status=='fail'))
      {
         this.rerender_datatable('allotment-table');
         this.ds.sendData('resetWallet');
      }
    });  
  }

  preloadData()
  {
     this.ds.sendData('get_permission');
     this.ds.sendData('setting');
     this.ds.sendData('resetWallet');
     this.ds.sendData('background_process');
  }

  set_permission(data:any)
  {
      if(data.permission.allocate_exe_user=='Denied')
      {
         this.router.navigate([this.dashboard_url+'dashboard']);
      }
  }

  ViewMoreDetail(id:any,modal:any)
  {
    this.ds.Loader(true);
		const formData = new FormData();
		formData.append('allot_id',id);
    var api = 'admin-api/get-allotment-detail';
		this.BackenddbService.postData(api,formData).subscribe((res:any) => {
      this.ds.Loader(false);
      if(res.status=='success')
      {
        this.allotment_detail =res.data;
        this.modalConfgRef = this.modalService.open(modal, {ariaLabelledBy: 'modal-basic-title', size: 'lg'});
      }else if(res.status=='error')
      {
        Swal.fire('',res.message,'warning');
      } 
    });  
  }

  ViewRoadMap(pkag_gp_id:any,id:any)
  {
    this.ds.Loader(true);
  	const formData = new FormData();
		formData.append('pkag_gp_id',pkag_gp_id);
    formData.append('id',id);
    this.allotRoadmap = []
    var api = 'admin-api/get-allot-roadmap-details';
		this.BackenddbService.postData(api,formData).subscribe((res:any) => {
      this.ds.Loader(false);
      if(res.status=='success')
      {
        this.allotRoadmap = res.data.allotRoadmap;
        this.currentRoadmapStatus = [];
        this.allotRoadmap.forEach((dobj:any, dataindex:any) => { 
          this.currentRoadmapStatus.push(dobj.status)
        });     
        (<any>$('#steeperProgress')).modal('show');
        setTimeout(() => {
          this.stepperProgressBar()
          this.stepper.to(res.data.currentOrder)
        },10);
      }
    });  
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
      }
    }
   });
}

get_wallet(wallet:any)
{
   this.wallet_balance = wallet.credit;
}

}

