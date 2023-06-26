import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class AssessmentService {
  serverUrl = environment.baseUrl;
  constructor(private http: HttpClient) { 
  }

  getAssessment(){
    return this.http.get(this.serverUrl + 'assessment-api/get_assessment');
  }
}
