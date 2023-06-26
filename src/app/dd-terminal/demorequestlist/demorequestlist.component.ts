import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { HttpClient,HttpParams  } from '@angular/common/http';
import { LoginService } from '../../services/login.service';
import { faPlusCircle,faUser, faEdit, faTrash, faEnvelope, faUsers, faEye,faBars, faCamera,faPlus,faMinus,faCog,faPowerOff,faDesktop,faDownload ,faFileExport,faRedo,faList,faNetworkWired } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { BackenddbService } from '../../services/backenddb.service';
import { DatapassService } from '../../services/datapass.service';
import { Subscription } from 'rxjs/Subscription';
import { Constants } from 'src/constants';

declare const activesidebar:any;
class Demorequest {
  id: number;
  candidate_name: string;
  candidate_email: string;
  contact_number:string;
  created_at:string;
}
class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  param:any;
 
}
@Component({
  selector: 'app-demorequestlist',
  templateUrl: './demorequestlist.component.html',
  styleUrls: ['./demorequestlist.component.css']
})




export class DemorequestlistComponent implements OnInit {
  current_url_array = [];
  serverUrl:any='';
  demo_search:string='';
  form_title:string = 'Demo Request List';
  faTrash=faTrash;
  faEnvelope=faEnvelope;
  demorequest:Demorequest[];
  @ViewChildren(DataTableDirective)
  dtElements: QueryList<DataTableDirective>;
  dtOptions: DataTables.Settings[] = [];
  dtUserOptions: DataTables.Settings[] = [];
  current_action:string = '';
  action_id:string = '';
  subscription: Subscription;

  constructor(private http: HttpClient,
              private LoginService: LoginService, 
              private BackenddbService:BackenddbService,
              private ds: DatapassService) {

    this.serverUrl = this.LoginService.getServerUrl();
   }

  ngOnInit(): void {
    activesidebar();
    this.current_url_array = [
			{'slug':"",'label':'Demo Request List'}
		];

    this.drawDemoRequestList();
    this.getSubsData();

  }

  getSubsData()
  {
    this.subscription = this.ds.getData().subscribe(x => { 
      if(x[0]=='reloadDemoList')
      {
         this.rerender_datatable('demorequest-table');
      }
    });
  }

  drawDemoRequestList()  {
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
        params = params.append("search", this.demo_search);
       
        params = params.append("order_col", dataTablesParameters.order[0].column);
        params = params.append("order_type", dataTablesParameters.order[0].dir);   
        
        let param = params.toString();
        that.http
          .post<DataTablesResponse>(
            this.serverUrl+'datatable-api/get_request_list',
            params, {}
          ).subscribe(resp => {

            that.demorequest = resp.data;
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: []
            });
            document.querySelector('.table-responsive').scrollIntoView({ behavior: 'smooth', block: 'end' });

          });
      },
      columns: [{ data: 's_no' }, { data: 'candidate_name' }, { data: 'candidate_email' }, { data: 'candidate_number' }, { data: 'created_at' } ]
   
     };
}

datatableSearch(event:any){
  
    this.demo_search  = event.target.value; 
    this.rerender_datatable('demorequest-table');
  
}

rerender_datatable(datatableName:any) {
  this.dtElements.forEach((dtElement: DataTableDirective, index: number) => {
    dtElement.dtInstance.then((dtInstance: any) => {
      //console.log(dtInstance.table().node().id);
      if(dtInstance.table().node().id == datatableName) {
         dtInstance.draw();
      }
    });
  });
}

deleteRequest(demo_id:any){
  Swal.fire({
    title: 'Are you sure?',
    text: 'Do you really want to delete this Request?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if(result.value) {
      const formData = new FormData();
      formData.append('request_id', demo_id);  
        this.ds.Loader(true);
        var api = 'admin-api/delete-demo-request';
        this.BackenddbService.postData(api,formData).subscribe(
          res => {
            this.ds.Loader(false);
            if(res.status == 'success')
            {
                
                Swal.fire('',res.message,'success');
                this.rerender_datatable('demorequest-table');
            }else 
            {
                Swal.fire('',Constants.ERROR,'warning');
            }
          }
        );
    }
  })
}

action(id:any,schedule_id:any,email:any)
{
   if(this.action_id != id || this.current_action=='')
   {
      Swal.fire('','Select action first.','warning');
      return true;
   }
   var data = {'call_from':'demo_list','id':id,'schedule_id':schedule_id,'email':email};
   if(this.current_action=='DeleteDemo')
   {
     this.deleteRequest(id);
   }else if(this.current_action=='Read' || this.current_action=='Unread')
   {
     this.changeReadStatus(id,this.current_action);
   }
   else
   {
      var array = [this.current_action,data];
      this.ds.sendData(array);
   }
}

changeAction(event:any,id:any)
{
   this.current_action = event.target.value;
   this.action_id = id;
}

changeReadStatus(id:any,status:any){
    const formData = new FormData();
    formData.append('request_id', id);  
    formData.append('status', status);  
    this.ds.Loader(true);
    var api = 'admin-api/change-read-status';
    this.BackenddbService.postData(api,formData).subscribe(
      res => {
        this.ds.Loader(false);
        if(res.status == 'success')
        {
            
            Swal.fire('',res.message,'success');
            this.rerender_datatable('demorequest-table');
        }else 
        {
            Swal.fire('',Constants.ERROR,'warning');
        }
      }
    );
}

statusshow(status){
  if(status =='Read'){
    return true;
  }
  else{
    return false;
  }
}
checkseenStatus(status){
  if(status =='Read'){
    return true;
  }
  else{
    return false;
  }
}
    checkunseenStatus(status){
      if(status =='Unread'){
        return true;
      }
      else{
        return false;
      }
}

}
