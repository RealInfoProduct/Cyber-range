import { Component, OnInit ,ViewChild} from '@angular/core';
import { LoginService } from '../../services/login.service';
import { faPaperPlane, faStopCircle, faHandPaper, faStop, faRocket, faDotCircle, faList, faTh } from '@fortawesome/free-solid-svg-icons';
import { DataTableDirective } from 'angular-datatables';
import { environment } from '../../../environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient,HttpParams  } from '@angular/common/http';
class Exercises {
	id: number;
	name: string;
	allot_id: string;
	start_date:string;
	end_date:string;
	status:string;
  }
  class DataTablesResponse {
	data: any[];
	draw: number;
	recordsFiltered: number;
	recordsTotal: number;
	param:any;
  }

@Component({
  selector: 'app-labusages',
  templateUrl: './labusages.component.html',
  styleUrls: ['./labusages.component.css']
})
export class LabusagesComponent implements OnInit {

	@ViewChild(DataTableDirective)
	dtElement: DataTableDirective;
	dtOptions: DataTables.Settings = {};
	exercise: Exercises[];
	faPaperPlane = faPaperPlane;
	faStopCircle = faStopCircle;
	faHandPaper = faHandPaper;
	faDotCircle = faDotCircle;
	faRocket = faRocket;
	faStop = faStop;
	faList = faList;
	faTh = faTh;
	serverUrl = environment.baseUrl;
	/*breadcrumbs array */
	current_url_array = [];
	form_title:string = 'My Exercises Stats';
	searchVal:string='';
	server_url:string;	
	
	constructor(private loginService: LoginService,private http: HttpClient,
		private router: Router,
		private route: ActivatedRoute,
		) { 
		this.server_url = this.loginService.getServerUrl();
			
   
	}
	
	ngOnInit(): void {	
		/*breadcrumbs array */		
		this.current_url_array = [
			{'slug':"",'label':'My Exercises Stats'} 
		];
		const that = this;
		this.dtOptions = {
  
		dom: '<"top">tr<"bottom"ilp><"clear">',
  
		pagingType: 'full_numbers',
		pageLength: 10,
		serverSide: true,
		processing: true,
		order: [[ 0, "desc" ]],
  
		ajax: (dataTablesParameters: any, callback) => {
		 
  
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
		
  
		  console.log(dataTablesParameters.length);
		 // console.log(startNumber);
  
  
		  let param = params.toString();
  
		  console.log(param);
		  that.http
			.post<DataTablesResponse>(
			  this.serverUrl+'datatable-api/dt_exercisestats_list',
			  params, {}
			).subscribe(resp => {
			  that.exercise = resp.data;
			  console.log(that.exercise);
  
			  callback({
				recordsTotal: resp.recordsTotal,
				recordsFiltered: resp.recordsFiltered,
				data: []
			  });
			});
		},
		columns: [{ data: 'start_date' },{ data: 'end_date' }]
  
  
  
  
		
	  };

	  
	}
	rerender_datatable() {
		this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
		dtInstance.draw();
		});
		}
	datatableSearch(event){
		this.searchVal  = event.target.value; 
		
		
		this.rerender_datatable();
	  }
}