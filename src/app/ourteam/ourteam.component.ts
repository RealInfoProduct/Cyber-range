import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-ourteam',
  templateUrl: './ourteam.component.html',
  styleUrls: ['./ourteam.component.css']
})
export class OurteamComponent implements OnInit {
  
  faEnvelope = faEnvelope;
  
  // breadcrumbs  
	current_url_array = [];
	form_title:string = ''; 

  server_url:string;	

  constructor(private loginService: LoginService) { 
    this.form_title = "Team";
    this.server_url = this.loginService.getServerUrl();
  }

  ngOnInit(): void {
    this.current_url_array = [
		  {"slug":"","label":"Team"}
		] 
  }

}
