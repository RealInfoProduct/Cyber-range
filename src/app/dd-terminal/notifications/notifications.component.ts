import { Component, OnInit,ViewChild,Input,Output, EventEmitter,ElementRef } from '@angular/core';
import { HttpClient,HttpParams  } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BackenddbService } from '../../services/backenddb.service';
import { LoginService } from '../../services/login.service';
import {IDatePickerConfig,ISelectionEvent, DatePickerComponent} from 'ng2-date-picker'; 
import * as moment from 'moment';

import { FormGroup,  FormBuilder, FormArray, FormControl, Validators  } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2';
import { ManualService } from '../../services/manual.service';
import { faUser, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

import { faBars } from '@fortawesome/free-solid-svg-icons'; 
import { Subject, BehaviorSubject } from 'rxjs';

declare const alertfun:any;

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
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  @Input() refreshDTable: Subject<any> = new Subject<any>();
  @ViewChild('dtpicker') sdate : ElementRef;
  viewProfile : Subject<any> = new Subject<any>();

  config: IDatePickerConfig = {
    format: 'DD-MM-YYYY HH:mm:ss',
    disableKeypress:true,
  };  

  faUser = faUser;
	faEdit = faEdit;
	faTrash = faTrash;
	status:string='';
  message:string='';
	faBars = faBars;

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
  loginGroupId:string ='';
  /*breadcrumbs array */
  current_url_array = [];
  readonly_start_date:boolean = true;
  from_date:any ='';
  to_date:any ='';

  
  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private BackenddbService: BackenddbService,
    private LoginService: LoginService,   
    private formBuilder: FormBuilder,
    private ManualService:ManualService
    ) {
      this.getFlashMessage();
        this.update_by = this.LoginService.getUserId();
        this.dashboard_url = this.LoginService.getDashboardUrl();
        this.loginGroupId = this.LoginService.getLoginGroup();
        //var group_id = this.route.snapshot.paramMap.get('group_id');
        if(this.loginGroupId != null)
        {
          
          this.group_id = this.loginGroupId;


        }
        this.notication_table();
    }

  ngOnInit(): void {
  alertfun();
    this.form_title = 'Manual List';
	this.current_url_array = [
		{'slug':"",'label':'Manual List'},
	];

    this.formdata = this.formBuilder.group({
      group: [''],
      user_status: [''],
      valid_start_date: [''],
      valid_end_date: [''],
    });

    /* get user list form db */   
    this.BackenddbService.getUserGroupList().subscribe((data:any) => {
    this.groupList = Array.from(Object.keys(data), k=>data[k]);
    });

    /* get user status list from CI */   
    this.BackenddbService.getStatusList().subscribe((data:any) => {
    this.userStatusList = Array.from(Object.keys(data), k=>data[k]);
    });  

    this.refreshDTable.subscribe(
      data => {
          if(data=='refreshTable')
          {
            this.notication_table();
          }
        }
      );
   
  }


  notication_table()
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
            this.serverUrl+'datatable-api/dt_notification_list',
            params, {}
          ).subscribe(resp => {
            that.persons = resp.data;
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: []
            });
          });
      },
      columns: [{ data: 'date_time' }]
    };
  }




  datatableSearch(event){
    this.searchVal  = event.target.value; 
    this.rerender_datatable();
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

  deleteNotification(id:any){

		var msg = "Do you really want to delete This Notification?";
		Swal.fire({
			title: 'Are you sure?',
			text: msg,
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'OK',
			cancelButtonText: 'Cancel'
		  }).then((result) => {
			
			if(result.value) {
				this.getDeleteNotification(id);
			}
		  })
	}

	getDeleteNotification(t_id){
		const formData = new FormData();
		formData.append('noti_id',t_id);
		this.BackenddbService.deleteNotification(formData).subscribe(
			res => {
				if(res==true){  
          this.notification=true;
          this.status="success";
          this.message="Notification delete successfully";
          this.rerender_datatable();
				}

			}
		);
	}

  deleteSelected()
  {
		var msg = "Do you really want to delete notification?";
    Swal.fire({
			title: 'Are you sure?',
			text: msg,
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'OK',
			cancelButtonText: 'Cancel'
		  }).then((result) => {
			if(result.value) {
        if(this.from_date=="")
        {
          Swal.fire('',"Sorry! select from date first.",'warning');
          return true;
        }
        if(this.to_date=="")
        {
          Swal.fire('',"Sorry! select to date first.",'warning');
          return true;
        }
        const formData = new FormData();
        formData.append('from_date',this.from_date);
        formData.append('to_date',this.to_date);
        var api = 'admin-api/del-daterange-notification';
        this.BackenddbService.postData(api,formData).subscribe(
          res => {
            if(res.status=='success')
            {
              Swal.fire('',res.message,'success');
            }else if(res.status=='error')
            {
              Swal.fire('',res.message,'warning');
            }
          }) 

      }}) 

  }

  setDatetime(data: ISelectionEvent,type:any)
  {
     if(data.date!="" && type=='from')
     {
      this.from_date = data.date;
     }else if(data.date!="" && type=='to')
     {
       this.to_date = data.date;
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


}
