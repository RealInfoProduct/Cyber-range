import { Component, OnInit,ViewChild,TemplateRef } from '@angular/core';
import { HttpClient,HttpParams  } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BackenddbService } from '../../services/backenddb.service';
import { LoginService } from '../../services/login.service';
import { Subject } from 'rxjs';

import { FormGroup,  FormBuilder  } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { DatapassService } from '../../services/datapass.service';
import { Subscription } from 'rxjs/Subscription';
import Swal from 'sweetalert2';
import { ManualService } from '../../services/manual.service';
import { faUser, faEdit, faTrash, faEye, faCopy } from '@fortawesome/free-solid-svg-icons';

import { faBars } from '@fortawesome/free-solid-svg-icons';

declare const alertfun:any;
declare const activesidebar:any;

class Person {
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

@Component({
  selector: 'app-manuallist',
  templateUrl: './manuallist.component.html',
  styleUrls: ['./manuallist.component.css']
})

export class ManuallistComponent implements OnInit {
  viewProfile : Subject<any> = new Subject<any>();
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

	faUser = faUser;
	faEdit = faEdit;
	faTrash = faTrash;
	faEye =faEye;
	faBars = faBars;
  faCopy = faCopy;

	public _opened: boolean = true; 
	public _toggleSidebar() {
		this._opened = !this._opened;
	}  	 
  messageArray = {  
		type: "",  
		message: "",  
	  }; 

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  persons: Person[];
  serverUrl = environment.baseUrl;
  public groupList = [];
  public userStatusList = [];
  copyfrm: FormGroup;
  formdata: FormGroup;
  group_id:string = '';
  user_status:string = '';
  form_title:string = '';
  msgalert:any;
  notification:boolean=false;
  dashboard_url:string;
  error: string;
  closed: boolean = true;
  alertMessage: string;
  alertClass: string;
  update_by:string;
  stringifiedData: any; 
  searchVal = '';
  server_url:string;
  /*breadcrumbs array */
  current_url_array = [];
  subscription: Subscription;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private BackenddbService: BackenddbService,
    private LoginService: LoginService,   
    private formBuilder: FormBuilder,
    private ManualService:ManualService,
    private ds: DatapassService
    ) {
      this.getFlashMessage();
        this.update_by = this.LoginService.getUserId();
        this.dashboard_url = this.LoginService.getDashboardUrl();
        var group_id = this.route.snapshot.paramMap.get('group_id');
        this.server_url = this.LoginService.getServerUrl();
        if(group_id != null)
        {
          this.group_id = group_id;
        }
    }

  ngOnInit(): void {
  alertfun();
  activesidebar(); 
    this.form_title = 'Manual List';
	this.current_url_array = [
		{'slug':"",'label':'Manual List'},
	];

    this.formdata = this.formBuilder.group({
      group: [''],
      user_status: [''],
    });

    /* get user list form db */   
    this.BackenddbService.getUserGroupList().subscribe((data:any) => {
    this.groupList = Array.from(Object.keys(data), k=>data[k]);
    });

    /* get user status list from CI */   
    this.BackenddbService.getStatusList().subscribe((data:any) => {
    this.userStatusList = Array.from(Object.keys(data), k=>data[k]);
    });  

    this.subscription = this.ds.getData().subscribe(x => { 
			if(x[0]=='set_permission')
			{
			  this.set_permission(x[1]);
			}
		  });

    this.createManualTable();
  }

  createManualTable()
  {
    /* user data table */
	  const that = this;
	  this.dtOptions = {

      dom: '<"top">tr<"bottom"ilp><"clear">',

      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      order: [[ 0, "desc" ]],
      ajax: (dataTablesParameters: any, callback) => {

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
            this.serverUrl+'manual-api/get_manual_list',
            params, {}
          ).subscribe(resp => {
            that.persons = resp.data;
            console.log(that.persons);

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: []
            });
          });
      },
      columns: [{ data: 'menual_title' },   { data: 'topics' }]
  
    };
  }

  datatableSearch(event){
    this.searchVal  = event.target.value; 
    this.rerender_datatable();
  }

  processDeleteUser(userId:any)
  {
    const formData = new FormData();
    /* here set submitted data in formData object array */
    formData.append('user_id', userId);
    formData.append('update_by', this.update_by);

    this.BackenddbService.deleteUser(formData).subscribe(
			res => {
			   if(res.status === 'success') {
				 	this.alertMessage = res.message;
          this.alertClass = 'primary';
          this.closed = false;
          this.rerender_datatable();
          }else {
            this.alertMessage = res.message;
            this.alertClass = 'danger';	
            this.closed = true;
          }
			},
			error => this.error = error
		  );
  }

  get f() { return this.formdata.controls; }

  rerender_datatable() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
    dtInstance.draw();
    });
    }

  redirect(strurl:any)
  {
    this.router.navigate([strurl]);
  }

  
  delete_Manual(id:any){
		var msg = "Do you really want to delete this manual?";
		Swal.fire({
			title: 'Are you sure?',
			text: msg,
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'OK',
			cancelButtonText: 'Cancel'
		  }).then((result) => {
			
			if(result.value) {
				this.getDeleteManual(id);
			}
		  });
	}

  copy_Manual(id:any){
    Swal.fire({
			title: 'Are you sure?',
			text: 'Do you really want to copy this manual',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'OK',
			cancelButtonText: 'Cancel'
		  }).then((result) => {
        if(result.value) {
          
          this.ds.Loader(true);
          const formData = new FormData();
          formData.append('id',id);
          var api = 'manual-api/copy-manual';
          this.BackenddbService.postData(api,formData).subscribe((res:any) => {
              this.ds.Loader(false);
              this.alertMessage = res.message;
              this.closed = false;
              if(res.status == 'success') {
               this.alertClass = 'primary';
               this.rerender_datatable();
               }else {
                 this.alertClass = 'danger';	
               }
          }); 

        }
		  });

  }

	getDeleteManual(t_id)
  {
		const formData = new FormData();
		formData.append('id',t_id);
		this.ManualService.deletetopic(formData).subscribe(
			res => {
				if(res==true){
          this.alertMessage = 'Manual has been successfully deleted.';
          this.alertClass = 'primary';
          this.closed = false;
          this.rerender_datatable();
				}
			}
		);
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
	setFlashMessage(type:any,message:any)
  {
    this.messageArray.type = type;
    this.messageArray.message = message;
    this.stringifiedData = JSON.stringify(this.messageArray);   
    this.LoginService.setflashMessage(this.stringifiedData);
  }
  viewUserProfile(user_id:any)
  {
    this.viewProfile.next(user_id);
  }

  set_permission(data:any)
  {
    if(data.permission.create_manual=='Denied')
    {
     this.router.navigate([this.dashboard_url+'dashboard']);
    }
  }
}
