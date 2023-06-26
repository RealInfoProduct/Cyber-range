import { Component, OnInit,ViewChild,Input, Output,EventEmitter } from '@angular/core';
import { HttpClient,HttpParams  } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BackenddbService } from '../../services/backenddb.service';
import { LoginService } from '../../services/login.service';
import { Subject } from 'rxjs';

import { FormGroup,  FormBuilder  } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2';
import { faUser, faEdit, faTrash,faShoppingCart, faPaperPlane, faPlus, faMinus, faWallet, faMoneyBill, faExchangeAlt } from '@fortawesome/free-solid-svg-icons';

import { faBars } from '@fortawesome/free-solid-svg-icons'; 

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
  selector: 'app-viewwallettransitionlist',
  templateUrl: './viewwallettransitionlist.component.html',
  styleUrls: ['./viewwallettransitionlist.component.css']
})
export class ViewwallettransitionlistComponent implements OnInit {
  viewProfile : Subject<any> = new Subject<any>();
  @Output() resetHeader: EventEmitter <any> = new EventEmitter<any>();

	faShoppingCart = faShoppingCart;
	faPaperPlane = faPaperPlane;
	faUser = faUser;
	faEdit = faEdit;
	faTrash = faTrash;
	faBars = faBars;
	faPlus = faPlus;
	faMinus = faMinus;
	faWallet = faWallet;
	faMoneyBill = faMoneyBill;
	faExchangeAlt = faExchangeAlt;

	public _opened: boolean = true; 
	public _toggleSidebar() {
		this._opened = !this._opened;
	}  	 


  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  persons: Person[];
  serverUrl = environment.baseUrl;
  formdata: FormGroup;
  status:string = '';

  error: string;
  closed: boolean = true;
  alertMessage: string;
  alertClass: string;
  update_by:string;
  group_id:string;
  server_url:string="";
  searchVal = '';
  my_voucher:string="";
  table_length:string = '6';
  
  /*breadcrumbs array */
  current_url_array = [];
	form_title:string = 'My Voucher';

	constructor(    private http: HttpClient,
		private router: Router,
		private route: ActivatedRoute,
		private BackenddbService: BackenddbService,
		private LoginService: LoginService,   
		private formBuilder: FormBuilder,) 
	{		
		this.server_url = this.LoginService.getServerUrl();
        this.update_by = this.LoginService.getUserId();
        this.group_id = this.LoginService.getLoginGroup();
		if(this.group_id=='1')
		{
			this.table_length = '8';
		}
	}

	ngOnInit(): void {
		/*breadcrumbs array */
		this.current_url_array = [
			{'slug':"",'label':'My Voucher'}
		];
		this.my_voucher = this.route.snapshot.paramMap.get('id');

		this.formdata = this.formBuilder.group({
		  status: [''],
		});	
	    this.voucherlist();
	  }

    voucherlist()
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
			params = params.append("status", this.status);
			params = params.append("my_voucher", this.my_voucher);
	
		   // console.log(dataTablesParameters.length);
		   // console.log(startNumber);
		
			let param = params.toString();
			that.http
			  .post<DataTablesResponse>(
				this.serverUrl+'datatable-api/get-wallet-transition-list',
				params, {}
			  ).subscribe(resp => {
				that.persons = resp.data;
			    console.log(resp);
	
				callback({
				  recordsTotal: resp.recordsTotal,
				  recordsFiltered: resp.recordsFiltered,
				  data: []
				});
			  });
		  },
		  columns: [{ data: 's_no' }, { data: 'description' }, { data: 'credit' }, { data: 'trans_id' }]
		};
    }
	
	  datatableSearch(event){
		this.searchVal  = event.target.value; 
		this.rerender_datatable();
	  }
	
	  
	  claimVoucher(v_id:any)
	  {	
		Swal.fire({
		  title: 'Are you sure?',
		  text: 'Do you really want to claim voucher.',
		  icon: 'warning',
		  showCancelButton: true,
		  confirmButtonText: 'OK',
		  cancelButtonText: 'Cancel'
		}).then((result) => {
		  if (result.value) {
			const formData = new FormData();
			formData.append('v_id',v_id);
			var api = 'candidate-api/claim-voucher';
			this.BackenddbService.postData(api,formData).subscribe((res:any) => {
				//console.log(res);
				if(res.status=="success")
				{
					this.resetHeader.emit('');
					this.rerender_datatable();
					Swal.fire('',res.message,'success');
				}else if(res.status=="error")
				{
					Swal.fire('',res.message,'warning');
				}
			});	
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
	
	  changeStatus(event:any)
	  {
		this.status = event.target.value;
		this.rerender_datatable();
	  }
	  
	  redirect(strurl:any)
	  {
		this.router.navigate([strurl]);
	  }

    viewUserProfile(user_id:any)
    {
      this.viewProfile.next(user_id);
    }
	
	}
	