import { Component, OnInit,ViewChild } from '@angular/core';
import { HttpClient,HttpParams  } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BackenddbService } from '../../services/backenddb.service';
import { LoginService } from '../../services/login.service';
import {digitValidator} from '../../helper/validatefun';

import { FormGroup,  FormBuilder, FormArray, FormControl, Validators  } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2';
import { faUser, faEdit, faTrash, faBars, faCheck, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { ChatService } from '../../services/chat.service';
import { DatapassService } from '../../services/datapass.service';
import { Subscription } from 'rxjs/Subscription';

declare const activesidebar:any;
declare const modal:any;

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
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.css']
})

export class UserlistComponent implements OnInit {

	faUser = faUser;
	faEdit = faEdit;
	faTrash = faTrash;
	faCheck = faCheck;
	faCreditCard = faCreditCard;

	public _opened: boolean = true; 
	public _toggleSidebar() {
		this._opened = !this._opened;
	}  	 
  
  subscription: Subscription;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  persons: Person[];
  serverUrl = environment.baseUrl;
  public groupList = [];
  public userStatusList = [];
  formdata: FormGroup;
  creditFrm: FormGroup;
  group_id:string = '';
  login_gp:string = '';
  user_status:string = '';
  form_title:string = '';

  error: string;
  closed: boolean = true;
  alertMessage: string;
  alertClass: string;
  update_by:string;

  searchVal = '';

  userCredit:string = '';
  server_url:string = '';
  
  /*breadcrumbs array */
  current_url_array = [];
  credit_system:string = '';

    /* validation error messsage */
    error_messages = {
      'credit': [
        { type: 'required', message: 'Credit required' },
        { type: 'digitValidator', message: 'Invalid input.' }
        ],
      };
  
  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private BackenddbService: BackenddbService,
    private LoginService: LoginService,   
    private formBuilder: FormBuilder,
    private ChatService :ChatService,
    private ds: DatapassService

    ) {
        this.update_by = this.LoginService.getUserId();
        var group_id = this.route.snapshot.paramMap.get('group_id');
        this.server_url = this.LoginService.getServerUrl();
        this.login_gp = this.LoginService.getLoginGroup();
        if(group_id != null)
        {
          this.group_id = group_id;
        }
    }

  ngOnInit(): void {
    this.loadData();
    activesidebar(); 

    this.form_title = 'Users List';
    this.current_url_array = [
    {'slug':"",'label':'Users List'},
    ];

    this.formdata = this.formBuilder.group({
      group: [''],
      user_status: [''],
      user_id:''
    });

    this.creditFrm = this.formBuilder.group({
      user_id: [''],
      credit:['', [Validators.required,digitValidator]],
    });

    /* get user list form db */   
    this.BackenddbService.getUserGroupList().subscribe((data:any) => {
    this.groupList = Array.from(Object.keys(data), k=>data[k]);
    });

    /* get user status list from CI */   
    this.BackenddbService.getStatusList().subscribe((data:any) => {
    this.userStatusList = Array.from(Object.keys(data), k=>data[k]);
    });  

    this.getUserDataTable();
  }

  loadData()
  {
      this.subscription = this.ds.getData().subscribe(x => { 
        if(x[0]=='setting')
        {
          this.get_setting(x[1]);
        }
      });
  }

  getUserDataTable()
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
        params = params.append("group_id", this.group_id);
        params = params.append("user_status", this.user_status);

        let param = params.toString();
        that.http
          .post<DataTablesResponse>(
            this.serverUrl+'datatable-api/get-user-list',
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
      columns: [{ data: 's_no' }, { data: 'User_Unique_ID' },  { data: 'Name' },  { data: 'role' }, { data: 'email' }, { data: 'mobile' }, { data: 'regDateTime' }]
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
          this.formdata.patchValue({
            user_id:userId
          });

          this.ChatService.deleteUser(this.formdata.value).subscribe(
            response => {
             
          });

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
  deleteUser(userId:any)
  {	
    Swal.fire({
        title: 'Are you sure?',
        text: 'Do you really want to delete user.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.value) {
          this.processDeleteUser(userId)
        }
      })
      .catch(() => 
        console.log('Cancel') 
      );
  }
  get f() { return this.formdata.controls; }

  rerender_datatable() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
    dtInstance.draw();
    });
    }

  openCreditModal(userId:any)
  {
     this.ds.Loader(true);
     this.userCredit = '';
     const formData = new FormData();
     formData.append('user_id', userId);      
     var api = 'order-api/get-user-wallet';
     this.BackenddbService.postData(api,formData).subscribe(
       res => {
         this.ds.Loader(false);
         if(res.status=='success')
         {
          this.userCredit = res.data[0].credit;
          this.creditFrm.patchValue({
            user_id: res.data[0].user_id,
            credit: ''
          });
          (<any>$('#creditModal')).modal('show');
         }else
         {
           this.alertMessage = res.message;
           this.closed = false;
           this.alertClass = 'danger'; 
         }
     });  
  }

  updateCredit(data:any)
  {
    if(this.creditFrm.valid) 
    {
          this.ds.Loader(true);
          this.userCredit = '';
          const formData = new FormData();
          formData.append('user_id', data.user_id);   
          formData.append('credit', data.credit);      
             var api = 'admin-api/update-credit';
          this.BackenddbService.postData(api,formData).subscribe(
            res => {
              this.ds.Loader(false);
              this.alertMessage = res.message;
              this.closed = false;
              if(res.status=='success')
              {
                this.alertClass = 'success';
                this.ds.sendData('resetWallet');
              }else
              {
                this.alertClass = 'danger';
              }
              (<any>$('#creditModal')).modal('hide'); 
          });  
    } 
    else 
    {
      this.validateAllFormFields(this.creditFrm);
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

  changeGroup(event:any)
  {
    this.group_id = event.target.value;
    this.rerender_datatable();
  }
  changeUserStatus(event:any)
  {
    this.user_status = event.target.value;
    this.rerender_datatable();
  }
  
  redirect(strurl:any)
  {
    this.router.navigate([strurl]);
  }

  //get setting from header  
get_setting(settings:any)
{
  settings.forEach( (myObject:any, index:any) => {
    if(settings[index].skey=='credit_system')
    {
      var svalue = JSON.parse(settings[index].svalue);
      if(svalue[0].status=='Active')
      {
        this.credit_system = svalue[0].status;
      }
    }
   });
}

preloadData()
{
   this.ds.sendData('setting');
}


}
