//import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, QueryList, ViewChildren } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient,HttpParams  } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BackenddbService } from '../../services/backenddb.service';
import { FrontenddbService } from '../../services/frontenddb.service';

import { LoginService } from '../../services/login.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

import { FormGroup,  FormBuilder, FormArray, FormControl, Validators  } from '@angular/forms';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2';
import {noWhitespaceValidator} from '../../helper/validatefun';
import { ChatService } from '../../services/chat.service';
import { faUser, faEdit, faTrash, faUsers, faEye } from '@fortawesome/free-solid-svg-icons';

import { DatapassService } from '../../services/datapass.service';
import { Subscription } from 'rxjs/Subscription';
declare const activesidebar:any;

class Team {
  id: number;
  firstName: string;
  lastName: string;
}

class Candidate {
  id: number;
  firstName: string;
  lastName: string;
}

class DataTablesResponseCandidate {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  param:any;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  param:any;
}
declare var $ : any;
@Component({
  selector: 'app-teamlist',
  templateUrl: './teamlist.component.html',
  styleUrls: ['./teamlist.component.css']
})
export class TeamlistComponent implements OnInit {
  viewProfile : Subject<any> = new Subject<any>();
  subscription: Subscription;
	faUser = faUser;
	faEdit = faEdit;
	faTrash = faTrash;	
	faUsers = faUsers;	
	faEye = faEye;	

  public _opened: boolean = true; 
	public _toggleSidebar() {
		this._opened = !this._opened;
	} 
	
  /* datatable */
  @ViewChildren(DataTableDirective)
  dtElements: QueryList<DataTableDirective>;
  dtOptions: DataTables.Settings[] = [];
  dtTrigger = new Subject(); 
  dtCandidateTrigger = new Subject();
  teams: Team[];
  candidates: Candidate[];
  serverUrl = environment.baseUrl;
  lessons:boolean = true;

  // user profile photo
  croppedImage: any = '';

  /*flash message*/
  msgalert:any;
  
  /*breadcrumbs array */
  current_url_array = [];

  formdata: FormGroup;
  assginTeamFrm: FormGroup;
  group_id:string = '';
  team_status:string = '';
  modalfadeclass:string = "";
  modalshow:string = "";
  error: string;
  closed: boolean = true;
  closedpopop: boolean = true;
  alertMessage: string;
  alertClass: string;
  update_by:string;
  statusList = [];
  teamTypeList = [];
  languageList = [];
  genderList = [];
  team_type:string = '';
  closeResult = '';
  checkArray: FormArray;
  candidate_table:boolean = false;

  dashboard_url:string; 
  my_team:string = '';

  /*assign team to user*/
  assign_team_id:string = '';
  assign_team_name:string = '';
  assign_instructor_id:string = '';
  assign_team_instr_name:string = '';
  assign_team_create_by:string = '';
  assign_team_create_datetime:string = '';
  assign_team_datetime:string = '';


  responseTableArray = [];  // store return response when team assign to candidate 


  /* instructor roles */
  inst_create_team:boolean = false;
  inst_allocate_exercise_user:boolean = false;

  server_url:string;

  searchVal = '';
  searchcandiVal = '';
  
  constructor(
    private http: HttpClient,
    private router: Router,
    private BackenddbService: BackenddbService,
    private LoginService: LoginService,   
    private FrontenddbService: FrontenddbService,   
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private ChatService :ChatService,
    private ds: DatapassService

    ) {
        this.update_by = this.LoginService.getUserId();
        this.group_id = this.LoginService.getLoginGroup();
        this.dashboard_url = this.LoginService.getDashboardUrl();
		
		this.server_url = this.LoginService.getServerUrl();

        if(this.group_id=='2') // here check insturctor 
        {
            /* Here get roles of instructor */
            const formData = new FormData();
            formData.append('instructor_id', this.update_by);    //login instructor id
            this.BackenddbService.getRoles(formData).subscribe(
              res => {
                if(res != null && res.create_team=="true")  // check instrutor have create team role
                {
                  this.inst_create_team = true;
                }else
                {
                  this.inst_create_team = false;
                }
                if(res != null && res.allocate_exercise_user=="true")  // check instrutor have create team role
                {
                  this.inst_allocate_exercise_user = true;
                }else
                {
                  this.inst_allocate_exercise_user = false;
                }
              });
        }else
        {
          this.inst_create_team = true;
          this.inst_allocate_exercise_user = true;
        }

        this.getFlashMessage();

        status = '';
        this.BackenddbService.getTeamTypeList(status).subscribe((data:any) => {
          this.teamTypeList = Array.from(Object.keys(data), k=>data[k]);
         // console.log(this.teamTypeList);
          });          

    /* get status list from CI */   
    this.BackenddbService.getStatusList().subscribe((data:any) => {
      this.statusList = Array.from(Object.keys(data), k=>data[k]);
      }); 

      this.FrontenddbService.getLanguageList().subscribe((data:any) => {
        this.languageList = data;
      });   
      this.FrontenddbService.getGenderList().subscribe((data:any) => {
        this.genderList = data;
      });      
      



    }

	form_title:any = 'Team List';
	
		ngOnInit(): void {
      activesidebar(); 
      this.subscription = this.ds.getData().subscribe(x => { 
        if(x[0]=='set_permission')
        {
          this.set_permission(x[1]);
        }
      });

		this.formdata = this.formBuilder.group({
		  status: [null],
		  team_type: [null],
      team_members:'',
      team_id:'',
      candidate_id:'',
      is_assign:''
		});

		this.assginTeamFrm = this.formBuilder.group({
		  team: [null, [Validators.required,noWhitespaceValidator]],
		  candidate_id: this.formBuilder.array([], [Validators.required])
		});    
		this.createTeamTable();
		this.create_candidate_table();
		
		this.current_url_array = [
			{'slug':"",'label':'Team List'}
		  ];

	}

  createTeamTable()
  {
       /* user data table */
       const that = this;
       this.dtOptions[1] = {
         dom: '<"top">tr<"bottom"ilp><"clear">',
         pagingType: 'full_numbers',
         pageLength: 10,
         serverSide: true,
         processing: true,
         order: [[ 0, "desc" ]],
         ajax: (dataTablesParameters: any, callback:any ) => {
   
           let params = new HttpParams();
           let startNumber: any;
   
           startNumber = dataTablesParameters.start;
           if (startNumber != 0) {
             startNumber = startNumber + 1
           } else {
             startNumber = startNumber;
           }

           params = params.append("start", startNumber);
           params = params.append("length", dataTablesParameters.length);
           params = params.append("draw", dataTablesParameters.draw);
           params = params.append("search", this.searchVal);
           params = params.append("order_col", dataTablesParameters.order[0].column);
           params = params.append("order_type", dataTablesParameters.order[0].dir);        
           params = params.append("status", this.team_status);
           params = params.append("team_type", this.team_type);
           params = params.append("team_assign_instructor", this.my_team);
   
           let param = params.toString();
           that.http
             .post<DataTablesResponse>(
               this.serverUrl+'datatable-api/get-team-list',
               params, {}
             ).subscribe(resp => {
   
               console.log(resp);
   
               that.teams = resp.data;
   
               callback({
                 recordsTotal: resp.recordsTotal,
                 recordsFiltered: resp.recordsFiltered,
                 data: []
               });
             });
         },
         columns: [{ data: 's_no' }, { data: 'team_unique_id' }, { data: 'team_name' },  { data: 'team_type' },  { data: 'team_created_by' }, { data: 'team_assign_instructor' }, { data: 'team_datetime' }]
       };
       //this.create_candidate_table();
  }

  datatableSearch(event){
    this.searchVal  = event.target.value; 
    this.rerender_datatable('team-table');
  }

  ngAfterViewInit(): void {
   this.dtTrigger.next();
   this.dtCandidateTrigger.next();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    this.dtCandidateTrigger.unsubscribe();
  }

  rerender_datatable(datatableName:any) {
    this.dtElements.forEach((dtElement: DataTableDirective, index: number) => {
      dtElement.dtInstance.then((dtInstance: any) => {
        console.log(dtInstance.table().node().id);
        if(dtInstance.table().node().id == datatableName) {
           dtInstance.draw();
        }
      });
    });
  }

  changeStatus(event:any)
  {
    this.team_status = event.target.value;
    this.rerender_datatable('team-table');
  }
  
  changeTeamType(event:any)
  {
    this.team_type = event.target.value;
    this.rerender_datatable('team-table');
  }

  changeMyTeam(event:any)
  {
    this.my_team = event.target.value;
    this.rerender_datatable('team-table');
  }

  processDeleteTeam(team_id:any)
  {
    const formData = new FormData();
    /* here set submitted data in formData object array */
    formData.append('team_id', team_id);
    formData.append('update_by', this.update_by);

    this.BackenddbService.deleteTeam(formData).subscribe(
			res => {
       
			   if(res.status === 'success') {

          this.formdata.patchValue({
            team_id :team_id
          });
         
          this.ChatService.deleteTeam(this.formdata.value);
          //   response => {
          //    // localStorage.setItem('userid', response.userId);
          //  });

				 	this.alertMessage = res.message;
          this.alertClass = 'primary';
          this.closed = false;
          this.rerender_datatable('team-table');
        }else {
            this.alertMessage = res.message;
            this.alertClass = 'danger';	
            this.closed = true;
          }
			},
			error => this.error = error
		  );
  }

  deleteTeam(team_id:any)
  {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete team? if you delete this team then assign team member also delete so please be careful.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.value) {
        this.processDeleteTeam(team_id)
      }
    })
    .catch(() => 
       console.log('Cancel') 
    );
  }

  redirect(strurl:any)
  {
    this.router.navigate([strurl]);
  }

  create_candidate_table()
  {
    this.clearCandidateCheckBox();
    this.candidates = [];

    this.candidate_table = true;

    const that = this;
    this.dtOptions[2] = {
      dom: '<"top">tr<"bottom"ilp><"clear">',
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      order: [[ 3, "desc" ]],
      ajax: (dataTablesParameters: any, callback:any) => {
        let params = new HttpParams();
        let startNumber: any;
        startNumber = dataTablesParameters.start;
        if (startNumber != 0) {
          startNumber = startNumber + 1
        } else {
          startNumber = startNumber;
        }
        params = params.append("start", startNumber);
        params = params.append("length", dataTablesParameters.length);
        params = params.append("draw", dataTablesParameters.draw);
        params = params.append("search", this.searchcandiVal);
        params = params.append("order_col", dataTablesParameters.order[0].column);
        params = params.append("order_type", dataTablesParameters.order[0].dir);
        params = params.append("group_id", "3");
        params = params.append("team_id", this.assign_team_id);
        params = params.append("user_status", "");
        params = params.append("team_name_null", "1");  // get all candidate
        //console.log(dataTablesParameters);

        let param = params.toString();
        that.http
          .post<DataTablesResponseCandidate>(
            this.serverUrl+'datatable-api/get-team-member-list',
            params, {}
          ).subscribe(resp => {
            that.candidates = resp.data;
            console.log(resp);

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: []
            });
          });
      },
      columns: [{ data: 's_no' }, { data: 'firstName' },  { data: 'lastName' }, { data: 'team_status' }, { data: 'email' }, { data: 'mobile' }]
    };
  }

  datatable_candiSearch(event){
    this.searchcandiVal  = event.target.value; 
    this.rerender_datatable('team-member-table');
  }


  refreshMainTable() {
    this.dtElements.forEach((dtElement: DataTableDirective, index: number) => {
      dtElement.dtInstance.then((dtInstance: any) => {
        // Destroy the table first
       // console.log(`The DataTable ${index} instance ID is: ${dtInstance.table().node().id}`);
       
      });
    })
  }

  openmodal(assign_team_id:any,assign_team_name:any,assign_instructor_id:any,team_instructor_name:any,team_created_by:any,team_create_datetime:any,team_datetime:any) {
    this.assign_team_id = assign_team_id;
    this.assign_team_name = assign_team_name;
    this.assign_instructor_id = assign_instructor_id;
    this.assign_team_instr_name = team_instructor_name;


    this.assign_team_create_by = team_created_by;
    this.assign_team_create_datetime = team_create_datetime;
    this.assign_team_datetime = team_datetime;

    this.responseTableArray = [];  // reset candidate assign response array
    this.modalshow = 'modal-show';
    this.clearCandidateCheckBox();

   // this.create_candidate_table();
   this.rerender_datatable('team-member-table');
    this.refreshMainTable();
  }

  closemodal()
  {
    this.modalshow = "";
    this.closedpopop = true;
  }

  /* open model for assign team for candidate */
  open(assign_team_id : any,assign_team_name:any,content:any) {
    this.assign_team_id = assign_team_id;
    this.assign_team_name = assign_team_name;
    this.responseTableArray = [];  // reset candidate assign response array
    this.create_candidate_table();
    this.refreshMainTable();
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'xl'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

  }

  getFlashMessage()
  {
    this.msgalert = this.LoginService.getflashMessage();
    if (typeof this.msgalert.type != "undefined")
    {
      this.alertClass = this.msgalert.type;
      this.alertMessage = this.msgalert.message;
      this.closed = false;
    }
  }

  /*this function close model popup*/
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  clearCandidateCheckBox()
  {
    this.checkArray = this.assginTeamFrm.get('candidate_id') as FormArray;
      while (this.checkArray.length !== 0) {
      this.checkArray.removeAt(0);
      }
  }

  onCheckboxChange(e:any) {
    this.checkArray = this.assginTeamFrm.get('candidate_id') as FormArray;

    if (e.target.checked) {
      this.checkArray.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      this.checkArray.controls.forEach((item: FormControl) => {
        if (item.value == e.target.value) {
          this.checkArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  assignTeamCandidate(data:any)
  {
      const formData = new FormData();
      /* here set submitted data in formData object array */
      formData.append('team_id', this.assign_team_id);
      formData.append('candidate_id', data.candidate_id);
      formData.append('update_by', this.update_by);
      this.responseTableArray = [];
      this.ds.Loader(true);
      this.BackenddbService.assignTeamCandidate(formData).subscribe(
        res => {
          this.formdata.patchValue({
            team_id:this.assign_team_id,
            team_members :res.user_id,
            candidate_id:data.candidate_id[0],
            is_assign:true
          });
            this.ChatService.updateTeam(this.formdata.value).subscribe(
            response => {
              if(response.error == false){
               // console.log('assign member on chat successfully');

              }
             
             });

          this.ds.Loader(false);
          if(res.status == 'error')
          {
            this.alertClass = 'danger';
            this.alertMessage = res.message;
            this.closedpopop = false;
          } 
          else if(res.status === 'return')
          {
             this.responseTableArray = res.message;
             this.clearCandidateCheckBox();
             this.rerender_datatable('team-member-table');
             this.rerender_datatable('team-table');
          }
        },
        error => this.error = error
        );
  }

  unassignTeamCandidate(data:any)
  {
      const formData = new FormData();
      /* here set submitted data in formData object array */
      formData.append('team_id', this.assign_team_id);
      formData.append('candidate_id', data.candidate_id);
      formData.append('update_by', this.update_by);
      this.responseTableArray = [];
      this.ds.Loader(true);
      this.BackenddbService.unassignTeamCandidate(formData).subscribe(
        res => {
          console.log(JSON.stringify(res));
          this.ds.Loader(false);
           if(res.status === 'return') {

            this.formdata.patchValue({
              team_id:this.assign_team_id,
              team_members :res.user_id ? res.user_id :null ,
              candidate_id:data.candidate_id[0],
              is_assign:false
            });

              this.ChatService.updateTeam(this.formdata.value).subscribe(
              response => {
                if(response.error == false){
                 // console.log('unassign member on chat successfully');
                }
               });

             this.responseTableArray = res.message;
             this.clearCandidateCheckBox();
             this.rerender_datatable('team-member-table');
             this.rerender_datatable('team-table');
            }else
            {
            }
        },
        error => this.error = error
        );
  }
  onSubmit(data:any)
  {
    if(data.candidate_id.length!=0)
   {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you really want to assgin team to selected candidate.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.value) {
          this.assignTeamCandidate(data)
        }
      })
      .catch(() => 
        console.log('Cancel') 
      );  
   }else
   {
      alert("Choose candidate first");
   } 
    
  }


  onUnassignCandidate(data:any)
  {
      if(data.candidate_id.length!=0)
    {
        Swal.fire({
          title: 'Are you sure?',
          text: 'Do you really want to unassgin team to selected candidate.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel'
        }).then((result) => {
          if (result.value) {
            this.unassignTeamCandidate(data)
          }
        })
        .catch(() => 
          console.log('Cancel') 
        );  
    }else
    {
        alert("Choose candidate first");
    } 
  }
  preloadData()
  {
     this.ds.sendData('get_permission');
  }
  set_permission(data:any)
  {
      if(data.permission.create_team=='Denied')
      {
         this.router.navigate([this.dashboard_url+'dashboard']);
      }
  }

  viewUserProfile(user_id:any)
  {
    this.viewProfile.next(user_id);
  }

  
}
