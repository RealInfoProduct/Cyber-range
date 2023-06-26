import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-earning',
  templateUrl: './earning.component.html',
  styleUrls: ['./earning.component.css']
})
export class EarningComponent implements OnInit {

   public _opened: boolean = true; 
	public _toggleSidebar() {
		this._opened = !this._opened;
	}
  
	/*breadcrumbs array */
	current_url_array = [];

	//form_title:any;
	form_title = "Earning";
	server_url:string;

	constructor(private loginService: LoginService,) { 
		this.server_url = this.loginService.getServerUrl();
	}

	ngOnInit(): void {
		this.current_url_array = [
			{'slug':"",'label':'Earning'}
		];
	}
	
}
