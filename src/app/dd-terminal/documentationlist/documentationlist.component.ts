import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-documentationlist',
  templateUrl: './documentationlist.component.html',
  styleUrls: ['./documentationlist.component.css']
})
export class DocumentationlistComponent implements OnInit {

	public _opened: boolean = true; 
	public _toggleSidebar() {
		this._opened = !this._opened;
	}
  
	/*breadcrumbs array */
	current_url_array = [];

	//form_title:any;
	form_title = "Documentation List";
	server_url:string;

	constructor(private loginService: LoginService,) { 
		this.server_url = this.loginService.getServerUrl();
	}

	ngOnInit(): void {
		this.current_url_array = [
			{'slug':"",'label':'Documentation List'}
		];
	}

}
