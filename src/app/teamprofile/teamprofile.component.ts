import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { FrontenddbService } from '../services/frontenddb.service';

import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-teamprofile',
  templateUrl: './teamprofile.component.html',
  styleUrls: ['./teamprofile.component.css']
})
export class TeamprofileComponent implements OnInit {
  team_profile = [];
  // breadcrumbs  
	current_url_array = [];
	form_title:string = ''; 

  server_url:string;
  alias:string = '';	

  constructor(
    private loginService: LoginService,
    private FrontenddbService: FrontenddbService,
    private router: Router,
    private route: ActivatedRoute
    
    ) { 

    this.form_title = "Team Profile";
    this.server_url = this.loginService.getServerUrl();
    this.alias = this.route.snapshot.paramMap.get('id');

  }

  ngOnInit(): void {
    this.current_url_array = [
		  {"slug":"","label":"Team Profile"}
		];

    const formData = new FormData();
    formData.append('alias', this.alias);
    formData.append('status','Active');
    formData.append('limit','1');
    
    this.FrontenddbService.getTeamProfile(formData).subscribe(
      res => {
           this.team_profile = res;
           console.log(this.team_profile);
      });

  }

}
