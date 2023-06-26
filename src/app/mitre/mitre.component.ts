import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BackenddbService } from '../services/backenddb.service';
import { faStar, faCircle, faQuestion, faQuestionCircle, faPowerOff, faTrash, faShoppingCart, faRecycle, faCog, faArrowCircleRight, faAngleDoubleLeft, faAngleDoubleRight, faAngleUp, faAngleDown, faAnchor, faLifeRing, faUndo, faCartPlus, faMoneyBill, faMoneyBillWave, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-mitre',
  templateUrl: './mitre.component.html',
  styleUrls: ['./mitre.component.css']
})

export class MitreComponent implements OnInit {

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

  current_url_array = [];
  form_title:string = '';
  progressbar: boolean = false;
  mitre:any = [];
  exercise:any = [];
  m_id:string = '';
  added_basket:any = [];
  setting:any = [];
  server_url:string = '';
  credit_system:string = 'Inactive';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private BackenddbService:BackenddbService,
    private LoginService:LoginService
  ) { 
       this.server_url = this.LoginService.getServerUrl();
    }

  ngOnInit(): void {

    this.m_id = this.route.snapshot.paramMap.get('id');

    this.current_url_array = [
      {"slug":"","label":"Mitre"}
    ];
    if(this.m_id==null)
    {
       this.get_mitre();
    }else
    {
       this.get_exercise();
    }
  }


  get_mitre()
  {
    this.progressbar = true;
    var api = 'candidate-api/get-mitre';
    this.BackenddbService.getData(api).subscribe(
        res => {
          this.progressbar = false;
          this.mitre = Array.from(Object.keys(res), k=>res[k]);
          console.log(this.mitre);
        });
  }

  get_exercise()
  {
    this.progressbar = true;
    const formData = new FormData();
    formData.append('mitre', this.m_id);
    var api = 'candidate-api/get-mitre-exercise';
    this.BackenddbService.postData(api,formData).subscribe(
        res => {
          this.progressbar = false;
          this.exercise = Array.from(Object.keys(res), k=>res[k]);
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


  matrix_toggle_technique(pass1:any,pass2:any)
  {
    var joined = pass1 + "--" + pass2;
    $(".subtechniques--" + joined).toggleClass("hidden");
    $(".sidebar--" + joined).toggleClass("expanded");
  }

}
