import { Component, OnInit,Renderer2,Inject } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { BackenddbService } from '../../services/backenddb.service';

import { DOCUMENT } from '@angular/common';

import { faShoppingCart, faPaperPlane, faRupeeSign,faDollarSign, faCreditCard, faWallet, faMoneyBillAlt , faMoneyBill, faMoneyBillWave } from '@fortawesome/free-solid-svg-icons';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { WindowRefService } from '../../services/window-ref.service';
import { DatapassService } from '../../services/datapass.service';
import { Subscription }   from 'rxjs/Subscription';

@Component({
  selector: 'app-buyvoucher',
  templateUrl: './buyvoucher.component.html',
  styleUrls: ['./buyvoucher.component.css'],
  providers: [WindowRefService]
})
export class BuyvoucherComponent implements OnInit {

	
	faShoppingCart = faShoppingCart;
	faPaperPlane = faPaperPlane;
	faRupeeSign = faRupeeSign;
	faDollarSign = faDollarSign;
	faCreditCard = faCreditCard;
	faWallet = faWallet;
	faMoneyBill = faMoneyBill;
	faMoneyBillAlt = faMoneyBillAlt;
	faMoneyBillWave = faMoneyBillWave;

	
	server_url:string;	
	
	/*breadcrumbs array */
	current_url_array = [];
	form_title:string = 'Buy Voucher';

	setting = [];
	voucher = [];
	credit_system:string = 'Inactive';
    unique_id:string = '';
	current_amount:any;
	subscription: Subscription;
	calculate = {'tax_amount':'','tax_rate':'','total_amount':'','voucher_amount':''};
	cur_icon:any;
	currency:any;
	order_insert_id:any;
    rzp_key:any; 

	constructor(
		private loginService: LoginService,
		private BackenddbService: BackenddbService,
		private router: Router,
		private route: ActivatedRoute,
		private _renderer2: Renderer2,
        @Inject(DOCUMENT) private _document: Document,
		private winRef: WindowRefService,
		private ds: DatapassService
		) 
	{		
		this.server_url = this.loginService.getServerUrl();
        this.unique_id = this.route.snapshot.paramMap.get('id');


		let script = this._renderer2.createElement('script');
		script.type = `text/javascript`;
		script.src = `https://checkout.razorpay.com/v1/checkout.js`;
	   
		this._renderer2.appendChild(this._document.body, script);

	}

	ngOnInit(): void {
		/*breadcrumbs array */
		this.current_url_array = [
			{'slug':"",'label':'Buy Voucher'}
		];
    if(this.unique_id!=null)
    {
      this.get_voucher();
    }
	}

    get_voucher()
	{	
    const formData = new FormData();
		formData.append('unique_id',this.unique_id);
		var api = 'payment-api/calculate-order';
		this.BackenddbService.postData(api,formData).subscribe((res:any) => {
			if(res.status == 'success')
			{
				this.voucher = Array.from(Object.keys(res.voucher_detail), k=>res.voucher_detail[k]);
				this.calculate['voucher_amount'] = res.voucher_amount;
				this.calculate['tax_rate'] = res.tax_rate;
				this.calculate['tax_amount'] = res.tax_amount;
				this.calculate['total_amount'] = res.total_amount;
				this.currency = res.currency;
				if(this.currency=='INR')
				{
					this.cur_icon = faRupeeSign;
				}else
				{
					this.cur_icon = faDollarSign;
				}
			}else
            {
				Swal.fire('',res.message,'warning');
			}
		});	
	}

  paynow()
  {
		var array = ['progressbar',true];
		this.ds.sendData(array);

        const formData = new FormData();
		formData.append('unique_id',this.unique_id);

		var api = 'payment-api/create-order';
		this.BackenddbService.postData(api,formData).subscribe((res:any) => {
			  if(res.status=='success')
			  {
				this.payWithRazor(res);
			  }else
			  {
				var array = ['progressbar',false];
				this.ds.sendData(array);	  
				Swal.fire('',res.message,'warning');
			  }
		});
  }

   verify_payment(data:any) {
        const formData = new FormData();
		formData.append('response',JSON.stringify(data));
		formData.append('currency',this.currency);
		formData.append('order_insert_id',this.order_insert_id);

		var api = 'payment-api/response';
		this.BackenddbService.postData(api,formData).subscribe((res:any) => {
			 if(res.status=='success')
			 {
				Swal.fire('',res.message,'success');
				this.router.navigate(['/my-voucher/1']);
			 }else
			 {
				Swal.fire('',res.message,'warning');
			 }
		});	
  }

  payWithRazor(val:any) {
	var amount = val.order_detail.total_amount; 
	this.order_insert_id = val.order_insert_id; 	
    const options: any = {
      key: this.rzp_key,//'rzp_test_YPXC9g4tbugWsI',
      amount: amount, // amount should be in paise format to display Rs 1255 without decimal point
      currency: 'INR',
      name: 'CyberRange Skyvirt', // company name or product name
      description: '',  // product description
      image: '', // company logo or product image
      order_id: val.order_id, // order_id created by you in backend
	  prefill: {
			// We should prevent closing of the form when esc key is pressed.
			name: val.order_detail.user.name,
			email: val.order_detail.user.email,
			contact: val.order_detail.user.mobile,
		  },
      modal: {
        // We should prevent closing of the form when esc key is pressed.
        escape: false,
      },
      notes: {
        // include notes if any
      },
      theme: {
        color: '#0c238a'
      }
    };
    options.handler = ((response, error) => {
      options.response = response;
      this.verify_payment(response);
      // call your backend api to verify payment signature & capture transaction
    });
    options.modal.ondismiss = (() => {
      // handle the case when user closes the form while transaction is in progress
     // console.log('Transaction cancelled.');
    });
	var array = ['progressbar',false];
	this.ds.sendData(array);
   const rzp = new this.winRef.nativeWindow.Razorpay(options);
   rzp.open();
  }


  get_setting(settings:any)
	{
		this.setting = settings;
		this.setting.forEach( (setObj:any, index:any) => {
			if(setObj.skey=="credit_system")
			{
				var svalue = JSON.parse(setObj.svalue);
				if(svalue[0].status=='Active')
				{
					this.credit_system = 'Active';
				}
				else
				{
				this.router.navigate(['']);
				}
			}
			if(setObj.skey=="razor_pay")
			{
				var svalue = JSON.parse(setObj.svalue);
				if(svalue[0].status=='Active')
				{
					this.rzp_key = svalue[0].RZP_KEY;
				}
			}	
	   });
	}


}
