import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Subject, BehaviorSubject,Observable } from 'rxjs';

import { faShoppingCart, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-purchasevoucher',
  templateUrl: './purchasevoucher.component.html',
  styleUrls: ['./purchasevoucher.component.css']
})
export class PurchasevoucherComponent implements OnInit {
	resetBasket : Subject<any> = new Subject<any>();

	faShoppingCart = faShoppingCart;
	faPaperPlane = faPaperPlane;

	server_url:string;	

	/*breadcrumbs array */
	current_url_array = [];
	form_title:string = 'My Voucher';

	constructor(private loginService: LoginService) 
	{		
		this.server_url = this.loginService.getServerUrl();
	}

	ngOnInit(): void {
		/*breadcrumbs array */
		this.current_url_array = [
			{'slug':"",'label':'My Voucher'}
		];

	}

	callResetHeader(event:any)
	{
		this.resetBasket.next('resetWallet');
	}

}
