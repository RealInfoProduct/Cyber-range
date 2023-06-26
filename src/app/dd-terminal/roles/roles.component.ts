import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, QueryList, ViewChildren } from '@angular/core';
import { FormGroup,  FormBuilder, FormControl, Validators  } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { BackenddbService } from '../../services/backenddb.service';

import { Router, ActivatedRoute } from '@angular/router';

import {noWhitespaceValidator} from '../../helper/validatefun';

import { faBars } from '@fortawesome/free-solid-svg-icons'; 

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {
 
	faBars = faBars;

	public _opened: boolean = true; 
	public _toggleSidebar() {
		this._opened = !this._opened;
	}  


  /*instructor dropdown */
  @ViewChild('auto') auto:any;
  limit_start:any = 0; // start limit in select query
  keyword = 'name';
  public instructor_list = []; // store instuctor
  temp_id = [];
  dropdown_instruc_id:string = ''; // assign_instructor_id 
  instructor_selected:boolean = false; // check dropdown selected or not for valication 
  spinner:boolean = false; // show spinner image when dynamin load instructor from db
  disabled_dropdown:boolean = false; // for disable dropdown
  initial_value:string = ""; //  default selected value

  /* alert message */
  closed: boolean = true;
  alertMessage: string;
  alertClass: string;

  /* flash message */
  messageArray = {  
    type: "",  
    message: "",  
  }; 
  stringifiedData: any; 
  msgalert:any;

  error: string;
  rolesfrm:FormGroup;
  submitted:boolean = false;
  progressbar:boolean = false;
  update_by:string;
  group_id:string;
  role_id:string;
  form_title:any = 'Allocate Roles';
  dashboard_url:string;
  server_url:string;

  isChecked_create_team:boolean = false;
  isChecked_create_exe:boolean = false;
  isChecked_allocate_exe_user:boolean = false;

  /*breadcrumbs array */
  current_url_array = [];
  
  error_messages = {
    'create_exercise': [
      { type: 'required', message: 'Create Exercise is required.' },
    ],
    'create_team': [
      { type: 'required', message: 'Create Team is required.' },
    ],
    'allocate_exercise_user': [
      { type: 'required', message: 'Allocate Exercise User is required.' },
    ]
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private loginService: LoginService,
    private BackenddbService: BackenddbService,
    private formBuilder: FormBuilder,
  ) { 
		this.getFlashMessage();
		this.server_url = this.loginService.getServerUrl();
		this.dashboard_url = this.loginService.getDashboardUrl();
		this.group_id = this.loginService.getLoginGroup();
		this.update_by = this.loginService.getUserId();     
  }

  ngOnInit() {

    this.role_id = this.route.snapshot.paramMap.get('id');
    const formData = new FormData();
    formData.append('role_id', this.role_id);
    formData.append('update_by', this.update_by);
   
    if(this.role_id!=null)
    {
		this.current_url_array = [
        {'slug':"instructor-permission",'label':'Instructor Permission'},
        {'slug':"",'label':'Edit Roles'}
      ];
	  
      this.disabled_dropdown = true;

      this.form_title = "Edit Roles";
      this.progressbar = true;
      this.BackenddbService.getRoles(formData).subscribe(
        res => {
         //console.log(res);
         this.progressbar = false;
         if(res==null)
         {
            this.router.navigate([this.dashboard_url+'roles-list']);
            return true;
         }

         const formData = new FormData();
         formData.append('instructor_id',res.instructor_id);
         this.loadInstructorDropDownData(formData,'Yes');

        // this.team_name = res.team_name // for team assign model in show team name
        if(res.create_team=='true')
        {
           this.isChecked_create_team = true
        }
        if(res.create_exercise=='true')
        {
           this.isChecked_create_exe = true
        } 
        if(res.allocate_exercise_user=='true')
        {
           this.isChecked_allocate_exe_user = true
        }                  

          this.rolesfrm.patchValue({
               create_team: this.isChecked_create_team,
               create_exercise: this.isChecked_create_exe,
               allocate_exercise_user: this.isChecked_allocate_exe_user,
          });
        });     
    }else
    {
		this.current_url_array = [{'slug':"",'label':'Allocate Roles'}];
		
      this.form_title = "Allocate Roles";
      formData.append('limit_start',this.limit_start);
      this.loadInstructorDropDownData(formData,'No');
    }

    /* set form validation */ 
      this.rolesfrm = this.formBuilder.group({
        create_exercise: ['', [Validators.required]],
        create_team: ['', [Validators.required]],
        allocate_exercise_user: ['', [Validators.required]],
    });

  }
  
  loadInstructorDropDownData(formData:any,selected:any)
  {

    this.BackenddbService.getInstructorDropDownList(formData).subscribe(
      res => {
        console.log(res);
        res.forEach( (myObject:any, index:any) => {
          let abc = this.instructor_list.find(ob => ob['id'] === res[index].U_ID);
          if(typeof(abc) ==='undefined')
          {
            this.instructor_list.push({id:res[index].U_ID,name:res[index].F_Name+" "+res[index].L_Name+" - "+res[index].eMail});
            if(selected=='Yes')
            {
              this.initial_value = res[index].F_Name+" "+res[index].L_Name+" - "+res[index].eMail;
              this.dropdown_instruc_id = res[index].U_ID;
             // console.log(this.initial_value);
            }
          }
        });
        if(res.length>0)
        {
          this.limit_start = this.limit_start+10;
        }
        //this.auto.focus();
      });
  }

  

  selectEvent(item:any) {
    this.dropdown_instruc_id = item.id; //assign instructor id when choose in instructor dropdown
    this.instructor_selected = false;

    this.progressbar = true;
    const formData = new FormData();
    formData.append('instructor_id', item.id);
    var api = 'admin-api/get-roles';
    this.BackenddbService.postData(api,formData).subscribe(
      res => {
        console.log(res);
        this.progressbar = false;
        if(res != null)
        {
            if(res.create_team=='true')
            {
              this.isChecked_create_team = true;
            }
            if(res.create_exercise=='true')
            {
              this.isChecked_create_exe = true;
            } 
            if(res.allocate_exercise_user=='true')
            {
              this.isChecked_allocate_exe_user = true;
            }  
            this.role_id = res.id;                
        }else
        {
            this.isChecked_create_team = false;
            this.isChecked_create_exe = false;
            this.isChecked_allocate_exe_user = false;
            this.role_id = null;
        }

        this.rolesfrm.patchValue({
          create_team: this.isChecked_create_team,
          create_exercise: this.isChecked_create_exe,
          allocate_exercise_user: this.isChecked_allocate_exe_user,
      });

      }); 

  }

  onFocused(e:any) {
    this.instructor_selected = false;
  }

  inputCleared(event:any){
    if(typeof(event) ==='undefined')
    {
      this.dropdown_instruc_id = '';
      this.instructor_selected = false;
    }

  }

  inputChanged(keyword:any){
    this.spinner = true;
    this.instructor_selected = false;

    const formData = new FormData();
    formData.append('search',keyword);
    this.BackenddbService.getInstructorDropDownList(formData).subscribe(
      res => {
        res.forEach( (myObject:any, index:any) => {
          let abc = this.instructor_list.find(ob => ob['id'] === res[index].U_ID);
          if(typeof(abc) ==='undefined')
          {
            this.instructor_list.push({id:res[index].U_ID,name:res[index].F_Name+" "+res[index].L_Name+" - "+res[index].eMail});
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
        this.BackenddbService.getInstructorDropDownList(formData).subscribe(
          res => {
            console.log(res);
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
            this.spinner = false;
            this.auto.open();
          });
   
 }

 addNewRoles(formData:any)
  {
    this.progressbar = true;
    this.BackenddbService.addNewRoles(formData).subscribe(
      res => {
          console.log(res);
          if(res.status == 'success')
          {
            this.closed = false;
            this.progressbar = false;
            this.setFlashMessage('primary',res.message);
            this.router.navigate([this.dashboard_url+'roles/'+res.insert_role_id]);
          }else if(res.status === 'error')
          {
            this.alertMessage = res.message;
            this.alertClass = 'danger'; 
            this.closed = false;
            this.progressbar = false;
          }
      },
      error => this.error = error
    )
  }

  updateRoles(formData:any)
  {
    this.progressbar = true;
    this.BackenddbService.UpdateRoles(formData).subscribe(
      res => {
          console.log(res);
          if(res.status == 'success')
          {
            this.alertMessage = res.message;
            this.alertClass = 'primary'; 
            this.closed = false;
            this.progressbar = false;
          }else if(res.status === 'error')
          {
            this.alertMessage = res.message;
            this.alertClass = 'danger'; 
            this.closed = false;
            this.progressbar = false;
          }
      },
      error => this.error = error
    )

  }

  onSubmit(data:any) {

    if(this.dropdown_instruc_id=="")  // validation for instructor dropdown
    {
      this.instructor_selected = true;
      return true;
    }  
  
          const formData = new FormData();
          this.closed = true;
          //this.progressbar = true;
          formData.append('role_id', this.role_id);
          formData.append('update_by', this.update_by);
          formData.append('update_by_group', this.group_id);
          
          formData.append('instructor_id', this.dropdown_instruc_id);
          formData.append('create_exercise', data.create_exercise);
          formData.append('create_team', data.create_team);
          formData.append('allocate_exercise_user', data.allocate_exercise_user);

          /* check if user_id null then insert new user */
          if(this.role_id==null)  
          {
            this.addNewRoles(formData);  /*insert new user*/
          }else
          { 
            this.updateRoles(formData);  /*update existing user*/
          }
        
      
    
  }

  
 get f() { return this.rolesfrm.controls; }

 
  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      //console.log(field);
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }
   
  setFlashMessage(type:any,message:any)
  {
    this.messageArray.type = type;
    this.messageArray.message = message;
    this.stringifiedData = JSON.stringify(this.messageArray);   
    this.loginService.setflashMessage(this.stringifiedData);
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

  

}