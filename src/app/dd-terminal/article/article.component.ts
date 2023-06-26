import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {

  public _opened: boolean = true; 
	public _toggleSidebar() {
		this._opened = !this._opened;
	}
  
	/*breadcrumbs array */
  current_url_array = [];
  

	//form_title:any;
	form_title = "Article";
  server_url:string;
  dashboard_url:string = "";

  a_desc_placeholder = "Description";
	a_desc:string = '';
	
	config: AngularEditorConfig = {
		editable: true,
		spellcheck: true,
		height: '15rem',
		minHeight: '5rem',
		placeholder: 'Enter text here...',
		translate: 'no',
		defaultParagraphSeparator: 'p',
		defaultFontName: '',
		toolbarHiddenButtons: [
		  ['bold']
		  ],
		customClasses: []
  };
  
	constructor(private loginService: LoginService,) { 
    this.dashboard_url = this.loginService.getDashboardUrl();
		this.server_url = this.loginService.getServerUrl();
	}

	ngOnInit(): void {
		this.current_url_array = [
			{'slug':"",'label':'Article'}
		];
	}

}
