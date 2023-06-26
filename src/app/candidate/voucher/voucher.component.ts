import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { BackenddbService } from '../../services/backenddb.service';

import { faShoppingCart, faPaperPlane, faRupeeSign, faDollarSign, faMoneyBill, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-voucher',
  templateUrl: './voucher.component.html',
  styleUrls: ['./voucher.component.css']
})
export class VoucherComponent implements OnInit {
	
	faShoppingCart = faShoppingCart;
	faPaperPlane = faPaperPlane;
	faRupeeSign = faRupeeSign;
	faMoneyBill = faMoneyBill;
	faCreditCard = faCreditCard;
	faDollarSign = faDollarSign;
	
	server_url:string;	
	
	/*breadcrumbs array */
	current_url_array = [];
	form_title:string = 'Voucher';

	setting = [];
	voucher = [];
	credit_system:string = 'Inactive';
	cur_icon:any;
	
	constructor(
		private loginService: LoginService,
		private BackenddbService: BackenddbService,
		private router: Router,
		private route: ActivatedRoute,
		) 
	{		
		this.server_url = this.loginService.getServerUrl();
	}

	ngOnInit(): void {
		/*breadcrumbs array */
		this.current_url_array = [
			{'slug':"",'label':'Voucher'}
		];
		this.get_voucher();
	}

	get_voucher()
	{
		var api = 'candidate-api/get-voucher';
		this.BackenddbService.getData(api).subscribe((res:any) => {
			this.voucher = Array.from(Object.keys(res.data), k=>res.data[k]);
			if(res.currency=='INR')
			{
				this.cur_icon = faRupeeSign;
			}else
			{
				this.cur_icon = faDollarSign;
			}
		});	
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
				}else
				{
				  this.router.navigate(['']);
				}
			}
	   });
	}

}
