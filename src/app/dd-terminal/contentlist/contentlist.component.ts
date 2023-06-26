
import { Component, OnInit,ViewChild } from '@angular/core';
import { HttpClient,HttpParams  } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BackenddbService } from '../../services/backenddb.service';
import { LoginService } from '../../services/login.service';

import { FormGroup,  FormBuilder  } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2';
import { ManualService } from '../../services/manual.service';
import { faUser, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

import { faBars } from '@fortawesome/free-solid-svg-icons'; 
declare const alertfun:any;


class Person {
  id: number;
  firstName: string;
  lastName: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  dashboard_url:string = "";
  recordsFiltered: number;
  recordsTotal: number;
  param:any;
}

@Component({
  selector: 'app-contentlist',
  templateUrl: './contentlist.component.html',
  styleUrls: ['./contentlist.component.css']
})

export class ContentlistComponent implements OnInit {

	faUser = faUser;
	faEdit = faEdit;
	faTrash = faTrash;
	notification:boolean=false;
  statusType:string='';
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
	/*open() {}
	close() {}
	triggerRerender() {}*/
	

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
  dashboard_url:string='';

  error: string;
  closed: boolean = true;
  alertMessage: string;
  alertClass: string;
  update_by:string;
  stringifiedData: any; 
  searchVal = '';
  
  /*breadcrumbs array */
  current_url_array = [];
  
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

        var group_id = this.route.snapshot.paramMap.get('group_id');
        this.dashboard_url = this.LoginService.getDashboardUrl();
        if(group_id != null)
        {
          this.group_id = group_id;


        }


    }

  ngOnInit(): void {
  alertfun();
  
    this.form_title = 'Content List';
	this.current_url_array = [
		{'slug':"",'label':'Content List'},
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
      

       // console.log(dataTablesParameters.length);
       // console.log(startNumber);


        let param = params.toString();
        that.http
          .post<DataTablesResponse>(
            this.serverUrl+'manual-api/get_content_list',
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
      columns: [{ data: 'menual_title' },   { data: 'topic_name' }]




	  
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

  // deleteManual(id:any){

  // }
  deleteContent(id:any){

		var msg = "Do You Really Want to delete This Content ?";
		Swal.fire({
			title: 'Are you sure?',
			text: msg,
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'OK',
			cancelButtonText: 'Cancel'
		  }).then((result) => {
			
			if(result.value) {
				this.getDeleteContent(id);
			//   this.current_allote_id = id;
			//   this.current_allote_status = status;
			//   if(this.t_pin=="" && status=='Allocated')
			//   {
			// 	  this.modalConfgRef = this.modalService.open(model, {ariaLabelledBy: 'modal-basic-title', size: 'sm'});
			// 	  return true;
			//   }
	
			}
		  })
	}

	getDeleteContent(t_id){

		const formData = new FormData();
		formData.append('content_id',t_id);
		this.ManualService.deleteContent(formData).subscribe(
			res => {
				if(res==true){

          this.message='Content Delete Successfully';
          this.notification=true;
          this.statusType='success';
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

}

