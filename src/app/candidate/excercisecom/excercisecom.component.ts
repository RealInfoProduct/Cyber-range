import { Component, OnInit,Input } from '@angular/core';
import { faBars, faArrowCircleRight, faArrowCircleLeft, faAngleRight, faAngleDown, faAngleDoubleUp, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { LoginService } from '../../services/login.service';
import { ManualService } from '../../services/manual.service';
import { FrontenddbService } from '../../services/frontenddb.service';
import { BackenddbService } from '../../services/backenddb.service';
import { Subscription }   from 'rxjs/Subscription';

declare const sidepanel: any;
declare const closeNav: any;
declare const openNav: any;
declare const back_to_top: any;
declare const sidepanel_zoomimg: any;

@Component({
  selector: 'app-excercisecom',
  templateUrl: './excercisecom.component.html',
  styleUrls: ['./excercisecom.component.css']
})
export class ExcercisecomComponent implements OnInit {
  @Input() ex_exercise_id: any;
  @Input() team_id: any;

  // this property value is bound to a different property name
  // when this component is instantiated in a template.
  @Input() ex_manual_id: any;
  @Input() ex_mode: any = '';
 

  faBars = faBars;
  faArrowCircleLeft = faArrowCircleLeft;
  faArrowCircleRight = faArrowCircleRight;
  faAngleRight = faAngleRight;
  faAngleDown = faAngleDown;
  faAngleDoubleUp = faAngleDoubleUp;
  faAngleUp = faAngleUp;

  manual_title: string = '';
  server_url: string;
  title_selected: string = '';
  description_selected: string = '';
  topicslist = [];
  progress_message: string = '';
  search_key: any;
  updateItem: any = '';
  prevdisabled: boolean = false;
  nextdisabled: boolean = false;
  selected_content: string = '';
  progressbar: boolean = false;
  search_element: boolean = false;
  show_nav: boolean = false;
  manual_id: string = '';
  selected_mid:any='';
  search_result =[];
  exercise_id:any;
  topic_array = [];
  start_index :any='';
  end_index :any='';
  getExercisedata=[];
  intervalId:any;
	teamObj:Subscription;

  constructor(private loginService: LoginService,
              private ManualService: ManualService,
              private FrontenddbService: FrontenddbService,
              private BackenddbService: BackenddbService) {
    this.server_url = this.loginService.getServerUrl();
  }

  ngOnInit(): void {
   
    sidepanel();
    back_to_top();
    sidepanel_zoomimg();

    window.scroll(0, 0);

    if(this.ex_exercise_id != '' && this.ex_mode ==''){
      this.getExeData();
    }
    else{
      openNav();
    }

    const formData = new FormData();
    this.selected_mid =this.ex_manual_id[0].id;
    
    formData.append('manual_id', this.ex_manual_id[0].id);
    this.getManualTitle(formData);

    //manual topics
    const mData = new FormData();
    mData.append('manual_id', this.ex_manual_id[0].id);
    this.getTopicWithContent(mData);

    if(typeof this.team_id!='undefined' && this.team_id!='')
    {
       this.track_team_activity();
    }

   }

   ngOnDestroy() {
    clearInterval(this.intervalId);
    }

   getExeData()
   {
    this.prevdisabled=true;
    const  exercisedata = new FormData();
    exercisedata.append('ex_id',this.ex_exercise_id);
    exercisedata.append('ex_alias','');
    exercisedata.append('ex_status','');
    exercisedata.append('ex_visibility','');
    this.FrontenddbService.getExercise(exercisedata).subscribe(
      res => {
        this.getExercisedata= res[0];
      });
   }

   track_team_activity()
   {
        this.intervalId = setInterval(() => { 
        const formdata = new FormData();
        formdata.append('team_id', this.team_id);
        var api = 'candidate-api/team-activity';  
        this.teamObj = this.BackenddbService.postData(api,formdata).subscribe((res:any) => {
             //console.log(res);
          });
        }, 1000*30);
   }


getManualTitle(formData:any){
  this.ManualService.get_manual(formData).subscribe(
    res => {
          this.manual_title = res[0].menual_title;
    });
}
  
  getTopicWithContent(formdata){
    this.ManualService.getTopicWithContent(formdata).subscribe(
      response => {
        this.topicslist = response;
        if(this.topicslist.length>1)
        {
          this.show_nav =true;
        }

        this.progressbar = false;
        if(this.ex_mode=='webconsole')
        {
            this.getTopicDetails(this.topicslist[0]['topic_id']);
        }
      });
  }

  getManualData(event:any){
    this.selected_mid =event.target.value;
    this.progressbar = true;
    const chnageData = new FormData();
    chnageData.append('manual_id', this.selected_mid);
    
    this.getTopicWithContent(chnageData);
    this.getManualTitle(chnageData);
    this.description_selected='';
    this.title_selected='';
  }

  getTopicDetails(topic_id) {
    
    sidepanel();
    this.progressbar = true;
    this.search_element=false;
    this.updateItem = parseInt(topic_id);
    this.selected_content = '';

    this.start_index = this.topicslist[0].topic_id;
    this.end_index = this.topicslist[this.topicslist.length-1].topic_id;

    if(typeof topic_id =='undefined')
    {
       this.description_selected='';
       this.title_selected = null;
       this.getExeData();
       this.progressbar = false;
       sidepanel();
       sidepanel_zoomimg();
       return true;
    }
    else if(this.start_index == topic_id){
      this.prevdisabled=false;
      this.nextdisabled=false;
    }
    else if(this.end_index == topic_id){
      this.nextdisabled=true;
    }
    else{
      this.nextdisabled=false;
    }

    const manData = new FormData();

    manData.append('manual_id', topic_id);
    this.ManualService.get_manual(manData).subscribe(
      res_manual => {
        back_to_top();
        if(res_manual.length!=0)
        {
          this.title_selected = res_manual[0].menual_title;
          this.description_selected = res_manual[0].description;
        }

        this.progressbar = false;
        sidepanel_zoomimg();
        closeNav();
      });
    
   
  }



  next_content(topic_id) {

 
    if(this.topic_array.length == 0){
    for(let i=0;i< this.topicslist.length;i++)
    {
     
      this.topic_array.push(parseInt(this.topicslist[i].topic_id));
    }
  }
 
    var topic =parseInt(topic_id);
   
    var index =  this.topic_array.indexOf(topic);
    
   
    var nextIndex = index+1;
  
    
    this.updateItem = this.topic_array[nextIndex];
    if (this.updateItem !=null &&  this.updateItem !='') {
      
      let last:any = this.topic_array[this.topic_array.length-1];
      if(last == this.updateItem){
        this.nextdisabled = true;
        this.prevdisabled = false;
        this.getTopicDetails(this.updateItem);
      }
      else{
        this.prevdisabled = false;
        this.nextdisabled = false;
  
        this.getTopicDetails(this.updateItem);
      }

    }
    else {
      this.updateItem = parseInt(topic_id);
      this.prevdisabled = false;
      this.nextdisabled = true;
    }
  }


  searchitems(event: any) {
    closeNav();


    this.progressbar = true;
    this.search_element = true;
    this.search_key = event.target.value;
    const formData = new FormData();
    formData.append('search_key', this.search_key);
    formData.append('manual_id', this.selected_mid);
    this.ManualService.searchResult(formData).subscribe(
      res => {
        if (res.status == 'success') {
          this.progressbar = false;
          this.search_result = res;
        }
        else {
          this.progressbar = false;
          this.search_result=[];
        }

      });

  }
  prev_content(topic_id) {

    if(this.topic_array.length == 0){
      for(let i=0;i< this.topicslist.length;i++)
      {
       
        this.topic_array.push(parseInt(this.topicslist[i].topic_id));
      }
    }
  
      var topic =parseInt(topic_id);
      var index =  this.topic_array.indexOf(topic);
      var nextIndex = index-1;
      this.updateItem = this.topic_array[nextIndex];
      
      let first = this.topic_array[0];
      if(first == this.updateItem){
        this.prevdisabled = true;
        this.nextdisabled = false;
  
        this.getTopicDetails(this.updateItem);
      }
      else{
        this.prevdisabled = false;
        this.nextdisabled = false;
        this.getTopicDetails(this.updateItem);
      }
  }

  getContentbyid(content_id:any) {

     closeNav();
    this.search_element=false;
    this.progressbar=true;
    const contentData = new FormData();
    contentData.append('content_id',content_id);
    this.ManualService.getcontent(contentData).subscribe(
      res => {
        this.progressbar=false;
        this.selected_content = res.title;
        this.description_selected = res.description;
      })
  }

  
}
