import { Component, OnInit } from '@angular/core';
import { FormGroup,  FormBuilder, FormControl, Validators  } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { faFile } from '@fortawesome/free-solid-svg-icons'; 
import { AngularEditorConfig } from '@kolkov/angular-editor';

import {noWhitespaceValidator} from '../../helper/validatefun';
import {mustMatch} from '../../helper/confirmed.validator';

@Component({
  selector: 'app-documentation',
  templateUrl: './documentation.component.html',
  styleUrls: ['./documentation.component.css']
})
export class DocumentationComponent implements OnInit {
	
	faFile = faFile;

	public _opened: boolean = true; 
	public _toggleSidebar() {
		this._opened = !this._opened;
	}

	doc_frm: FormGroup;
	// error validation message
	error_messages = {
	'd_title': [
		{ type: 'required', message: 'Title is required' },  
	]} 
	// alert box	
	error: string;

	 
	/*breadcrumbs array */
	current_url_array = [];
	
	//form_title:any;
	form_title = "Add Documentation";
	server_url:string;

	d_desc_placeholder = "Description";
	d_desc:string = '';
	
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

	constructor(private loginService: LoginService, private formBuilder: FormBuilder,) { 
		this.server_url = this.loginService.getServerUrl();
	}

	ngOnInit(): void {
		/* Form validation */
		this.doc_frm = this.formBuilder.group({
			d_title: [null, [Validators.required,noWhitespaceValidator]],
		});

		this.current_url_array = [
			{'slug':"",'label':'Add Documentation'}
		];
	}

	get f() { return this.doc_frm.controls; }

	// validation check here 
	validateAllFormFields(formGroup: FormGroup) {
		Object.keys(formGroup.controls).forEach(field => {
			console.log(field);
			const control = formGroup.get(field);
			if (control instanceof FormControl) {
				control.markAsTouched({ onlySelf: true });
			} else if (control instanceof FormGroup) {
				this.validateAllFormFields(control);
			}
		});
	}
}