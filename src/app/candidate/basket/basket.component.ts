import { Component, OnInit } from '@angular/core';
import { Subject, BehaviorSubject,Observable } from 'rxjs';
import { FormGroup,  FormBuilder,FormArray, FormControl, Validators  } from '@angular/forms';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

import { Router } from '@angular/router';
import { BackenddbService } from '../../services/backenddb.service';
import { LoginService } from '../../services/login.service';
import {FilterPipe} from '../../modal/filter.pipe';
import { OrderService } from '../../services/order.service';

import {noWhitespaceValidator,greaterThanZeroValidator} from '../../helper/validatefun';

import { faStar, faQuestion, faCircle, faQuestionCircle, faUserCircle } from '@fortawesome/free-solid-svg-icons';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css']
})
export class BasketComponent implements OnInit {
	
	resetBasket : Subject<any> = new Subject<any>();

	faStar = faStar;
	faQuestion = faQuestion;
	faCircle = faCircle;
	faQuestionCircle = faQuestionCircle;
	faUserCircle = faUserCircle;

	// for store added exercise
	added_basket = [];
	setting = [];
	total_credits:number = 0;

	// enroll option
	checkout_option:string = "Inactive";
	req_to_inst_option:string = "Inactive";
	
	server_url:string;	
	
	/*breadcrumbs array */
	current_url_array = [];
	form_title:string = 'Basket';
	progressbar:boolean = false;

	credit_system:string = 'Inactive';

	// transition pin
	t_pin:string = "";
	checkoutfrm:FormGroup;
	modalConfgRef:any;

	error_messages = {
		't_pin': [
		{ type: 'required', message: 'TPIN is required' },
		] 
		};

	constructor(private loginService: LoginService,
	        	private BackenddbService: BackenddbService,
				private OrderService: OrderService,
				private modalService: NgbModal,
				private router: Router,
				private fb:FormBuilder,
				) 
	{		
		this.server_url = this.loginService.getServerUrl();
	}

	ngOnInit(): void {	
		/*breadcrumbs array */
		this.current_url_array = [
			{'slug':"",'label':'Basket'}
		];
		// checkout t pin form
		this.checkoutfrm = this.fb.group({
			t_pin: ['', [Validators.required,noWhitespaceValidator]],
		});
	}

	// get added basket from header
	get_added_basket(basket:any)
	{
		this.added_basket = basket;
		this.total_credits = 0;
		this.added_basket.forEach( (myObject:any, index:any) => {
			 var credits = Number(this.added_basket[index].credits);
			 this.total_credits = this.total_credits+credits;
		});
	} 

	get_setting(settings:any)
	{
		this.setting = settings;
		this.setting.forEach( (myObject:any, index:any) => {
			if(this.setting[index].skey=='checkout')
			{
			   if(this.setting[index].svalue=='Active')
			   {
				   this.checkout_option = 'Active';
			   }
			}else if(this.setting[index].skey=="request_to_instructor")
			{
				if(this.setting[index].svalue=='Active')
				{
					this.req_to_inst_option = 'Active';
				}
			}else if(this.setting[index].skey=="credit_system")
			{
				var svalue = JSON.parse(this.setting[index].svalue);
				if(svalue[0].status=='Active')
				{
					this.credit_system = 'Active';
				}
			}
	   });
	}

	submit(data:any)
	{
		if(this.checkoutfrm.valid)
		{
		  this.modalConfgRef.close();	
		  this.checkout_submit('checkout',data.t_pin);
		}else
		{
		  this.validateAllFormFields(this.checkoutfrm); // check validation
		}
	}

	checkout_submit(option:any,t_pin:any)
	{
		this.progressbar = true;
		const formData = new FormData();
		formData.append('option',option);
		formData.append('t_pin',t_pin);
		this.OrderService.enrollNow(formData).subscribe((res:any) => {
			this.progressbar = false;
			this.t_pin = '';
			if(res.status=='success')
			{
				this.resetBasket.next('resetHeaderBasket');
				Swal.fire('',res.message,'success');
				setTimeout( () => { this.router.navigate([`/user-exercises`]); }, 2000 );
			}else if(res.status=='error')
			{
				Swal.fire('',res.message,'warning');
			}
			});
	}

	enroll_now(option:any,model:any)
	{
		if(option=='checkout')
		{
			var msg = 'Do you really want to checkout.';
		}else if(option=='request_to_instructor')
		{
			var msg = 'Do you really want to request to instructor.';
		}
		Swal.fire({
			title: 'Are you sure?',
			text: msg,
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Yes',
			cancelButtonText: 'No'
		  }).then((result) => {
			if (result.value) {
				if(this.t_pin=="" && option=='checkout' &&  this.credit_system=='Active')
				{
					this.modalConfgRef = this.modalService.open(model, {ariaLabelledBy: 'modal-basic-title', size: 'sm'});
				    return true;
				}
                this.checkout_submit(option,'');
			}
		  })
	}

	get f() { return this.checkoutfrm.controls; }

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
  
}
