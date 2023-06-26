import { Component, OnInit} from '@angular/core';
import { FormGroup,  FormBuilder, FormArray, FormControl, Validators  } from '@angular/forms';

import { faFile, faCalculator, faGlobe, faUser, faUserTie, faUsers, faUserFriends, faBook, faCog, faFileAlt, faCubes, faLifeRing, faAddressBook, faMicrophone, faCircle, faDotCircle, faStopCircle, faComments, faBars,faAngleRight, faAngleDown, faAngleDoubleRight, faTimesCircle, faSearch,faCreditCard,faWallet } from '@fortawesome/free-solid-svg-icons';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { DataShareService } from '../../services/utils/data-share.service';
import { BackenddbService } from '../../services/backenddb.service';
import { DatapassService } from '../../services/datapass.service';
import { Subscription } from 'rxjs/Subscription';
import { Subject, BehaviorSubject } from 'rxjs';

declare const activesidebar:any;
declare const hideshow:any;
// declare const dragable:any;

@Component({
  selector: 'app-asidebar',
  templateUrl: './asidebar.component.html',
  styleUrls: ['./asidebar.component.css']
})
export class AsidebarComponent implements OnInit {
	subscription: Subscription;
	faBars = faBars;
	faGlobe = faGlobe;	
	faCalculator = faCalculator;
	faUserTie = faUserTie;
	faUser = faUser;
	faUsers = faUsers;
	faBook = faBook;
	faCog = faCog;
	faFileAlt = faFileAlt;
	faCubes = faCubes;
	faLifeRing = faLifeRing;
	faAddressBook = faAddressBook;
	faMicrophone = faMicrophone;  
	faCircle = faCircle;
	faDotCircle = faDotCircle;
	faStopCircle = faStopCircle;
	faComments = faComments;	
	faAngleRight = faAngleRight;
	faAngleDown = faAngleDown;
	faFile = faFile;
	faAngleDoubleRight = faAngleDoubleRight;
	faTimesCircle = faTimesCircle;
	faSearch = faSearch;
	faCreditCard = faCreditCard;
	faWallet = faWallet;	
	faUserFriends = faUserFriends;
	
	chat_userId:any='';
	loginGroupId:string;
	dashboard_url:string;
	otherconfigdata:any='';
	create_ex_menu:string = 'Allowed';
	allotment_menu:string = 'Allowed';
	ex_menu:string = 'Allowed';
	team_menu:string = 'Allowed';
	manual_menu:string = 'Allowed';
	exe_bundle_menu:string = 'Allowed';

	credit_system:string = 'Inactive';
	ref_system:string = 'Inactive';
	showclass:string = "";
	chat_status:any='';
	chat_menu:any='Allowed';
	site_Url:string
	server_url:string

	constructor(private loginService: LoginService, 
		       private router: Router ,
			   private  dataShareService: DataShareService,
			   private  BackenddbService: BackenddbService,
			   private ds: DatapassService) {
		this.site_Url = this.loginService.siteUrl;
		this.server_url = this.loginService.getServerUrl();
		this.loginGroupId = this.loginService.getLoginGroup();

		if(this.loginGroupId=='2')
		{
		   this.get_permission();
		}
		this.getSetting();
	}

	ngOnInit(): void {
		this.getOtherCongData();
        this.loadData();
		this.dashboard_url = this.loginService.getDashboardUrl();
		this.chat_userId = this.dataShareService.getUserId();
		activesidebar(); 
		hideshow();
	}
	loadData()
	{
		this.subscription = this.ds.getData().subscribe(x => {
			if(x=='get_permission')
			{
				if(this.loginGroupId=='2')
				{
				   this.get_permission();
				}
			}else if(typeof x !='undefined')
			{
                if(x[0]=='disableChat')
				{
                    this.disableChat();
				}
			}
		  });
		  var array = ['checkClaim','2','No'];
		  this.ds.sendData(array);
	} 
	disableChat()
	{
		this.chat_status = 'Inactive';
	}
	getOtherCongData()
	{
		const otherData1 = new FormData();
			otherData1.append('set_key','other_config');
			this.BackenddbService.getSetting(otherData1).subscribe(
				res => {
			 this.otherconfigdata = JSON.parse(res.data['11'].svalue);
			 if(this.chat_status=='')
			 {
				this.chat_status = this.otherconfigdata['0'].chat_status;
			 }
		  });
	}
	get_permission()
	{
	  var api = 'admin-api/get-permission';
	  this.BackenddbService.getData(api).subscribe((res:any) => {
		 if(Object.keys(res).length !==0 && res.permission!= null)
		 {
				var array = ['set_permission',res];
				this.ds.sendData(array);
				this.create_ex_menu = res.permission.create_exercise;
				this.exe_bundle_menu = res.permission.exercise_bundle;
				this.allotment_menu = res.permission.allocate_exe_user;
				this.team_menu = res.permission.create_team;
				this.manual_menu = res.permission.create_manual;
				this.chat_menu = res.permission.chat;
				if(this.create_ex_menu=='Denied' && this.allotment_menu=='Denied')
				{
					this.ex_menu = 'Denied';
				}
		  }
		});
	  }

  getSetting()
  {
        const formData1 = new FormData();
		formData1.append('set_key','');
		this.BackenddbService.getSetting(formData1).subscribe(
			res => {
				if(res.status=='success')
				{
					var setting = Array.from(Object.keys(res.data), k=>res.data[k]);
					setting.forEach((setObj:any, index:any) => {
						if(setObj.skey=='credit_system' || setObj.skey=='reference_user')
						{
							var svalue = JSON.parse(setObj.svalue);
							if(svalue[0].status=='Active')
							{
								if(setObj.skey=='credit_system')
								{
									this.credit_system = svalue[0].status;
								}else
								{
									this.ref_system = svalue[0].status;
								}
								activesidebar(); 
							}
						}
					});
				}
		});	
  }

	redirect(strurl:any)
	{
		this.router.navigate([strurl]);
	}
}