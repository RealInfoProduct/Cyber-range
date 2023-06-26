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
import { ChatService } from '../../services/chat.service';
import { faPlusCircle, faRandom, faLaptop ,faArrowCircleRight, faArrowCircleLeft, faUser, faEdit, faTrash, faUsers, faEye,faBars, faCamera,faPlus,faMinus,faCog,faPowerOff,faDesktop,faDownload ,faFileExport,faRedo,faList,faNetworkWired 
  ,faStar, faQuestion, faQuestionCircle, faCircle, faShoppingCart, faFlag, faTasks, faTrophy, faCreditCard, faCartPlus, faUserCircle,faFile} from '@fortawesome/free-solid-svg-icons';

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
  selector: 'app-packagelist',
  templateUrl: './packagelist.component.html',
  styleUrls: ['./packagelist.component.css']
})
export class PackagelistComponent implements OnInit {
  viewProfile : Subject<any> = new Subject<any>();
  subscription: Subscription;
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
faPlusCircle = faPlusCircle;

  public _opened: boolean = true; 
	public _toggleSidebar() {
		this._opened = !this._opened;
	} 
	
  /* datatable */
  @ViewChildren(DataTableDirective)
  dtElements: QueryList<DataTableDirective>;
  dtOptions: DataTables.Settings[] = [];
  dtTrigger = new Subject(); 
  dtCandidateTrigger = new Subject();
  teams: Team[];
  candidates: Candidate[];
  serverUrl = environment.baseUrl;
  lessons:boolean = true;

  // user profile photo
  croppedImage: any = '';

  /*flash message*/
  msgalert:any;
  
  /*breadcrumbs array */
  current_url_array = [];
  exPopup:any;
  formdata: FormGroup;
  assginTeamFrm: FormGroup;
  group_id:string = '';
  team_status:string = '';
  modalfadeclass:string = "";
  modalshow:string = "";
  error: string;
  closed: boolean = true;
  closedpopop: boolean = true;
  alertMessage: string;
  alertClass: string;
  update_by:string;
  statusList = [];
  teamTypeList = [];
  languageList = [];
  genderList = [];
  team_type:string = '';
  closeResult = '';
  checkArray: FormArray;
  candidate_table:boolean = false;

  dashboard_url:string; 
  my_team:string = '';

  /*assign team to user*/
  assign_team_id:string = '';
  assign_team_name:string = '';
  assign_instructor_id:string = '';
  assign_team_instr_name:string = '';
  assign_team_create_by:string = '';
  assign_team_create_datetime:string = '';
  assign_team_datetime:string = '';


  responseTableArray = [];  // store return response when team assign to candidate 
  ex_detail = []; 

  /* instructor roles */
  inst_create_team:boolean = false;
  inst_allocate_exercise_user:boolean = false;

  server_url:string;

  searchVal = '';
  searchcandiVal = '';
  
  constructor(
    private http: HttpClient,
    private router: Router,
    private BackenddbService: BackenddbService,
    private LoginService: LoginService,   
    private FrontenddbService: FrontenddbService,   
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private ChatService :ChatService,
    private ds: DatapassService
    ) {
        this.update_by = this.LoginService.getUserId();
        this.group_id = this.LoginService.getLoginGroup();
        this.dashboard_url = this.LoginService.getDashboardUrl();
		    this.server_url = this.LoginService.getServerUrl();
    }

	  form_title:any = 'Exercise Bundle List';
	
		ngOnInit(): void {
      activesidebar(); 
      this.subscription = this.ds.getData().subscribe(x => { 
        if(x[0]=='set_permission')
        {
          this.set_permission(x[1]);
        }
      });
	  
		this.createPackageTable();
		
		this.current_url_array = [
			{'slug':"",'label':'Exercise Bundle List'}
		  ];
	}

  createPackageTable()
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
           params = params.append("ex_id", '');
   
           let param = params.toString();
           that.http
             .post<DataTablesResponse>(
               this.serverUrl+'datatable-api/get-package-list',
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
         columns: [{ data: 's_no' }, { data: 'group_name' }, { data: 'created_by' }, { data: 'last_datetime' }]
       };
  }

  ViewMoreDetail(id:any,model:any)
  {
    this.getExercise(id,model);
  }

  getExercise(id:any,model:any)
  {
    this.ds.Loader(true);
    const formData = new FormData();
    formData.append('pk_id',id);
	  var api = 'admin-api/get-exercise';
	  this.BackenddbService.postData(api,formData).subscribe((res:any) => {
      this.ex_detail = Array.from(Object.keys(res), k=>res[k]);
      this.ds.Loader(false);
      this.exPopup = this.modalService.open(model, {ariaLabelledBy: 'modal-basic-title', size: 'xl'});
		});
  }

  datatableSearch(event){
    this.searchVal  = event.target.value; 
    this.rerender_datatable('team-table');
  }

  ngAfterViewInit(): void {
   this.dtTrigger.next();
   this.dtCandidateTrigger.next();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    this.dtCandidateTrigger.unsubscribe();
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
  
  deletePackage(id:any)
  {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete package.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.value) {
        const formData = new FormData();
        this.ds.Loader(true);
        this.closed = true;
        formData.append('id',id);
        var api = 'admin-api/delete-package';
        this.BackenddbService.postData(api,formData).subscribe(
          res => {
            this.ds.Loader(false);
            this.closed = false;
            if(res.status == 'success')
            {
              this.ds.sendData('notification');
              this.rerender_datatable('team-table');
              this.alertClass = 'success'; 
              this.alertMessage = res.message;
            }else if(res.status == 'error')
            {
              this.alertMessage = res.message;
              this.alertClass = 'danger'; 
            }
          });
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

  
  refreshMainTable() {
    this.dtElements.forEach((dtElement: DataTableDirective, index: number) => {
      dtElement.dtInstance.then((dtInstance: any) => {
        // Destroy the table first
       // console.log(`The DataTable ${index} instance ID is: ${dtInstance.table().node().id}`);
       
      });
    })
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

