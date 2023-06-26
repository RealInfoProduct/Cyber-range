import { Component, OnInit,ViewChild } from '@angular/core';
import { FormGroup,  FormBuilder, FormControl, Validators  } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { faFile, faEdit, faTrash, faSort } from '@fortawesome/free-solid-svg-icons'; 
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { environment } from '../../../environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import {noWhitespaceValidator} from '../../helper/validatefun';
//import {mustMatch} from '../../helper/confirmed.validator';
import { ManualService } from '../../services/manual.service';
import { BackenddbService } from '../../services/backenddb.service';
import { DatapassService } from '../../services/datapass.service';
import { Subscription } from 'rxjs/Subscription';

import Swal from 'sweetalert2';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

declare const alertfun:any;
declare const activesidebar:any;

@Component({
  selector: 'app-manual',
  templateUrl: './manual.component.html',
  styleUrls: ['./manual.component.css']
})
export class ManualComponent implements OnInit {

	faFile = faFile;
	faEdit = faEdit;
	faTrash = faTrash;	
	faSort = faSort;
	submitted: boolean = false;
	showTopicForm:boolean=false;
	public _opened: boolean = true; 
	progress_message:string='';
	serverUrl = environment.baseUrl;
	public _toggleSidebar() {
		this._opened = !this._opened;
	}
	public personaldetails = [];

	messageArray = {  
		type: "",  
		message: "",  
	  }; 
	man_frm: FormGroup;

	topic_frm : FormGroup;
	msgalert:any;
	stringifiedData: any; 
	// error validation message
	error_messages = {
		'm_title': [
			{ type: 'required', message: 'Manual Title is required' },  
		],
		't_title': [
			{ type: 'required', message: 'Topic Title is required' },  
		],
		'd_desc': [
			{ type: 'required', message: 'Description is required' },  
		],
	} 
	// alert box	
	error: string;
	manual_id:string='';
	group_id:string = '';

	t_title:string='';
	closed: boolean = true;
	alertMessage: string;
	alertClass: string;
	last_insert_id:'';
	edit_tid:string='';
	index :string='1';
	message:string;
	topicMessage:string;
	notification:boolean=false;
	topic_btn:string='Save';
	notification_topic:boolean=false;
	Topicbtn:boolean=false;
	topicslist :Object;
	
	dashboard_url:string;
	manual_title:string;
	/*breadcrumbs array */
	current_url_array = [];
	
	//form_title:any;
	form_title = "Manual";
	server_url:string;

	d_desc_placeholder = "Description";
	d_desc:string = '';
	
	config: AngularEditorConfig ;
	subscription: Subscription;

	@ViewChild('auto') auto:any;
	public instructor_list = []; // store instuctor
	keyword = 'name';
	initial_value:string = ""; //  default selected value
	instructor_selected:string = ""; 
	limit_start:any = 0; // start limit in select query
	update_by:string = "";

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private loginService: LoginService, 
		private formBuilder: FormBuilder,
		private ManualService:ManualService,
		private BackenddbService:BackenddbService,
		private ds: DatapassService
		)
		 { 
			this.getFlashMessage();
			this.server_url = this.loginService.getServerUrl();
			this.dashboard_url = this.loginService.getDashboardUrl();
			this.group_id = this.loginService.getLoginGroup();
			this.update_by = this.loginService.getUserId(); 

    	}

	ngOnInit(): void {
		alertfun();
		activesidebar(); 
		this.loadData();
		this.manual_id = this.route.snapshot.paramMap.get('id');

		/* Form validation */
		this.man_frm = this.formBuilder.group({
			m_title: [null, [Validators.required,noWhitespaceValidator]],
		});

		this.topic_frm = this.formBuilder.group({
			t_title: [null, [Validators.required,noWhitespaceValidator]],
			d_desc: [null, [Validators.required,noWhitespaceValidator]],
		});

		this.config = {
			editable: true,
			spellcheck: true,
			height: '15rem',
			minHeight: '5rem',
			placeholder: 'Enter text here...',
			translate: 'no',
			defaultParagraphSeparator: 'p',
			defaultFontName: '',
			uploadUrl: this.serverUrl+'/Manual_api/upload_des_image',
			uploadWithCredentials: false,
			toolbarHiddenButtons: [
			  ['bold'],
			  ['insertVideo']
			  ],
			customClasses: []
		};
		if(this.manual_id != null){
			this.Topicbtn=true;
			const formData = new FormData();
			formData.append('manual_id',this.manual_id);
			this.ManualService.get_manual(formData).subscribe(
				res => {
					//this.manual_title= res[0].menual_title;
					this.man_frm.patchValue({
						m_title:res[0].menual_title
					  });
					this.instructor_selected = res[0].user_id;
					this.loadInstructorDropDownData('Yes');
				});
				this.loadTopicList(formData);
		}else
		{
			this.instructor_selected = this.update_by;
			this.loadInstructorDropDownData('Yes');
		}

		this.current_url_array = [
			{'slug':"",'label':'Manual'}
		];

	}

	loadData()
	{
		var array = ['checkClaim','2',''];
		this.ds.sendData(array);
		this.subscription = this.ds.getData().subscribe(x => { 
			if(x[0]=='set_permission')
			{
			  this.set_permission(x[1]);
			}
		  });
	}

	loadTopicList(formData){
		this.ManualService.topics_list(formData).subscribe(
			res => {
				this.topicslist = res;
			});
	}
	get f() { return this.man_frm.controls; }
	
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

	onSubmit(data:any) {
    		this.ds.Loader(true);
			this.submitted =true;
			if (this.man_frm.valid) {
				const formData = new FormData();
				formData.append('manual_parent_id',this.last_insert_id !=null ? this.last_insert_id :'0');
				formData.append('manual_title',data.m_title ? data.m_title : data.t_title);
				formData.append('description',data.d_desc  ? data.d_desc : '');
				formData.append('user_id',this.instructor_selected);

				this.addNewManual(formData ,'Manual');
			}
			else{
				this.validateAllFormFields(this.man_frm);
			}
	}
	updateManual(data:any)
	{
		    this.submitted =true;
			if(this.man_frm.valid)
			{
				const formData = new FormData();
				formData.append('manual_parent_id','0');
				formData.append('manual_title',data.m_title);
				formData.append('description',data.d_desc ? data.d_desc :'');
				formData.append('user_id',this.instructor_selected);
				formData.append('id',this.manual_id);

				this.ManualService.editTopic(formData).subscribe(
					res => {
						console.log(res);
						if(res.status == 'success')
						{
							this.message="Manual Update Successfully";
							this.notification=true;
						}
						else{
							this.message="Please Edit Mannual For Update";
							this.notification=true;
						}
					});
				}
	}
	deleteTopic(id:any){
		var msg = "Do you really want to delete this Topic ?";
		Swal.fire({
			title: 'Are you sure?',
			text: msg,
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'OK',
			cancelButtonText: 'Cancel'
		  }).then((result) => {
			if(result.value) {
				this.getDeleteTopic(id);
			}
		  })
	}

	getDeleteTopic(t_id){
		this.ds.Loader(true);
		const formData = new FormData();
		formData.append('id',t_id);
		this.ManualService.deletetopic(formData).subscribe(
			res => {
				if(res==true)
				{
					this.ds.Loader(false);
					this.notification=true;
					this.notification_topic=false;
					this.topicMessage='';
					this.message = "Content Deleted Successfully.";
					const formData = new FormData();
					formData.append('manual_id',this.manual_id);
					this.loadTopicList(formData);
				}

			}
		);
	}
	editTopic(t_id){
		this.router.navigate([this.dashboard_url+'content/'+this.manual_id+'/'+t_id]);
	}

	addNewManual(formData:any,type)
	{
		if(this.edit_tid != '')
		{
			formData.append('id',this.edit_tid);
			this.ManualService.editTopic(formData).subscribe(
				res => {
					if(res.status== 'success')
					{
						this.notification=true;
						this.ds.Loader(false);
						this.message = "Topic updated successfully.";
						const formData = new FormData();
						formData.append('manual_id',this.manual_id);
						this.loadTopicList(formData);
					}
					else{
						this.topicMessage ="please edit Topic for Update";
						this.notification_topic=true;
					}
				});
		}
		else
		{
			this.ManualService.insertmanual(formData).subscribe(
				res => {
						if(res.last_insert_id != null){
							if(type =='Manual'){
							this.ds.Loader(false);
							this.setFlashMessage('success',"Manual Added Successfully.");
							this.router.navigate([this.dashboard_url+'manual/'+res.last_insert_id]);
							}
							else{
								this.notification=true;
								this.message = "Topic Added Successfully.";
								const formData = new FormData();
								formData.append('manual_id',this.manual_id);
								this.loadTopicList(formData);
							}
						}
				});
		}
	}

	addContent(){
		this.router.navigate([this.dashboard_url+'content/'+this.manual_id]);
	}
	getFlashMessage()
	{
	  this.msgalert = this.loginService.getflashMessage();
	  if (typeof this.msgalert.type != "undefined")
	  {
		this.alertClass = this.msgalert.type;
		this.alertMessage = this.msgalert.message;
		this.closed = false;
	  }
	}
	setFlashMessage(type:any,message:any)
	{
		this.messageArray.type = type;
		this.messageArray.message = message;
		this.stringifiedData = JSON.stringify(this.messageArray);   
		this.loginService.setflashMessage(this.stringifiedData);
	}

  saveOrder()
  {
	  this.ds.Loader(true);
	  const formData = new FormData();
	  formData.append('topicslist',JSON.stringify(this.topicslist));
	  var api = 'manual-api/save-order';
	  this.BackenddbService.postData(api,formData).subscribe(
		res => {
			this.ds.Loader(false);
		})	
  }

  loadInstructorDropDownData(selected:any)
  {
	const formData = new FormData();
	formData.append('instructor_id',this.instructor_selected);
	if(this.group_id=='1')
	{
		formData.append('group_id','1,2');
	}

  this.BackenddbService.getInstructorDropDownList(formData).subscribe(
    res => {
      res.forEach( (myObject:any, index:any) => {
        let abc = this.instructor_list.find(ob => ob['id'] === res[index].U_ID);
        if(typeof(abc) ==='undefined')
        {
          this.instructor_list.push({id:res[index].U_ID,name:res[index].F_Name+" "+res[index].L_Name+" - "+res[index].eMail});
          if(selected=='Yes')
          {
            this.initial_value = res[index].F_Name+" "+res[index].L_Name+" - "+res[index].eMail;
          }
        }
      });
      if(res.length>0)
      {
        this.limit_start = this.limit_start+10;
      }
    });
}

  selectEvent(item:any) {
	  if(typeof item.id!='undefined')
	  {
		this.instructor_selected = item.id;
	  }
  }

 onFocused(e:any) {
	this.instructor_selected = '';
  }

  inputCleared(event:any){
	if(typeof(event) ==='undefined')
	{
	   this.instructor_selected = '';
	}
  }
  

  inputChanged(keyword:any){
	this.instructor_selected = '';
	const formData = new FormData();
	formData.append('search',keyword);
	if(this.group_id=='1')
	{
	  formData.append('group_id','1,2');
	}
	this.BackenddbService.getInstructorDropDownList(formData).subscribe(
	  res => {
		res.forEach( (myObject:any, index:any) => {
		  let abc = this.instructor_list.find(ob => ob['id'] === res[index].U_ID);
		  if(typeof(abc) ==='undefined')
		  {
			this.instructor_list.push({id:res[index].U_ID,name:res[index].F_Name+" "+res[index].L_Name+" - "+res[index].eMail});
		  }
		});
	  });
  }
  
  scrolledToEnd(item:any) {
	const formData = new FormData();
	formData.append('search','');
	formData.append('limit_start',this.limit_start);
	this.BackenddbService.getInstructorDropDownList(formData).subscribe(
	  res => {
		res.forEach( (myObject:any, index:any) => {
		  let abc = this.instructor_list.find(ob => ob['id'] === res[index].U_ID);
		  if(typeof(abc) ==='undefined')
		  {
			this.instructor_list.push({id:res[index].U_ID,name:res[index].F_Name+" "+res[index].L_Name+" - "+res[index].eMail});
		  }
		});
		if(res.length>0)
		{
		  this.limit_start = this.limit_start+10;
		}
		this.auto.open();
	  });
  }
  
  onDrop(event: CdkDragDrop<string[]>) {

	if (event.previousContainer === event.container) {
	   moveItemInArray(event.container.data, 
		  event.previousIndex, event.currentIndex);
	} else {
	   transferArrayItem(event.previousContainer.data,
	   event.container.data,
	   event.previousIndex,
	   event.currentIndex);
	}
	this.saveOrder();
 }

 set_permission(data:any)
 {
	 if(data.permission.create_manual=='Denied')
	 {
		this.router.navigate([this.dashboard_url+'dashboard']);
	 }
 }


}
