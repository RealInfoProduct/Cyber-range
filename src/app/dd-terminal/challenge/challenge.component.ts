import { Component, OnInit,ViewChild } from '@angular/core';
import { FormGroup,  FormBuilder, FormControl, Validators  } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { faFile, faEdit, faTrash, faSort, faPlus } from '@fortawesome/free-solid-svg-icons'; 
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { environment } from '../../../environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import {noWhitespaceValidator,digitValidator} from '../../helper/validatefun';
//import {mustMatch} from '../../helper/confirmed.validator';
import { BackenddbService } from '../../services/backenddb.service';
import { DatapassService } from '../../services/datapass.service';
import { Subscription } from 'rxjs/Subscription';
import Swal from 'sweetalert2';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
declare const alertfun:any;
declare const activesidebar:any;
@Component({
  selector: 'app-challenge',
  templateUrl: './challenge.component.html',
  styleUrls: ['./challenge.component.css']
})
export class ChallengeComponent implements OnInit {
	faFile = faFile;
	faEdit = faEdit;
	faTrash = faTrash;	
	faSort = faSort;
	faPlus = faPlus
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
	task_frm : FormGroup;
	ques_frm : FormGroup;
	msgalert:any;
	stringifiedData: any; 
	keyword_array = []; 
	// error validation message
	error_messages = {
		'm_title': [
			{ type: 'required', message: 'Challenge is required' },  
		],
		'status': [
			{ type: 'required', message: 'Status is required' },  
		],
		'title': [
			{ type: 'required', message: 'Title is required' },  
		],
		'question': [
			{ type: 'required', message: 'Question is required' },  
		],
		'ques_type': [
			{ type: 'required', message: 'Question Type is required' },  
		],
		'ques_status': [
			{ type: 'required', message: 'Question Status is required' },  
		],
		'option_a': [
			{ type: 'required', message: 'Option A is required' },  
		],
		'option_b': [
			{ type: 'required', message: 'Option B is required' },  
		],
		'option_c': [
			{ type: 'required', message: 'Option C is required' },  
		],
		'option_d': [
			{ type: 'required', message: 'Option D is required' },  
		],
		'answer': [
			{ type: 'required', message: 'Answer is required' },  
		],
		'option_answer': [
			{ type: 'required', message: 'Answer is required' },  
		],
		'marks': [
			{ type: 'required', message: 'Marks is required' },  
			{ type: 'digitValidator', message: 'Invalid marks entered' },  
		],
	} 
	option:any = ['A','B','C','D']
	placeholder = "Keywords"
	sec_placeholder = "Keywords"
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
	form_title = "Challenge";
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
	@ViewChild('multiSelect') manual_dropdown;
	exDropdownList:any = [];
	exItems:any = [];
	exDropdownSettings = {};
	exKeyword:any = "";
	exList:any;
	exArray:any = [];
	assetList:any = [];
	assetItems:any = [];
	assetKeyword:any = "";
	assetArray:any = [];
	statusList:any = []
	showModal: boolean = false
	showQuesModal: boolean = false
	task:any = []
	currentTaskId:any = ''
	currentQuesId:any = ''
	optionShow: boolean = true
	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private loginService: LoginService, 
		private formBuilder: FormBuilder,
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
		alertfun()
		activesidebar()
		this.dropdown_setting()
		this.loadData()
		this.getExerciceList()
		this.manual_id = this.route.snapshot.paramMap.get('id');
		/* Form validation */
		this.man_frm = this.formBuilder.group({
			m_title: [null, [Validators.required,noWhitespaceValidator]],
			d_desc: [null,],
			exKeyword: [null],
			keyword: [null],
			status: ['Active', [Validators.required]],
		});
		this.task_frm = this.formBuilder.group({
			title: [null, [Validators.required,noWhitespaceValidator]],
			desc: [null,],
			status: ['Active', [Validators.required]],
		});
		this.ques_frm = this.formBuilder.group({
			ques_type: ['Yes', [Validators.required]],
			question: ['', [Validators.required]],
			option_a: ['', [noWhitespaceValidator]],
			option_b: ['', [noWhitespaceValidator]],
			option_c: ['', [noWhitespaceValidator]],
			option_d: ['', [noWhitespaceValidator]],
			option_answer: ['A', [Validators.required]],
			marks: ['', [Validators.required,noWhitespaceValidator,digitValidator]],
			ques_status: ['Active', [Validators.required]],
			answer: [''],
			assetKeyword: [''],
		});
		this.ques_frm.get('ques_type').valueChanges.subscribe(response => {
			if(response == "Yes"){
				this.ques_frm.get('option_a').setValidators(Validators.required);
				this.ques_frm.get('option_a').updateValueAndValidity();
				this.ques_frm.get('option_b').setValidators(Validators.required);
				this.ques_frm.get('option_b').updateValueAndValidity();
				this.ques_frm.get('option_c').setValidators(Validators.required);
				this.ques_frm.get('option_c').updateValueAndValidity();
				this.ques_frm.get('option_d').setValidators(Validators.required);
				this.ques_frm.get('option_d').updateValueAndValidity();
				this.ques_frm.get('option_answer').setValidators(Validators.required);
				this.ques_frm.get('option_answer').updateValueAndValidity();
				this.ques_frm.get('answer').clearValidators();
				this.ques_frm.get('answer').updateValueAndValidity();
			} else {
				this.ques_frm.get('option_a').clearValidators();
				this.ques_frm.get('option_a').updateValueAndValidity();
				this.ques_frm.get('option_b').clearValidators();
				this.ques_frm.get('option_b').updateValueAndValidity();
				this.ques_frm.get('option_c').clearValidators();
				this.ques_frm.get('option_c').updateValueAndValidity();
				this.ques_frm.get('option_d').clearValidators();
				this.ques_frm.get('option_d').updateValueAndValidity();
				this.ques_frm.get('option_answer').clearValidators();
				this.ques_frm.get('option_answer').updateValueAndValidity();
				this.ques_frm.get('answer').setValidators(Validators.required);
				this.ques_frm.get('answer').updateValueAndValidity();
			}
		  })
		this.BackenddbService.getStatusList().subscribe((data:any) => {
			this.statusList = Array.from(Object.keys(data), k=>data[k]);
	    });  
		if(this.manual_id!=null)
		{
			this.getChallenge()
		}
		this.current_url_array = [
			{'slug':"",'label':'Manual'}
		];
	}
	dropdown_setting()
	{
	  this.exDropdownSettings = {
		singleSelection: false,
		idField: 'id',
		textField: 'name',
		selectAllText: 'Select All',
		unSelectAllText: 'UnSelect All',
		itemsShowLimit: 10,
		allowSearchFilter: true,
		allowRemoteDataSearch:true,
	  };
	}  
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
	getChallenge()
	{
		const formData = new FormData()
		formData.append('id',this.manual_id)
		let api = 'challenge-api/get-challenge'
		this.BackenddbService.postData(api,formData).subscribe(
			res => {
				if(res.status=='success')
				{
					console.log(res.data)
					let data = res.data
					this.exArray = data.relevent_exe_id 
					this.task = data.task
					this.assetList = data.asset
					this.man_frm.patchValue({
						m_title: data.name,
						d_desc: data.description,
						exKeyword: data.relevent_exe,
						status: data.status,
					})
				}else
				{
					this.setFlashMessage('success',res.message);
					this.router.navigate([this.dashboard_url+'challenge']);
				}
			})
	}
	onSubmit(data:any) 
	{
		if(this.man_frm.valid) 
		{
			this.ds.Loader(true)
			const formData = new FormData()
			let api = 'challenge-api/add-challenge'
			if(this.manual_id!=null)
			{
				api = 'challenge-api/update-challenge'
				formData.append('id',this.manual_id)
			}
			formData.append('name',data.m_title)
			formData.append('description',data.d_desc)
			formData.append('relevent_exe',JSON.stringify(this.exArray))
			formData.append('status',data.status)
			this.BackenddbService.postData(api,formData).subscribe(
				res => {
					this.ds.Loader(false)
					this.notification=true
					if(res.status == 'success')
					{
						if(this.manual_id==null)
						{
							this.setFlashMessage('success',res.message)
						}else
						{
							this.message = res.message
						}
						this.router.navigate([this.dashboard_url+'challenge/'+res.last_insert_id])
					}
					else
					{
						this.message="Fail to add challenge"
					}
				});
		}
		else
		{
			this.validateAllFormFields(this.man_frm)
		}
	}
	onTaskSubmit(data:any) 
	{
		if(this.task_frm.valid) 
		{
			this.ds.Loader(true)
			const formData = new FormData()
			let api = 'challenge-api/add-task'
			if(this.currentTaskId!='')
			{
				api = 'challenge-api/edit-task'
				formData.append('id',this.currentTaskId)
			}
			formData.append('chall_id',this.manual_id)
			formData.append('title',data.title)
			formData.append('description',data.desc)
			formData.append('status',data.status)
			this.BackenddbService.postData(api,formData).subscribe(
				res => {
					this.ds.Loader(false)
					this.notification=true
					this.message = res.message
					this.showModal = false
					this.getChallenge()
				});
		}
		else
		{
			this.validateAllFormFields(this.task_frm)
		}
	}
	onQuesSubmit(data:any) 
	{
			if(this.ques_frm.valid) 
			{
				this.ds.Loader(true);
				const formData = new FormData();
				let api = 'challenge-api/add-question'
				if(this.currentQuesId!='')
				{
					api = 'challenge-api/edit-question'
					formData.append('id',this.currentQuesId)
				}else
				{
					formData.append('task_id',this.currentTaskId)
				}
				formData.append('question',data.question)
				formData.append('ques_type',data.ques_type)
				formData.append('option_a',data.option_a)
				formData.append('option_b',data.option_b)
				formData.append('option_c',data.option_c)
				formData.append('option_d',data.option_d)
				formData.append('option_answer',data.option_answer)
				formData.append('marks',data.marks)
				formData.append('status',data.ques_status)
				formData.append('answer',data.answer)
				formData.append('asset',JSON.stringify(this.assetArray))
				this.BackenddbService.postData(api,formData).subscribe(
					res => {
						this.ds.Loader(false)
						this.notification=true
						this.message = res.message
						this.showQuesModal = false
						this.getChallenge()
					});
			}
			else
			{
				this.validateAllFormFields(this.ques_frm);
			}
	}
	editTask(id:any)
	{
		this.currentTaskId = ''
		this.currentQuesId = ''
		let result:any = this.task.find((obj:any)=>{
            return obj.id == id
		})
        if(typeof result !== undefined)
		{
			this.task_frm.patchValue({
				title: result.task_name,
				desc: result.description,
				status: result.status,
			})
			this.showModal = true
			this.currentTaskId = id
		}
	}
	resetForm()
	{
		this.ques_frm.patchValue({
			ques_type: 'Yes',
			question: '',
			option_a: '',
			option_b: '',
			option_c: '',
			option_d: '',
			option_answer: 'A',
			marks: null,
			ques_status: 'Active',
			answer: null,
			assetKeyword:''
		});
	} 
	addQuesModal(id:any)
	{
		this.currentTaskId = id
		this.optionShow = true
		this.closed = true
		this.resetForm()
		this.showQuesModal = true
	}
	quesTypeChange(event:any)
	{
	  if(event.target.value=='Yes')
	  {
         this.optionShow = true
	  }else
	  {
		 this.optionShow = false
	  }
	}
	getExerciceList()
	{
		let api = 'challenge-api/get-exercise-list'
		this.BackenddbService.getData(api).subscribe(
			res => {
				this.exList = res
				console.log(res)
		});
	}
	onItemSelect(item:any,type:any)
	{
		if(type=='Exercise')
		{
		  this.exArray.push(item.id)
		}else
		{
		  this.assetArray.push(item.id)
		}
	}
	onItemDeSelect(item:any,type:any)
	{
		if(type=='Exercise')
		{
			const index = this.exArray.indexOf(item.id, 0);
			if (index > -1) {
				this.exArray.splice(index, 1);
			}
		}else
		{
			const index = this.assetArray.indexOf(item.id, 0);
			if (index > -1) {
				this.assetArray.splice(index, 1);
			}
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
	getDeleteTopic(t_id:any){
		this.ds.Loader(true);
		const formData = new FormData();
		formData.append('id',t_id);
		// this.ManualService.deletetopic(formData).subscribe(
		// 	res => {
		// 		if(res==true)
		// 		{
		// 			this.ds.Loader(false);
		// 			this.notification=true;
		// 			this.notification_topic=false;
		// 			this.topicMessage='';
		// 			this.message = "Content Deleted Successfully.";
		// 			const formData = new FormData();
		// 			formData.append('manual_id',this.manual_id);
		// 			this.loadTopicList(formData);
		// 		}
		// 	}
		// );
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
	saveOrder(index:any)
	{
		console.log(this.task[index]['question'])
		this.ds.Loader(true);
		const formData = new FormData();
		formData.append('question',JSON.stringify(this.task[index]['question']));
		var api = 'challenge-api/save-question-order';
		this.BackenddbService.postData(api,formData).subscribe(
			res => {
				this.ds.Loader(false);
				console.log(res)
			})	
	}
	editQuestion(taskIndex:any,quesIndex:any)
	{
		let data = this.task[taskIndex]['question'][quesIndex]
		this.showQuesModal = true
		let answer = ''
		let option_answer = 'A'
		if(data.ques_type=='Yes')
		{
			this.optionShow=true
			option_answer = data.answer
		}else
		{
			this.optionShow=false
			answer = data.answer
		}
		let asset = data.asset
		let assetKeyword = []

		this.assetList.forEach((obj:any, index:any) => { 
			let search = asset.indexOf(obj.id);
			if(search>-1)
			{
				assetKeyword.push(obj)
			}
		})

		this.currentQuesId = data.id
		this.ques_frm.patchValue({
			ques_type: data.ques_type,
			question: data.question,
			option_a: data.option_a,
			option_b: data.option_b,
			option_c: data.option_c,
			option_d: data.option_d,
			option_answer: option_answer,
			marks: data.marks,
			ques_status: data.status,
			answer: answer,
			assetKeyword: assetKeyword,
		});
	}
    onDrop(event: CdkDragDrop<string[]>,index:any) 
	{
		if (event.previousContainer === event.container) {
		moveItemInArray(event.container.data, 
			event.previousIndex, event.currentIndex);
		} else {
		transferArrayItem(event.previousContainer.data,
		event.container.data,
		event.previousIndex,
		event.currentIndex);
		}
		this.saveOrder(index);
	}
	set_permission(data:any)
	{
		if(data.permission.create_manual=='Denied')
		{
			this.router.navigate([this.dashboard_url+'dashboard']);
		}
	}
	hide() {
		this.showModal = false
		this.showQuesModal = false
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
	get f() { return this.man_frm.controls; }
}