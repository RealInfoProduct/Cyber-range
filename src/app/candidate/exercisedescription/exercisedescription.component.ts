import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, QueryList, ViewChildren } from '@angular/core';
import { Options, ChangeContext, PointerType } from '@angular-slider/ngx-slider';
import { LoginService } from '../../services/login.service';
import { BackenddbService } from '../../services/backenddb.service';
import { FrontenddbService } from '../../services/frontenddb.service';
import { DatapassService } from '../../services/datapass.service';
import { Subscription } from 'rxjs/Subscription';

import { Router, ActivatedRoute } from '@angular/router';
import {FilterPipe} from '../../modal/filter.pipe';

import { faStar, faQuestion, faQuestionCircle, faCircle, faShoppingCart, faFlag, faTasks, faTrophy, faCreditCard, faCartPlus, faUserCircle} from '@fortawesome/free-solid-svg-icons';
import { FormGroup,  FormBuilder, FormArray, FormControl, Validators  } from '@angular/forms';

@Component({
  selector: 'app-exercisedescription',
  templateUrl: './exercisedescription.component.html',
  styleUrls: ['./exercisedescription.component.css']
})
export class ExercisedescriptionComponent implements OnInit {
	
	//icon 
	faStar = faStar;
	faQuestion = faQuestion;
	faQuestionCircle = faQuestionCircle;
	faCircle = faCircle;
	faShoppingCart = faShoppingCart;
	faFlag = faFlag;
	faTrophy = faTrophy;
	faCreditCard = faCreditCard;
	faCartPlus = faCartPlus;
	faUserCircle = faUserCircle;
	
	subscription: Subscription;

	server_url:string;

	loader:boolean = false;

	exercise = [];
	// for store added exercise
	added_basket = [];

	// exercise alias
	alias:string = "";
	status:string = "";
	visibility:string = "";
	
	/*breadcrumbs array */
	current_url_array = [];
	form_title:string = 'Exercise Description';

	setting = [];
	credit_system:string = 'Inactive';

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private BackenddbService: BackenddbService,
		private loginService: LoginService,   
		private FrontenddbService: FrontenddbService,  
		private fb:FormBuilder,
		private ds: DatapassService 

		) {		
		this.server_url = this.loginService.getServerUrl(); 
        // get alias from url
		this.alias = this.route.snapshot.paramMap.get('alias');

		if(this.alias!=null)
		{

		}else
		{
			this.router.navigate(['/exercise-repository']);
		}


		this.loader = true;
		const formData = new FormData();
		formData.append('ex_id','');
		formData.append('ex_alias',this.alias);
		formData.append('ex_status',this.status);
		formData.append('ex_visibility',this.visibility);

		// Here get exercise 
		 this.FrontenddbService.getExercise(formData).subscribe(
		 	res => {
				this.loader = false;
				this.exercise = Array.from(Object.keys(res), k=>res[k]);
		 	});
	}

	ngOnInit(): void {	
		/*breadcrumbs array */
		this.current_url_array = [
			{'slug':"",'label':'Exercise Description'}
		];
		this.loadSubcData();
	}

	loadSubcData()
	{
	  this.subscription = this.ds.getData().subscribe(x => { 
		if(x[0]=='set_permission')
		{
		   this.set_permission(x[1]);
		}
	  });
	}
	

	get_added_basket(basket:any)
	{
		this.added_basket = basket;
	} 

	get_setting(settings:any)
	{
		this.setting = settings;
		this.setting.forEach( (setObj:any, index:any) => {
			if(setObj.skey=="credit_system")
			{
				var svalue = JSON.parse(setObj.svalue);
				if(svalue[0].status=='Active')
				{
					this.credit_system = 'Active';
				}
			}
	   });
	}

	set_permission(data:any)
	{
		if(data.permission.enroll=='Denied')
		{
			this.router.navigate(['/']);
		}
	}

	preloadData()
	{
	    this.ds.sendData('get_permission');
	}


}
