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
import { faUser, faEdit, faTrash, faUsers, faEye,faPaperPlane } from '@fortawesome/free-solid-svg-icons';

import { DatapassService } from '../../services/datapass.service';
import { Subscription } from 'rxjs/Subscription';
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
  selector: 'app-claimlist',
  templateUrl: './claimlist.component.html',
  styleUrls: ['./claimlist.component.css']
})
export class ClaimlistComponent implements OnInit {
  viewProfile : Subject<any> = new Subject<any>();
  subscription: Subscription;
	faUser = faUser;
	faEdit = faEdit;
	faTrash = faTrash;	
	faUsers = faUsers;	
	faEye = faEye;	
  faPaperPlane = faPaperPlane;

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
  team_status:string = '';
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

  dashboard_url:string; 
 
  responseTableArray = [];  // store return response when team assign to candidate 

  server_url:string;
  id:string = '';

  searchVal = '';

	form_title:any = 'Resource Claim List';
  private isClicked = false;

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
    }
	
		ngOnInit(): void {
      activesidebar(); 
      this.loadData();
      
		this.formdata = this.formBuilder.group({
      status: [null],
    });

		this.claimList();
		
		this.current_url_array = [
			{'slug':"",'label':'Resource Claim List'}
		  ];
	}

  ngAfterContentChecked() {
    this.dtchange.detectChanges();
  }


  loadData()
  {
    this.subscription = this.ds.getData().subscribe(x => { 
      if(typeof x !='undefined')
      {
          if(x[0]=='set_permission')
          {
            this.set_permission(x[1]);
          }else if(x[0]=='submit_claim')
          {
            this.submitClaim(x[1]);
          }
      }

    });  
  }

  claimList()
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
           params = params.append("status", this.team_status);
           params = params.append("id", this.id);
   
           let param = params.toString();
           that.http
             .post<DataTablesResponse>(
               this.serverUrl+'datatable-api/get-claim-list',
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
         columns: [{ data: 's_no' }, { data: 'name' }, { data: 'res_type' },  { data: 'credit' },  { data: 'claim_status' },  { data: 'last_datetime' }]
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
    this.team_status = event.target.value;
    this.rerender_datatable('team-table');
  }

  openTpinModal(id:any)
  {
    this.isClicked = false;
    this.current_id = id;
    var array = ['openTpinModal','submit_claim'];
    this.ds.sendData(array);
  }

  submitClaim(t_pin:any)
  {
    if(this.isClicked)
    {
      return "";
    }
    this.isClicked = true; 
    this.ds.Loader(true);
    const formData = new FormData();
    formData.append('id', this.current_id);      
    formData.append('t_pin', t_pin);      
    var api = 'admin-api/claim-resource';
    this.BackenddbService.postData(api,formData).subscribe(
      res => {
        //console.log(res);
        this.ds.Loader(false);
        this.alertMessage = res.message;
        this.closed = false;
        if(res.status=='success')
        {
          this.ds.sendData('resetWallet');
          this.alertClass = 'success'; 
          this.rerender_datatable('team-table');
        }else
        {
          this.alertClass = 'danger'; 
        }
    });
  }
   
  refreshMainTable() {
    this.dtElements.forEach((dtElement: DataTableDirective, index: number) => {
      dtElement.dtInstance.then((dtInstance: any) => {
      });
    })
  }
 
  preloadData()
  {
     this.ds.sendData('get_permission');
  }
  set_permission(data:any)
  {
      if(data.permission.create_team=='Denied')
      {
         this.router.navigate([this.dashboard_url+'dashboard']);
      }
  }

}

