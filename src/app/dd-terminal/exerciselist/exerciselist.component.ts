import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, QueryList, ViewChildren } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient,HttpParams  } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BackenddbService } from '../../services/backenddb.service';
import { FrontenddbService } from '../../services/frontenddb.service';

import { LoginService } from '../../services/login.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

import { FormGroup,  FormBuilder, FormArray, FormControl, Validators  } from '@angular/forms';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2';
import {noWhitespaceValidator} from '../../helper/validatefun';

import { faUser, faEdit, faTrash, faUsers, faEye,faBars, faCamera, faCopy } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';

import { DatapassService } from '../../services/datapass.service';
import { Subscription } from 'rxjs/Subscription';
import { Constants } from 'src/constants';
declare const activesidebar:any;

class Exercise {
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
  selector: 'app-exerciselist',
  templateUrl: './exerciselist.component.html',
  styleUrls: ['./exerciselist.component.css']
})
export class ExerciselistComponent implements OnInit {

  viewProfile : Subject<any> = new Subject<any>();
  subscription: Subscription;

	faUser = faUser;
	faEdit = faEdit;
	faTrash = faTrash;	
	faUsers = faUsers;	
	faEye = faEye;	
  faBars = faBars;
  faCamera = faCamera;
  faCopy = faCopy;

  public _opened: boolean = true; 
	public _toggleSidebar() {
		this._opened = !this._opened;
	} 

  /* datatable */
  @ViewChildren(DataTableDirective)
  dtElements: QueryList<DataTableDirective>;
  dtOptions: DataTables.Settings[] = [];
  dtTrigger = new Subject();
  exercise: Exercise[];
  serverUrl = environment.baseUrl;

  /*flash message*/
  msgalert:any;
  
  /*breadcrumbs array */
  current_url_array = [];

  bg_process = [];
  bg_task = [{'task':'delete_admin_exercise'}];

  visiability_array = ['Public','Private'];
  status_array = ['Active','Inactive'];
  visiability_status = '';
  status = '';

  formdata: FormGroup;
  exefrm: FormGroup;
  group_id:string = '';
  progressbar: boolean = false;
  modalfadeclass:string = "";
  error: string;
  closed: boolean = true;
  closedpopop: boolean = true;
  alertMessage: string;
  alertClass: string;
  update_by:string;
  closeResult = '';
  checkArray: FormArray;

  dashboard_url:string; 
  my_team:string = '';

  form_title:any = 'Exercise List';

  searchVal = '';
  
  constructor(
    private http: HttpClient,
    private router: Router,
    private BackenddbService: BackenddbService,
    private LoginService: LoginService,   
    private FrontenddbService: FrontenddbService,   
    private fb:FormBuilder,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private ds: DatapassService
    ) {
        this.update_by = this.LoginService.getUserId();
        this.group_id = this.LoginService.getLoginGroup();
        this.dashboard_url = this.LoginService.getDashboardUrl();
        this.getFlashMessage();
    }

		ngOnInit() {
      activesidebar(); 
    this.subscription = this.ds.getData().subscribe(x => { 
      if(x[0]=='set_process_array')
      {
          this.set_process_array(x[1]);
      }else if(x[0]=='set_permission')
      {
        this.set_permission(x[1]);
      }
    });

		this.createExerciseTable();
		
		this.current_url_array = [
			{'slug':"",'label':'Exercise List'}
		  ];

	}

  createExerciseTable()
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
           //params = params.append("group_id", this.group_id);
           params = params.append("status", this.status);
           params = params.append("visibility", this.visiability_status);
           
           if(this.group_id=='2')
           {
            params = params.append("created_by", this.update_by);
           }else
           {
            params = params.append("created_by",'');
           }
   
           let param = params.toString();
           that.http
             .post<DataTablesResponse>(
               this.serverUrl+'datatable-api/get-exercise-list',
               params, {}
             ).subscribe(resp => {
               that.exercise = resp.data;
               callback({
                 recordsTotal: resp.recordsTotal,
                 recordsFiltered: resp.recordsFiltered,
                 data: []
               });
             });
         },
         columns: [{ data: 's_no' }, { data: 'unique_id' }, { data: 'name' }, { data: 'visibility' }, { data: 'created_by' }, { data: 'created_datetime' }, { data: 'last_datetime' }]
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

  changeStatus(event:any,type:any)
  {
    if(type=='status')
    {
      this.status = event.target.value;
    }else
    {
      this.visiability_status = event.target.value;
    }
    this.rerender_datatable('team-table');
  }
  
  changeTeamType(event:any)
  {
   // this.team_type = event.target.value;
    this.rerender_datatable('team-table');
  }

  changeMyTeam(event:any)
  {
    this.my_team = event.target.value;
    this.rerender_datatable('team-table');
  }

  exportCsv()
  {
    this.ds.Loader(true);
    const formData = new FormData();
    formData.append('status', this.status);
    formData.append('visibility', this.visiability_status);
    this.BackenddbService.postData('admin-api/create-exercise-csv',formData).subscribe((res:any) => {
        this.ds.Loader(false);
        if(res.status=='success')
        {
            const link = document.createElement('a');
            link.setAttribute('target', '_blank');
            link.setAttribute('href', res.url);
            link.setAttribute('download', '');
            document.body.appendChild(link);
            link.click();
            link.remove();
        }else
        {
          Swal.fire('',res.message,'warning');
        }
      }
    );
  }

  deleteExercise(ex_id:any,unique_id:any)
  {
    Swal.fire({
      title: 'Are you sure?',
      text: Constants.ALERT_DEL_EXE,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.value) {
        const formData = new FormData();
          /* here set submitted data in formData object array */
          formData.append('ex_id', ex_id);
          formData.append('asset_unique_id',unique_id);  
          formData.append('label','Deleting exercise('+unique_id+')');
          this.BackenddbService.postData('redhatrest-api/submit-delete-exercise',formData).subscribe(
            res => {
              if(res.status == 'success') {
                this.ds.sendData('background_process');
                Swal.fire('',res.message,'success');
              }else {
                Swal.fire('',res.message,'warning');
                if(typeof res.redraw != 'undefined' && res.redraw=='1')
                {
                   this.rerender_datatable('team-table');
                }
               }
            },
            error => this.error = error
            );
            }
    })
    
  }

  copyExercise(id:any)
  {
    Swal.fire({
      title: 'Are you sure?',
      text: Constants.ALERT_COPY_EXE,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.value) {
        const formData = new FormData();
        formData.append('ex_id', id);  
        formData.append('update_by', this.update_by);  
        formData.append('process','prepare_admin_infra');  
        formData.append('task', 'copy');  
        formData.append('exe_unique_id', '');  
        formData.append('asset_unique_id', '');  
        formData.append('label','Copy exercise');  
      
       this.ds.Loader(true);
      this.BackenddbService.rabbitmqSubmitProcess(formData).subscribe(
        res => {
          this.ds.Loader(false);
          if(res.status == 'success')
          {
            this.ds.sendData('background_process');
          }else 
          {
              this.alertMessage = Constants.ERROR;
              this.alertClass = 'danger';
              this.closed = false;
          }
        }
      );
      }
    })
  }

  redirect(strurl:any)
  {
    this.router.navigate([strurl]);
  }

  set_process_array(data:any)
  {
    this.bg_process = data;
    data.forEach((dobj:any, dataindex:any) => { 
      var result = this.bg_task.find(bgt => bgt.task == dobj.process_type);
      if(typeof(result) !='undefined' && (dobj.status=='success' || dobj.status=='fail'))
      {
         this.rerender_datatable('team-table');
      }
    });  
  }

  preloadData()
  {
     this.ds.sendData('get_permission');
  }  
  
  set_permission(data:any)
  {
    if(data.permission.create_exercise=='Denied')
    {
        this.router.navigate([this.dashboard_url+'dashboard']);
    }
  }

  refreshMainTable() {
    this.dtElements.forEach((dtElement: DataTableDirective, index: number) => {
      dtElement.dtInstance.then((dtInstance: any) => {
      });
    })
  }

  /* open model for assign team for candidate */
  open(assign_team_id : any,assign_team_name:any,content:any) {
    this.refreshMainTable();
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'xl'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

  }

  get f() { return this.exefrm.controls; }

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

 
  }