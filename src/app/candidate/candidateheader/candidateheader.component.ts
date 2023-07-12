import { Component, OnInit,Input, Output, EventEmitter, HostListener} from '@angular/core';

import { Subject, BehaviorSubject,Observable } from 'rxjs';

import { faUserCircle, faBell, faEnvelope, faPhone, faPhoneSquare, faSign, faShoppingBasket, faTimesCircle, faWallet, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { Router, UrlTree, UrlSegment, UrlSegmentGroup, PRIMARY_OUTLET, DefaultUrlSerializer, RouterState, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AssessmentService } from '../../services/assessment.service';
import { LoginService } from '../../services/login.service';
import { ChatService } from '../../services/chat.service';
import { FrontenddbService } from '../../services/frontenddb.service';
import { OrderService } from '../../services/order.service';
import { BackenddbService } from '../../services/backenddb.service';
import { Auth } from './../../interfaces/auth';
import Swal from 'sweetalert2';
import { DatapassService } from '../../services/datapass.service';
import { Subscription } from 'rxjs/Subscription';

declare const headerfix: any;

@Component({
  selector: 'app-candidateheader',
  templateUrl: './candidateheader.component.html',
  styleUrls: ['./candidateheader.component.css']
})
export class CandidateheaderComponent implements OnInit {

  @Input() resetHeaderBasket: Subject<any> = new Subject<any>();
  @Input() process_notifier: Subject<any> = new Subject<any>();

  @Output() setting: EventEmitter <any> = new EventEmitter<any>();
  @Output() added_basket: EventEmitter <any> = new EventEmitter<any>();
  @Output() wallet: EventEmitter <any> = new EventEmitter<any>();
  @Output() loadexercise = new EventEmitter<string>();
  @Output() bg_process_array: EventEmitter <any> = new EventEmitter<any>();

  @HostListener('scroll', ['$event'])

  process_array = [];
  user_id:string;
  dashboard_url:string;

  subscription: Subscription;

  task: string = 'background_process';
  value:string = '';
  userid:any='';
	loginName:string;
	loginGroupId:string;
	logout_every_id:string;
	alertMessage: string;
	alertClass: string;
	error: string;
	result:any;
	confirm:any = false;
  isNavbarCollapsed=true;  
  progressbar:boolean = false;
  userId:any='';
	faUserCircle = faUserCircle;
	faBell = faBell;
	faEnvelope = faEnvelope;
	faPhone = faPhone;
	faPhoneSquare = faPhoneSquare;
	faSign = faSign;
  faSignInAlt = faSignInAlt;	
	faShoppingBasket = faShoppingBasket; 
	faTimesCircle = faTimesCircle;
	faWallet = faWallet;
	
  server_url:string;
  access_url:string;
  basket = [];
  notification = [];
  basket_count:number = 0;
  wallet_balance:number = 0;
  total_credits:number = 0;
  credit_system:string = 'Inactive'; 
  mitre_system:string = 'Inactive'; 
  // max add to basket limit
  max_add_limit:number;

  //notification
  start_limit = 0;
  length = 10;
  note_count:number = 0;
  edit_profile:string = 'Allowed';
  enroll:string = 'Allowed';
  access_exercise:string = 'Allowed';

  browser_title = [
    {'login':'CyberRange - Login'},    
    {'registration':'CyberRange - Registration'},
    {'forgot-password':'CyberRange - Forgot Password'},
    {'reset-password':'CyberRange - Reset Password'}, 
    {'exercise-repository':'CyberRange - Exercises'}, 
    {'contact-us':'CyberRange - Contact Us'},    
    {'basket':'CyberRange - Basket'},
    {'topology':'CyberRange - Topology'}, 
    {'profile':'CyberRange - Profile'},
    {'user-exercises':'CyberRange - My Exercises'},
    {'my-transactions':'CyberRange - My Transactions'},
    {'my-activity':'CyberRange - My Activity'},
    {'my-exercises-stats':'CyberRange - My Exercises Stats'},
    {'exercise-description':'CyberRange - Exercise Description'},
 ];
  
 objectkeys = Object.keys;
 url = '';
 tree: UrlTree;
 fragment = '';
 queryParams = {};
 web_email:any='';
 web_contact:any='';
 otherconfigdata:any='';
 // primary outlet
 primary: UrlSegmentGroup;

	constructor(
    private loginService: LoginService,
    private OrderService: OrderService,
    private FrontenddbService: FrontenddbService,
    private BackenddbService: BackenddbService,
    private AssessmentService:AssessmentService,
    private title: Title,
    private ChatService:ChatService,
		private router: Router,
    private ds: DatapassService
    )
	{
      this.setBrowserTitle();
	  	this.server_url = this.loginService.getServerUrl();
      this.dashboard_url = this.server_url;
      this.loginName = this.loginService.getLoginName();
      this.logout_every_id = this.loginService.getUserId();
      this.loginGroupId = this.loginService.getLoginGroup();
      this.user_id = this.logout_every_id;
      this.access_url = this.loginService.getAceessUrl();
      this.getSetting();
      if(this.logout_every_id!=null) 
      {
        this.progressbar = true;
        this.background_process();

        this.getBasket('','');
        this.get_notification('Yes');
        this.get_wallet();
        this.note_count = this.notification.length;
      }
      if(this.loginGroupId=='3')
      {
        this.get_permission();
      }
      
  }

  ngOnInit(): void {

    headerfix();
    this.getOtherCongData();
    this.process_notifier.subscribe(
      data => {
          if(data=='background_process')
          {
            this.background_process();
          }
        }
      );

    this.resetHeaderBasket.subscribe(
      data => {
          if(data=='resetHeaderBasket')
          {
            this.resetBasket();
          }else if(data=='resetWallet')
          {
            this.get_wallet();
          }
        }
      );
      this.loadSubcData();
  }


  loadSubcData()
  {
    this.subscription = this.ds.getData().subscribe(x => {
      if(x=='get_permission')
      {
          this.get_permission();
      }
    });
  }

  get_permission()
	{
      var api = 'admin-api/get-permission';
      this.BackenddbService.getData(api).subscribe((res:any) => {
        if(Object.keys(res).length !==0)
        {
          this.edit_profile = res.permission.edit_profile;
          this.enroll = res.permission.enroll;
          this.access_exercise = res.permission.access_exercise;
          var array = ['set_permission',res];
          this.ds.sendData(array);
        }
      });
	}

  getOtherCongData(){
		const otherData1 = new FormData();
			otherData1.append('set_key','other_config');
			this.BackenddbService.getSetting(otherData1).subscribe(
				res => {
          if(res.status=="success")
          {
            this.otherconfigdata = JSON.parse(res.data['11'].svalue);
            this.web_email = this.otherconfigdata['0'].email;
            this.web_contact = this.otherconfigdata['0'].contact;
          }
         
			
		  });
	
		  
	  }
  setBrowserTitle()
  {
    this.tree = this.router.parseUrl(this.router.url);
    this.fragment = this.tree.fragment;
    this.queryParams = this.tree.queryParams;
    this.primary = this.tree.root.children[PRIMARY_OUTLET];
    if(typeof this.primary=='undefined')
    {
      this.title.setTitle('CyberRange');
    }else
    {
      const s: UrlSegment[] = this.primary.segments;
      if(typeof s[1] == 'undefined')
      {
        this.title.setTitle('CyberRange');
      }else
      {
        this.browser_title.forEach( (myObject:any, index:any) => {
          if(typeof this.browser_title[index][s[1].path]!='undefined')
          {
            this.title.setTitle(this.browser_title[index][s[1].path]);
          }
        });
      }
    }
  }

  getSetting()
  {
    const formData1 = new FormData();
		formData1.append('set_key','credit_system,checkout,request_to_instructor,max_addtobasket_limit,mitre,razor_pay,other_config,google_recaptcha');
		this.BackenddbService.getSetting(formData1).subscribe(
			res => {
				if(res.status=='success')
				{
          var setting = Array.from(Object.keys(res.data), k=>res.data[k]);
          this.setting.emit(setting);
          setting.forEach( (setObj:any, index:any) => {
            if(setObj.skey=="max_addtobasket_limit")
            {
               var svalue = JSON.parse(setObj.svalue);
               if(svalue[0].status=='Active')
               {
                 this.max_add_limit = Number(svalue[0].limit);
               }
            }else if(setObj.skey=='credit_system')
            {
              var svalue = JSON.parse(setObj.svalue);
              if(svalue[0].status=='Active')
              {
                 this.credit_system = svalue[0].status;
              }
            }else if(setObj.skey=='mitre')
            {
              var svalue = JSON.parse(setObj.svalue);
              if(svalue[0].status=='Active')
              {
                 this.mitre_system = svalue[0].status;
              }
            }
            
           });
				}
		});	
  }

  get_wallet()
  {
    this.OrderService.getUserWallet().subscribe((res:any) => {
          if(res.status=='success')
          {
             this.wallet_balance = res.data[0]['credit'];
             this.wallet.emit(res.data[0]);
          }
      });
	}
  assessmentLogin(user_id:any){

    this.progressbar = true;
		const result =	this.AssessmentService.getAssessment().subscribe((res:any) => {
		this.progressbar = false;
		    if(res.status=='success'){
				let  token = res.token; 
				var ass_url = this.access_url+'/LoginWithOutPackage/'+token;
				window.open(ass_url,'_blank');
			}
		});
  }
  get_notification(clear:any)
  {
    const formData = new FormData();
    formData.append('log_user_id', this.logout_every_id); 
    let num = this.start_limit;//number
		var start_limit = num.toString(); // convert to string
    formData.append('log_start_limit', start_limit); 
    let num1 = this.length;//number
		var length = num1.toString(); // convert to string
    formData.append('log_length',length); 

    this.FrontenddbService.getNotification(formData).subscribe(
      res => {
         this.progressbar = false;
        if(res.status=='success')
        {
          if(clear=='Yes')
          {
            this.notification = [];
          }
          res.data.forEach( (myObject:any, index:any) => {

          this.notification.push({'id':res.data[index].id,
                                  'Log_Narration':res.data[index].Log_Narration,
                                  'Slug':res.data[index].Slug,
                                  'date_time':res.data[index].date_time,    
                                  'time_ago':res.data[index].time_ago,
                                });

         });
          //this.notification = Array.from(Object.keys(res.data), k=>res.data[k]);
          var num = Number(res.total_notification);
          this.note_count = num;
        }
      });
  }

  delete_notification(index:any,id:any)
  {
        const formData = new FormData();
        formData.append('log_id', id);  
        this.FrontenddbService.DeleteNotification(formData).subscribe(
          res => {
             //console.log(res); 
             this.get_notification('Yes');
             var count = this.note_count-1; 
             if(count<0)
             {
               this.note_count = 0;
             }else
             {
               this.note_count = count;
             } 
             this.notification.splice(index, 1);
          });

  }

  CallLogOut()
  {
    const formData = new FormData();
    /* here set submitted data in formData object array */
    //console.log(this.logout_every_id);
    formData.append('logout_every_id', this.logout_every_id);
    this.progressbar = true;
    this.loginService.logoutEveryWhere(formData).subscribe(
			res => {
        //console.log(res);
        this.progressbar = false;
			   if(res.status === 'success') {
					this.alertMessage = res.message;
          this.alertClass = 'primary';
          this.logout_every_id = '';     
          this.loginService.logOut();   
          this.chatLogout();
          this.router.navigate(['/login']);
  
        }else {
          this.alertMessage = res.message;
          this.alertClass = 'danger';			       
			  }
			},
			error => this.error = error
		  );
  }

  async chatLogout() {
   
     this.userid = localStorage.getItem('userid');
    
     await  this.ChatService.removeLS()
     .then((removedLs: boolean) => {
      this.ChatService.logout({ userId: this.userid }).subscribe((response: Auth) => {
        
       });
     })
     .catch((error: Error) => {
       alert(' This App is Broken, we are working on it. try after some time.');
       throw error;
     });
 }
  logOut(): void {

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to log off.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.CallLogOut();
      }
    })

   }

   getBasket(message:any,type:any)
   {
    const formData = new FormData();
    formData.append('bt_status','basket');  
    this.OrderService.getBasket(formData).subscribe((res:any) => {
      this.progressbar = false;
      //console.log(res); 
      if(res.status=='success')
      {
         this.basket = Array.from(Object.keys(res.data), k=>res.data[k]);
         this.basket_count = this.basket.length;
         this.added_basket.emit(this.basket);
      }else
      {
        this.basket = [];
        this.basket_count = this.basket.length;
        this.added_basket.emit(this.basket);
      }
      if(message!='')
      {
         Swal.fire('',message,type);
      }
		});	
   }

   removeBasket(id:any)
   {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you really want to remove this exercise?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel'
      }).then((result) => {
          if (result.value) {

            const formData = new FormData();
            formData.append('id',id);
            this.progressbar = true;

            this.OrderService.deleteBasket(formData).subscribe(
              res => {
                //console.log(res);
                if(res.status=='success')
                {
                  this.getBasket('Exercise removed successfully from basket.','success');
                }else
                {
                  this.progressbar = false;
                }
              });
          } 
        })  
   }

   addToBasket(exe_id:any,ex_credit:any) {
    
    if(this.logout_every_id==null)
    {
      Swal.fire({
        text: 'Please login first!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Login Here',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.value) {
          this.router.navigate([`/login`]);
        } 
      })      
      return true;
    }

    var total_add_basket = 1+this.basket.length;
    if(this.max_add_limit!=null && total_add_basket>this.max_add_limit) 
    {
         Swal.fire('',"Sorry! you can add max "+this.max_add_limit+" exericse in basket.","warning");
         return true;
    }     

    const formData = new FormData();
    formData.append('exe_id',exe_id);
    this.progressbar = true;
    
    this.OrderService.addToBasket(formData).subscribe(
			res => {
        //console.log(res);
        if(res.status=='success')
        {
          this.getBasket('','');
        }else
        {
          this.progressbar = false;
        }
        //Swal.fire('Exercise added successfully.');
      });
  }

  resetBasket()
  {
     this.getBasket("","");
  }

  onScroll(event:any)
  {
    let tracker = event.target;

    let limit = tracker.scrollHeight - tracker.clientHeight;
    //console.log(event.target.scrollTop, limit);
    if (event.target.scrollTop === limit) {
       this.start_limit = this.start_limit+this.length;
       this.get_notification('no');
    } 
  }

  background_process()
  {
    if(this.user_id=="") { return true; }
    const formData = new FormData();
    formData.append('update_by', this.user_id);  
    this.BackenddbService.TrackProcess(formData).subscribe(
      res => {
        //console.log(res);
        if(res.status == 'success')
        {
            this.process_array = [];
            var status = '';
            var failstatus = '';
            var callback = '';
            var track_process_id = [];
            var redirect = '';
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
                                      
              if(res.data[index].status=='success')
              {
                status = 'success';
                track_process_id.push(res.data[index].id);

                if(process_data.process_type=='create_admin_template')
                {
                  redirect = this.dashboard_url+'exercise-list/';
                }

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

              var count = this.process_array.length+this.notification.length; 
              if(count<0)
              {
                this.note_count = 0;
              }else
              {
                this.note_count = count;
              } 

            });
            this.bg_process_array.emit(this.process_array);

           // console.log(this.process_array);
            // reload exercise data when process success
            if(status=='success')
            {
              setTimeout( () => { this.loadexercise.emit(); }, 1000 );
              this.delete_track_process(JSON.stringify(track_process_id));
            }else if(failstatus=='Yes')
            {
              setTimeout( () => { this.loadexercise.emit(); }, 1000 );
              this.delete_track_process(JSON.stringify(track_process_id));
            }

            //callback in every 15 sec if process exsit
            if(this.process_array.length!=0 && callback=='Yes')
            {
              setTimeout( () => { this.background_process(); }, 5000 );
            }
        }else
        {
            this.process_array = [];
            this.bg_process_array.emit(this.process_array);
        }
        this.start_limit = 0;
        this.length = 10;
        this.get_notification('Yes');
      }
    );


    //this.process_array.push({'label':'Powering on','status':'Running'});
    //this.loadexercise.emit();
  }

  remove_bgprocss_notify(i:any,id:any)
  {
    var count = this.note_count-1; 
    if(count<0)
    {
      this.note_count = 0;
    }else
    {
      this.note_count = count;
    }
    this.process_array.splice(i, 1);
    var ids = [id];
    this.delete_track_process(JSON.stringify(ids));
  }
  
  delete_track_process(track_process_id:any)
  {
    const formData = new FormData();
    formData.append('track_process_id', track_process_id);  
    this.BackenddbService.DeleteProcess(formData).subscribe(
      res => {
        var track_process_array = JSON.parse(track_process_id)
        var count = this.note_count - track_process_array.length;
        if(count<0)
        {
          this.note_count = 0;
        }else
        {
          this.note_count = count;
        }

        setTimeout( () => { this.background_process(); }, 10000 );
      });
  }


  open_demo_model()
  {
    var array = ['open_demo_model','open'];
    this.ds.sendData(array);
  }

  offerCose() {
    document.getElementById("offer").style.display = "none";
  }
}
