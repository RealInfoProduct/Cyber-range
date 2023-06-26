//import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
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

import { faBars, faUser, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

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
  selector: 'app-teamtypelist',
  templateUrl: './teamtypelist.component.html',
  styleUrls: ['./teamtypelist.component.css']
})
export class TeamtypelistComponent implements OnInit {
  viewProfile : Subject<any> = new Subject<any>();
  subscription: Subscription;
  faUser = faUser;
	faEdit = faEdit;
	faTrash = faTrash;
  faBars = faBars;

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

  /*flashmessage*/
  msgalert:any;

  formdata: FormGroup;
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
   
   
	/*breadcrumbs array */
	current_url_array = [];

	server_url:string;
	
  constructor(
    private http: HttpClient,
    private router: Router,
    private BackenddbService: BackenddbService,
    private LoginService: LoginService,   
    private FrontenddbService: FrontenddbService,   
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private ds: DatapassService
    ) {
        this.update_by = this.LoginService.getUserId();
        this.group_id =  this.LoginService.getLoginGroup();
        this.dashboard_url = this.LoginService.getDashboardUrl();
        status = null;
        this.getFlashMessage();
		
		this.server_url = this.LoginService.getServerUrl();

        this.BackenddbService.getTeamTypeList(status).subscribe((data:any) => {
          this.teamTypeList = Array.from(Object.keys(data), k=>data[k]);
         // console.log(this.teamTypeList);
          });          

    /* get status list from CI */   
    this.BackenddbService.getStatusList().subscribe((data:any) => {
      this.statusList = Array.from(Object.keys(data), k=>data[k]);
      }); 
    }
	
  form_title:any = 'Team Type List';

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

    this.createTeamTypeTable();
	
	this.current_url_array = [
        {'slug':"",'label':'Team Type List'}
      ];
  }

  createTeamTypeTable()
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
           params = params.append("assign_instructor", "");
           params = params.append("status", this.team_status);
   
           let param = params.toString();
           that.http
             .post<DataTablesResponse>(
               this.serverUrl+'datatable-api/get-team-type-list',
               params, {}
             ).subscribe(resp => {
   
               console.log(resp);
   
               that.teams = resp.data;
   
               callback({
                 recordsTotal: resp.recordsTotal,
                 recordsFiltered: resp.recordsFiltered,
                 data: []
               });
             });
         },
         columns: [{ data: 's_no' }, { data: 'team_type' },  { data: 'team_type_created_by' }, { data: 'team_type_assign_instructor' }, { data: 'status' }, { data: 'last_datetime' }]
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
        console.log(dtInstance.table().node().id);
        if(dtInstance.table().node().id == datatableName) {
           dtInstance.draw();
        }
      });
    });
  }

  changeStatus(event:any)
  {
    this.team_status = event.target.value;
    this.rerender_datatable('team-table');
  }
  
  changeTeamType(event:any)
  {
    this.team_type = event.target.value;
    this.rerender_datatable('team-table');
  }

  processDeleteTeamType(team_type_id:any)
  {
    const formData = new FormData();
    /* here set submitted data in formData object array */
    formData.append('team_type_id', team_type_id);
    formData.append('update_by', this.update_by);

    this.BackenddbService.deleteTeamType(formData).subscribe(
			res => {
        console.log(res);
			   if(res.status === 'success') {
				 	this.alertMessage = res.message;
          this.alertClass = 'primary';
          this.closed = false;
          this.rerender_datatable('team-table');
        }else {
            this.alertMessage = res.message;
            this.alertClass = 'danger';	
            this.closed = true;
          }
			},
			error => this.error = error
		  );
  }

  deleteTeamType(team_id:any)
  {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete team type? if you delete this team type then its also removed from team.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.value) {
        this.processDeleteTeamType(team_id)
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
