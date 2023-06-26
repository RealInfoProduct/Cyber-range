//import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, QueryList, ViewChildren,ChangeDetectorRef } from '@angular/core';
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
import {noWhitespaceValidator,csvValidator} from '../../helper/validatefun';

import { faBars, faUser, faEdit, faTrash, faCopy } from '@fortawesome/free-solid-svg-icons';

import { DatapassService } from '../../services/datapass.service';
import { Subscription } from 'rxjs/Subscription';

class Team {
  id: number;
  firstName: string;
  lastName: string;
}

class Candidate {
  id: number;
  firstName: string;
  lastName: string;
}

class DataTablesResponseCandidate {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  param:any;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  param:any;
}
declare var $ : any;
declare const activesidebar:any;
@Component({
  selector: 'app-referencelist',
  templateUrl: './referencelist.component.html',
  styleUrls: ['./referencelist.component.css']
})
export class ReferencelistComponent implements OnInit {
  viewProfile : Subject<any> = new Subject<any>();
  subscription: Subscription;
  faUser = faUser;
	faEdit = faEdit;
	faTrash = faTrash;
  faBars = faBars;
  faCopy = faCopy;

	public _opened: boolean = true; 
	public _toggleSidebar() {
		this._opened = !this._opened;
	} 

	
  @ViewChildren(DataTableDirective)
  /* Datatable */
  dtElements: QueryList<DataTableDirective>;
  dtOptions: DataTables.Settings[] = [];
  dtTrigger = new Subject();
  teams: Team[];
  serverUrl = environment.baseUrl;

  modalConfgRef:any;

  /*flashmessage*/
  msgalert:any;

  formdata: FormGroup;
  refcsvfrm: FormGroup;
  reffrm: FormGroup;
  group_id:string = '';
  error: string;
  closed: boolean = true;
  alertMessage: string;
  alertClass: string;
  update_by:string;
  statusList = [];
  teamTypeList = [];
  team_type:string = '';
  team_status:string = '';
  dashboard_url:string;
  files:any;
   
	/*breadcrumbs array */
	current_url_array = [];

	server_url:string;
  ref_url:string='';

  error_messages = {
    'ref_email': [
      { type: 'required', message: 'Email is required' },
      { type: 'email', message: 'Valid Email required' },

    ],
    'ref_name': [
      { type: 'required', message: 'Name is required' },
    ], 
    'csv': [
      { type: 'required', message: 'CSV file is required' },
    ],     
  }

	
  constructor(
    private http: HttpClient,
    private router: Router,
    private BackenddbService: BackenddbService,
    private LoginService: LoginService,   
    private FrontenddbService: FrontenddbService,   
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private ds: DatapassService,
    private cdref: ChangeDetectorRef
    ) {
        this.update_by = this.LoginService.getUserId();
        this.group_id =  this.LoginService.getLoginGroup();
        this.dashboard_url = this.LoginService.getDashboardUrl();
        status = null;
        this.getFlashMessage();
		
		this.server_url = this.LoginService.getServerUrl();

        this.BackenddbService.getTeamTypeList(status).subscribe((data:any) => {
          this.teamTypeList = Array.from(Object.keys(data), k=>data[k]);
          });          

    /* get status list from CI */   
    this.BackenddbService.getStatusList().subscribe((data:any) => {
      this.statusList = Array.from(Object.keys(data), k=>data[k]);
      }); 
    }
	
  form_title:any = 'Reference List';

  searchVal = '';
  
	
  ngOnInit(): void {
    activesidebar();
    this.subscription = this.ds.getData().subscribe(x => { 
      if(x[0]=='set_permission')
      {
        this.set_permission(x[1]);
      }
  });
  

    this.formdata = this.formBuilder.group({
      status: [null],
      team_type: [null],
    });

    /* set form validation */ 
    this.reffrm = this.formBuilder.group({
      ref_name: ['', [Validators.required,noWhitespaceValidator]],
      ref_email: ['', [Validators.required,noWhitespaceValidator,Validators.email]],
  });

  this.refcsvfrm = this.formBuilder.group({
    csv: ['', [Validators.required,csvValidator]],
  });

    this.getRefUrl();
    this.refTable();
	
	this.current_url_array = [
        {'slug':"",'label':'Reference List'}
      ];
  }

  refTable()
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
           params = params.append("status", this.team_status);
   
           let param = params.toString();
           that.http
             .post<DataTablesResponse>(
               this.serverUrl+'datatable-api/get-ref-list',
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
         columns: [{ data: 's_no' }, { data: 'ref_name' },  { data: 'ref_email' }, { data: 'created_by_name' }, { data: 'ref_status' }, { data: 'last_datetime' }, { data: 'action' }]
       };
  }

  datatableSearch(event){
    this.searchVal  = event.target.value; 
    this.rerender_datatable('ref-table');
  }

  ngAfterViewInit(): void {
   this.dtTrigger.next();
   this.cdref.detectChanges();
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

  changeStatus(event:any)
  {
    this.team_status = event.target.value;
    this.rerender_datatable('ref-table');
  }
  
  changeTeamType(event:any)
  {
    this.team_type = event.target.value;
    this.rerender_datatable('ref-table');
  }

  getRefUrl()
  {
      var api = 'admin-api/get-ref-url';
      this.BackenddbService.getData(api).subscribe((data:any) => {
          this.ref_url = data.ref_url;
      });
  }

  copyUrl(val: string){
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  deleteRef(id:any)
  {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.value) {
        const formData = new FormData();
        /* here set submitted data in formData object array */
        formData.append('id', id);
        this.ds.Loader(true);

        var api = 'admin-api/delete-ref';
        this.BackenddbService.postData(api,formData).subscribe(
          res => {
            this.ds.Loader(false);
             if(res.status == 'success') {
              this.alertClass = 'success';
              this.rerender_datatable('ref-table');
              this.ds.sendData('notification');
            }else {
                this.alertClass = 'danger';	
              }
              this.alertMessage = res.message;
              this.closed = false;
              
          },
          error => this.error = error
          );
      }
    })
    .catch(() => 
       console.log('Cancel') 
    );
  }

  redirect(strurl:any)
  {
    this.router.navigate([strurl]);
  }


  check_csv(event: any) {
    this.files = event.target.files;
 }

upload_csv()
{
  if(this.refcsvfrm.valid) {
  let fData: FormData = new FormData;
  for(var i = 0; i < this.files.length; i++)
  {
      fData.append("file", this.files[i]);
  }
  this.ds.Loader(true);
  var api = 'admin-api/upload-ref-csv';
  this.BackenddbService.postData(api,fData).subscribe(
      res => {
        this.ds.Loader(false);
        this.modalConfgRef.close();
        this.refcsvfrm.get('csv').setValue('');
        if(res.status=='success')
        {
          this.alertClass = 'success'; 

        }else
        {
          this.alertClass = 'danger'; 
        }
        this.alertMessage = res.message;
        this.closed = false;
        this.ds.Loader(false);
      }
  )
    }else {
      this.validateAllFormFields(this.refcsvfrm);
    }
}




  onSubmit(data:any) {
  
      if (this.reffrm.valid) {
          const formData = new FormData();
          this.closed = true;
          this.ds.Loader(true);
          formData.append('ref_email', data.ref_email);
          formData.append('ref_name', data.ref_name);
          var api = 'admin-api/create-ref';

          this.BackenddbService.postData(api,formData).subscribe(
            res => {
              this.ds.Loader(false);
              this.modalConfgRef.close();
              if(res.status=='success')
              {
                this.alertClass = 'success'; 
                this.rerender_datatable('ref-table');
                this.ds.sendData('notification');
              }else
              {
                this.alertClass = 'danger'; 
              }
              this.alertMessage = res.message;
              this.closed = false;
              this.ds.Loader(false);
            });
 
      } else {
        this.validateAllFormFields(this.reffrm);
      }
    
  }

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

  createRef(modal:any)
  {
    this.modalConfgRef = this.modalService.open(modal, {ariaLabelledBy: 'modal-basic-title', size: 'lg'});
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

  viewUserProfile(user_id:any)
  {
    this.viewProfile.next(user_id);
  }

}
