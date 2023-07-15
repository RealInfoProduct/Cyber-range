import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, QueryList, ViewChildren } from '@angular/core';
import { Options, ChangeContext, PointerType } from '@angular-slider/ngx-slider';
import { LoginService } from '../../services/login.service';
import { BackenddbService } from '../../services/backenddb.service';
import { FrontenddbService } from '../../services/frontenddb.service';
import { DatapassService } from '../../services/datapass.service';
import { Subscription } from 'rxjs/Subscription';
import { Router, ActivatedRoute } from '@angular/router';

import { faStar, faCircle, faQuestion, faQuestionCircle, faPowerOff, faTrash, faShoppingCart, faRecycle, faCog, faArrowCircleRight, faAngleDoubleLeft, faAngleDoubleRight, faAngleUp, faAngleDown, faAnchor, faLifeRing, faUndo, faCartPlus, faMoneyBill, faMoneyBillWave, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { FormGroup,  FormBuilder, FormArray, FormControl, Validators  } from '@angular/forms';
import {FilterPipe} from '../../modal/filter.pipe';
import { animate, style, transition, trigger } from '@angular/animations';
import { Renderer2 } from '@angular/core';

@Component({
  selector: 'app-exerciserepository',
  templateUrl: './exerciserepository.component.html',
  styleUrls: ['./exerciserepository.component.css'],
})
export class ExerciserepositoryComponent implements OnInit {

	//icon
	selectedFilterMenu:any = 1;
	faStar = faStar;
	faCircle = faCircle;
	faQuestionCircle = faQuestionCircle;
	faQuestion = faQuestion;
	faPowerOff = faPowerOff;
	faTrash = faTrash;
	faShoppingCart = faShoppingCart;
	faRecycle = faRecycle;
	faCog = faCog;
	faArrowCircleRight = faArrowCircleRight;
	faAngleDoubleLeft = faAngleDoubleLeft;
	faAngleDoubleRight = faAngleDoubleRight;
	faAngleUp = faAngleUp;
	faAngleDown = faAngleDown;
	faAnchor = faAnchor;
	faLifeRing = faLifeRing;
	faUndo = faUndo;
	faCartPlus = faCartPlus;
	faMoneyBill = faMoneyBill;
	faMoneyBillWave = faMoneyBillWave;
	faUserCircle = faUserCircle;
	subscription: Subscription;
	selectedExType = ''

	
	//store teaming
	search_keyword:string = '';
	teamingList = [];
	// difficultyList = ['Low','Medium','High'];
	difficultyList = [ 
		{
			difficultyName : "Low",
			isChecked: false
		},
		{
			difficultyName : "Medium",
			isChecked: false
		},
		{
			difficultyName : "High",
			isChecked: false
		}
	];
	difficultyClass = ['lowc','mediumc','highc'];
	exe_type = ['Instructor-Led','Self-Paced'];
	exe_val:string = '';
	exerciseData = [];
	newsList = [];
	start_limit:number = 0;
	length:number = 16;

	/* rating filter */
	minValue:string = '1';
	maxValue:string = '5';
	options: Options = {
	  floor: 1,
	  ceil: 5,
	  showTicksValues: true
	};
	user_id:string='';
	//load more btn
	load_more_btn:boolean = true;
	//loader 
	loader:boolean = false;
	logText: string = '';
	toggletxt:any='Show Filter';

	// for store added exercise
	added_basket = [];

	exefilterfrm: FormGroup;
	
	/* show hide button */
	isShow = false;

	userRatingArr = [
		{
			value: '1',
			checked: false
		},
		{
			value: '2',
			checked: false
		},
		{
			value: '3',
			checked: false
		},
		{
			value: '4',
			checked: false
		},
		{
			value: '5',
			checked: true
		}
	]
	toggleDisplay() {
		this.isShow = !this.isShow;
		if(this.toggletxt =='Show Filter'){
            this.toggletxt='Hide Filter';
        }
        else{
            this.toggletxt = 'Show Filter';
        }
	}
	/* End */

	server_url:string;	

	setting = [];
	credit_system:string = 'Inactive';
	
	/*breadcrumbs array */
	current_url_array = [];
    form_title:string = 'Exercises';
	isFilterOption = false;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private BackenddbService: BackenddbService,
		private loginService: LoginService,   
		private FrontenddbService: FrontenddbService,  
		private fb:FormBuilder,
		private ds: DatapassService 

	) 
	{		
		this.server_url = this.loginService.getServerUrl();
		this.user_id = this.loginService.getUserId();
		
		if(this.user_id == null){
			localStorage.clear();
		}
        //Here get teaming list
		this.BackenddbService.getTeamingList().subscribe((data:any) => {
			// this.teamingList = Array.from(Object.keys(data), k=>data[k]);
			// const dataArray = this.teamingList
			// dataArray.map((ele :any) =>  ele = {colorName : ele, isChecked : false} )
			// console.log(dataArray ,"vc=========");

			const inputObject = data
			const outputArray = [];
			  for (const key in inputObject) {
				if (Object.hasOwnProperty.call(inputObject, key)) {
				  outputArray.push({
					colorName: inputObject[key],
					isChecked: false
				  });
				}
			  }
			  outputArray.pop(); // Remove the last element since it doesn't exist in the desired output
			  this.teamingList = outputArray
			  
		});	

		//Here get news	
		const formData = new FormData();
		this.FrontenddbService.getNews(formData).subscribe(
			res => {
				this.newsList = Array.from(Object.keys(res), k=>res[k]);
			});

			console.log(this.exe_type);
	}
	
	ngOnInit(): void {
		/*breadcrumbs array */
		this.current_url_array = [
			{'slug':"",'label':'Exercises'}
		];

        //Here set form group
		this.exefilterfrm = this.fb.group({
			teaming: this.fb.array([]),
			difficulty: this.fb.array([]),
			exe_type: [],
			search:[]
		  }); 
		this.loadExerciseRepository();  
		
		if (window.screen.width < 767) 
		{ // 768px portrait
			this.isShow = true;
		}
		  else{
			this.isShow = false;
		}	
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

	// load exercise
	loadExerciseRepository()
	{
		this.loader = true;
		const formData = new FormData();
		formData.append('rating',this.maxValue);
		formData.append('teaming',this.exefilterfrm.value.teaming);
		formData.append('difficulty_level',this.exefilterfrm.value.difficulty);
		formData.append('exe_type',this.exe_val);
		formData.append('search', this.search_keyword);
		formData.append('order_by', 'ex.id');
		let num = this.start_limit;//number
		var start_limit = num.toString(); // convert to string
		formData.append('start_limit', start_limit);
		let num1 = this.length;//number
        var length = num1.toString(); // convert to string
		formData.append('length', length);

		// Here get exercise 
		this.FrontenddbService.getExerciseRepository(formData).subscribe(
			res => {
				setTimeout( () => { this.loader = false; }, 1000 );
				res.forEach((myObject:any, index:any) => {
					this.exerciseData.push(res[index]);
				});
				this.exerciseData.forEach((element, index ) => {
					if (index === 0) {
						element.duration = `700ms`
					} else {
						element.duration = `${index * 1000 }ms`
					}
				})
				
				if(res.length>=16)
				{
					this.load_more_btn = true;
				}else
				{
					this.load_more_btn = false;
				}
			});

	}

	// on rating change
	onUserChangeEnd(changeContext: ChangeContext): void {
		this.exerciseData = [];
		this.start_limit = 0;
		this.loadExerciseRepository();
	}

	// on teaming change
	onChange(team:string, isChecked: boolean)
	{
 		const index = this.teamingList.findIndex(id => id.colorName === team)
 		this.teamingList[index].isChecked = !this.teamingList[index].isChecked
		const teamFormArray = <FormArray>this.exefilterfrm.controls.teaming;
    	if (isChecked) {
			teamFormArray.push(new FormControl(team));
		} else {
		  let index = teamFormArray.controls.findIndex(x => x.value == team)
		  teamFormArray.removeAt(index);
		}
		this.exerciseData = [];
		this.start_limit = 0;	
		this.loadExerciseRepository();
	  }

	// on difficulty level change
	  onDiffChange(diffy:string, isChecked: boolean)
	  {
		const index = this.difficultyList.findIndex(id => id.difficultyName === diffy)
 		this.difficultyList[index].isChecked = !this.difficultyList[index].isChecked
		const diffyFormArray = <FormArray>this.exefilterfrm.controls.difficulty;
		if (isChecked) {
			diffyFormArray.push(new FormControl(diffy));
		} else {
		  let index = diffyFormArray.controls.findIndex(x => x.value == diffy)
		  diffyFormArray.removeAt(index);
		}
		this.exerciseData = [];
		this.start_limit = 0;
		this.loadExerciseRepository();
	  }

	onExTypeChange(diffy: string, isCloseClicked?: boolean) {
		if (isCloseClicked) {
			this.exe_val = ''
		}
		console.log("exe_val========>",this.exe_val);
		
		this.exerciseData = [];
		this.start_limit = 0;
		this.loadExerciseRepository();
	}

	  

	// on load more click  
	loadMore()
	{
		this.start_limit = this.start_limit+this.length; 
		this.loadExerciseRepository(); 
	}
	
	search(data:any)
	{
		this.exerciseData = [];
		this.start_limit = 0;
		this.search_keyword = data.search;
		this.loadExerciseRepository(); 
	}
	
	resetForm() {
		window.location.reload();
    }

	onKeyUpEvent(data:any)
	{
		if(data.search=="")
		{
		this.exerciseData = [];
		this.start_limit = 0;
		this.search_keyword = data.search;
		this.loadExerciseRepository();
		}
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


	showFilterOption(){
		this.isFilterOption = !this.isFilterOption
	}

	userRatingChange(item :any, close ?: any){
		this.userRatingArr.forEach((element, index) => {
			if (element.value === item.value) {
				element.checked = true
			} else if (close && index == 4) {
				element.checked = true
			} else {
				element.checked = false
			}
		})
		this.maxValue = close == false ? item.value : this.userRatingArr[4].value
		this.exerciseData = [];
		this.start_limit = 0;
		this.loadExerciseRepository();
	}

	selectedMenu(index){
		this.selectedFilterMenu = index;
	}


	reting(reting){
		return new Array(Number(reting))
	}
}
