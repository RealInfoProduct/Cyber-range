import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import {NgbAccordionConfig} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-usertestimonial',
  templateUrl: './usertestimonial.component.html',
  styleUrls: ['./usertestimonial.component.css']
})
export class UsertestimonialComponent implements OnInit {

  // breadcrumbs  
	current_url_array = [];
	form_title:string = ''; 

  server_url:string;	

  constructor(private loginService: LoginService, config: NgbAccordionConfig) { 
    // customize default values of accordions used by this component tree
    config.closeOthers = true;
    config.type = 'info'

    this.form_title = "Users Testimonial";
    this.server_url = this.loginService.getServerUrl();
  }

  ngOnInit(): void {
    this.current_url_array = [
		  {"slug":"","label":"Users Testimonial"}
		] 
  }

}
