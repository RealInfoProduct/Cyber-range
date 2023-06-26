import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, QueryList, ViewChildren, ChangeDetectorRef, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient,HttpParams  } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BackenddbService } from '../../services/backenddb.service';
import { FrontenddbService } from '../../services/frontenddb.service';

import { LoginService } from '../../services/login.service';
import {digitValidator} from '../../helper/validatefun';
import { ImageCroppedEvent,ImageTransform,CropperPosition,Dimensions,base64ToFile } from 'ngx-image-cropper';

import { FormGroup,  FormBuilder, FormArray, FormControl, Validators  } from '@angular/forms';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2';
import { faUser, faEdit, faTrash, faUsers, faEye } from '@fortawesome/free-solid-svg-icons';

import { DatapassService } from '../../services/datapass.service';
import { Subscription } from 'rxjs/Subscription';
declare const activesidebar:any;
declare const modal:any;

class Team {
  id: number;
  firstName: string;
  lastName: string;
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
  selector: 'app-voucherlist',
  templateUrl: './voucherlist.component.html',
  styleUrls: ['./voucherlist.component.css']
})
export class VoucherlistComponent implements OnInit {

  @ViewChild('photo') photo: ElementRef;

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
  teams: Team[];
  serverUrl = environment.baseUrl;

  /*flash message*/
  msgalert:any;
  
  /*breadcrumbs array */
  current_url_array = [];

  formdata: FormGroup;
  addvoucherfrm: FormGroup;
  group_id:string = '';
  team_status:string = '';
  error: string;
  closed: boolean = true;
  closedpopop: boolean = true;
  alertMessage: string;
  alertClass: string;
  update_by:string;
  statusList = [];
  closeResult = '';
  checkArray: FormArray;
  candidate_table:boolean = false;
  v_id:string = '';

  dashboard_url:string; 
 
  responseTableArray = [];  // store return response when team assign to candidate 

  server_url:string;

  searchVal = '';

  imageChangedEvent: any = '';
  croppedImage: any = '';
  uploadedImage: any = '';
  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  showCropper = false;
  containWithinAspectRatio = false;
  transform: ImageTransform = {};
  cropos: CropperPosition = {x1:100,y1:100,x2:100,y2:100};
	form_title:any = 'Voucher List';

  /* validation error messsage */
  error_messages = {
    'name': [
    { type: 'required', message: 'Name required' },
    ],
    'price': [
      { type: 'required', message: 'Price required' },
      { type: 'digitValidator', message: 'Invalid input.' }
      ],
    'credit': [
      { type: 'required', message: 'Credit required' },
      { type: 'digitValidator', message: 'Invalid input.' }
      ],
    'status': [
      { type: 'required', message: 'Status required' },
      ],
      'orders': [
        { type: 'required', message: 'Order required' },
        { type: 'digitValidator', message: 'Invalid input.' }
        ],
    };


  constructor(
    private http: HttpClient,
    private router: Router,
    private BackenddbService: BackenddbService,
    private LoginService: LoginService,   
    private FrontenddbService: FrontenddbService,   
    private formBuilder: FormBuilder,
    private dtchange: ChangeDetectorRef,
    private ds: DatapassService
    ) {
        this.update_by = this.LoginService.getUserId();
        this.group_id = this.LoginService.getLoginGroup();
        this.dashboard_url = this.LoginService.getDashboardUrl();
		
		    this.server_url = this.LoginService.getServerUrl();
        
        /* get status list from CI */   
        this.BackenddbService.getStatusList().subscribe((data:any) => {
          this.statusList = Array.from(Object.keys(data), k=>data[k]);
        }); 
    }
	
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
    });

		this.addvoucherfrm = this.formBuilder.group({
      name:['', [Validators.required]],
      price:['', [Validators.required,digitValidator]],
      credit:['', [Validators.required,digitValidator]],
      status:[null, [Validators.required]],
      orders:['', [Validators.required,digitValidator]],
    });

		this.createTeamTable();
		
		this.current_url_array = [
			{'slug':"",'label':'Voucher List'}
		  ];

	}

  ngAfterContentChecked() {
    this.dtchange.detectChanges();
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
   
           let param = params.toString();
           that.http
             .post<DataTablesResponse>(
               this.serverUrl+'datatable-api/get-voucher-list',
               params, {}
             ).subscribe(resp => {
   
               that.teams = resp.data;
   
               callback({
                 recordsTotal: resp.recordsTotal,
                 recordsFiltered: resp.recordsFiltered,
                 data: []
               });
             });
         },
         columns: [{ data: 's_no' }, { data: 'name' }, { data: 'price' },  { data: 'credit' },  { data: 'last_datetime' }]
       };
  }

  datatableSearch(event){
    this.searchVal  = event.target.value; 
    this.rerender_datatable('team-table');
  }

  ngAfterViewInit(): void {
   this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  rerender_datatable(datatableName:any) {
    this.dtElements.forEach((dtElement: DataTableDirective, index: number) => {
      dtElement.dtInstance.then((dtInstance: any) => {
       // console.log(dtInstance.table().node().id);
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

  deleteVoucher(v_id:any)
  {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete voucher?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.value) {
        const formData = new FormData();
        formData.append('id',v_id);      
        this.ds.Loader(true);
        var api = 'admin-api/delete-voucher';
        this.BackenddbService.postData(api,formData).subscribe(
          res => {
            this.ds.Loader(false);
            this.closed = false;
            this.alertMessage = res.message;

            if(res.status=='success')
            {
              this.alertClass = 'success'; 
              this.rerender_datatable('team-table');
            }else
            {
              this.alertClass = 'danger'; 
            }
          });
      }
    })
    .catch(() => 
       console.log('Cancel') 
    );
  }

  add_voucher()
  {
    this.v_id = '';
    this.croppedImage = '';
    this.uploadedImage = '';
    this.addvoucherfrm.patchValue({
      name: '',
      price: '',
      credit: '',
      status: null,
      orders: '',
    });
    this.photo.nativeElement.value = '';
    $('#voucherModal').modal('show');
  }

  getVoucher(id:any)
  {
    this.ds.Loader(true);
    const formData = new FormData();
    formData.append('id', id);      
    var api = 'admin-api/get-voucher';
    this.BackenddbService.postData(api,formData).subscribe(
      res => {
        this.ds.Loader(false);
        this.croppedImage = '';
        if(res.status=='success')
        {
          this.v_id = res.data.id;
          this.uploadedImage = res.data.image;
          this.addvoucherfrm.patchValue({
            name: res.data.name,
            price: res.data.price,
            credit: res.data.credit,
            status: res.data.status,
            orders: res.data.orders,
          });
          $('#voucherModal').modal('show');
        }else
        {
          this.alertMessage = res.message;
          this.closed = false;
          this.alertClass = 'danger'; 
        }
    });  
  }

  submit(data:any)
  {
    if(this.addvoucherfrm.valid) {
      const formData = new FormData();
      formData.append('id', this.v_id);      
      formData.append('name', data.name);      
      formData.append('price', data.price);      
      formData.append('credit', data.credit);      
      formData.append('status', data.status);    
      formData.append('orders', data.orders);    
      formData.append('image', this.croppedImage);      
      this.ds.Loader(true);
  
      var api = 'admin-api/add-voucher';
      this.BackenddbService.postData(api,formData).subscribe(
        res => {
          this.ds.Loader(false);
          this.alertMessage = res.message;
          this.closed = false;
          $('#voucherModal').modal('hide');

          if(res.status=='success')
          {
            this.alertClass = 'success'; 
            this.rerender_datatable('team-table');
          }else
          {
            this.alertClass = 'danger'; 
          }
        });
    } else {
      this.validateAllFormFields(this.addvoucherfrm);
    }
  }

  choose_image()
  {
  }
  
  refreshMainTable() {
    this.dtElements.forEach((dtElement: DataTableDirective, index: number) => {
      dtElement.dtInstance.then((dtInstance: any) => {
      });
    })
  }

  get f() { return this.addvoucherfrm.controls; }
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

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
}

imageCropped(event: ImageCroppedEvent) {
    this.uploadedImage = '';
    this.croppedImage = event.base64;
}

imageLoaded() {
    this.showCropper = true;
}

cropperReady(sourceImageDimensions: Dimensions) {
   // console.log('Cropper ready', sourceImageDimensions);
}

loadImageFailed() {
    //console.log('Load failed');
}

rotateLeft() {
    this.canvasRotation--;
    this.flipAfterRotate();
}

rotateRight() {
    this.canvasRotation++;
    this.flipAfterRotate();
}

private flipAfterRotate() {
    const flippedH = this.transform.flipH;
    const flippedV = this.transform.flipV;
    this.transform = {
        ...this.transform,
        flipH: flippedV,
        flipV: flippedH
    };
}


flipHorizontal() {
    this.transform = {
        ...this.transform,
        flipH: !this.transform.flipH
    };
}

flipVertical() {
    this.transform = {
        ...this.transform,
        flipV: !this.transform.flipV
    };
}

resetImage() {
    this.scale = 1;
    this.rotation = 0;
    this.canvasRotation = 0;
    this.transform = {};
}

zoomOut() {
    this.scale -= .1;
    this.transform = {
        ...this.transform,
        scale: this.scale
    };
}

zoomIn() {
    this.scale += .1;
    this.transform = {
        ...this.transform,
        scale: this.scale
    };
}

toggleContainWithinAspectRatio() {
    this.containWithinAspectRatio = !this.containWithinAspectRatio;
}

updateRotation() {
    this.transform = {
        ...this.transform,
        rotate: this.rotation
    };
}

}
