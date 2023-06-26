import { Component, OnInit,Input,EventEmitter  } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BackenddbService } from '../../services/backenddb.service';
import { FrontenddbService } from '../../services/frontenddb.service';

@Component({
  selector: 'app-viewuserprofile',
  templateUrl: './viewuserprofile.component.html',
  styleUrls: ['./viewuserprofile.component.css']
})
export class ViewuserprofileComponent implements OnInit {
  @Input() get_viewProfile: Subject<any> = new Subject<any>();

  // user profile photo
  croppedImage: any = '';
  /* View user profile */
  candidate_f_name:string = '';
  candidate_l_name:string = '';
  candidate_m_name:string = '';
  candidate_status:string = '';
  candidate_email:string = '';
  candidate_mobile:string = '';
  candidate_language:string = '';
  candidate_address:string = '';
  candidate_country:string = '';
  candidate_state:string = '';
  candidate_city:string = '';
  candidate_pin:string = '';
  candidate_sex:string = '';

  languageList = [];
  genderList = [];
  closeResult = '';
  progressbar: boolean = false;
  showModal: boolean = false;
  serverUrl = environment.baseUrl;



  constructor(
    private FrontenddbService: FrontenddbService,
    private BackenddbService: BackenddbService,
  ) { }

  ngOnInit(): void {

    this.get_viewProfile.subscribe(
      data => {
          if(data!='')
          {
            this.progressbar = true;
            this.viewProfileModelOpen(data);
          }
        }
      );

    this.FrontenddbService.getLanguageList().subscribe((data:any) => {
      this.languageList = data;
    });   

    this.FrontenddbService.getGenderList().subscribe((data:any) => {
      this.genderList = data;
    });  

  }

  /* open view profile model popup */
  viewProfileModelOpen(user_id:any)
  {
    const formData = new FormData();
    formData.append('user_id', user_id);
    this.BackenddbService.getFullProfile(formData).subscribe(
      res => {
       this.progressbar = false;
       /*here set view candidate profile data*/
       this.candidate_f_name = res.F_Name;
       this.candidate_l_name = res.M_Name;
       this.candidate_m_name = res.L_Name;
       this.candidate_status = res.user_status;
       this.candidate_email = res.eMail;
       this.candidate_mobile = res.Mobile;
       this.candidate_language = this.languageList[res.Language];
       this.candidate_address = res.Address;
       this.candidate_country = res.country_name;
       this.candidate_state = res.state_name;
       this.candidate_city = res.City;
       this.candidate_pin = res.Pin;
       this.candidate_sex = this.genderList[res.Sex];
       this.croppedImage = res.Photo;

       this.showModal = true; 
      }
    );    
  }

  hide() {
    this.showModal = false;
  }
}
