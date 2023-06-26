import { Component, OnInit,Input,Output, EventEmitter,HostListener } from '@angular/core';
import { BackenddbService } from '../../services/backenddb.service';
import { Title } from '@angular/platform-browser';
import { Auth } from './../../interfaces/auth';
import { Router, UrlTree, UrlSegment, UrlSegmentGroup, PRIMARY_OUTLET, DefaultUrlSerializer, RouterState, ActivatedRoute } from '@angular/router';
import { ChatService } from '../../services/chat.service';
import { LoginService } from '../../services/login.service';
import { OrderService } from '../../services/order.service';

import { faUserCircle, faBell, faEnvelope, faPhone, faPhoneSquare, faSign, faShoppingBasket, faTimesCircle, faWallet } from '@fortawesome/free-solid-svg-icons';
import { Subject, BehaviorSubject } from 'rxjs';
import { DatapassService } from '../../services/datapass.service';
import { Subscription } from 'rxjs/Subscription';

import Swal from 'sweetalert2'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
 // @Input() current_url_array: Array<any>;
  @Input() process_id: string;
  @Input() side: string;
  @Input() fun: string;
  @Input() process_notifier: Subject<any> = new Subject<any>();
  @Input() resetHeaderData: Subject<any> = new Subject<any>();
  
  @Output() setting: EventEmitter <any> = new EventEmitter<any>();
  @Output() wallet: EventEmitter <any> = new EventEmitter<any>();
  bgProcessNotifier : Subject<any> = new Subject<any>();

  subscription: Subscription;

  @HostListener('scroll', ['$event'])
  
  task: string = 'background_process';
  value:string = '';

	/* Icon */
	faUserCircle = faUserCircle;
	faBell = faBell;
	faEnvelope = faEnvelope;
	faPhone = faPhone;
	faPhoneSquare = faPhoneSquare;
	faSign = faSign;	
	faShoppingBasket = faShoppingBasket; 
	faTimesCircle = faTimesCircle;
  faWallet = faWallet;
  userid:string='';
	loginName:string;
	loginGroupId:string;
  user_id:string;

  //notification
  notification = [];

  // alert box
	alertMessage: string;
	alertClass: string;
  error: string;
  confirm:any = false;
  
  result:any;
  
  //verifySession:boolean = false;
  verifySession:any;
  site_Url:string;
  dashboard_url:string;

  //notification count
  note_count:number = 0;

  //notification
  start_limit = 0;
  length = 10;

  wallet_balance:number = 0;
  total_credits:number = 0;
  credit_system:string = 'Inactive'; 

  // for background process bar show
  process_array = [];
  // for browser title
  browser_title = [
                    {'dashboard':'CyberRange - Dashboard'},
                    {'resource':'CyberRange - Resource'},
                    {'resource-list':'CyberRange - Resource List'},
                    {'roles':'CyberRange - Roles'},
                    {'roles-list':'CyberRange - Roles List'},
                    {'exercise':'CyberRange - Exercise Creation'},
                    {'user-profile':'CyberRange - User Profile'},
                    {'user-list':'CyberRange - User List'},
                    {'team-type':'CyberRange - Team Type'},
                    {'team-type-list':'CyberRange - Team Type List'},
                    {'team':'CyberRange - Team'},
                    {'team-list':'CyberRange - Team List'},
                 ];

  objectkeys = Object.keys;
  url = '';
  tree: UrlTree;
  fragment = '';
  queryParams = {};
  // primary outlet
  primary: UrlSegmentGroup;
  server_url:string;
  
  constructor(
   // private titleService: Title, 
    private loginService: LoginService,
    private BackenddbService: BackenddbService,
    private router: Router,
    private title: Title,
    private ChatService:ChatService,
    private OrderService:OrderService,
    private ds: DatapassService
  ) {

    this.setBrowserTitle();

    this.site_Url = this.loginService.siteUrl;
	  this.server_url = this.loginService.getServerUrl();

    this.dashboard_url = this.loginService.getDashboardUrl();
    this.loginName = this.loginService.getLoginName();
    this.loginGroupId = this.loginService.getLoginGroup();
    this.user_id = this.loginService.getUserId();

    this.background_process();
    this.getSetting();
    this.get_wallet();
 
  }

  ngOnInit() {
 
    this.subscription = this.ds.getData().subscribe(x => { 
      if(x=='background_process')
      {
          this.background_process();
      }else if(x=='resetWallet')
      {
          this.get_wallet();
          this.get_notification('Yes');
      }else if(x=='notification')
      {
          this.get_notification('Yes');
      }else if(x=='setting')
      {
          this.getSetting();
      }
    });
    
    this.process_notifier.subscribe(
      data => {
          if(data=='background_process')
          {
            this.background_process();
          }
        }
      );

      this.resetHeaderData.subscribe(
        data => {
            if(data=='resetWallet')
            {
              this.get_wallet();
              this.get_notification('Yes');
            }
          }
        );

  }

  setBrowserTitle()
  {
    this.tree = this.router.parseUrl(this.router.url);
    this.fragment = this.tree.fragment;
    this.queryParams = this.tree.queryParams;
    this.primary = this.tree.root.children[PRIMARY_OUTLET];
    const s: UrlSegment[] = this.primary.segments;

    this.browser_title.forEach( (myObject:any, index:any) => {
      if(typeof this.browser_title[index][s[1].path]!='undefined')
      {
        this.title.setTitle(this.browser_title[index][s[1].path]);
      }
    });
  }

  get_wallet()
  {
    this.OrderService.getUserWallet().subscribe((res:any) => {
          if(res.status=='success')
          {
             this.wallet_balance = res.data[0]['credit'];
             var array = ['wallet',res.data[0]];
             this.ds.sendData(array);
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
            if(setObj.skey=='credit_system')
            {
              var svalue = JSON.parse(setObj.svalue);
              if(svalue[0].status=='Active')
              {
                 this.credit_system = svalue[0].status;
              }
            }
           });
           var array = ['setting',setting];
           this.ds.sendData(array);
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

  delete_notification(index:any,id:any)
  {
        const formData = new FormData();
        formData.append('log_id', id);  
        this.BackenddbService.DeleteNotification(formData).subscribe(
          res => {
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

  get_notification(clear:any)
  {
    this.user_id = this.loginService.getUserId();
    const formData = new FormData();
    formData.append('log_user_id', this.user_id); 
    let num = this.start_limit;//number
		var start_limit = num.toString(); // convert to string
    formData.append('log_start_limit', start_limit); 
    let num1 = this.length;//number
		var length = num1.toString(); // convert to string
    formData.append('log_length',length); 

    this.BackenddbService.getNotification(formData).subscribe(
      res => {
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
          var num = Number(res.total_notification);
          this.note_count = num+this.process_array.length;
        }
      });
  }

  onScroll(event:any)
  {
    let tracker = event.target;
    let limit = tracker.scrollHeight - tracker.clientHeight;
    if (Math.round(event.target.scrollTop) === limit) {
       this.start_limit = this.start_limit+this.length;
       this.get_notification('no');
    } 
  }

  getArchivedCsv()
  {

    this.BackenddbService.getData('admin-api/get-archived-csv').subscribe((res:any) => {
        console.log(res);
        if(res.status=='success')
        {
          const link = document.createElement('a');
          link.setAttribute('target', '_blank');
          link.setAttribute('href', res.url);
          link.setAttribute('download', '');
          document.body.appendChild(link);
          link.click();
          link.remove();
        }
      })
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
                if(res.data[index].process_type=='export_archived_list')
                {
                  this.getArchivedCsv(); 
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

            var array = ['set_process_array',this.process_array];
            this.ds.sendData(array);

           // this.bg_process_array.emit(this.process_array);

           // console.log(this.process_array);
            // reload exercise data when process success
            if(status=='success')
            {
              setTimeout( () => { 
                var array = ['reloadExercise',''];
                this.ds.sendData(array);
              }, 1000 );
              this.delete_track_process(JSON.stringify(track_process_id));
            }else if(failstatus=='Yes')
            {
              setTimeout( () => {
                var array = ['reloadExercise',''];
                this.ds.sendData(array);
               }, 1000 );
              this.delete_track_process(JSON.stringify(track_process_id));
            }

            //callback in every 15 sec if process exsit
            if(this.process_array.length!=0 && callback=='Yes')
            {
              setTimeout( () => { this.background_process(); }, 12000 );
            }
        }else
        {
            this.process_array = [];
            var array = ['set_process_array',this.process_array];
            this.ds.sendData(array);
        }
        this.start_limit = 0;
        this.length = 10;
        this.get_notification('Yes');
      }
    );

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

  CallLogOut()
  {
    this.ds.Loader(true);
    const formData = new FormData();
    /* here set submitted data in formData object array */
    formData.append('logout_every_id', this.user_id);
    this.loginService.logoutEveryWhere(formData).subscribe(
			res => {
        //console.log(res);
        this.ds.Loader(false);
        this.alertMessage = res.message;
			   if(res.status === 'success') {
          this.alertClass = 'primary';
          this.user_id = '';     
          this.loginService.logOut();   
          this.chatLogout();
          this.router.navigate(['/login']);
        }else {
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
  
  redirect(strurl:any)
  {
    if(strurl == 'my-transactions' || strurl == 'my-calendar')
    {
      strurl = this.site_Url+strurl;
    }else
    {
      strurl = this.dashboard_url+strurl;
    }     

    this.router.navigate([strurl]);
  }
}