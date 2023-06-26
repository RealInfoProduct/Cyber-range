import { Component, OnInit, QueryList, ViewChildren, } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient,HttpParams  } from '@angular/common/http';
import { environment } from '../../../environments/environment';

import { BackenddbService } from '../../services/backenddb.service';

import { LoginService } from '../../services/login.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

import { FormGroup,  FormBuilder, FormControl  } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2';

import { faPlusCircle,faUser, faEdit, faTrash, faUsers, faEye,faBars, faCamera,faPlus,faMinus,faCog,faPowerOff,faDesktop,faDownload ,faFileExport,faRedo,faList,faNetworkWired } from '@fortawesome/free-solid-svg-icons';
import { DatapassService } from '../../services/datapass.service';
import { Subscription } from 'rxjs/Subscription';
import {Constants} from '../../../constants';

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
  selector: 'app-archivelist',
  templateUrl: './archivelist.component.html',
  styleUrls: ['./archivelist.component.css']
})
export class ArchivelistComponent implements OnInit {

  subscription: Subscription;
  viewProfile : Subject<any> = new Subject<any>();

  //fontasome icon
  faPlusCircle = faPlusCircle;
	faEye = faEye;	
	faBars = faBars;
    
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

  /*flash message*/
  msgalert:any;
  
  /*breadcrumbs array */
  current_url_array = [];

  alloted_status:string = "";
  status_list = [];

  // model popup object 
  modalConfgRef:any;

  status_array = ['publish','unpublish'];

  group_id:string = '';
  error: string;
  closed: boolean = true;
  closedpopop: boolean = true;
  alertMessage: string;
  alertClass: string;
  update_by:string;
  closeResult = '';

  dashboard_url:string; 
  
  form_title:string = 'Archive List';

  searchVal = '';

  server_url:string;

  allotment_id:string = '';

  allotment_detail:any;
      
  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private BackenddbService: BackenddbService,
    private LoginService: LoginService,   
    private fb:FormBuilder,
    private modalService: NgbModal,
    private ds: DatapassService
    ) {
        this.update_by = this.LoginService.getUserId();
        this.group_id = this.LoginService.getLoginGroup();
        this.dashboard_url = this.LoginService.getDashboardUrl();
        this.server_url = this.LoginService.getServerUrl();
        this.allotment_id = this.route.snapshot.paramMap.get('id');
    }

		ngOnInit() {
      activesidebar(); 
      this.loadData();
      this.drawAllotmentList();
      /*breadcrumbs array */
      this.current_url_array = [
        {'slug':"",'label':'Archive List'}
      ];
      /* End breadcrumbs array */	
      
      /* get allotment status list from CI */   
      this.BackenddbService.getAllotmentStatusList().subscribe((data:any) => {
        this.status_list = Array.from(Object.keys(data), k=>data[k]);
        });

 }

  loadData()
  {
      this.subscription = this.ds.getData().subscribe(x => { 
        if(x[0]=='set_permission')
        {
          this.set_permission(x[1]);
        }
    });
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
               this.serverUrl+'datatable-api/get-archive-list',
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

  refreshMainTable() {
    this.dtElements.forEach((dtElement: DataTableDirective, index: number) => {
      dtElement.dtInstance.then((dtInstance: any) => {
      });
    })
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
  }

  exportCsv()
  {
    const formData = new FormData();
    formData.append('process','export_archived_list');  
    formData.append('alloted_status',this.alloted_status);
    formData.append('asset_unique_id','');    
    formData.append('label','Exporting archive list');

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

  ViewMoreDetail(id:any,modal:any)
  {
    this.ds.Loader(true);
    const formData = new FormData();
		formData.append('allot_id',id);
    formData.append('archive','Yes');
    var api = 'admin-api/get-allotment-detail';
		this.BackenddbService.postData(api,formData).subscribe((res:any) => {
      this.ds.Loader(false);
      if(res.status=='success')
      {
        this.allotment_detail = res.data;
        this.modalConfgRef = this.modalService.open(modal, {ariaLabelledBy: 'modal-basic-title', size: 'lg'});
      }else if(res.status=='error')
      {
        Swal.fire('',res.message,'warning');
      } 
    });  
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

