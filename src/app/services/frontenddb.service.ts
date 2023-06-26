import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class FrontenddbService {
  serverUrl = environment.baseUrl;
  
  constructor(private http: HttpClient) { }
  
  getCountryList() {
    return this.http.get(this.serverUrl + 'registration-api/get-country-list');
 } 

 addDemoRequest(formdata:any){
  return this.http.post<any>(this.serverUrl + 'candidate-api/add_demo',formdata).pipe(
    catchError(this.handleError)
  );
 }
 
 getStateList(countryId:any) {
    return this.http.get(this.serverUrl + 'registration-api/get-state-list/'+countryId);
 } 

 getLanguageList() {
  return this.http.get(this.serverUrl + 'registration-api/get-language-list');
} 

getGenderList() {
  return this.http.get(this.serverUrl + 'registration-api/get-gender-list');
} 

checkExsitingEmail(formdata:any) {
  return this.http.post<any>(this.serverUrl + 'registration-api/check-exsiting-email',formdata).pipe(
    catchError(this.handleError)
  );
} 

RegistrationSubmit(formdata:any) {
  return this.http.post<any>(this.serverUrl + 'registration-api/registration-submit',formdata).pipe(
    catchError(this.handleError)
  );
}

UpdateProfile(formdata:any) {
  return this.http.post<any>(this.serverUrl + 'candidate-api/update-profile',formdata).pipe(
    catchError(this.handleError)
  );
}

VerifyToken(formdata:any) {
  return this.http.post<any>(this.serverUrl + 'registration-api/verify-token',formdata).pipe(
    catchError(this.handleError)
  );
}


getProfile(formdata:any) {
  return this.http.post<any>(this.serverUrl + '/candidate-api/get-profile',formdata).pipe(
    catchError(this.handleError)
  );
}

contactUs(formdata:any) {
  return this.http.post<any>(this.serverUrl + '/candidate-api/contact-us',formdata).pipe(
    catchError(this.handleError)
  );
} 

getTotalExercise(formdata:any) {
  return this.http.post<any>(this.serverUrl + 'candidate-api/get-total-exercise',formdata).pipe(
    catchError(this.handleError)
  ); 
}

getNews(formdata:any) {
  return this.http.post<any>(this.serverUrl + 'candidate-api/get-news',formdata).pipe(
    catchError(this.handleError)
  ); 
}

getExerciseRepository(formdata:any) {
  return this.http.post<any>(this.serverUrl + 'candidate-api/get-exercise-repository',formdata).pipe(
    catchError(this.handleError)
  ); 
}

getExercise(formdata:any) {
  return this.http.post<any>(this.serverUrl + 'candidate-api/get-exercise',formdata).pipe(
    catchError(this.handleError)
  ); 
}

getNotification(formdata:any) {
  return this.http.post<any>(this.serverUrl + 'admin-api/get-notification',formdata).pipe(
    catchError(this.handleError)
  ); 
}

DeleteNotification(formdata:any) {
  return this.http.post<any>(this.serverUrl + 'admin-api/delete-notification',formdata).pipe(
    catchError(this.handleError)
  ); 
}

loadAllottedExercise(formdata:any) {
  return this.http.post<any>(this.serverUrl + 'candidate-api/load-allotted-exercise',formdata).pipe(
    catchError(this.handleError)
  ); 
}

// getAllottedExercise() {
//   return this.http.get(this.serverUrl + 'candidate-api/get-allotted-exercise');
// } 


getAllottedExercise(formdata:any) {
  return this.http.post<any>(this.serverUrl + 'candidate-api/get-allotted-exercise',formdata).pipe(
    catchError(this.handleError)
  ); 
}

getArchivedExercise() {
  return this.http.get(this.serverUrl + 'candidate-api/get-archived-exercise');
} 

trackExerciseTime() {
  return this.http.get(this.serverUrl + 'candidate-api/track-exercise-time');
} 

getTeamProfile(formdata:any) {
  return this.http.post<any>(this.serverUrl + 'candidate-api/get-team-profile',formdata).pipe(
    catchError(this.handleError)
  ); 
} 

launchAction(formdata:any) {
  return this.http.post<any>(this.serverUrl + 'redhatrest-api/launch-action',formdata).pipe(
    catchError(this.handleError)
  ); 
}

getLiveVMStatus(formdata:any) {
  return this.http.post<any>(this.serverUrl + 'redhatrest-api/get-live-vm-status',formdata).pipe(
    catchError(this.handleError)
  ); 
}

getWebConsole(formdata:any) {
  return this.http.post<any>(this.serverUrl + 'redhatrest-api/get-webconsole-url',formdata).pipe(
    catchError(this.handleError)
  ); 
}

getManualData(formdata:any) {
  return this.http.post<any>(this.serverUrl + 'candidate-api/get-manual-data',formdata).pipe(
    catchError(this.handleError)
  ); 
} 



  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened. Please try again later.');
  } 
}
