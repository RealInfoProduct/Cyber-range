import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { faPlus, faMinus, faWallet, faMoneyBill, faExchangeAlt} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-wallettransaction',
  templateUrl: './wallettransaction.component.html',
  styleUrls: ['./wallettransaction.component.css']
})
export class WallettransactionComponent implements OnInit {
  
	faPlus = faPlus;
	faMinus = faMinus;
	faWallet = faWallet;
	faMoneyBill = faMoneyBill;
	faExchangeAlt = faExchangeAlt;

  	/*breadcrumbs array */
	current_url_array = [];
	form_title:string = 'My Transactions';
	
	server_url:string;	
	
	constructor(private loginService: LoginService) { 
		this.server_url = this.loginService.getServerUrl();
	}
	
	ngOnInit(): void {	
		/*breadcrumbs array */		
		this.current_url_array = [
			{'slug':"",'label':'My Transactions'} 
		];
	}
}
