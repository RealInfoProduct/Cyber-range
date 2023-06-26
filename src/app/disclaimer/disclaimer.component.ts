import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-disclaimer',
  templateUrl: './disclaimer.component.html',
  styleUrls: ['./disclaimer.component.css']
})
export class DisclaimerComponent implements OnInit {
  
  // breadcrumbs  
	current_url_array = [];
	form_title:string = ''; 

  server_url:string;	

  constructor(private loginService: LoginService) { 
    this.form_title = "Disclaimer";
    this.server_url = this.loginService.getServerUrl();
  }

  ngOnInit(): void {
    this.current_url_array = [
		  {"slug":"","label":"Disclaimer"}
		] 
  }

}
