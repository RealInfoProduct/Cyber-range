import { Component, OnInit } from '@angular/core';
import { DatapassService } from '../../services/datapass.service';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup,  FormBuilder, FormArray, FormControl, Validators  } from '@angular/forms';
import {noWhitespaceValidator} from '../../helper/validatefun';
import { LoginService } from '../../services/login.service';
import { BackenddbService } from '../../services/backenddb.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

declare const modal:any;

@Component({
  selector: 'app-common',
  templateUrl: './common.component.html',
  styleUrls: ['./common.component.css']
})
export class CommonComponent implements OnInit {

  subscription: Subscription;
  tpinfrm: FormGroup;
  progressbar:boolean = false;
  server_url:string = '';
  group_id:string = '';
  dashboard_url:string = '';
  fun_call:string = '';
  error_messages = {
		't_pin': [
		{ type: 'required', message: 'TPIN is required' },
		] 
    };

  constructor(
    private fb:FormBuilder,
    private ds: DatapassService,
    private loginService:LoginService,
    private BackenddbService:BackenddbService,
    private router: Router,

   ) {    
     this.server_url = this.loginService.getServerUrl();
     this.group_id = this.loginService.getLoginGroup();
     this.dashboard_url = this.loginService.getDashboardUrl();
   }

  ngOnInit(): void {
    this.tpinfrm = this.fb.group({
			t_pin: ['', [Validators.required,noWhitespaceValidator]],
		});
    this.loadData();
  }

  loadData()
  {
    this.subscription = this.ds.getData().subscribe(x => {
      if(typeof x !='undefined')
      {
          if(x[0]=='openTpinModal')
          {
            this.openTpinModal(x[1]);
          }else if(x[0]=='showloader')
          {
            this.showLoader(x[1]);
          }else if(x[0]=='checkClaim' && this.group_id=='2')
          {
             this.checkClaim(x[1],x[2]);
          }else if(x[0]=='getCredit' && this.group_id=='1')
          {
             this.getCredit(x);
          }else if(x[0]=='getResRequest')
          {
            this.getResRequest(x);
          }
      }
    });
  }

  openTpinModal(data:any)
  {
     this.fun_call = data;
     (<any>$('#tpinModal')).modal('show');
  }

  showLoader(flag:any)
  {
    this.progressbar = flag;
  }

  submit_tpin(data:any)
  {
    if(this.tpinfrm.valid)
		{
      if(this.fun_call=='submit_claim')
      {
        var array = ['submit_claim',data.t_pin];
        this.ds.sendData(array);
      }
      (<any>$('#tpinModal')).modal('hide');
		}else
		{
		  this.validateAllFormFields(this.tpinfrm); // check validation
		}
  }

  getCredit(data:any)
  {
    const formData = new FormData();
    formData.append('type',data[1]);
    formData.append('id',data[2]);
    var api = 'admin-api/get-claim-credit';
    this.BackenddbService.postData(api,formData).subscribe((res:any) => {
      if(res.status=='success')
      {
        var array = ['setCredit',res.data.credit];
        this.ds.sendData(array);
      }
    })
  }

  checkClaim(type:any,redirect:any)
  {
    const formData = new FormData();
    formData.append('type',type);
    var api = 'admin-api/get-claim';
    this.BackenddbService.postData(api,formData).subscribe((res:any) => {
        if(res.status=='success')
        {
          if(redirect!='No')
          {
            Swal.fire('Oops...', res.message, 'warning');
            this.router.navigate([this.dashboard_url+'claim-list/'+res.id]);
          }

          if(res.res_type=='2')
          {
              var array = ['disableChat',''];
              this.ds.sendData(array);
          }
        }
      });
  }
  
  getResRequest(data:any)
  {
    const formData = new FormData();
    formData.append('res_type',data[1]);
    formData.append('user_id',data[2]);
    var api = 'admin-api/get_res_request';
    this.BackenddbService.postData(api,formData).subscribe((res:any) => {
      if(res.status=='success')
      {
        var array = ['setResRequest',res.data];
        this.ds.sendData(array);
      }
    })
  }

  get f() { return this.tpinfrm.controls; }

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
