import { Component, OnInit, OnDestroy, Injectable  } from '@angular/core'; 
import { Title } from '@angular/platform-browser';

import { Subject, BehaviorSubject,Observable } from 'rxjs';
import { Subscription }   from 'rxjs/Subscription';

import { LoginService } from '../../services/login.service';
import { FrontenddbService } from '../../services/frontenddb.service';
import { BackenddbService } from '../../services/backenddb.service';
import { NotificationService } from '../../services/notification.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';

import { faRedoAlt, faRandom, faLaptop ,faArrowCircleRight, faArrowCircleLeft, faUser, faEdit, faTrash, faUsers, faEye,faBars, faCamera, faPlus, faMinus, faCog, faPowerOff, faDesktop, faDownload, faFileExport, faRedo, faList, faNetworkWired, faCircle, faBell, faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

declare const topology_sidebtn:any; 

@Component({
  selector: 'app-topology',
  templateUrl: './topology.component.html',
  styleUrls: ['./topology.component.css']
})
export class TopologyComponent implements OnInit,OnDestroy {

	//fontasome icon
	faRedoAlt = faRedoAlt;
	faAngleLeft = faAngleLeft;
	faAngleRight = faAngleRight;
	faUser = faUser;
	faEdit = faEdit;
	faTrash = faTrash;	
	faUsers = faUsers;	
	faEye = faEye;	
	faBars = faBars;
	faCamera = faCamera;
	faPlus = faPlus;
	faMinus = faMinus;
	faCog = faCog;
	faPowerOff = faPowerOff;
	faDesktop = faDesktop;
	faDownload = faDownload;
	faFileExport = faFileExport;
	faRedo = faRedo;
	faList = faList;
	faNetworkWired = faNetworkWired;
	faArrowCircleLeft = faArrowCircleLeft;
	faArrowCircleRight = faArrowCircleRight;
	faLaptop = faLaptop;
	faRandom = faRandom;
	faCircle = faCircle;
	faBell = faBell;

	redraw_net_topology: Subject<any> = new Subject<any>();

	/*breadcrumbs array */
	current_url_array = [];
	form_title:string = 'Network Topology';

	server_url:string;
	allot_id:string;
	allot_primary_id:string;	

	progressbar:boolean = false;
	show_progress:boolean = true;
    resource_img_url:string = "";

	// infra info
	resource_added = [];
	network_data = [350,650,'frontend']; //sub,main
	vm_user = [];
	access = [];

	trackExeTimeObj:Subscription;
	getAllottedExeObj:Subscription;
	listenNotObj:Subscription;
	sendMsgObj:Subscription;

	call_again:string = "";
	intervalId:any;

	used_time:string = "";
	remain_time:string = "";

	load_topology:string = "Yes";
	// store allotment exercise data
	current_ex_data = [];
	start_manual = [];
    // store running process info
	process_array = [];
	pro_len:any='0';
	disable_click:boolean = false;

	ex_exercise_id:string="";
	ex_manual_id =[];

	user_id:string = '';
	loginName:string = '';
	message:string = '';
	team_name:string = '';
	team_id:string = '';

  constructor(
    private loginService: LoginService,
    private FrontenddbService: FrontenddbService,
    private BackenddbService: BackenddbService,
    private NotificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
	private title: Title,
	private toastr: ToastrService
  ) { 

    this.server_url = this.loginService.getServerUrl();
	this.resource_img_url = this.server_url+'media/';
	this.loginName = this.loginService.getLoginName();

    this.allot_id = this.route.snapshot.paramMap.get('id');
	this.user_id = this.loginService.getUserId();
  }

  ngOnInit(): void {

	topology_sidebtn();

    		/*breadcrumbs array */
		this.current_url_array = [
			{'slug':"",'label':'Network Topology'}
		];
		this.title.setTitle('CyberRange - Network Topology');
		this.loadAllottedExercise();
		this.background_process();

       // get socket notification response
		this.listenNotification();
  }

  ngOnDestroy() {
	if(typeof this.getAllottedExeObj !='undefined' )
	{  
	   this.getAllottedExeObj.unsubscribe();
	}
	clearInterval(this.intervalId);
	//this.disconnect();
  }


  listenNotification(): void {
	this.listenNotObj = this.NotificationService.receiveMessages().subscribe((socketResponse:any) => {
		if(typeof socketResponse['data'][0].type != 'undefined' && socketResponse['data'][0].room == this.allot_id && socketResponse['data'][0].type=='VM_Operation' && socketResponse['data'][0].user_id != this.user_id)
		{
			this.toastr.success(socketResponse['data'][0].message,'',{ closeButton:true, tapToDismiss:true });
			this.getLiveVMStatus(this.current_ex_data);
		}
		});
}

disconnect(): void {
	this.NotificationService.disconnect().subscribe((socketResponse:any) => {
	});
}

redirect()
{
	this.router.navigate(['/user-exercises']);
}
redirect_home()
{
	 this.router.navigate(['/exercise-repository']);
}
  
  getLiveVMStatus(ex_data:any)
  {
    if(this.show_progress==true)
    {
      this.progressbar = true;
    }  
	const formData = new FormData();
	formData.append('ex_data',JSON.stringify(ex_data));
	formData.append('allot_id',this.allot_id);

	this.FrontenddbService.getLiveVMStatus(formData).subscribe((res:any) => {
        this.progressbar = false;

		   if(res.status=='success')
		   {		
                this.resource_added = Array.from(Object.keys(res.data), k=>res.data[k]);
				this.disable_click = false;

				if(this.access.length != 0)
				{
					this.resource_added.forEach((resObj:any, resindex:any) => {
					if(resObj.asset_type=="VM")
					{
						if(typeof resObj.locked_vm!='undefined')
						{
                            this.disable_click = true;
						}
						this.access.forEach((accObj:any, index:any) => {
							if(resObj.asset_unique_id==accObj.unique_id) 
							{
							this.resource_added[resindex]['vm_control'] = this.access[index];
							}
					    });	
					}
					});	
				}
				setTimeout(() => {
					this.redraw_net_topology.next('draw_network_topology');  
				}, 1000 );
		   }else
		   {
			  Swal.fire('',res.message,'warning');
		   }
	});
   }

  track_exercise_time()
  {
		this.intervalId = setInterval(() => { 
		this.show_progress = false;
		this.trackExeTimeObj = this.FrontenddbService.trackExerciseTime().subscribe((data:any) => {
				if(typeof data !='undefined' && data.length !=0)
				{
					this.loadAllottedExercise();
				}
			});

		}, 1000*20);
	}

 loadAllottedExercise()
 {
		if(this.show_progress==true)
		{
		this.progressbar = true;
		}
		const formData = new FormData();
		formData.append('allot_id',this.allot_id);
		if(this.load_topology=="Yes")
		{
			formData.append('load_access','Yes');
		}

		this.FrontenddbService.loadAllottedExercise(formData).subscribe((res:any) => {
			this.progressbar = false;
			this.show_progress = true;
			
			if(res.status=='success')
			{
				this.used_time = res.data.used_time;
				this.remain_time = res.data.remain_time;

				if(typeof(res.data.team_name) != 'undefined')
                {
					this.team_name = res.data.team_name;
				}
				if(typeof(res.data.team_id) != 'undefined')
                {
					this.team_id = res.data.team_id;
				}				
                if(this.load_topology=="Yes")
				{
                    this.vm_user = res.vm_user;
	                this.access = res.access;
					this.allot_primary_id = res.data.id;
					this.getLiveVMStatus(res.data.data);
					this.current_ex_data = res.data.data;

					this.start_manual = Array.from(Object.keys(res.start_manual), k=>res.start_manual[k]);;
					this.ex_exercise_id = res.exercise_id; 

					this.load_topology = 'No';
					this.track_exercise_time();
				}  
			}else
			{
				Swal.fire('',res.message,'warning');
				this.router.navigate(['/user-exercises']);
			}
		});
 }

   
 delete_track_process(track_process_id:any)
 {
   const formData = new FormData();
   formData.append('track_process_id', track_process_id);  
   this.BackenddbService.DeleteProcess(formData).subscribe(
	 res => {
	   var track_process_array = JSON.parse(track_process_id)
	   setTimeout( () => { this.background_process(); }, 10000 );	   
	 });
 }

 background_process()
 {
   const formData = new FormData();
   this.BackenddbService.TrackProcess(formData).subscribe(
	 res => {
	   if(res.status == 'success')
	   {
		   this.process_array = [];
		   var status = '';
		   var failstatus = '';
		   var callback = '';
		   var track_process_id = [];
		   var redirect = '';
		   var redirect_home = '';
		   res.data.forEach( (myObject:any, index:any) => {
			 var process_data = JSON.parse(res.data[index].process_data);
			
			 this.process_array.push({'id':res.data[index].id,
									  'asset_unique_id':res.data[index].asset_unique_id,    
									  'label':process_data.label,
									  'process_type':res.data[index].process_type,
									  'status':res.data[index].status,
									  'time_ago':res.data[index].time_ago,
									  'date_time':res.data[index].date_time,
									 });

									 this.pro_len= this.process_array.length;
									 
			 if(res.data[index].status=='success')
			 {
			   status = 'success';
			   track_process_id.push(res.data[index].id);
			   if(typeof process_data.response_message != 'undefined')
			   {
                   this.message = process_data.response_message;
			       this.send_notification();
			   }
			   callback='Yes';
			 }

			 if(res.data[index].status=='in_queue' || res.data[index].status=='processing')
			 {
			   callback = 'Yes';
			 }
			 if(res.data[index].status=='fail')
			 {
				failstatus = 'Yes';
				track_process_id.push(res.data[index].id);
			 }
		   });

		   if(status=='success')
		   {
			 setTimeout( () => { this.getLiveVMStatus(this.current_ex_data); }, 1000 );
			 this.delete_track_process(JSON.stringify(track_process_id));
		   }else if(failstatus=='Yes')
		   {
			setTimeout( () => { this.getLiveVMStatus(this.current_ex_data); }, 1000 );
			this.delete_track_process(JSON.stringify(track_process_id));
		   }

		   //callback in every 15 sec if process exsit
		   if(this.process_array.length!=0 && callback=='Yes')
		   {
			 setTimeout( () => {  this.background_process(); }, 10000 );
		   }
	   }else
	   {
		  this.process_array = [];
	   }

	 }
   );
 }

 network_toplogy_action(data:any)
{
  var action = data[0]['action'];
  var asset_unique_id = data[0]['asset_unique_id'];

  this.resource_added.forEach((myObject:any, index:any) => { 
    if(this.resource_added[index].asset_unique_id == asset_unique_id)
    {
      var resource_data = this.resource_added[index];
      this.perform_action(resource_data,action);
    }
  }); 
}

get_web_console(vm_id:any,asset_unique_id:any)
{
	this.progressbar = true;
	const formData = new FormData();
	formData.append('vm_id',vm_id);
	formData.append('unique_id',asset_unique_id);
	formData.append('allot_id',this.allot_primary_id);
	
    this.FrontenddbService.getWebConsole(formData).subscribe((res:any) => {
		this.progressbar = false;
		if(res.status=='success')
		{
			Swal.fire('',res.message,'success');
            window.open(res.link, "_blank");
		}else
		{
			Swal.fire('',res.message,'warning');
		}
	}); 
}


send_notification()
{
	if(this.message != '')
	{
		var msg_array = [{'room':this.allot_id,'user_id':this.user_id,'type':'VM_Operation','message':this.message}]; 
		this.NotificationService.sendMessage(msg_array);
		this.message = '';
	}
}

rabbitMQSubmitProcess(formData:any,process_bar:any)
{
  if(this.show_progress==true)
  {
    this.progressbar = true;
  }
  this.BackenddbService.rabbitmqSubmitProcess(formData).subscribe(
    res => {
      this.progressbar = false;
      if(res.status == 'success')
      {
		this.show_progress = false;
		this.background_process();
		this.getLiveVMStatus(this.current_ex_data);
		this.send_notification();
      }else 
      {
		Swal.fire('',res.message,'warning');
      }
    }
  );
}



power(vm_id:any,power_mode:any,asset_unique_id:any,label:any,response_message:any)
{
  const formData = new FormData();
  formData.append('process','power_vm');  
  formData.append('power_mode',power_mode);  
  formData.append('vm_id',vm_id);  
  formData.append('asset_unique_id', asset_unique_id);  
  formData.append('label',label);  
  formData.append('response_message',response_message);  

  this.rabbitMQSubmitProcess(formData,'Yes');
}

//here get console info of vm
get_console(vm_id:any)
{
  const formData = new FormData();
  formData.append('vm_id', vm_id);  
  this.progressbar = true;
  this.BackenddbService.getSpiceConsole(formData).subscribe(
    res => {
      if(res.status == 'success')
      {
        //here download console file
        const blob = new Blob([res.file_data], {type: "text/plain;charset=utf-8"});
        saveAs(blob, "console.vv");
		setTimeout( () => { this.progressbar = false; }, 2000 );
      }else if(res.status == 'error')
      {
		 this.progressbar = false;
		 Swal.fire('',res.message,'warning');
      }
    });
}

 restore_machine()
 {
	Swal.fire({
		title: 'Are you sure?',
		text: 'Do you really want to restore all VM at initial stage. If you restore then all VM has been automatically shut down.',
		icon: 'warning',
		showCancelButton: true,
		confirmButtonText: 'OK',
		cancelButtonText: 'Cancel'
	  }).then((result) => {
		if(result.value)
		{
			this.disable_click = true;

			var response_message = this.loginName+' restored all VM at initial stage';  

			const formData = new FormData();
			formData.append('process','restore_base_snapshot');  
			formData.append('asset_unique_id', this.allot_id);  
			formData.append('ex_data',JSON.stringify(this.current_ex_data));
			formData.append('label','Restoring all VM at initial stage');  
			formData.append('response_message',response_message);  
			this.message = this.loginName+' restoring all VM at initial stage';  

			this.rabbitMQSubmitProcess(formData,'Yes');
		}

    });
	// /this.allot_id
 }

 snapshot(vm_id:any,operation:any,snapshot_id:any,asset_unique_id:any,label:any,vm_power_status:any,response_message:any)
{
  if(operation == 'restore_vm' && vm_power_status=='up')
  {
		var msg = 'Do you really want to restore at inital stage. If you restore then VM will be automatic power off.';
  }else if(operation == 'restore_vm')
  {
		var msg = 'Do you really want to restore at inital stage.';
  } 
  else if(operation == 'restore_snapshot' && vm_power_status=='up')
  {
    var msg = 'Do you really want to restore snapshot. If you restore snapshot then VM will be automatic power off.';
  }else if(operation == 'restore_snapshot')
  {
    var msg = 'Do you really want to restore snapshot.';
  }else if(operation == 'create_snapshot')
  {
    var msg = 'Do you really want to create snapshot.';
  }else if(operation == 'delete_snapshot')
  {
    var msg = 'Do you really want to delete snapshot.';
  }

   Swal.fire({
    title: 'Are you sure?',
    text: msg,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.value) {
      if((operation == 'restore_snapshot' || operation == 'restore_vm') && vm_power_status=='up')
      {

        // var asset_name = '';
        // this.resource_added.forEach( (myObject:any, index:any) => {
        //   if(this.resource_added[index].asset_unique_id == asset_unique_id)
        //   {
        //     asset_name = this.resource_added[index].asset_name;
        //   }
        // });

    	const formData = new FormData();
		formData.append('process','snapshot_vm');  
		formData.append('operation',operation);  
		formData.append('snapshot_id',snapshot_id);  
		formData.append('vm_id',vm_id);  
		formData.append('asset_unique_id', asset_unique_id);  
		formData.append('label',label);  
		formData.append('response_message',response_message);  

		this.rabbitMQSubmitProcess(formData,'No');

      }else
      {
        const formData = new FormData();
        formData.append('process','snapshot_vm');  
        formData.append('operation',operation);  
        formData.append('snapshot_id',snapshot_id);  
        formData.append('vm_id',vm_id);  
        formData.append('asset_unique_id', asset_unique_id); 
		formData.append('snapshot_name', 'User'); 
		formData.append('memory','true'); 
	    formData.append('label',label);  
		formData.append('response_message',response_message);  

        this.rabbitMQSubmitProcess(formData,'Yes');    
      }
    }
  })

  .catch(() => 
     console.log('Cancel') 
  ); 
}

 perform_action(resource_data:any,action:any)
{


  var vm_id = resource_data.vm_id;
  var asset_unique_id = resource_data.asset_unique_id; 
  var asset_name = resource_data.asset_name; 

  if(action=="web_console")
  {
     this.get_web_console(vm_id,asset_unique_id);
  }else if(action=="download_console")
  {
	this.get_console(vm_id);
  }else if(action=="power_on")
  {
	 this.message = this.loginName+' Powering on '+ asset_name; 
	 var response_message = this.loginName+' Powered on '+ asset_name;  
      this.power(vm_id,'up',asset_unique_id,'Powering on '+ asset_name,response_message);
  }else if(action=="power_off")
  {
	this.message = this.loginName+' Powering off '+ asset_name;  
	var response_message = this.loginName+' Powered off '+ asset_name;  
    this.power(vm_id,'stop',asset_unique_id,'Powering off '+ asset_name,response_message);
  }else if(action=="create_snapshot")
  {
    var snapshot_id  = resource_data.snapshot_id; 
    var power_on_status = resource_data.power_on_status;

	this.message = this.loginName+' Creating snapshot of '+ asset_name;  
	var response_message = this.loginName+' Created snapshot of '+ asset_name; 

    this.snapshot(vm_id,'create_snapshot',snapshot_id,asset_unique_id,'Creating snapshot of '+asset_name,power_on_status,response_message);
  }else if(action=="delete_snapshot")
  {
    var snapshot_id  = resource_data.user_snapshot_id; 
    var power_on_status = resource_data.power_on_status;

	this.message = this.loginName+' Deleting snapshot of '+ asset_name;  
	var response_message = this.loginName+' Deleted snapshot of '+ asset_name; 

    this.snapshot(vm_id,'delete_snapshot',snapshot_id,asset_unique_id,'Deleting snapshot of '+asset_name,power_on_status,response_message);
  }else if(action=="restore_snapshot")
  {
    var snapshot_id  = resource_data.user_snapshot_id; 
    var power_on_status = resource_data.power_on_status;

	this.message = this.loginName+' Restoring snapshot of '+ asset_name;  
	var response_message = this.loginName+' Restored snapshot of '+ asset_name; 

    this.snapshot(vm_id,'restore_snapshot',snapshot_id,asset_unique_id,'Restoring snapshot of '+asset_name,power_on_status,response_message);
  }else if(action=="restore_vm")
  {
    var power_on_status = resource_data.power_on_status;

	this.message = this.loginName+' Restoring '+asset_name+' VM at initial stage.';  
	var response_message = this.loginName+' Restored '+asset_name+' VM at initial stage.';  

    this.snapshot(vm_id,'restore_vm','',asset_unique_id,'Restoring '+asset_name+' VM',power_on_status,response_message);
  }

}

}
