import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, QueryList, ViewChildren } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient,HttpParams  } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BackenddbService } from '../../services/backenddb.service';

import { LoginService } from '../../services/login.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

import { FormGroup,  FormBuilder, FormArray, FormControl, Validators  } from '@angular/forms';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2';
import {noWhitespaceValidator} from '../../helper/validatefun';

import { faBars, faUser, faEdit, faTrash,faEye,faUsers } from '@fortawesome/free-solid-svg-icons';


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
  selector: 'app-roleslist',
  templateUrl: './roleslist.component.html',
  styleUrls: ['./roleslist.component.css']
})
export class RoleslistComponent implements OnInit {
  viewProfile : Subject<any> = new Subject<any>();
	faBars = faBars;

	public _opened: boolean = true; 
	public _toggleSidebar() {
		this._opened = !this._opened;
  }  	 
  
  /* Instructor DropDown */
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

  /* processbar */
  progressbar: boolean = false;

  packageAssignFrm: FormGroup;
  group_id:string = '';
  error: string;
  update_by:string;
  dashboard_url:string;
  site_url:string;
  msgalert:any;
  closeResult = '';
  modalshow:string = "";
  confirm_modal_show:string = "";
  assign_pk_unique_id:string="";
  assign_package_id:string="";
  rolesfrm:FormGroup;

  searchVal = '';

  /* View Roles*/
  ro_create_exercise:boolean = false; 
  ro_create_team:boolean = false; 
  ro_allocate_exercise_user:boolean = false; 
  instructor_name:string = "";
    
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
    }

	/*breadcrumbs array */
	current_url_array = [];
	form_title:string = 'Instructor Permission';

  ngOnInit(): void {
    this.createRolesTable();
	/*breadcrumbs array */
	this.current_url_array = [
		{'slug':"",'label':'Instructor Permission'}
	];
  }
  get f() { return this.rolesfrm.controls; }

  createRolesTable()
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
               this.serverUrl+'datatable-api/get-roles-list',
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
        //console.log(dtInstance.table().node().id);
        if(dtInstance.table().node().id == datatableName) {
           dtInstance.draw();
        }
      });
    });
  }

  processDeleteRoles(role_id:any)
  {
    const formData = new FormData();
    /* here set submitted data in formData object array */
    formData.append('role_id', role_id);
    formData.append('update_by', this.update_by);
    this.progressbar = true;
    this.BackenddbService.deleteRoles(formData).subscribe(
			res => {
         this.progressbar = false;
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

  deleteRoles(resource_id:any)
  {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this roles.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.value) {
        this.processDeleteRoles(resource_id)
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
  viewPackageModelOpen(roles_id:any,instructor_name:any,viewpackage:any)
  {
    const formData = new FormData();
    formData.append('role_id', roles_id);

    this.ro_create_exercise = false;  
    this.ro_create_team = false;  
    this.ro_allocate_exercise_user = false; 
    this.instructor_name = instructor_name;
    this.progressbar = true;

    this.BackenddbService.getRoles(formData).subscribe(
      res => {
       //console.log(res);
       if(res.create_team == 'true')
       {
         this.ro_create_team = true;
       }
       if(res.create_exercise == 'true')
       {
         this.ro_create_exercise = true; 
       }
       if(res.allocate_exercise_user=='true')
       {
        this.ro_allocate_exercise_user = true;
       }
       this.progressbar = false;
      });   
   

    this.modalService.open(viewpackage, {ariaLabelledBy: 'modal-basic-title', size: 'lg'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }


  openConfirmPopupModal()
  {
      this.confirm_modal_show = 'confirm-modal-show';
  }
  closeConfirmPopupModal()
  {
      this.confirm_modal_show = '';
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

  viewUserProfile(user_id:any)
  {
    this.viewProfile.next(user_id);
  }

}

