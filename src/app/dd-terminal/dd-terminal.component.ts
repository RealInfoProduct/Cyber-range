import { Component,OnDestroy, OnInit, Injectable,Input,Output, EventEmitter,  } from '@angular/core'; 
import { BackenddbService } from '../services/backenddb.service';
import { FormGroup,  FormBuilder, FormArray, FormControl, Validators  } from '@angular/forms';
import { Subject, BehaviorSubject } from 'rxjs';

import { faBars, faArrowCircleRight, faUser, faUserTie, faUsers, faBook, faUserCircle, faAddressBook, faServer, faMemory, faDatabase, faBell, faCog, faShare, faNetworkWired, faBookReader } from '@fortawesome/free-solid-svg-icons';
declare const slidebar:any; 
declare const activesidebar:any;

@Component({
  selector: 'app-dd-terminal',
  templateUrl: './dd-terminal.component.html',
  styleUrls: ['./dd-terminal.component.css']
})
export class DdTerminalComponent implements OnInit, OnDestroy {
	resetNotiTable : Subject<any> = new Subject<any>();

	faBars = faBars;
	faArrowCircleRight = faArrowCircleRight;
	faUserTie = faUserTie;
	faUser = faUser;
	faUsers = faUsers;
	faBook = faBook;
	faUserCircle = faUserCircle;
	faAddressBook = faAddressBook;	
	faDatabase = faDatabase;
	faMemory = faMemory;
	faServer = faServer;
	faCog = faCog;
	faBell = faBell;
	faShare = faShare;
	faNetworkWired = faNetworkWired;
	faBookReader = faBookReader;
	
	cpu:string = '0';
	used_cpu:string = '0';
	memory:string = '0';
	used_memory:string = '0';
	total_memory:string = '0';
	storage:string = '0';
	used_storage:string = '0';
	total_storage:string = '0';

	total_instructors:string = '0';
	total_users:string = '0';
	total_excercise:string = '0';
	total_exe_public:string = '0';
	total_exe_private:string = '0';
	total_allotment:string = '0';
	total_allotted:string = '0';
	total_running:string = '0';
	total_expired:string = '0';
	total_pause:string = '0';
	total_manual:string = '0';

	total_team:string = '0';

	time:number = 5;

	public _opened: boolean = true; 
	public _toggleSidebar() {
		this._opened = !this._opened;
	}  
	intervalId:any;
	
	constructor(private BackenddbService: BackenddbService) {
		
	}

	ngOnInit(): void {
		activesidebar(); 
		this.load_dashboard()
		this.load_interval_dashboard(); 
	}

	ngOnDestroy() {
		clearInterval(this.intervalId);
	}
	
	action_sidebar(){
		slidebar();
	}

	timeSelect(event:any)
	{
		clearInterval(this.intervalId);
		this.time = event.target.value;
		this.load_interval_dashboard();
	}

    load_interval_dashboard()
	{
		var ti = 1000*this.time;
		this.intervalId = setInterval(() => { 
		//	alert();
			this.load_dashboard();
			this.resetNotiTable.next('refreshTable');
			}, ti);
	}

	load_dashboard()
	{
			var api = 'admin-api/get-admin-dashboard';
			this.BackenddbService.getData(api).subscribe((res:any) => {
				//console.log(res);
				if(typeof res != null)
				{  
				  this.total_instructors = res.total_instructor;
				  this.total_users = res.total_user;
				  this.total_team = res.total_team;
				  this.total_excercise = res.total_exe;
				  this.total_exe_public = res.total_exe_public;
				  this.total_exe_private = res.total_exe_private;
				  this.total_allotment = res.total_allotment;
				  this.total_allotted = res.total_allotted;
				  this.total_running = res.total_running;
				  this.total_expired = res.total_expired;
				  this.total_pause = res.total_pause;
				  this.total_manual = res.total_manual;
				}
				this.get_server_resource();
			});	
			
	}

	get_server_resource()
	{
	  var api = 'admin-api/get-server-resource';
	  this.BackenddbService.getData(api).subscribe((res:any) => {
		  if(typeof res != null)
		  { 
			     this.cpu = res.cpu;
			     this.used_cpu = res.used_cpu;
			     this.memory = res.memory;
				 this.used_memory = res.used_memory;
			     this.total_memory = res.total_memory;
			     this.storage = res.storage;
				 this.used_storage = res.used_storage;
			     this.total_storage = res.total_storage;
		  }
		});
	  }

}

