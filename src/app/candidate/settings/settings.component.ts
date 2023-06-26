import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl  } from '@angular/forms';
import { faCamera, faCog, faAngleLeft, faAngleRight, faLock, faUser, faAddressCard, faKeyboard, faLaptop, faKey, faBraille, faExchangeAlt } from '@fortawesome/free-solid-svg-icons'; 
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  faCamera = faCamera;
  faCog = faCog;
  faAngleLeft = faAngleLeft;
  faAngleRight = faAngleRight;
  faLock = faLock;
  faUser = faUser;
  faAddressCard = faAddressCard;
  faKeyboard = faKeyboard;
  faLaptop = faLaptop;
  faKey = faKey;
  faBraille = faBraille;
  faExchangeAlt = faExchangeAlt;

  t_pin:string = "";
  server_url:string;

  constructor(private loginService: LoginService) { 
    this.server_url = this.loginService.getServerUrl();
  }

  ngOnInit(): void {
    
  }

}
