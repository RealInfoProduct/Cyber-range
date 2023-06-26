import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-candidateprofile',
  templateUrl: './candidateprofile.component.html',
  styleUrls: ['./candidateprofile.component.css']
})
export class CandidateprofileComponent implements OnInit {
   user_id: string;
   update_by: string;

  constructor(private loginService: LoginService) {
    this.user_id = this.loginService.getUserId();
    this.update_by = this.user_id;
   }

  ngOnInit(): void {
  }

}
