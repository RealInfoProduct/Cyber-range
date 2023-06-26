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

import { faBars, faUser, faEdit, faTrash,faEye,faUsers } from '@fortawesome/free-solid-svg-icons';
declare const activesidebar:any;


class Package {
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
  selector: 'app-resourcelist',
  templateUrl: './resourcelist.component.html',
  styleUrls: ['./resourcelist.component.css']
})

export class ResourcelistComponent implements OnInit {
  viewProfile : Subject<any> = new Subject<any>();

	faBars = faBars;

	public _opened: boolean = true; 
	public _toggleSidebar() {
		this._opened = !this._opened;
	}  	 
	/*open() {}
	close() {}
  triggerRerender() {}*/
  
  
	
  @ViewChild('auto') auto:any;
  limit_start:any = 0;
  keyword = 'name';
  public instructor_list = [];
  temp_id = [];
  dropdown_instruc_id:string = ''; // assign_instructor_id 
  spinner:boolean=false;
  instructor_selected:boolean=false;  // show error message if instructor not selected

  /*Icon*/
  faUser = faUser;
	faEdit = faEdit;
  faTrash = faTrash;
  faEye = faEye;
  faUsers = faUsers;
  
  /* Datatable */
  @ViewChildren(DataTableDirective)
  dtElements: QueryList<DataTableDirective>;
  dtOptions: DataTables.Settings[] = [];
  dtTrigger = new Subject();
  packages: Package[];
  serverUrl = environment.baseUrl;

  /* alert message */
  closed: boolean = true;
  alertMessage: string;
  alertClass: string;

  form_title:string = "";

  packageAssignFrm: FormGroup;
  group_id:string = '';
  error: string;
  update_by:string;
  dashboard_url:string;
  site_url:string;
  msgalert:any;
  closeResult = '';
  modalshow:string = "";
  assign_pk_unique_id:string="";
  assign_package_id:string="";

  /*breadcrumbs array */
  current_url_array = [];

  /* View Resource*/
  rs_exercise:string; 
  rs_team:string; 
  rs_users:string; 
  rs_vm:string; 
  rs_network:string; 
  rs_template:string; 
  rs_disk:string;   
  rs_storage:string; 
  rs_vcpu:string; 
  rs_vram:string; 
  rs_max_vcpu:string; 
  rs_max_vram:string; 
  rs_max_storage:string; 
  
  /* Used Resource */
  urs_exercise:string; 
  urs_team:string; 
  urs_users:string; 
  urs_vm:string; 
  urs_network:string; 
  urs_template:string; 
  urs_disk:string;   
  urs_storage:string; 
  urs_vcpu:string; 
  urs_vram:string;   
  urs_max_vcpu:string; 
  urs_max_vram:string; 
  urs_max_storage:string; 
    
  server_url:string;

  searchVal = '';
  
  constructor(
    private http: HttpClient,
    private router: Router,
    private BackenddbService: BackenddbService,
    private LoginService: LoginService,   
    private modalService: NgbModal,

    ) {
        this.update_by = this.LoginService.getUserId();
        this.group_id =  this.LoginService.getLoginGroup();
        this.dashboard_url = this.LoginService.getDashboardUrl();
        this.site_url = this.LoginService.getSiteUrl();
        status = null;
        this.getFlashMessage();

        this.form_title = 'Resource List';
        this.current_url_array = [{'slug':"",'label':'Resource List'}];

		    this.server_url = this.LoginService.getServerUrl();

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

  ngOnInit(): void {
    activesidebar(); 
    this.createPackageTable();
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
   
           let param = params.toString();
           that.http
             .post<DataTablesResponse>(
               this.serverUrl+'datatable-api/get-resource-list',
               params, {}
             ).subscribe(resp => {
               that.packages = resp.data;
               callback({
                 recordsTotal: resp.recordsTotal,
                 recordsFiltered: resp.recordsFiltered,
                 data: []
               });
             });
         },
         columns: [ { data: 'user_unique_id' },  { data: 'instructor_name' }, { data: 'email' }, { data: 'created_by' }, { data: 'last_datetime' }]
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

  processDeleteResource(resource_id:any)
  {
    const formData = new FormData();
    /* here set submitted data in formData object array */
    formData.append('resource_id', resource_id);
    formData.append('update_by', this.update_by);
    this.BackenddbService.postData('admin-api/delete-resource',formData).subscribe(
			res => {
        //console.log(res);
			   if(res.status === 'success') {
				 	this.alertMessage = res.message;
          this.alertClass = 'primary';
          this.closed = false;
          this.rerender_datatable('team-table');
        }else {
            this.alertMessage = res.message;
            this.alertClass = 'danger';	
            this.closed = false;
          }
			},
			error => this.error = error
		  );
  }

  deleteResource(resource_id:any)
  {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this resource.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.value) {
        this.processDeleteResource(resource_id)
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

  /* package view modal open */
  viewPackageModelOpen(resource_id:any,viewpackage:any)
  {
    const formData = new FormData();
    formData.append('resource_id', resource_id);
    this.BackenddbService.postData('admin-api/get-resource',formData).subscribe(
      res => {
       /*here set view package data*/
       this.rs_exercise= res.exercise;
       this.rs_team= res.team;
       this.rs_users= res.users;
       this.rs_vm= res.vm;
       this.rs_network= res.network;
       this.rs_template= res.template;
       this.rs_disk= res.disk;
	   
       this.rs_storage = res.storage;
       this.rs_vcpu = res.vcpu;
       this.rs_vram = res.vram;
	   
       this.rs_max_vcpu= res.max_vcpu;
       this.rs_max_vram= res.max_vram;
       this.rs_max_storage= res.max_storage;
      }
    );   
    this.BackenddbService.postData('admin-api/get-used-resource',formData).subscribe(
      res => {
       /*here set view package data*/
       this.urs_exercise= res.exercise;
       this.urs_team= res.team;
       this.urs_users= res.users;
       this.urs_vm= res.vm;
       this.urs_network= res.network;
       this.urs_template= res.template;
       this.urs_disk= res.disk;	   
       this.urs_storage= res.storage;
       this.urs_vcpu= res.vcpu;
       this.urs_vram= res.vram;
       this.urs_max_vcpu= res.max_vcpu;
       this.urs_max_vram= res.max_vram;
       this.urs_max_storage= res.max_storage;
      }
    );    

    this.modalService.open(viewpackage, {ariaLabelledBy: 'modal-basic-title', size: 'lg'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  /*open assign package modal popup*/
  openmodal(package_id:any,pack_unique_id:any) {
    this.modalshow = 'modal-show';
    this.assign_pk_unique_id = pack_unique_id;
    this.assign_package_id = package_id;
  }

  /*close assign package modal popup*/
  closemodal()
  {
    this.modalshow = '';
    this.instructor_selected = false;
    this.dropdown_instruc_id = "";
    this.auto.clear(); // clear instructor dorpdown
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

  selectEvent(item:any) {
    this.dropdown_instruc_id = item.id; //assign instructor id when choose in instructor dropdown
    this.instructor_selected = false;

  }

  onFocused(e:any) {
    this.instructor_selected = false;
  }

  inputCleared(event:any){
    if(typeof(event) ==='undefined')
    {
      this.dropdown_instruc_id = '';
      this.instructor_selected = false;
    }

  }

  inputChanged(keyword:any){
    this.spinner = true;
    this.instructor_selected = false;

    const formData = new FormData();
    formData.append('search',keyword);
    this.BackenddbService.getInstructorDropDownList(formData).subscribe(
      res => {
        res.forEach( (myObject:any, index:any) => {
          let abc = this.instructor_list.find(ob => ob['id'] === res[index].U_ID);
          if(typeof(abc) ==='undefined')
          {
            this.instructor_list.push({id:res[index].U_ID,name:res[index].F_Name+" "+res[index].L_Name+" - "+res[index].eMail});
          }
        });
        this.spinner = false;
        this.auto.open();
      });
  }

  scrolledToEnd(item:any) {
        this.spinner = true;
        this.instructor_selected = false;
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
            this.spinner = false;
            this.auto.open();
          });
   
 }

 viewUserProfile(user_id:any)
 {
   this.viewProfile.next(user_id);
 }

 

}
