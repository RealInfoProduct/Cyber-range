import { Component,OnDestroy, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ManualService } from '../../services/manual.service';
import { noWhitespaceValidator } from '../../helper/validatefun';
import { Router, ActivatedRoute } from '@angular/router';

import { DatapassService } from '../../services/datapass.service';
import { Subscription } from 'rxjs/Subscription';
import { Constants } from 'src/constants';

declare const alertfun: any;
@Component({
	selector: 'app-content',
	templateUrl: './content.component.html',
	styleUrls: ['./content.component.css']

})
export class ContentComponent implements OnInit, OnDestroy {

	public _opened: boolean = true;
	subscription: Subscription;

	/*breadcrumbs array */
	current_url_array = [];
	content_frm: FormGroup;
	messageArray = {
		type: "",
		message: "",
	};
	//form_title:any;
	form_title = "Add Content";
	server_url: string;
	dashboard_url: string = "";
	manual_list: any;
	stringifiedData: any;
	topics_lists: any = '';
	content_id: string = '';
	selectedTitle: string = '';
	seldec: string = '';
	selmanual_id: string = '';
	seltopic_id: any = '';
	c_desc_placeholder = "Description";
	c_desc: string = '';
	message: string = '';
	notification: boolean = false;
	manual_id: string = '';
	stausType: string = '';
	topic_id: string = '';
	msgalert: any;
	alertMessage: string;
	alertClass: string;
	selectedvalue: string = '';
	closed: boolean = true;
	config: AngularEditorConfig;
	error_messages = {
		'c_title': [
			{ type: 'required', message: 'Enter  Title is required' },
		],

		'c_desc': [
			{ type: 'required', message: 'Description is required' },
		],

	}
	constructor(
		private loginService: LoginService, 
		private ManualService: ManualService,
		private router: Router,
		private route: ActivatedRoute,
		private formBuilder: FormBuilder,
		private ds: DatapassService) {
		this.getFlashMessage();
		this.dashboard_url = this.loginService.getDashboardUrl();
		this.server_url = this.loginService.getServerUrl();
	}
	ngOnDestroy() {
		this.ds.sendData('admin_sidebar_show');
	}	

	ngOnInit(): void {

		this.ds.sendData('admin_sidebar_hide');
		this.manual_id = this.route.snapshot.paramMap.get('id');
		this.content_id =this.route.snapshot.paramMap.get('content_id');
		alertfun();

		this.config = {
			editable: true,
			spellcheck: true,
			height: '25rem',
			minHeight: '70vh',
			placeholder: 'Enter text here...',
			translate: 'no',
			defaultParagraphSeparator: 'p',
			defaultFontName: '',
			uploadUrl: this.server_url + '/Manual_api/upload_des_image/'+this.manual_id,
			uploadWithCredentials: false,
			sanitize: false,
			toolbarHiddenButtons: [
				['bold'],
				['insertVideo']
			],
			customClasses: []
		};


		if(this.content_id !=null){
			this.form_title ='Edit Content';
			this.current_url_array = [
				{'slug':"",'label':'Edit Content'}
			];
			const formData = new FormData();
			formData.append('manual_id',this.content_id);
			this.ManualService.get_manual(formData).subscribe(
				res => {
					this.content_frm.patchValue({
						c_desc:res[0].description,
						c_title:res[0].menual_title
					});
				});
		}
		else{
			this.current_url_array = [
				{'slug':"",'label':'Add Content'}
			];
		}
		this.content_frm = this.formBuilder.group({
			c_title: [null, [Validators.required, noWhitespaceValidator]],
			c_desc: [null, [Validators.required, noWhitespaceValidator]]
		});

		this.ManualService.get_manual_list().subscribe(
			res => {
				this.manual_list = res;
			}
		);

		this.subscription = this.ds.getData().subscribe(x => { 
			if(x[0]=='set_permission')
			{
			  this.set_permission(x[1]);
			}
		  });

	}
	get f() { return this.content_frm.controls; }

	// validation check here 
	validateAllFormFields(formGroup: FormGroup) {
		Object.keys(formGroup.controls).forEach(field => {
			const control = formGroup.get(field);
			if (control instanceof FormControl) {
				control.markAsTouched({ onlySelf: true });
			} else if (control instanceof FormGroup) {
				this.validateAllFormFields(control);
			}
		});
	}

	onSubmit(data: any) {
		this.ds.Loader(true);
		if (this.content_frm.valid) {
			const formData = new FormData();
			formData.append('manual_title', data.c_title);
			formData.append('manual_parent_id', this.manual_id);
			formData.append('description', data.c_desc);
			this.addNewManual(formData);
		}
		else {
			this.validateAllFormFields(this.content_frm);
		}
	}

	addNewManual(formData: any) {
			this.ManualService.insertmanual(formData).subscribe(
				res => {
					if (res.last_insert_id != null) {
						this.ds.Loader(false);
						this.setFlashMessage('success', 'Content Added Successfull');
						this.router.navigate([this.dashboard_url + 'manual/' + this.manual_id]);
					}
				});
	}
	updateContent(data) {
		this.ds.Loader(true);
		const formData = new FormData();
		formData.append('manual_title', data.c_title);
		formData.append('manual_parent_id', this.manual_id);
		formData.append('description', data.c_desc);
		formData.append('id', this.content_id);

   	this.ManualService.editTopic(formData).subscribe(
			res => {
				this.ds.Loader(false);
				if(res.status =='success'){
					this.setFlashMessage('success',res.message);
					this.router.navigate([this.dashboard_url + 'manual/' + this.manual_id]);
				}
				else{
					if(res.status==500)
					{
						this.notification=true;
						this.message = Constants.FAIL_EDIT_TOPIC;
						this.stausType='danger';
					}
				}
			});
	}
	gettopicsbymid(event: any) {
		this.manual_id = event.target.value;
		const formData = new FormData();
		formData.append('manual_id', this.manual_id);
		this.ManualService.topics_list(formData).subscribe(
			res => {
				this.topics_lists = res;
			});
	}
	chnageTopic(event: any) {
		this.topic_id = event.target.value;
	}

	getFlashMessage() {
		this.msgalert = this.loginService.getflashMessage();
		if (typeof this.msgalert.type != "undefined") {
			this.alertClass = this.msgalert.type;
			this.alertMessage = this.msgalert.message;
			this.closed = false;
		}
	}
	setFlashMessage(type: any, message: any) {
		this.messageArray.type = type;
		this.messageArray.message = message;
		this.stringifiedData = JSON.stringify(this.messageArray);
		this.loginService.setflashMessage(this.stringifiedData);
	}

	set_permission(data:any)
	{
		if(data.permission.create_manual=='Denied')
		{
		   this.router.navigate([this.dashboard_url+'dashboard']);
		}
	}
}
