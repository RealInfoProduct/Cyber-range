import { Component,OnDestroy, OnInit, Injectable  } from '@angular/core'; 
import { Subject, BehaviorSubject,Observable } from 'rxjs';

import { LoginService } from '../../services/login.service';
import { FrontenddbService } from '../../services/frontenddb.service';
import { BackenddbService } from '../../services/backenddb.service';

import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { FormGroup,  FormBuilder,FormArray, FormControl, Validators  } from '@angular/forms';
import {noWhitespaceValidator,greaterThanZeroValidator} from '../../helper/validatefun';

import { AssessmentService } from '../../services/assessment.service';

import { NotificationService } from '../../services/notification.service';
import { ToastrService } from 'ngx-toastr';
import { DatapassService } from '../../services/datapass.service';
import { faProjectDiagram,  faPaperPlane, faStopCircle, faHandPaper, faStop, faRocket, faDotCircle, faList, faTh, faArchive, faCloudDownloadAlt, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Subscription }   from 'rxjs/Subscription';
import {NgbProgressbarConfig} from '@ng-bootstrap/ng-bootstrap';
import Stepper from 'bs-stepper';

@Component({
	selector: 'app-userexercises',
	templateUrl: './userexercises.component.html',
	styleUrls: ['./userexercises.component.css']
})
export class UserexercisesComponent implements OnInit, OnDestroy {
	private stepper: Stepper;

    bgProcessNotifier : Subject<any> = new Subject<any>();
	faArrowUp = faArrowUp; 
	faArrowDown = faArrowDown;
	faPaperPlane = faPaperPlane;
	faStopCircle = faStopCircle;
	faHandPaper = faHandPaper;
	faDotCircle = faDotCircle;
	faRocket = faRocket;
	faStop = faStop;
	faList = faList;
	faTh = faTh;
	faArchive = faArchive;
	faCloudDownloadAlt = faCloudDownloadAlt;
	faProjectDiagram = faProjectDiagram;

	/*breadcrumbs array */
	current_url_array = [];
	form_title:string = 'My Exercises';
	allotted = [];
	archived = [];
	allottedRoadmap = [];
	status_array = ['Allotted','Running','Pause','Expired'];
	server_url:string;	
	site_url:string;
	access_url:string;
	subscription: Subscription;

	progressbar:boolean = false;
	show_progress:boolean = true;
	process_msg:string = '';

	disable_control:boolean = false;

	allot_status:string = '';
	allot_id_array = []; 
	setting = [];
	credit_system:string = 'Inactive';
	checkout_option:string = "Inactive";
	req_to_inst_option:string = "Inactive";
    extend_allot_id:string = '';
	extend_popup_obj:any; 

	trackExeTimeObj:Subscription;
	getAllottedExeObj:Subscription;
	listenNotObj:Subscription;
	sendMsgObj:Subscription;

	call_again:string = "";
	reload_call:string = "";
	intervalId:any;
	reload_interval:any;
	valid:boolean = false;

	message:string = "";
	reload:string = "";
	user_id:string = "";
	loginName:string = "";
	allot_id:string = "";
	currentTab:string = "GridView";
	currentDetail = [];

	// transition pin 
	t_pin:string = "";
	checkoutfrm:FormGroup;
	modalConfgRef:any;
	error_messages = {
		't_pin': [
		{ type: 'required', message: 'TPIN is required' },
		] 
		};

	constructor(
			private loginService: LoginService,
			private FrontenddbService:FrontenddbService,
			private BackenddbService:BackenddbService,
			private AssessmentService:AssessmentService,
			private router: Router,
			private NotificationService: NotificationService,
			private toastr: ToastrService, 
			private modalService: NgbModal,
			private fb:FormBuilder,
			config: NgbProgressbarConfig,
			private ds: DatapassService 

	) { 
		this.server_url = this.loginService.getServerUrl();
		this.site_url = this.loginService.getSiteUrl();
		this.access_url = this.loginService.getAceessUrl();
		config.max = 1000;
		config.striped = true;
		config.animated = true;
		// config.type = 'success';
		config.height = '13px';

	}
	
	ngOnInit() {	
		/*breadcrumbs array */
		this.current_url_array = [
			{'slug':"",'label':'My Exercises'}
		];
		this.user_id = this.loginService.getUserId();
		
		this.loginName = this.loginService.getLoginName();

        // load alloted exercise
		this.getAllottedExercise();
		// get socket notification response
		this.listenNotification();

		this.message = "";
		//this.testing_notification();

				// checkout t pin form
		this.checkoutfrm = this.fb.group({
			t_pin: ['', [Validators.required,noWhitespaceValidator]],
		});
		this.loadSubcData();
	}

	ngOnDestroy() {
		// destory load allocated exercise
		if(typeof this.getAllottedExeObj !='undefined')
		{
		  this.getAllottedExeObj.unsubscribe();
		}

  	   // destory track_exercise_time
		clearInterval(this.intervalId);
		clearInterval(this.reload_interval);
		this.disconnect();
	  }

	  loadSubcData()
	  {
		this.subscription = this.ds.getData().subscribe(x => { 
		  if(x[0]=='set_permission')
		  {
			 this.set_permission(x[1]);
		  }
		});
	  }
  

	  listenNotification(): void {
		this.listenNotObj = this.NotificationService.receiveMessages().subscribe((socketResponse:any) => {
			this.allot_id_array.forEach((altObj:any, altindex:any) => {
			if(typeof socketResponse['data'][0].type != 'undefined' && socketResponse['data'][0].room == altObj && socketResponse['data'][0].type=='VM_Operation' && socketResponse['data'][0].user_id != this.user_id)
			{
				this.toastr.success(socketResponse['data'][0].message,'');
				if(typeof socketResponse['data'][0].reload != 'undefined' && socketResponse['data'][0].reload=='Yes')
				{
					this.getAllottedExercise();
				}
			}
		});
		});
	}

	disconnect(): void {
		this.NotificationService.disconnect().subscribe((socketResponse:any) => {
		});
	}

	send_notification()
    {
		if(this.message != '')
		{
			var msg_array = [{'room':this.allot_id,'user_id':this.user_id,'type':'VM_Operation','reload':this.reload,'message':this.message}]; 
			this.NotificationService.sendMessage(msg_array);
			this.message = '';
			this.reload = '';
		}
    }

	track_exercise_time()
	{
		this.intervalId = setInterval(() => { 
		this.show_progress = false;
		this.trackExeTimeObj = this.FrontenddbService.trackExerciseTime().subscribe((data:any) => {
			var time_array = Array.from(Object.keys(data.data), k=>data.data[k]);
				time_array.forEach((tmObj:any, index:any) => {
					this.allotted.forEach((altObj:any, altindex:any) => {
						if(tmObj.id==altObj.id)
						{
							this.allotted[altindex].used_time = tmObj.used_time;
							this.allotted[altindex].remain_time = tmObj.remain_time;
						}
					})
                })
			});

		}, 1000*10);
	}

	reload_exercise()
	{
		this.reload_interval = setInterval(() => { 
		   this.show_progress = false;
		  this.getAllottedExercise();
		}, 1000*10);
	}	

	stepperProgressBar()
	{
	  this.stepper = new Stepper(document.querySelector('.bs-stepper'), {
		linear: false,
		animation: true
	  })
	}
	
	setCurrentTab(tab:any)
	{
		this.currentTab = tab;
	}

	getExerciseDetail(a_id:any)
	{
		this.currentDetail = [];
		this.allotted.forEach((Obj:any, index:any) => {
			if(Obj.id==a_id)
			{
				this.currentDetail = Obj;
			}
		});
		(<any>$('#exeDetailModal')).modal('show');
	}

	getAllottedExercise()
    {
		if(this.show_progress==true)
		{
		   this.progressbar = true;
		}
		const formData = new FormData();
		this.getAllottedExeObj = this.FrontenddbService.getAllottedExercise(formData).subscribe((data:any) => {
			this.progressbar = false;
			this.show_progress = true;
			this.allot_status = '';
            this.valid = false;
			this.allotted = Array.from(Object.keys(data), k=>data[k]);

			if(data.length!=0 && this.reload_call=="")
			{
				this.reload_exercise();
				this.reload_call = 'Yes';
			}

			this.allotted.forEach((altObj:any, index:any) => {

				this.allot_id_array.push(altObj.a_id);
				if(altObj.process_status==true && this.valid==false)
				{
					this.valid = true;
				}

				if(altObj.status=='Running')
				{
				   if(this.allot_status=="" && this.call_again=="")
				   {
					this.call_again = "Yes";
					this.track_exercise_time();
				   }
				   this.allot_status = 'Running';
				}
			});	

			});

	}	


	getAssesment(id:any,alot_id:any){
		this.progressbar = true;
		const result =	this.AssessmentService.getAssessment().subscribe((res:any) => {
		this.progressbar = false;
		    if(res.status=='success'){
				let  token = res.token; 
				var ass_url = this.access_url+'assessmentLogin/'+token+'/'+id+'/'+alot_id;
				window.open(ass_url,'_blank');
			}
		});
	}

	TpinSubmit(data:any)
	{
		if(this.checkoutfrm.valid)
		{
			this.progressbar = true;
			const formData = new FormData();
			formData.append('allot_id',this.extend_allot_id);
			formData.append('t_pin',data.t_pin);
			this.change_allot_button('disable',this.extend_allot_id);
			var api = 'redhatrest-api/extend-request-submit';
			this.BackenddbService.postData(api,formData).subscribe((res:any) => 
			{
				this.modalConfgRef.close();	
				this.progressbar = false;
				this.change_allot_button('disable',this.extend_allot_id);
				if(res.status=='success')
				{
					Swal.fire('',res.message,'success');
					this.bgProcessNotifier.next('background_process');
				}else if(res.status=='error')
				{
					Swal.fire('',res.message,'warning');
					this.bgProcessNotifier.next('background_process');
				}
			});	
		}else
		{
		    this.validateAllFormFields(this.checkoutfrm); // check validation
		}
	}

	ExtendSubmit(type:any,model:any)
	{
		this.modalConfgRef.close();
		if(type=='instructor')
		{
			this.Action(this.extend_allot_id,'extend');
		}else
		{
		    this.modalConfgRef = this.modalService.open(model, {ariaLabelledBy: 'modal-basic-title', size: 'sm'});
		}	  
	}

	ExtendAction(allote_id:any,model:any)
	{
		this.extend_allot_id = allote_id;
		this.extend_popup_obj = model;
		if(this.credit_system=="Active")
		{
			this.modalConfgRef = this.modalService.open(model, {ariaLabelledBy: 'modal-basic-title', size: 'sm'});
			return true;
		}else
		{
			this.Action(allote_id,'extend');
		}
	}

	Action(allote_id:any,action:any)
	{
       if(action=='launch')
	   {
		   var msg = 'Do you really want to launch?';
		   var label = 'Exercise('+allote_id+') preparing';
		   this.message = this.loginName+ ' preparing exercise('+allote_id+')';
		   this.reload = 'Yes';
	   }else if(action=='running')
	   {
		   var msg = 'Do you really want to launch?';
		   var label = 'Exercise('+allote_id+') launching';
		   this.message = this.loginName+ ' launching exercise('+allote_id+')';
	   }else if(action=='pause')
	   {
		   var msg = 'Do you really want to pause?';
		   var label = 'Pause('+allote_id+') operation';
		   this.message = this.loginName+ ' pausing exercise('+allote_id+')';
		   this.reload = 'Yes';
	   }else if(action=='resume')
	   {
		   var msg = 'Do you really want to resume?';
		   var label = 'Resume('+allote_id+') operation';
		   this.message = this.loginName+ ' resuming exercise('+allote_id+')';
		   this.reload = 'Yes';
	   }else if(action=='extend')
	   {
		   var msg = 'Do you really want to extend?';
		   var label = 'Extend('+allote_id+') operation';
		   this.reload = 'Yes';
	   }

	   this.allot_id = allote_id;
	   if(this.message!='')
	   {
		this.send_notification();
	   }


	   Swal.fire({
        title: 'Are you sure?',
        text: msg,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if(result.value) {
         
			this.progressbar = true;
			const formData = new FormData();
			formData.append('allot_id',allote_id);
			formData.append('action',action);
			formData.append('label',label);

			if(action=='launch')
			{
				this.disable_button(allote_id);
			}else
			{
				this.change_allot_button('disable',allote_id);
			}	


			this.FrontenddbService.launchAction(formData).subscribe((res:any) => {
				this.progressbar = false;
				if(res.status=='success')
				{
					Swal.fire('',res.message,'success');
					if(action=='launch')
					{
						this.getAllottedExercise();
					}

					if(action=='launch' || action=='pause' || action=='resume')
					{
					   this.bgProcessNotifier.next('background_process');
					}else if(action=='running')
					{
						this.router.navigate(['/topology/'+allote_id]);
					}else if(action=='extend')
					{
						this.getAllottedExercise();
					}
				}else if(res.status=='error')
				{
					Swal.fire('',res.message,'warning');
				}
				});

        }
      })

	}

	disable_button(allote_id:any)
	{
		this.allotted.forEach((allotObj:any, index:any) => {
			if(allotObj.a_id==allote_id)
			{
			   this.allotted[index].disable = true;
			}
		});	
	}

	change_allot_button(type:any,allote_id:any)
	{
       if(type=='disable')
	   {
			this.allotted.forEach((allotObj:any, index:any) => {
				if(allotObj.a_id==allote_id)
				{
				  this.allotted[index].disable = true;
				  this.allotted[index].process_status = true;
				}
		    });
	   }else if(type=='enable')
	   {
			this.allotted.forEach((allotObj:any, index:any) => {
				if(allotObj.a_id==allote_id)
				{
				  this.allotted[index].disable = false;
				  this.allotted[index].process_status = false;
				}
		    });
	   }
	}

	get_header_response(data:any)
	{
		data.forEach((proObj:any, index:any) => {
			this.allotted.forEach((allotObj:any, index:any) => {
				  if(allotObj.a_id==proObj.asset_unique_id)
				  {
					 this.allotted[index].process_status = true;
				  }else
				  {
					this.allotted[index].process_status = false;
				  }
			})
	    })	

		data.forEach((proObj:any, index:any) => {
			if((proObj.process_type=="launch_user_infra") && (proObj.status=='success'))
			{
				this.router.navigate(['/topology/'+proObj.asset_unique_id]);
				if(proObj.status=='success')
				{
                    this.reload = 'Yes';
					this.message = this.loginName+ ' launched exercise.';
					this.send_notification();
				}
			}else if((proObj.process_type=="pause_user_infra") && (proObj.status=='success' || proObj.status=='fail'))
			{
				setTimeout( () => { this.getAllottedExercise(); },3000);
				if(proObj.status=='success')
				{
                    this.reload = 'Yes';
					this.message = this.loginName+ ' paused exercise.';
					this.send_notification();
				}
			}else if((proObj.process_type=="resume_user_infra") && (proObj.status=='success' || proObj.status=='fail'))
			{
				setTimeout( () => { this.getAllottedExercise(); },3000);
				if(proObj.status=='success')
				{
                    this.reload = 'Yes';
					this.message = this.loginName+ ' resumed exercise.';
					this.send_notification();
				}
			}else if((proObj.process_type=="extend_allotment") && (proObj.status=='success' || proObj.status=='fail'))
			{
				setTimeout( () => { this.getAllottedExercise(); },3000);
			}else if(((proObj.process_type=="launch_user_infra") || (proObj.process_type=="pause_user_infra") || (proObj.process_type=="resume_user_infra")) && proObj.status=='fail')
			{
				this.change_allot_button('enable',proObj.asset_unique_id);
				Swal.fire('',proObj.label+'-fail','warning');
			}else if((proObj.process_type=="launch_user_infra") || (proObj.process_type=="pause_user_infra") || (proObj.process_type=="resume_user_infra"))
			{
				this.change_allot_button('disable',proObj.asset_unique_id);
			}
		})
	}
	
	onChange(event:any)
	{
		if(event.target.checked) {
			this.status_array.push(event.target.value);
		}else
		{
			let index = this.status_array.findIndex(x => x == event.target.value)
			this.status_array.splice(index, 1); 
		}	
		this.getAllottedExercise();
	}

	archived_load()
	{
		this.progressbar = true;
			this.getAllottedExeObj = this.FrontenddbService.getArchivedExercise().subscribe((data:any) => {
			this.progressbar = false;
			this.archived = Array.from(Object.keys(data), k=>data[k]);
			});
	}

	roadmapLoad()
	{
		this.progressbar = true;
		const formData = new FormData();
		formData.append('roadmap_status','1');
		this.getAllottedExeObj = this.FrontenddbService.getAllottedExercise(formData).subscribe((data:any) => {
		this.progressbar = false;
		this.allottedRoadmap = Array.from(Object.keys(data), k=>data[k]);
		console.log(this.allottedRoadmap);

		setTimeout(() => {
			this.stepperProgressBar()
			//this.stepper.to(res.data.currentOrder)
		  },100);

		});
	}

	get_setting(settings:any)
	{
		this.setting = settings;
		this.setting.forEach( (myObject:any, index:any) => {
			if(this.setting[index].skey=='checkout')
			{
			   if(this.setting[index].svalue=='Active')
			   {
				   this.checkout_option = 'Active';
			   }
			}else if(this.setting[index].skey=="request_to_instructor")
			{
				if(this.setting[index].svalue=='Active')
				{
					this.req_to_inst_option = 'Active';
				}
			}else if(this.setting[index].skey=='credit_system')
			{
			   var svalue = JSON.parse(this.setting[index].svalue);
			   if(svalue[0].status=='Active')
				{
					this.credit_system = 'Active';
				}
			}
	   });
	}

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
	
	  set_permission(data:any)
	  {
		  if(data.permission.access_exercise=='Denied')
		  {
			  this.router.navigate(['/']);
		  }
	  }
  
	  preloadData()
	  {
		  this.ds.sendData('get_permission');
	  }

}
