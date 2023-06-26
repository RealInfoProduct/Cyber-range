import { Component, OnInit,Input } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { faBars } from '@fortawesome/free-solid-svg-icons';

declare const slidebar:any; 

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.css']
})
export class BreadcrumbsComponent implements OnInit {
  @Input() current_url_array: Array<any>;
  @Input() form_title: string;
  @Input() side: string;
  
  faBars = faBars;
  
  public _opened: boolean = true; 

  dashboard_url:string = "";

  constructor(
    private loginService: LoginService,
    private router: Router
    ) {
      this.dashboard_url = this.loginService.getDashboardUrl();
     }

     ngOnInit(): void {
  }
  
  action_sidebar(){
    slidebar();
  }
}