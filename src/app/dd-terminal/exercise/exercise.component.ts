import { Component, OnInit,Output,EventEmitter,ViewChild,ChangeDetectorRef   } from '@angular/core';
import { Subject, BehaviorSubject,Observable } from 'rxjs';

import { FormGroup,  FormBuilder,FormArray, FormControl, Validators  } from '@angular/forms';
import { LoginService } from '../../services/login.service';

import { BackenddbService } from '../../services/backenddb.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

import {noWhitespaceValidator,greaterThanZeroValidator} from '../../helper/validatefun';

import { faBars,faPlus,faMinus,faCog,faPowerOff,faDesktop,faDownload ,faFileExport,faTrash,faRedo,faList,faNetworkWired} from '@fortawesome/free-solid-svg-icons';
import { saveAs } from 'file-saver';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { DatapassService } from '../../services/datapass.service';
import { Subscription } from 'rxjs/Subscription';
import { Constants } from 'src/constants';

declare const activesidebar:any;

@Component({
  selector: 'app-exercise',
  templateUrl: './exercise.component.html',
  styleUrls: ['./exercise.component.css'],
})
export class ExerciseComponent implements OnInit 
{
     redraw_net_topology: Subject<any> = new Subject<any>();

    @ViewChild('multiSelect') template_dropdown;
    exercise_selectedItems = [];
    exercise_dropdownSettings = {};

    /* toggle menu */
    faBars = faBars;
    faPlus = faPlus;
    faMinus = faMinus;
    faCog = faCog;
    faPowerOff = faPowerOff;
    faDesktop = faDesktop;
    faDownload = faDownload;
    faFile = faFileExport;
    faTrash =  faTrash;
    faRedo = faRedo;
    faList = faList;
    faNetworkWired = faNetworkWired;

    modalConfgRef:any;

    /*breadcrumbs array */
    current_url_array = [];
    //form_title:any;
    form_title:string = 'New Exercise';

    public _opened: boolean = true; 
    public _toggleSidebar() {
    this._opened = !this._opened;
    }  	 

    current_vm_name:string = "";
    resource_img_url:string = "";
    topology_demo_view:string = "Yes";

    /* exercise unique id generate by mysql */
    exe_unique_id:string = "";
    /* exercise id after create exercise */
    exercise_id:string = "";
    disable_control:boolean = false;
    infra_create_status:string = 'pending';
    delete_infra_btn:boolean = false;
    prepare_infra_btn:boolean = true;

    exercisefrm:FormGroup;
    configfrm:FormGroup;
    finalfrm:FormGroup;

    templateList = [];

    current_temp_icon_id:string = '';
    current_template_name:string = '';
    current_template_id:string = '';

    resource_added = []; 
    demo_resource = []; 
    closeResult = '';
    disk_added = []; 
    nic_added = []; 

    // store background prcoess
    bg_process_array = [];

    /* disable delete button */
    disable_delete_btn:boolean = false;
    delete_template_btn:boolean = false;

    /* check true condition */
    public checkvalid:boolean = false;

    update_by:string;
    group_id:string;
    dashboard_url:string;

    /* custom error */
    disk_name_error:string = 'Disk Name required.'; 
    disk_size_error:string = 'Disk Size required.'; 

    nic_name_error:string = 'Nic required.'; 
    nic_network_error:string = 'Network required.'; 

    /* for set nic like ex- nic1, nic2 etc */
    nic_series:number = 1;

    /* flash message */
    messageArray = {  
    type: "",  
    message: "",  
    }; 
    stringifiedData: any; 
    msgalert:any;

    /*  step form */
    step_first:string = "step1";
    step_second:string = '';
    step_third:string = '';

    step_second_disable:boolean = true;
    step_third_disable:boolean = true;

    // disable step 2,3 input control
    disable_step2_ctrl:boolean = false;
    disable_step3_ctrl:boolean = false;
 
    /* template dropdown tooltip text */  
    template_description:string = "";

    /* custom error mesg */
    network_error_msg:string = '';
    temp_name_error_msg:string = '';
    temp_error_msg:string = '';

    /* for store network resource which insert by user 
     and this for configuration popup in network dropdown 
    */
    network_dropdown = [];
    
    /* store configuration of resource like vm resource configuration */
    configuration_array = [];
    current_asset_unique_id:string;
    // use for manage resource and input fields in configuration in modal box
    config_step:string;

    /* internet disable */
    internet_disable:boolean = false;

    /* alert message */
    closed: boolean = true;
    alertMessage: string;
    alertClass: string;

    server_url:string;

    //instructor resourses
    rs_exercise:number = 0;
    rs_vm:number = 0;
    rs_network:number = 0;
    rs_template:number = 0;
    rs_disk:number = 0;
    rs_total_disk:number = 0;
    rs_vcpu:number = 0;
    rs_total_vcpu:number = 0;
    rs_vram:number = 0;
    rs_total_vram:number = 0;
    rs_storage:number = 0;   
    rs_total_storage:number = 0; 
    rs_max_vcpu:number = 0;
    rs_max_vram:number = 0;
    rs_max_storage:number = 0;
    
    //static max no of disk and network add
    max_disk:number = 5;
    max_network:number = 5;
    netInterfaceList:any = []
    defaultNicInterface:string = '3'
 
    /* validation error messsage */
    error_messages = {
    'config_vcpu': [
    { type: 'required', message: 'No. of VCPU required' },
    { type: 'greaterThanZeroValidator', message: 'Invalid input.' }
    ],
    'config_vram': [
    { type: 'required', message: 'No. of VRAM required' },
    { type: 'greaterThanZeroValidator', message: 'Invalid input.' }
    ] ,
    'disk_name': [
    { type: 'required', message: 'Disk name required' },
    ] ,
    'disk_size': [
    { type: 'required', message: 'Disk size required' },
    { type: 'greaterThanZeroValidator', message: 'Invalid input.' }
    ] ,
    'nic_name': [
    { type: 'required', message: 'Nic name required' },
    ] ,
    'nic_network': [
    { type: 'required', message: 'Nic network required' },
    ],
    'exercise_name': [
      { type: 'required', message: 'Exercise Name required' },
      ]     
    };
	  subscription: Subscription;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private BackenddbService:BackenddbService,
    private LoginService:LoginService,
    private modalService: NgbModal,
    private fb:FormBuilder,
    private dtchange: ChangeDetectorRef,
    private ds: DatapassService
  ) {

    this.getFlashMessage();
    this.server_url = LoginService.getServerUrl();
    this.resource_img_url = this.server_url+'media/';
    this.ds.Loader(true);

    /*get exercise id from url if set*/
    this.exercise_id = this.route.snapshot.paramMap.get('id');

    this.dashboard_url = this.LoginService.getDashboardUrl();
    this.group_id = this.LoginService.getLoginGroup();
    this.update_by = this.LoginService.getUserId(); 

    const formData = new FormData();
    formData.append('update_by', this.update_by);  
    formData.append('group_id', this.group_id);  

    /* if exercise id not found then load exercise from temp_exercise table if exsit */
    if(this.exercise_id == null)
    {
       this.getTempExercise(formData,'','');
    } 

    this.exercise_dropdownSettings = {
      singleSelection: true,
      idField: 'temp_id',
      textField: 'template_name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      allowRemoteDataSearch:true,
      limitSelection:1
    };
     // here call function for load template from ovirt server
   }

  ngOnInit() {
   activesidebar();

   this.subscription = this.ds.getData().subscribe(x => { 
    if(x[0]=='set_process_array')
    {
       this.set_process_array(x[1]);
    }else if(x[0]=='reloadExercise')
    {
       this.reloadExercise();
    }else if(x[0]=='set_permission')
    {
       this.set_permission(x[1]);
    }
  });

  var array = ['checkClaim','',''];
  this.ds.sendData(array);

	/*breadcrumbs array */
	this.current_url_array = [
		{'slug':"",'label':'New Exercise'}
	];

   // exercise data array  
	 this.exercisefrm = this.fb.group({
        internet: ['MyWAN', [Validators.required,noWhitespaceValidator]],
        network: ['', [Validators.required,noWhitespaceValidator]],
        templates: ['', [Validators.required,noWhitespaceValidator]],
        template_name: ['', [Validators.required,noWhitespaceValidator]],
    });

    this.finalfrm = this.fb.group({
      exercise_name: ['', [Validators.required,noWhitespaceValidator]],
  });

  // resource config data array
  this.configfrm = this.fb.group({
    config_vcpu: ['', [Validators.required,greaterThanZeroValidator]],
    config_vram:['', [Validators.required,greaterThanZeroValidator]],
    disk_array: this.fb.array([]),
    nic_array: this.fb.array([]) ,
  }); 
  this.getExerciseTemplates();
 }

 ngAfterContentChecked() {
  this.dtchange.detectChanges();
}

// reload exercise data when background process success. its call by header component
reloadExercise() {
  const formData = new FormData();
  formData.append('update_by', this.update_by); 
  formData.append('group_id', this.group_id);  

  /* if exercise id not found then load exercise from temp_exercise table if exsit */
  this.getTempExercise(formData,'','');
}

  /* here get Ovirt template form ovirt server */
  getExerciseTemplates()
  {
    this.BackenddbService.getExerciseTemplates().subscribe(
      res => {
                  if(res.reason != null)
                  {
                      alert(res.detail);
                  }else
                  {   
                    this.templateList = Array.from(Object.keys(res), k=>res[k]);
                    this.ds.Loader(false);
                  }
              });
  }
  
  setInstructorResource(resource:any)
  {
    if(this.group_id=='2')
    {
          if(resource.status=='success')
          {
            if(resource.data.used_resource.exercise==resource.data.resource.exercise)
            {
              this.setFlashMessage('danger',Constants.INSTRUCT_DONT_RES);
              this.router.navigate([this.dashboard_url+'exercise-list/']);
              return true;
            }

            if(resource.data.used_resource.template==resource.data.resource.template)
            {
              this.setFlashMessage('danger',Constants.INSTRUCT_DONT_RES);
              this.router.navigate([this.dashboard_url+'exercise-list/']);
              return true;
            }

            this.rs_exercise = resource.data.remaing_resource.exercise;
            this.rs_vm = resource.data.remaing_resource.vm;
            this.rs_network = resource.data.remaing_resource.network;
            this.rs_template = resource.data.remaing_resource.template;
            this.rs_disk = resource.data.remaing_resource.disk;
            this.rs_total_disk = resource.data.resource.disk;
            this.rs_vcpu = resource.data.remaing_resource.vcpu;
            this.rs_total_vcpu = resource.data.resource.vcpu;
            this.rs_vram = resource.data.remaing_resource.vram;
            this.rs_total_vram = resource.data.resource.vram;
            this.rs_storage = resource.data.remaing_resource.storage;
            this.rs_total_storage = resource.data.resource.storage;
            this.rs_max_vcpu = resource.data.resource.max_vcpu;
            this.rs_max_vram = resource.data.resource.max_vram;
            this.rs_max_storage = resource.data.resource.max_storage;

          }else
          {
                this.setFlashMessage('danger',resource.message);
                this.router.navigate([this.dashboard_url+'exercise-list/']);
                return true;
          }  
    }
  }

  /*  here get temp exercise from db */
  getTempExercise(formData:any,fetch_data:any,action:any)
  {
    if(fetch_data!='')  {  this.ds.Loader(true);  }
    var api = 'admin-api/get-temp-exercise'
    this.BackenddbService.postData(api,formData).subscribe(
      res => {
        this.closed = true;
        if(fetch_data!='')  {  this.ds.Loader(false);  }
        if(res.status=='success')
        {
          //here set instructor resources
          this.setInstructorResource(res.resource);
          this.netInterfaceList = res.networkInterface

          this.exe_unique_id = res.data.exe_unique_id;
          this.infra_create_status = res.data.infra_create_status;
          this.form_title = 'New Exercise - '+this.exe_unique_id;

          if(res.data.infra_create_status=='pending')
          {
            this.prepare_infra_btn = true;
            // here if pending enable first step control
            this.disable_control = false;
          }else if(res.data.infra_create_status=='success')
          {
            // here if success then disable first step control and enable second step
            this.step_second_disable = false;
            this.step_third_disable = false;

            this.disable_step2_ctrl = false;
            this.disable_step3_ctrl = false;

            //this.disable_control = true;
            this.delete_infra_btn = true;

            if(fetch_data!='configuration')
            {
              this.step_first = '';
              this.step_second = 'step2';
              this.step_third = '';
            }
            //here load real machine status like power on/off etc
            this.getVMStatus('open_step_form');
          }else if(res.data.infra_create_status=='rollback_infra')
          {
            this.step_second_disable = false;
            this.disable_step2_ctrl = false;
            this.disable_step3_ctrl = true;

            // here if success then disable first step control and enable second step
            //this.disable_control = true;
            this.delete_infra_btn = true;
            this.prepare_infra_btn = false;

            this.closed = false;
            this.alertMessage = Constants.INFRA_CREATE_FAIL;
            this.alertClass = "danger";

          }else if(res.data.infra_create_status=='rollback_template')
          {

            this.step_second_disable = false;
            this.step_third_disable = false;

            this.disable_step2_ctrl = true;
            this.disable_step3_ctrl = true;

            this.disable_control = true;
            this.delete_infra_btn = false;

            this.step_first = '';
            this.step_second = '';
            this.step_third = 'step3';

            this.delete_template_btn = true;

            this.closed = false;
            this.alertMessage = Constants.INFRA_CREATE_FAIL;
            this.alertClass = "danger";

          }else if(res.data.infra_create_status=='locked')
          {
            // here if success then disable first step control and enable second step
            this.step_second_disable = false;
            this.step_third_disable = false;

            this.disable_step2_ctrl = true;
            this.disable_step3_ctrl = true;

            this.disable_control = true;
            this.delete_infra_btn = false;

            this.step_first = '';
            this.step_second = '';
            this.step_third = 'step3';
          }
          else
          {
             this.disable_control = true;
          }

          if(res.data.data != '')
          {

            this.demo_resource = Array.from(Object.keys(res.data.data), k=>res.data.data[k]);

            setTimeout(() => {
             this.redraw_net_topology.next('draw_network_topology');  
           }, 1000 ); 

            this.resource_added = Array.from(Object.keys(res.data.data), k=>res.data.data[k]);
            this.resource_added.sort(this.dynamicSort("order"));
            if(fetch_data=='configuration')
            {
              this.resource_added.forEach((myObject:any, index:any) => { 
                if(this.current_asset_unique_id == this.resource_added[index].asset_unique_id && typeof(this.resource_added[index].configuration) != 'undefined')
                {
                      this.configfrm.patchValue({
                        config_vcpu: this.resource_added[index].configuration.config_vcpu,
                        config_vram: this.resource_added[index].configuration.config_vram,
                    });

                    if(typeof(this.resource_added[index].configuration.disk_array) != 'undefined')
                    {  
                      let diskfrmArray = this.configfrm.get('disk_array') as FormArray;
                      diskfrmArray.clear();

                      var disk_data_array = this.resource_added[index].configuration.disk_array;
                      disk_data_array.forEach((diskObj:any, diskindex:any) => { 
                        let disk_name = diskObj.disk_name;  
                        let disk_size = diskObj.disk_size; 
                        let exist_disk_id = ''; 

                        if(typeof diskObj.disk_id != 'undefined')
                        {
                          exist_disk_id = diskObj.disk_id; 
                        }
                        this.add_disk_row(disk_name,disk_size,'',exist_disk_id);
                      }); 
                    }

                    if(typeof(this.resource_added[index].configuration.nic_array) != 'undefined')
                    {
                      let nicfrmArray = this.configfrm.get('nic_array') as FormArray;
                      nicfrmArray.clear();

                      var nic_data_array = this.resource_added[index].configuration.nic_array;
                      this.nic_series = 1;
                      nic_data_array.forEach((nicObj:any, nicindex:any) => { 
                        let nic_name = nicObj.nic_name
                        let nic_interface = nicObj.nic_interface
                        let nic_network = nicObj.nic_network
                        let exist_nic_id =''
                        if(typeof nicObj.nic_id !='undefined')
                        {
                            exist_nic_id = nicObj.nic_id;
                        }
                        this.add_network_row(nic_name,nic_interface,nic_network,exist_nic_id);
                      }); 
                    }

                    if(action=='add_configuration')
                    {
                      this.closed = false;
                      this.alertMessage = Constants.RES_CONFIG_SAVED;
                      this.alertClass = "success";
                      this.modalConfgRef.close(); // autoclose popup after submit configuration
                    }
                }
             });
            }else if(fetch_data=='update_network')
            {
               setTimeout(() => {
                this.redraw_net_topology.next('draw_network_topology');  
              }, 1000 );
           
            }   
          }else
          {
            this.resource_added = []; 
          }
        }else if(res.status=='error')
        {
            this.alertMessage = res.message;
            this.alertClass = 'danger';
            this.closed = false;
        }
      });
  }
  // here update data in temp expercise db table
  updateTempExercise(data:any,type:any,action:any)
  {
    const formData = new FormData();
    formData.append('exe_unique_id', this.exe_unique_id);  
    formData.append('update_by', this.update_by);  
    formData.append('group_id', this.group_id);  
    formData.append('data', JSON.stringify(data));  
    formData.append('type', type);  
    formData.append('action', action);  
    this.ds.Loader(true);

    var api = 'admin-api/update-temp-exercise';
    this.BackenddbService.postData(api,formData).subscribe(
      res => {
        this.ds.Loader(false);
        if(res.status == 'success')
        {
          const formData = new FormData();
          formData.append('update_by', this.update_by);  
          formData.append('group_id', this.group_id);  

          /* here call function when remove resource OR add configuration for reset all latest data from db */
          if(type =='resource' && (action == 'remove' || action == 'add'))
          {
             this.getTempExercise(formData,'','');
          }else if(type =='configuration' && action == 'add')
          {
             this.getTempExercise(formData,'configuration','add_configuration');
          }

        }else if(res.status == 'error')
        {
          this.alertMessage = res.message;
          this.alertClass = 'danger';
          this.closed = false;
        }

      });
   //
  }

  // here use this for generate unique asset id
  private S4(): string {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }

  public templateDeSelect(item: any) {
    this.template_description = "";
    this.current_template_id = "";
    this.current_temp_icon_id = "";
    this.current_template_name = "";
  }
  /* here set tooltip value of template dropdown */
  changeTemplate(item:any)
  {
      this.temp_error_msg = '';

      this.template_description = "";
      this.current_template_id = "";
      this.current_temp_icon_id = "";
      this.current_template_name = "";

      if(item.temp_id != "")
      {
        this.templateList.forEach((myObj:any, index:any) => {
          if(myObj.temp_id == item.temp_id)
          {
              this.template_description = myObj.description;
              this.current_template_id = item.temp_id;
              this.current_temp_icon_id = myObj.large_icon_id;
              this.current_template_name = myObj.template_name;

         }
        });
      }
  }
  // here clear error message
  clear_network_error()
  {
      this.network_error_msg = '';
  }
  // here clear error message
  clear_temp_name_error()
  {
    this.temp_name_error_msg = '';
  }

  // here add template
  add_templates(data:any)
  {
    this.temp_name_error_msg = '';
    this.temp_error_msg = '';
    var valid = true;
   
    if(data.template_name=="")
    {
      this.temp_name_error_msg = 'Template Name required.';
      var valid = false;
    }
    if(data.template_name.length>20)
    {
      this.temp_name_error_msg = 'Max 20 alphanumeric character allow.';
      var valid = false;
    }
    if(this.current_template_id=='')
    {
      this.temp_error_msg = 'Template required.';
      var valid = false;
    }

    if(valid == false)
    {
      return false;
    }
    var checkexsit:any;
    this.resource_added.forEach((myObject:any, index:any) => {
      if(this.resource_added[index].asset_name == data.template_name)
      {
        checkexsit = false;
        Swal.fire('Oops...', Constants.TEMP_EXIST, 'warning');
      }
    });

    if(checkexsit == false)
    {
     return false;
    }

    // here start check instructor virtual machine resource
    if(this.group_id=="2")
    {
      var checkexsit:any;
      var numberofvm = 1;

      if(this.rs_vm==0)
      {
        checkexsit = false;
		    Swal.fire('Oops...', Constants.INSTRUCT_NOT_ADD_VM, 'warning');
        return false;
      }

      this.resource_added.forEach( (myObject:any, index:any) => {
        if(this.resource_added[index].asset_type == 'VM')
        {
          numberofvm = numberofvm;
        }
      }); 

      if(numberofvm>this.rs_vm)
      {
        checkexsit = false;
		    Swal.fire('Oops...', Constants.INSTRUCT_NOT_ADD_VM, 'warning');
      }        

      if(checkexsit == false)
      {
        return false;
      }
    }

    // here end check instructor virtual machine resource
    var res_add = {image:'vm.jpg',
    large_icon_id:this.current_temp_icon_id,
    asset_unique_id:this.S4(),
    asset_type:'VM',
    asset_name:data.template_name,
    description:this.template_description,
    template_name:this.current_template_name,
    base_template_id:this.current_template_id,
    order:1
    };
  
    this.resource_added.sort(this.dynamicSort("order"));
    this.updateTempExercise(res_add,'resource','add');
  }
  // here add network
  add_network(data:any)
  {
       this.network_error_msg = "";
       var valid = true;
       if(data.network=="")
       {
         this.network_error_msg = 'Network Name required.';
         var valid = false;
       }
       if(data.network.length>20)
       {
         this.network_error_msg = 'Max 20 alphanumeric character allow.';
         var valid = false;
       }
       if(valid == false)
       {
         return false;
       }
       var checkexsit:any;
        this.resource_added.forEach( (myObject:any, index:any) => {
          if(this.resource_added[index].asset_name == data.network)
          {
            checkexsit = false;
            Swal.fire('Oops...', Constants.NET_EXIST, 'warning');
          }
        });
        if(checkexsit == false)
        {
          return false;
        }

       // here start check instructor network resource
       if(this.group_id=="2")
       {
          var checkexsit:any;
          var numberofnetwork = 1;

          if(this.rs_network==0)
          {
            checkexsit = false;
            Swal.fire('Oops...', Constants.INSTRUCT_NOT_ADD_NET, 'warning');
            return false;
          }

          this.resource_added.forEach( (myObject:any, index:any) => {
            if(this.resource_added[index].asset_type == 'Switch')
            {
              numberofnetwork = numberofnetwork;
            }
          }); 

          if(numberofnetwork>this.rs_network)
          {
            checkexsit = false;
            Swal.fire('Oops...',Constants.INSTRUCT_NOT_ADD_NET, 'warning');
          }        

          if(checkexsit == false)
          {
            return false;
          }
       }
       // here end check instructor network resource

        var res_add = {image:'switch.png',
        asset_unique_id:this.S4(),
        asset_type:'Switch',
        asset_name:data.network,
        template_name:'-',
        order:3
      };
      this.resource_added.push(res_add);
      this.resource_added.sort(this.dynamicSort("order"));
      this.updateTempExercise(res_add,'resource','add');
  }
  // here add internet 
  add_internet(data:any)
  {
      var res_add = {image:'gateway.jpg',
      asset_unique_id:this.S4(),
      asset_type:'Gateway',
      asset_name:data.internet,
      template_name:'-',
      order:2
      };
      this.resource_added.push(res_add);
      this.resource_added.sort(this.dynamicSort("order"));
      this.updateTempExercise(res_add,'resource','add');
  }

  /* here remove added resource */
  removeResource(asset_unique_id:any,index:any)
  {
    const formData = new FormData();
    formData.append('update_by', this.update_by);  
    formData.append('process','delete_resource');  
    formData.append('exe_unique_id', this.exe_unique_id);  
    formData.append('asset_unique_id', asset_unique_id);  
    formData.append('label','Removing resoruce');  
    this.rabbitMQSubmitProcess(formData,'Yes');
  }
  
  //  here call removeResource function
  remove_resource(asset_type:any,asset_unique_id:any,index:any)
  {
    if(asset_type=='VM')
    {
      var msg = Constants.REMOVE_RES;
    }else
    {
      var msg = Constants.REMOVE_NET_RES;
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
         this.removeResource(asset_unique_id,index);
      }
    })
  }

  /* start function for add disk row */
  add_disk_row(disk_name:any,disk_size:any,checkvalid:any,exist_disk_id:any){

    const disk_fa = (this.configfrm.get('disk_array')as FormArray);
    
    // here start check no of disk for instructor
    if(this.group_id=='2' && checkvalid=='Yes')
    {
        if(disk_fa.length+1>this.max_disk)
        {
          Swal.fire('Oops...', "Instructor can add max "+this.max_disk+" disk in single VM.", 'warning');
          return false;
        }

        var disk_ary =  this.configfrm.get('disk_array')['value'];
        var storage_exit = 0;
        disk_ary.forEach((myObject:any, i:any) => {
          if(disk_ary[i]['disk_size']!=null)
          {
            var num = Number(disk_ary[i]['disk_size']);
            storage_exit = storage_exit+num;
          }
        });


        var numberofdisk = disk_fa.length+1;
        var diskexit = 0;
        this.resource_added.forEach((myObject:any, res_index:any)=>  { 
          var asset_unique_id = this.resource_added[res_index].asset_unique_id;
          if(this.current_asset_unique_id != asset_unique_id && typeof this.resource_added[res_index].configuration != 'undefined')
          {
            if(typeof this.resource_added[res_index].configuration.disk_array != 'undefined')
            {
                  var disk_data_array = this.resource_added[res_index].configuration.disk_array;
                  disk_data_array.forEach((diskObj:any, diskindex:any) => { 
                  diskexit = diskexit+1;
                  storage_exit = storage_exit+disk_data_array[diskindex]['disk_size'];
              }); 
            }
          }
        });
        var numberofdisk = numberofdisk+diskexit;
        if(numberofdisk>this.rs_total_disk)
        {
          Swal.fire('Oops...', Constants.INSTRUCT_NOT_RES, 'warning');          
          return false;
        }

        if(storage_exit>this.rs_total_storage)
        {
          Swal.fire('Oops...', Constants.INSTRUCT_NOT_RES, 'warning');
          return true;      
        }

    }
    // here end check no of disk for instructor

    disk_fa.push(this.fb.group({
      disk_name: [disk_name],
      disk_size: [disk_size, [greaterThanZeroValidator]],
      exist_disk_id:[exist_disk_id]
    }));
  }

  deleteDiskRow(i:number){
    const disk_fa = (this.configfrm.get('disk_array')as FormArray);
    disk_fa.removeAt(i);
    if(disk_fa.length===0) this.add_disk_row('','','','');
  }

  getDiskControls() {
    return (<FormArray>this.configfrm.get('disk_array')).controls;
  }
    /* end function for add disk row */

  /* start function for add nic row */
  add_network_row(nic_name:any='',nicInterface:any='',nic_network:any='',exist_nic_id:any=''){
    const nic_fa = (this.configfrm.get('nic_array')as FormArray);

    if(nic_fa.length+1>this.max_network)
    {
      Swal.fire('Oops...', "Instructor can't add more then "+this.max_network+" network.", 'warning');
      return false;
    }

     if(nic_name=='')
    {
       nic_name = 'nic'+this.nic_series;
    }
    if(nicInterface=="")
    {
      nicInterface = this.defaultNicInterface
    }

    this.checkvalid = false;
    let nicfrmArray = this.configfrm.get('nic_array') as FormArray;
    nicfrmArray.value.forEach((myObj:any, index:any) => {
      if(myObj.nic_name == nic_name)
      {
        this.checkvalid = true;
      }
  });

  if(this.checkvalid)
  {
    nic_name = 'nic'+(this.nic_series+1);
  }

   nic_fa.push(this.fb.group({
      nic_name: [nic_name],
      nic_interface: [nicInterface],
      nic_network: [nic_network],
      exist_nic_id:exist_nic_id
    }));
    this.nic_series = this.nic_series+1;
  }

  deleteNetworkRow(i:number){
    const nic_fa = (this.configfrm.get('nic_array')as FormArray);
    nic_fa.removeAt(i);
    //this.nic_series = this.nic_series-1;
    if(nic_fa.length===0) 
    {
      this.nic_series = 1;
      this.add_network_row('','','');
    }
  }

  getNetworkControls() {
    return (<FormArray>this.configfrm.get('nic_array')).controls;
  }
    /* start function for add nic row */

  /* here save configuration resource */  
  config_resource(data:any)  
  {
    console.log('data')
    console.log(data)
    //return true
    if(this.configfrm.valid) {
      data.asset_unique_id = this.current_asset_unique_id;
      this.updateTempExercise(data,'configuration','add');
    }else
    {
      this.validateAllFormFields(this.configfrm); // check validation
    }
  }

  deleteComplateInfra()
  {
      
  }
 
deleteInfra()
{
  Swal.fire({
    title: 'Are you sure?',
    text: Constants.DEL_PREPAR_INFRA,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.value) {
      this.checkvalid = false; 
     this.resource_added.forEach((myObject:any, index:any) => { 
       if(this.resource_added[index].asset_type == 'VM')
       {
          if(this.resource_added[index].power_on_status == 'up')
          {
            this.checkvalid = true;
          }
       }
     });  

     if(this.checkvalid)
     {
       Swal.fire('Oops...', Constants.POWER_OFF_ALL, 'warning'); 
       return true; 
     }

      const formData = new FormData();
      formData.append('update_by', this.update_by);  
      formData.append('process','delete_admin_infra');  
      formData.append('exe_unique_id', this.exe_unique_id);  
      formData.append('asset_unique_id', '');  
      formData.append('label','Deleting infra');  
    
      this.rabbitMQSubmitProcess(formData,'Yes');
      this.prepare_infra_btn = false;
      this.delete_infra_btn = false;

      this.step_second_disable = true;
      this.step_third_disable = true;
    }
  })


  .catch(() => 
     console.log('Cancel') 
  );   
}

create_infrastructure()
{
  if(this.resource_added.length==0)
  {
    Swal.fire('Oops...', "You can't prepare infra. Please add resources first.", 'warning');
    return true;
  }

  this.checkvalid = false;
  this.resource_added.forEach((myObject:any, res_index:any)=>  { 
    var asset_type = this.resource_added[res_index].asset_type;
    if(asset_type=='VM' && typeof this.resource_added[res_index].configuration == 'undefined')
    {
      this.checkvalid = true;
    }
  });
  if(this.checkvalid)
  {
    Swal.fire('Oops...', "You can't prepare infra. Please configure all resource first.", 'warning');
    return true;
  }
  
  this.checkvalid = false;
  this.resource_added.forEach((myObject:any, res_index:any)=>  { 
    var asset_type = this.resource_added[res_index].asset_type;
    if(asset_type=='VM')
    {
      this.checkvalid = true;
    }
  });

  if(this.checkvalid==false)
  { 
    Swal.fire('Oops...', "You can't prepare infra. Please add at least one template.", 'warning');
    return true;
  }

  Swal.fire({
    title: 'Are you sure?',
    text: "Do you really want to prepare infra? after prepare infra you can't edit.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.value) {
      const formData = new FormData();
      formData.append('update_by', this.update_by);  
      formData.append('process','prepare_admin_infra');  
      formData.append('exe_unique_id', this.exe_unique_id);  
      formData.append('asset_unique_id', '');  
      formData.append('label','Preparing infra');  
    
      this.rabbitMQSubmitProcess(formData,'Yes');
      this.prepare_infra_btn = false;
      this.disable_control = true;
    }
  })
  
  .catch(() => 
     console.log('Cancel') 
  );
}

// vm configuration model box open and data setup here
config_modelbox(asset_unique_id:any,model:any,config_step:any)
{
   if(config_step==true)
   {
     this.config_step = 'update';
   }else
   {
    this.config_step = 'save';
   }

    /* here set default option internet for nic network dropdown  */
    if(this.network_dropdown.length==0)
    {
      this.network_dropdown.push('Internet');
      this.network_dropdown.push('Traffic Generator');
    }
    /*here set nic network dropdown for array
      here come network who insert by user
    */
    this.resource_added.forEach( (myObject:any, index:any) => {
      
      if(this.resource_added[index].asset_unique_id == asset_unique_id)
      {
             this.current_vm_name = this.resource_added[index].asset_name;
      }
      
      if(this.resource_added[index].asset_type ==='Switch')
      {
        let findnet = this.network_dropdown.find(ob => ob === this.resource_added[index].asset_name);
        if(typeof(findnet) === 'undefined')
        {
          this.network_dropdown.push(this.resource_added[index].asset_name);
        }
      }
    });

    this.configfrm.reset();
    let diskfrmArray = this.configfrm.get('disk_array') as FormArray;
    diskfrmArray.clear();
    let nicfrmArray = this.configfrm.get('nic_array') as FormArray;
    nicfrmArray.clear();
    this.nic_series = 1;
    this.add_disk_row('','','','');    
    this.add_network_row('','','');

    /* here set current asset unique id which for configure resource */
    this.current_asset_unique_id = asset_unique_id;

    const formData = new FormData();
    formData.append('update_by', this.update_by);  
    formData.append('group_id', this.group_id);  
    formData.append('operation', 'fetch');  
    /* if exercise id not found then load exercise from temp_exercise table if exsit */
    if(this.exercise_id == null)
    {
        this.getTempExercise(formData,'configuration','');
    }
    this.modalConfgRef = this.modalService.open(model, {ariaLabelledBy: 'modal-basic-title', size: 'lg'});
}

update_network(data:any)  
{
  if(this.configfrm.valid) {
    data.asset_unique_id = this.current_asset_unique_id;
    const formData = new FormData();
    formData.append('exe_unique_id', this.exe_unique_id);  
    formData.append('data', JSON.stringify(data));
    formData.append('process','update_vm_infra');  
    formData.append('asset_unique_id', this.current_asset_unique_id);  
    formData.append('label','vm updating'); 

    Swal.fire({
      title: 'Are you sure?',
      text: "Do you really want to update resource configuration.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.value) {
        this.ds.Loader(true);
        this.rabbitMQSubmitProcess(formData,'Yes');
        this.modalConfgRef.close(); 
      }
    }); 
  }else
  {
    this.validateAllFormFields(this.configfrm); // check validation
  }
}

//here get console info of vm
get_console(vm_id:any)
{
  const formData = new FormData();
  formData.append('update_by', this.update_by);  
  formData.append('vm_id', vm_id);  
  this.ds.Loader(true);
  this.BackenddbService.getSpiceConsole(formData).subscribe(
    res => {
      this.ds.Loader(false);
      if(res.status == 'success')
      {
        //here download console file
        const blob = new Blob([res.file_data], {type: "text/plain;charset=utf-8"});
        saveAs(blob, "console.vv");
      }else if(res.status == 'error')
      {
          this.alertMessage = res.message;
          this.alertClass = 'danger';
          this.closed = false;
      }
    });
}

// this function is use for get current status of vm
getVMStatus(call_by:any)
{
  const formData = new FormData();
  formData.append('update_by', this.update_by);  
  formData.append('exe_unique_id', this.exe_unique_id);  
  if(call_by=='open_step_form')
  {
    this.ds.Loader(true);
  }

  this.BackenddbService.getVmInfo(formData).subscribe(
    res => {
      this.ds.Loader(false);
      if(res.status == 'success')
      {
          this.resource_added = Array.from(Object.keys(res.data), k=>res.data[k]);
          this.resource_added.sort(this.dynamicSort("order"));
          setTimeout(() => {
            this.redraw_net_topology.next('draw_network_topology');  
          }, 1000 ); 
      }else if(res.status == 'error')
      {
          this.alertMessage = res.message;
          this.alertClass = 'danger';
          this.closed = false;
      }
    }
  );
}


rabbitMQSubmitProcess(formData:any,process_bar:any)
{
  if(process_bar=='Yes')
  {
    this.ds.Loader(true);
  }
  this.BackenddbService.rabbitmqSubmitProcess(formData).subscribe(
    res => {
      this.ds.Loader(false);
      if(res.status == 'success')
      {
        this.ds.sendData('background_process');
        this.getVMStatus('');
      }else 
      {
          this.alertMessage = Constants.ERROR;
          this.alertClass = 'danger';
          this.closed = false;
      }
    }
  );
}

// here use this function for power on OR off VM
power(vm_id:any,power_mode:any,asset_unique_id:any,label:any)
{
  const formData = new FormData();
  formData.append('update_by', this.update_by);  
  formData.append('process','power_vm');  
  formData.append('power_mode',power_mode);  
  formData.append('vm_id',vm_id);  
  formData.append('exe_unique_id', this.exe_unique_id);  
  formData.append('asset_unique_id', asset_unique_id);  
  formData.append('label',label);  

  this.rabbitMQSubmitProcess(formData,'Yes');
}

snapshot(vm_id:any,operation:any,snapshot_id:any,asset_unique_id:any,label:any,vm_power_status:any)
{

  if(operation == 'restore_snapshot' && vm_power_status=='up')
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
      if(operation == 'restore_snapshot' && vm_power_status=='up')
      {
        var asset_name = '';
        this.resource_added.forEach( (myObject:any, index:any) => {
          if(this.resource_added[index].asset_unique_id == asset_unique_id)
          {
            asset_name = this.resource_added[index].asset_name;
          }
        });

        this.power(vm_id,'stop',asset_unique_id,'Powering off '+asset_name);
        setTimeout(() => {
          const formData = new FormData();
          formData.append('update_by', this.update_by);  
          formData.append('process','snapshot_vm');  
          formData.append('operation',operation);  
          formData.append('snapshot_id',snapshot_id);  
          formData.append('vm_id',vm_id);  
          formData.append('exe_unique_id', this.exe_unique_id);  
          formData.append('asset_unique_id', asset_unique_id);  
          formData.append('label',label);  

          this.rabbitMQSubmitProcess(formData,'No');
        }, 10000
        );
      }else
      {
        const formData = new FormData();
        formData.append('update_by', this.update_by);  
        formData.append('process','snapshot_vm');  
        formData.append('operation',operation);  
        formData.append('snapshot_id',snapshot_id);  
        formData.append('vm_id',vm_id);  
        formData.append('exe_unique_id', this.exe_unique_id);  
        formData.append('asset_unique_id', asset_unique_id);  
        formData.append('label',label);  

        this.rabbitMQSubmitProcess(formData,'Yes');    
      }
    }
  })

  .catch(() => 
     console.log('Cancel') 
  ); 
}


// here open step form when click on step button
open_step_form(step_form:any)
{
    if(step_form == '1' && (this.infra_create_status!='rollback_template'))
    {
        this.step_first = 'step1';
        this.step_second = '';
        this.step_third = '';
    }else if(step_form == '2' && (this.infra_create_status=='success' || this.infra_create_status=='rollback_infra'))
    {
      this.step_first = '';
      this.step_second = 'step2';
      this.step_third = '';
      this.getVMStatus('open_step_form');
    }else if(step_form == '3' && (this.infra_create_status=='success' || this.infra_create_status=='locked'))
    {
      this.step_first = '';
      this.step_second = '';
      this.step_third = 'step3';
    }
}
// here set process array for step 2 Configure Resource table
set_process_array(data:any)
{
  data.forEach((dataObject:any, dataindex:any) => { 
    if(data[dataindex].process_type=='create_admin_template' && data[dataindex].status=='success')
    {
      this.setFlashMessage('success',"Exercise has successfully created on server.");
      var redirect = this.dashboard_url+'exercise-list/';
      this.router.navigate([redirect]);
      return true;
    }
  });  

  this.bg_process_array = [];
  this.resource_added.forEach((myObject:any, index:any) => { 
      if(this.resource_added[index].asset_type=='VM')
      {
          var status = 'OK';
          data.forEach((dataObject:any, dataindex:any) => { 
          if(data[dataindex].asset_unique_id == this.resource_added[index].asset_unique_id)
          {
            this.bg_process_array.push({
              'id':data[dataindex].id,
              'res_status':'',
              'asset_unique_id':data[dataindex].asset_unique_id,
              'status':data[dataindex].status,
              'label':data[dataindex].label
              });
              status = '';
          }

          });
          if(status=='OK')
          {
            this.bg_process_array = [];
          }
      }

  });
  if(data.length==0)
  {
     this.disable_control = false;
  }else
  {
    this.disable_control = true;
  }
}

// here perform action from network topology
perform_action(resource_data:any,action:any,config_popup:any)
{
  var vm_id = resource_data.vm_id;
  var asset_unique_id = resource_data.asset_unique_id; 
  var asset_name = resource_data.asset_name; 

  if(action=="power_on")
  {
     this.power(vm_id,'up',asset_unique_id,'Powering on '+ asset_name);
  }else if(action=="power_off")
  {
    // down stop
    this.power(vm_id,'stop',asset_unique_id,'Powering off '+ asset_name);
  }else if(action=="create_snapshot")
  {
    var snapshot_id  = resource_data.snapshot_id; 
    var power_on_status = resource_data.power_on_status;
    this.snapshot(vm_id,'create_snapshot',snapshot_id,asset_unique_id,'Creating snapshot of '+asset_name,power_on_status);
  }else if(action=="restore_snapshot")
  {
    var snapshot_id  = resource_data.snapshot_id; 
    var power_on_status = resource_data.power_on_status;
    this.snapshot(vm_id,'restore_snapshot',snapshot_id,asset_unique_id,'Restore snapshot of '+asset_name,power_on_status);
  }else if(action=="delete_snapshot")
  {
    var snapshot_id  = resource_data.snapshot_id; 
    var power_on_status = resource_data.power_on_status;
    this.snapshot(vm_id,'delete_snapshot',snapshot_id,asset_unique_id,'Delete snapshot of '+asset_name,power_on_status);
  }else if(action=="download_console")
  {
    this.get_console(vm_id);
  }else if(action=="configure_network")
  {
    this.config_modelbox(asset_unique_id,config_popup,'step2');
  }
}

// here call action from network topology click button
network_toplogy_action(data:any)
{
  var action = data[0]['action'];
  var asset_unique_id = data[0]['asset_unique_id'];

  this.resource_added.forEach((myObject:any, index:any) => { 
    if(this.resource_added[index].asset_unique_id == asset_unique_id)
    {
      var resource_data = this.resource_added[index];
      this.perform_action(resource_data,action,data[0]['config_popup']);
    }
  });  
}

// here final submit and start make template 
final_submit(data:any)
{

  if(this.finalfrm.valid) {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you really want to final submit. Once exercise will final submit you can't reconfigure this exercise.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.value) {
        this.checkvalid = false; 
        var noofvm = 0;
        this.resource_added.forEach((myObject:any, index:any) => { 
          if(this.resource_added[index].asset_type == 'VM')
          {
            if(this.resource_added[index].power_on_status != 'down')
            {
              this.checkvalid = true;
            }
            noofvm = noofvm+1;
          }
        }); 
        
        if(this.group_id=='2' && noofvm>this.rs_template)
        {
          Swal.fire('Oops...', "Instructor don't have enough resource for final submit.", 'warning');
          return true;          
        }

        if(this.checkvalid)
        {
          Swal.fire('Oops...', "Please power off all virtual machine from configure resources step.", 'warning');
          return true; 
        }else
        {
          const formData = new FormData();
          formData.append('update_by', this.update_by);  
          formData.append('process','create_admin_template');  
          formData.append('exe_unique_id', this.exe_unique_id);  
          formData.append('asset_unique_id', '');
          formData.append('queue_name', 'sequentialqueue');
          formData.append('exercise_name',data.exercise_name);
          formData.append('label','Final submitting exercise');  
          
          this.rabbitMQSubmitProcess(formData,'Yes');
          
          this.disable_step2_ctrl = true;
          this.disable_step3_ctrl = true;
          this.delete_infra_btn = false;
        }
      }
    })

  } else {
    this.validateAllFormFields(this.finalfrm);
  }
}

delete_template()
{    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete template.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.value) {
        const formData = new FormData();
        formData.append('update_by', this.update_by);  
        formData.append('process','delete_admin_template');  
        formData.append('exe_unique_id', this.exe_unique_id);  
        formData.append('asset_unique_id', '');  
        formData.append('label','Deleting template');  
      
        this.rabbitMQSubmitProcess(formData,'Yes');
        this.delete_template_btn = false;
      }
    });

}

checkMaxVcpu(event:any)
{
  
  if(this.group_id=='2')
  {
      var num = Number(this.configfrm.value.config_vcpu);
     // var noofvcpu = 0;
      var totalvcpu = num;
      this.resource_added.forEach((myObject:any, index:any) => { 
        var asset_type = this.resource_added[index].asset_type;
        var asset_unique_id = this.resource_added[index].asset_unique_id;

        if(asset_type == 'VM' && asset_unique_id!=this.current_asset_unique_id && typeof this.resource_added[index].configuration != 'undefined')
        {
           var config_vcpu = this.resource_added[index].configuration.config_vcpu;
           totalvcpu = totalvcpu + config_vcpu;
        }
      }); 

      if(totalvcpu>this.rs_total_vcpu)
      {
        Swal.fire('Oops...', "Instructor can't have enough vCPU resource.", 'warning');
        this.configfrm.controls['config_vcpu'].setValue('');
        return true;      
      }

      if(num>this.rs_max_vcpu)
      {
        Swal.fire('Oops...', "Instructor can add max virtual CPU "+this.rs_max_vcpu+".", 'warning');
        this.configfrm.controls['config_vcpu'].setValue('');
        event.preventDefault();
        return false;
      }

  }  
}

checkMaxVram(event:any)
{
  if(this.group_id=='2')
  {
    var num = Number(this.configfrm.value.config_vram);
    // var noofvcpu = 0;
     var totalvram = num;
     this.resource_added.forEach((myObject:any, index:any) => { 
       var asset_type = this.resource_added[index].asset_type;
       var asset_unique_id = this.resource_added[index].asset_unique_id;

       if(asset_type == 'VM' && asset_unique_id!=this.current_asset_unique_id && typeof this.resource_added[index].configuration != 'undefined')
       {
          var config_vram = this.resource_added[index].configuration.config_vram;
          totalvram = totalvram + config_vram;
       }
     }); 
     if(totalvram>this.rs_total_vram)
     {
       Swal.fire('Oops...', "Instructor can't have enough vRAM resource.", 'warning');       
       this.configfrm.controls['config_vram'].setValue('');
       return true;      
     }

     if(num>this.rs_max_vram)
     {
       Swal.fire('Oops...', "Instructor can add max virtual vRAM "+this.rs_max_vram+".", 'warning');
       this.configfrm.controls['config_vram'].setValue('');
       event.preventDefault();
       return false;
     }
  }  
}

checkMaxStorage(event:any,indx:any)
{
  if(this.group_id=='2')
  {    
     let diskfrmArray = this.configfrm.get('disk_array') as FormArray;
      var storage_exit = 0;
      diskfrmArray.value.forEach((myObject:any, i:any) => {
        if(diskfrmArray.value[i]['disk_size']!=null)
        {
          var num = Number(diskfrmArray.value[i]['disk_size']);
          storage_exit = storage_exit+num;
        }
      });


      this.resource_added.forEach((myObject:any, index:any) => { 
        var asset_type = this.resource_added[index].asset_type;
        var asset_unique_id = this.resource_added[index].asset_unique_id;
         if(asset_type == 'VM' && asset_unique_id!=this.current_asset_unique_id && typeof this.resource_added[index].configuration != 'undefined')
        {
             if(typeof this.resource_added[index].configuration.disk_array != 'undefined')
            {
                var disk_data_array = this.resource_added[index].configuration.disk_array;
                disk_data_array.forEach((diskObj:any, diskindex:any) => { 
                storage_exit = storage_exit+disk_data_array[diskindex]['disk_size'];
              }); 
            }
        }
      }); 
 
      if(storage_exit>this.rs_total_storage)
      {
        Swal.fire('Oops...', "Instructor can't have enough storage resource.", 'warning');
        var disk_name = this.configfrm.controls['disk_array']['value'][indx]['disk_name'];

        var exist_disk_id = '';

        if(typeof this.configfrm.controls['disk_array']['value'][indx]['exist_disk_id'] != 'undefined')
        {
           exist_disk_id = this.configfrm.controls['disk_array']['value'][indx]['exist_disk_id'];
        }

        const disk_fa = (this.configfrm.get('disk_array')as FormArray);
        disk_fa.removeAt(indx);
        this.add_disk_row(disk_name,'','',exist_disk_id);
        return true;      
      }

      var num = Number(diskfrmArray.value[indx]['disk_size']);
      if(num > this.rs_max_storage)
      {
        var disk_name = diskfrmArray.value[indx]['disk_name'];
        var disk_size = '';
        diskfrmArray.removeAt(indx);
        diskfrmArray.insert(indx, this.fb.group({
          disk_name: [disk_name],
          disk_size: [disk_size]
        }));

        Swal.fire('Oops...', "Instructor can add max disk size "+this.rs_max_storage+" GB.", 'warning');
        return false;
      }
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

get f() { return this.configfrm.controls; }
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

  /* here sort two dimensional array  */
  dynamicSort(property:any) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a:any,b:any) {
        /* next line works with strings and numbers */
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

  //here check alphanumerc character
  keyPressAlphaNumeric(event:any)
  {
    var inp = String.fromCharCode(event.keyCode);
    if(event.target.value.length>=20)
    {
    event.preventDefault();
    return false;    
    }

    if (/^[a-zA-Z0-9_\\\/.’'-]+$/.test(inp)) {
    return true;
    } else {
    event.preventDefault();
    return false;
    }
  }

  setFlashMessage(type:any,message:any)
  {
    this.messageArray.type = type;
    this.messageArray.message = message;
    this.stringifiedData = JSON.stringify(this.messageArray);   
    this.LoginService.setflashMessage(this.stringifiedData);
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

  check_disk_name(event:any,findindex:any)
  {
    let diskfrmArray = this.configfrm.get('disk_array') as FormArray;
      diskfrmArray.value.forEach((myObj:any, index:any) => {
        if(findindex!=index && event.target.value==myObj.disk_name)
        {

          diskfrmArray.value.forEach((diskObj:any, index:any) => {
            if(findindex==index)
            {
                var disk_size = diskObj.disk_size;
                diskfrmArray.removeAt(findindex);
                diskfrmArray.insert(findindex, this.fb.group({
                  disk_name: [''],
                  disk_size: [disk_size, [greaterThanZeroValidator]]
                }));
                Swal.fire('Oops...', "This disk name aleardy used.", 'warning');
            }
          });  
        }
    });
  }
  //here check internet alerady select or not
  selectNetInterface(event:any,findindex:any)
  {
    let nicfrmArray = this.configfrm.get('nic_array') as FormArray;
   
    // var vm_exsit = false;
    // this.resource_added.forEach((Obj:any, ind:any) => { 
    //   if(vm_exsit == false && typeof Obj.created!='undefined')
    //   {
    //     vm_exsit = true;
    //   }
    // });
    
    // this.resource_added.forEach((Obj:any, ind:any) => { 
    //      if(Obj.asset_type=='Switch' && Obj.asset_name==event.target.value && typeof Obj.created=='undefined')
    //      {
    //           var nic_name = nicfrmArray.value[findindex].nic_name;
    //           var nic_network = '';
             
    //           if(this.infra_create_status=='pending' && vm_exsit==true)
    //           {
    //               nicfrmArray.removeAt(findindex);
    //               nicfrmArray.insert(findindex, this.fb.group({
    //                 nic_name: [nic_name],
    //                // nic_interface: [nic_name],
    //                 nic_network: [nic_network]
    //               }));

    //               Swal.fire('Oops...', "Please first prepare infra before update it.", 'warning');
    //               this.modalConfgRef.close(); 
    //           }
    //      }
    // });
  }
  //here check internet alerady select or not
  selectNet(event:any,findindex:any)
  {
    let nicfrmArray = this.configfrm.get('nic_array') as FormArray;
    nicfrmArray.value.forEach((nicObj:any, index:any) => {
      if(findindex!=index && nicObj.nic_network=="Internet" && event.target.value=="Internet")
      {
        var nic_name = nicfrmArray.value[findindex].nic_name;
        var nic_network = '';
        nicfrmArray.removeAt(findindex);
        nicfrmArray.insert(findindex, this.fb.group({
          nic_name: [nic_name],
          nic_network: [nic_network]
        }));
        Swal.fire('Oops...', "Internet already selected.", 'warning');
      }
    });

    var vm_exsit = false;
    this.resource_added.forEach((Obj:any, ind:any) => { 
      if(vm_exsit == false && typeof Obj.created!='undefined')
      {
        vm_exsit = true;
      }
    });
    
    this.resource_added.forEach((Obj:any, ind:any) => { 
         if(Obj.asset_type=='Switch' && Obj.asset_name==event.target.value && typeof Obj.created=='undefined')
         {
              var nic_name = nicfrmArray.value[findindex].nic_name;
              let nicInterface = nicfrmArray.value[findindex].nic_interface;
              var nic_network = '';
             
              if(this.infra_create_status=='pending' && vm_exsit==true)
              {
                  nicfrmArray.removeAt(findindex);
                  nicfrmArray.insert(findindex, this.fb.group({
                    nic_name: [nic_name],
                    nic_interface: [nicInterface],
                    nic_network: [nic_network]
                  }));

                  Swal.fire('Oops...', "Please first prepare infra before update it.", 'warning');
                  this.modalConfgRef.close(); 
              }
         }
    });
  }

  preloadData()
  {
    this.ds.sendData('get_permission');
  }
  
  set_permission(data:any)
  {
      if(typeof data.permission.create_exercise!='undefined' && data.permission.create_exercise=='Denied')
      {
         this.router.navigate([this.dashboard_url+'dashboard']);
      }
  }

}

