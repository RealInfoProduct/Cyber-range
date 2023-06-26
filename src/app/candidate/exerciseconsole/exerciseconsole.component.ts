import { Component, OnInit } from '@angular/core';
import { faBars, faArrowCircleRight, faArrowCircleLeft, faAngleRight, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { LoginService } from '../../services/login.service';
import { ManualService } from '../../services/manual.service';
import { FrontenddbService } from '../../services/frontenddb.service';
import { BackenddbService } from '../../services/backenddb.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription }   from 'rxjs/Subscription';

import Swal from 'sweetalert2';

declare const sidepanel: any;
declare const closeNav: any;
@Component({
  selector: 'app-exerciseconsole',
  templateUrl: './exerciseconsole.component.html',
  styleUrls: ['./exerciseconsole.component.css']
})
export class ExerciseconsoleComponent implements OnInit {

  ex_exercise_id:string="";
  ex_mode:string="";
  ex_manual_id =[];
  extra_id:string="";
  vl_id:string="";
  intervalId:any;
	teamObj:Subscription;
  team_id:string="";

  constructor(
    private route: ActivatedRoute,
    private FrontenddbService:FrontenddbService,
    private BackenddbService:BackenddbService,
  ) {
    
       this.extra_id = this.route.snapshot.paramMap.get('extraid');
       this.vl_id = this.route.snapshot.paramMap.get('id');


       if(this.vl_id!='preview')
       {
          const formData = new FormData();
          formData.append('extra_id',this.extra_id);
          formData.append('vl_id',this.vl_id);

          this.FrontenddbService.getManualData(formData).subscribe((res:any) => {
              if(res.status=='success')
              {
                this.ex_manual_id = Array.from(Object.keys(res.start_manual), k=>res.start_manual[k]);;
                this.ex_exercise_id = res.ex_id;
                this.team_id = res.team_id;

                if(typeof res.mode!='undefined' && res.mode=='webconsole')
                {
                    this.ex_mode = res.mode;
                }

              }else if(res.status=='error')
              {
                Swal.fire('',res.message,'warning');
              }
          });
       }else
       {
        const formData = new FormData();
        formData.append('preview','Yes');
        formData.append('manual_id',this.extra_id);
        
        this.FrontenddbService.getManualData(formData).subscribe((res:any) => {
            if(res.status=='success')
            {
              this.ex_manual_id = Array.from(Object.keys(res.start_manual), k=>res.start_manual[k]);;
            }else if(res.status=='error')
            {
              Swal.fire('',res.message,'warning');
            }
        });
       }

  }

  ngOnInit(): void {


  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
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
  
}
