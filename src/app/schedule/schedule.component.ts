import { Component, OnInit,ViewChild,ElementRef,TemplateRef, ViewEncapsulation,ChangeDetectionStrategy, ChangeDetectorRef,OnDestroy  } from '@angular/core';
import { BackenddbService } from '../services/backenddb.service';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {IDatePickerConfig,ISelectionEvent, DatePickerComponent} from 'ng2-date-picker'; 
import { FormGroup,  FormBuilder, FormArray, FormControl, Validators  } from '@angular/forms';
import Swal from 'sweetalert2';
import {noWhitespaceValidator} from '../helper/validatefun';
import { LoginService } from '../services/login.service';
import { DatapassService } from '../services/datapass.service';
import { Subscription } from 'rxjs/Subscription';
import { faBars,faCross,faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./schedule.component.css'],
  changeDetection: ChangeDetectionStrategy.Default

})
export class ScheduleComponent implements OnInit,OnDestroy  {

  @ViewChild('dtpicker') sdate : ElementRef;
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;
   @ViewChild('auto') auto:any;

   faTrash = faTrash;
// If you need to access it in ngOnInit hook
//@ViewChild(TemplateRef, { static: true }) auto: TemplateRef<any>;

  schedule_id:any = '';
  schedule:any = [];	
  allotment_detail:any = [];	
  group_id:string = '';

  start_date:string = '';
  end_date:string = '';
	server_url:string;

  modalRef:any;
  action_type:string = '';

  schedulefrm: FormGroup;
  progressbar: boolean = false;
  subscription: Subscription;
  call_from:string = '';
  id:string = '';
  readonly_start_date:boolean = true;
  config: IDatePickerConfig = {
    format: 'DD-MM-YYYY HH:mm:ss',
    disableKeypress:true,
  };  

  public invite_list:any = [];
  public instructor_list = [];
  keyword = 'name';
  limit_start:any = 0;
  temp_id = [];
  dropdown_instruc_id:string = ''; // assign_instructor_id 
  instructor_selected:boolean = false; // check dropdown selected or not for valication 
  spinner:boolean = false; // show spinner image when dynamin load instructor from db
  disabled_dropdown:boolean = false; // for disable dropdown
  initial_value:string = ""; //  default selected value

  error_messages = {
    'title': [
    { type: 'required', message: 'Title is required' },
    ],  
    'description': [
      { type: 'required', message: 'Description is required' },
      ], 
      'invite_email': [
        { type: 'email', message: 'Valid Email required' },
        ],    
      
  }

  constructor(
    private modal: NgbModal,
    private BackenddbService:BackenddbService,
    private dtchange: ChangeDetectorRef,
    private fb:FormBuilder,
    private loginService: LoginService,
    private ds: DatapassService,
  ) {
    this.server_url = this.loginService.getServerUrl();
    this.group_id = this.loginService.getLoginGroup();
   }

  ngOnInit(): void {
    this.schedulefrm = this.fb.group({
      start_date: '',
      end_date:'',
      title: ['', [Validators.required,noWhitespaceValidator]],
      description:['', [Validators.required,noWhitespaceValidator]],
      invite_email:''
		})
    this.getSubsData();
    this.instructor_list = [];
    const formData = new FormData();
    formData.append('search','');
    formData.append('limit_start',this.limit_start);
    this.getUserList(formData,'');
  }

  ngOnDestroy(): void {
    this.modalRef = null;
    this.modal = null;
  }  
  
 
  getSubsData()
  {
    this.subscription = this.ds.getData().subscribe(x => { 
      this.call_from = '';
      this.id = '';
      this.invite_list = [];
      if(x[0]=='AddSchedule')
      {
        this.action_type = x[0];
        this.call_from = x[1]['call_from'];
        if(this.call_from=='demo_list')
        {
          this.id = x[1]['id'];
          this.invite_list.push(x[1]['email']);
        }
        this.addEvent();
      }else if(x[0]=='EditSchedule')
      {
        this.schedule_id = x[1]['schedule_id'];
        this.call_from = x[1]['call_from'];
        this.action_type = x[0];
        this.getSchedule();
      }else if(x[0]=='DeleteSchedule')
      {
        this.schedule_id = x[1]['schedule_id'];
        this.call_from = x[1]['call_from'];
        this.action_type = x[0];
        if(this.call_from=='demo_list')
        {
          this.id = x[1]['id'];
        }
        this.deleteSchedule();
      }else if(x[0]=='ViewSchedule')
      {
        this.schedule_id = x[1]['schedule_id'];
        this.call_from = x[1]['call_from'];
        this.action_type = x[0];
        this.getSchedule();
      }else if(x[0]=='ViewAllotment')
      {
        this.schedule_id = x[1]['schedule_id'];
        this.call_from = x[1]['call_from'];
        this.action_type = x[0];
        this.ViewMoreDetail(this.schedule_id);
      }
    });
  }

  getSchedule()
  {
    this.progressbar = true;
    const formData = new FormData();
    this.schedule = [];
    formData.append('schedule_id',this.schedule_id);
    var api = 'candidate-api/get-schedule';
    this.BackenddbService.postData(api,formData).subscribe((res:any) => {
      this.progressbar = false;
      if(res.data.length!=0)
      {
        this.schedule = res.data;
        this.schedulefrm.patchValue({
          title:res.data.title,
          description:res.data.description,
        });

        this.start_date = res.data.start_date;
        this.end_date = res.data.end_date;
        this.invite_list = res.data.invite;
        this.modalRef = this.modal.open(this.modalContent , {ariaLabelledBy: 'modal-basic-title', size: 'lg'});
      }
    });
  }

  ViewMoreDetail(id:any)
  {
		this.progressbar = true;
		const formData = new FormData();
		formData.append('allot_id',id);
    var api = 'admin-api/get-allotment-detail';
		this.BackenddbService.postData(api,formData).subscribe((res:any) => {
      this.progressbar = false;
      if(res.status=='success')
      {
        this.allotment_detail =res.data;
        this.modalRef = this.modal.open(this.modalContent , {ariaLabelledBy: 'modal-basic-title', size: 'lg'});
      }else if(res.status=='error')
      {
        Swal.fire('',res.message,'warning');
      } 
    });  

  }

  deleteSchedule()
  {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you really want to delete schedule.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel'
      }).then((result) => {
      if(result.value)
      {
        this.progressbar = true;
        const formData = new FormData();
        formData.append('schedule_id',this.schedule_id);
        formData.append('call_from',this.call_from);
        if(this.id!='')
        {
          formData.append('id',this.id);
        }
        var api = 'candidate-api/delete-schedule';
        this.BackenddbService.postData(api,formData).subscribe((res:any) => {
          this.progressbar = false;
          if(res.status=='error')
          {
            Swal.fire('',res.message,'warning');
          }else if(res.status=='success')
          {
             Swal.fire('',res.message,'success');
             if(this.call_from=='calendar')
             {
               var array = ['reloadCalendar'];
             }else if(this.call_from=='demo_list')
             {
               var array = ['reloadDemoList'];
             }
             this.ds.sendData(array);
          }
        });  
      }
    });
  }

  update_schedule(data:any)
  {
    if(this.schedulefrm.valid) 
    {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you really want to schedule.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel'
      }).then((result) => {
      if(result.value)
      {
        this.progressbar = true;
        const formData = new FormData();
        formData.append('schedule_id',this.schedule_id);
        formData.append('title',data.title);
        formData.append('start_date',data.start_date);
        formData.append('end_date',data.end_date);
        formData.append('description',data.description);
        formData.append('call_from',this.call_from);
        if(this.id!='')
        {
          formData.append('id',this.id);
        }        

        if(this.invite_list.length!=0)
        {
          formData.append('invite',JSON.stringify(this.invite_list));
        }else
        {
          formData.append('invite','');
        }

        var api = 'candidate-api/update-schedule';
        this.BackenddbService.postData(api,formData).subscribe((res:any) => {
          this.progressbar = false;
          if(res.status=='error')
          {
            Swal.fire('',res.message,'warning');
          }else if(res.status=='success')
          {
             Swal.fire('',res.message,'success');
             this.modalRef.close();	
             if(this.call_from=='calendar')
             {
               var array = ['reloadCalendar'];
             }else if(this.call_from=='demo_list')
             {
               var array = ['reloadDemoList'];
             }
             this.ds.sendData(array);
          }
        });  
      }
    });

  }else
  {
    this.validateAllFormFields(this.schedulefrm); // check validation
  }
         
  }

  addEvent(): void {
    this.getCurrentDate();
    this.schedule_id = '';
    this.action_type = 'AddSchedule';
    this.schedulefrm.patchValue({
      title:'',
      description:'',
      invite_email:''
    });
     this.end_date = '';
    this.modalRef = this.modal.open(this.modalContent, {ariaLabelledBy: 'modal-basic-title', size: 'lg'});
  }

  getCurrentDate()
  {
    var api = 'candidate-api/get-current-date';
    this.BackenddbService.getData(api).subscribe((res:any) => {
      this.start_date = res.date;
      this.end_date = '';
    });  
  }

  setDatetime(data: ISelectionEvent,type:any,ex_id:any)
  {
  } 


  getUserList(formData:any,selected:any)
  {
    var api = 'candidate-api/get-user-dropdown';
    this.BackenddbService.postData(api,formData).subscribe(
      res => {
        res.forEach( (myObject:any, index:any) => {
          let abc = this.instructor_list.find(ob => ob['id'] === res[index].U_ID);
          if(typeof(abc) ==='undefined')
          {
            this.instructor_list.push({id:res[index].U_ID,name:res[index].eMail});
            if(selected=='Yes')
            {
              this.initial_value = res[index].eMail;
              this.dropdown_instruc_id = res[index].U_ID;
            }
          }
        });
        if(res.length>0)
        {
          this.limit_start = this.limit_start+10;
        }
       // this.auto.open();
      });
  }

  selectEvent(item:any) {
     this.dropdown_instruc_id = item.id; //assign instructor id when choose in instructor dropdown
  }

  clearForm()
  {

  }

  onFocused(e:any) {
    this.instructor_selected = false;
  }

  inputCleared(event:any){
    if(typeof(event) ==='undefined')
    {
      this.dropdown_instruc_id = '';
      this.instructor_selected = false;
      this.clearForm();
    }

  }

  inputChanged(keyword:any){
    this.spinner = true;
    this.instructor_selected = false;

    const formData = new FormData();
    formData.append('search',keyword);
    var api = 'candidate-api/get-user-dropdown';
    this.BackenddbService.postData(api,formData).subscribe(
      res => {
        res.forEach( (myObject:any, index:any) => {
          let abc = this.instructor_list.find(ob => ob['id'] === res[index].U_ID);
          if(typeof(abc) ==='undefined')
          {
            this.instructor_list.push({id:res[index].U_ID,name:res[index].eMail});
          }
        });
        this.spinner = false;
        //this.auto.open();
      });
  }

  scrolledToEnd(item:any) {
        this.spinner = true;
        this.instructor_selected = false;
        const formData = new FormData();
        formData.append('search','');
        formData.append('limit_start',this.limit_start);
        var api = 'candidate-api/get-user-dropdown';
        this.BackenddbService.postData(api,formData).subscribe(
          res => {
            res.forEach( (myObject:any, index:any) => {
              let abc = this.instructor_list.find(ob => ob['id'] === res[index].U_ID);
              if(typeof(abc) ==='undefined')
              {
                this.instructor_list.push({id:res[index].U_ID,name:res[index].eMail});
              }
            });
            if(res.length>0)
            {
              this.limit_start = this.limit_start+10;
            }
            this.spinner = false;
           // this.auto.open();
          });
   
 }

 isValidMailFormat(control:any){
  let EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

  if (control != "" && (control.length <= 5 || !EMAIL_REGEXP.test(control))) {
    Swal.fire('','Invalid email','warning');
    return false;
  }

  return true;
}

 add_invite(data:any)
 {
     var email = '';
     if(this.dropdown_instruc_id!='')
     {
       email = this.dropdown_instruc_id;
     }else if(data.invite_email!='')
     {
      email = data.invite_email;
     }

     if(email=='')
     {
      Swal.fire('','Select invite first!','warning');
      return false;
     }

     let temp = this.instructor_list.find(ob => ob['id'] === email);
     if(typeof(temp) !='undefined')
     {
         let invite = this.invite_list.find(ob => ob === temp['name']);
         if(typeof(invite) ==='undefined')
         {
            this.invite_list.push(temp['name']);
         }else
         {
          Swal.fire('',temp['name']+' has been already added.','warning');
         }  
       this.dropdown_instruc_id = '';
     }else if(email!='' && email!=null)
     {
        var valid = this.isValidMailFormat(data.invite_email);
        if(valid==false)
        {
          return "";
        }

        let invite = this.invite_list.find(ob => ob === email);
        if(typeof(invite) ==='undefined')
        {
          this.invite_list.push(email);
        }else
        {
           Swal.fire('',email+' has been already added.','warning');
        }  
        this.dropdown_instruc_id = '';
     }
     
     this.schedulefrm.patchValue({
      invite_email:''
    });

     
}

removeInvite(email:any)
{
  let index = this.invite_list.findIndex(x => x == email)
  this.invite_list.splice(index,1);
}


  get f() { return this.schedulefrm.controls; }

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

}
