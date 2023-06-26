import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse,HttpHeaders  } from '@angular/common/http';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class BackenddbService {
  serverUrl = environment.baseUrl;
  
  constructor(private http: HttpClient) { }

  getUserGroupList() {
    return this.http.get(this.serverUrl + 'admin-api/get-user-group-list');
 } 

 getAllotmentStatusList() {
  return this.http.get(this.serverUrl + 'admin-api/allotment-status-list');
} 

 getStatusList() {
  return this.http.get(this.serverUrl + 'admin-api/status-list',);
} 

getTeamingList() {
  return this.http.get(this.serverUrl + 'admin-api/teaming-list');
} 

getTeamTypeList(status:any) {
  return this.http.get(this.serverUrl + 'admin-api/team-type-list/'+status);
} 

getInstuctorList() {
  return this.http.get(this.serverUrl + 'admin-api/instuctor-list');
}

getCurrentInstuctorList(formdata:any) {
  return this.http.post<any>(this.serverUrl + 'admin-api/current-instuctor-list',formdata).pipe(
    catchError(this.handleError)
  );  
}

getTeam(formdata:any) {
  return this.http.post<any>(this.serverUrl + 'admin-api/get-team',formdata).pipe(
    catchError(this.handleError)
  );  
}

getAddressBook(formdata:any) {
  return this.http.post<any>(this.serverUrl + 'admin-api/get-addressbook',formdata).pipe(
    catchError(this.handleError)
  );  
}

getTeamType(formdata:any) {
  return this.http.post<any>(this.serverUrl + 'admin-api/get-team-type',formdata).pipe(
    catchError(this.handleError)
  );  
}

getFullProfile(formdata:any) {
  return this.http.post<any>(this.serverUrl + 'admin-api/get-full-profile',formdata).pipe(
    catchError(this.handleError)
  );  
}

assignTeamCandidate(formdata:any) {
  return this.http.post<any>(this.serverUrl + 'admin-api/assign-team-candidate',formdata).pipe(
    catchError(this.handleError)
  );  
}

unassignTeamCandidate(formdata:any) {
  return this.http.post<any>(this.serverUrl + 'admin-api/unassign-team-candidate',formdata).pipe(
    catchError(this.handleError)
  );  
}


 deleteUser(formdata:any) {
  return this.http.post<any>(this.serverUrl + 'admin-api/delete-user',formdata).pipe(
    catchError(this.handleError)
  );
} 

deleteTeam(formdata:any) {
  return this.http.post<any>(this.serverUrl + 'admin-api/delete-team',formdata).pipe(
    catchError(this.handleError)
  );
} 

deleteTeamType(formdata:any) {
  return this.http.post<any>(this.serverUrl + 'admin-api/delete-team-type',formdata).pipe(
    catchError(this.handleError)
  );
} 

addNewTeam(formdata:any) {
  return this.http.post<any>(this.serverUrl + 'admin-api/add-new-team',formdata).pipe(
    catchError(this.handleError)
  );
}

UpdateTeam(formdata:any) {
  return this.http.post<any>(this.serverUrl + 'admin-api/update-team',formdata).pipe(
    catchError(this.handleError)
  );  
}

addNewTeamType(formdata:any) {
  return this.http.post<any>(this.serverUrl + 'admin-api/add-new-team-type',formdata).pipe(
    catchError(this.handleError)
  );
}

updateTeamType(formdata:any) {
  return this.http.post<any>(this.serverUrl + 'admin-api/update-team-type',formdata).pipe(
    catchError(this.handleError)
  );  
}

getResourceChartData(formdata:any) {
  return this.http.post<any>(this.serverUrl + 'admin-api/get-resource-chat-data',formdata).pipe(
    catchError(this.handleError)
  );  
}

getInstructorDropDownList(formdata:any) {
  return this.http.post<any>(this.serverUrl + 'admin-api/get-instructor-dropdown',formdata).pipe(
    catchError(this.handleError)
  );  
}

addNewRoles(formdata:any) {
  return this.http.post<any>(this.serverUrl + 'admin-api/add-new-roles',formdata).pipe(
    catchError(this.handleError)
  );  
}
getRoles(formdata:any) {
  return this.http.post<any>(this.serverUrl + 'admin-api/get-roles',formdata).pipe(
    catchError(this.handleError)
  );  
}

UpdateRoles(formdata:any) {
  return this.http.post<any>(this.serverUrl + 'admin-api/update-roles',formdata).pipe(
    catchError(this.handleError)
  );  
}

deleteRoles(formdata:any) {
  return this.http.post<any>(this.serverUrl + 'admin-api/delete-roles',formdata).pipe(
    catchError(this.handleError)
  );  
}

getExerciseTemplates() {
  return this.http.get<any>(this.serverUrl + 'redhatrest-api/get-templates').pipe(
    catchError(this.ovirthandleError)
  ); 
}


prepareInfra(formdata:any) {
  return this.http.post<any>(this.serverUrl + 'redhatrest-api/prepare-infra',formdata).pipe(
    catchError(this.handleError)
  ); 
}

deleteInfra(formdata:any) {
  return this.http.post<any>(this.serverUrl + 'redhatrest-api/delete-prepare-infra',formdata).pipe(
    catchError(this.handleError)
  ); 
}

getVmInfo(formdata:any) {
  return this.http.post<any>(this.serverUrl + 'redhatrest-api/get-vm-detail',formdata).pipe(
    catchError(this.handleError)
  ); 
}

getSpiceConsole(formdata:any) {
  return this.http.post<any>(this.serverUrl + 'redhatrest-api/get-spice-console',formdata).pipe(
    catchError(this.handleError)
  ); 
}

// track process here 
TrackProcess(formdata:any) {
  return this.http.post<any>(this.serverUrl + 'admin-api/track-process',formdata).pipe(
    catchError(this.handleError)
  ); 
}
// delete success status track process
DeleteProcess(formdata:any) {
  return this.http.post<any>(this.serverUrl + 'admin-api/delete-track-process',formdata).pipe(
    catchError(this.handleError)
  ); 
}

rabbitmqSubmitProcess(formdata:any) {
  return this.http.post<any>(this.serverUrl + 'redhatrest-api/rabbitmq-submit-process',formdata).pipe(
    catchError(this.handleError)
  ); 
}

powerStatusVm(formdata:any) {
  return this.http.post<any>(this.serverUrl + 'redhatrest-api/power-vm',formdata).pipe(
    catchError(this.handleError)
  ); 
}

CreateSnapshot(formdata:any) {
  return this.http.post<any>(this.serverUrl + 'redhatrest-api/create-snapshot',formdata).pipe(
    catchError(this.handleError)
  ); 
}

create_template(formdata:any) {
  return this.http.post<any>(this.serverUrl + 'redhatrest-api/create-exercise-templates',formdata).pipe(
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

getInstructorResource(formdata:any) {
  return this.http.post<any>(this.serverUrl + 'admin-api/get-instructor-resource',formdata).pipe(
    catchError(this.handleError)
  ); 
}

getSetting(formdata:any) {
  return this.http.post<any>(this.serverUrl + 'admin-api/get-setting',formdata).pipe(
    catchError(this.handleError)
  ); 
}

loadAllottedExercise(formdata:any) {
  return this.http.post<any>(this.serverUrl + 'admin-api/load-allotted-exercise',formdata).pipe(
    catchError(this.handleError)
  ); 
}

setAllotExerciseData(formdata:any) {
  return this.http.post<any>(this.serverUrl + 'admin-api/set-allot-exercise',formdata).pipe(
    catchError(this.handleError)
  );  
}

getData(api:any) {
  return this.http.get(this.serverUrl + api);
}

postData(api:any,formdata:any) {
  return this.http.post<any>(this.serverUrl + api,formdata).pipe(
    catchError(this.handleError)
  );  
}

headerLogoUpdate(formdata:any) {
  return this.http.post<any>(this.serverUrl + 'admin-api/logo-update',formdata).pipe(
    catchError(this.handleError)
  );  
}

updateEmailConfig(formdata:any) {
  return this.http.post<any>(this.serverUrl + 'admin-api/update-email-config',formdata).pipe(
    catchError(this.handleError)
  );
} 
updateOtherConfig(formdata:any) {
  return this.http.post<any>(this.serverUrl + 'admin-api/update-other-config',formdata).pipe(
    catchError(this.handleError)
  );
} 
private ovirthandleError(error: HttpErrorResponse) {
  if (error.error instanceof ErrorEvent) {
    // A client-side or network error occurred. Handle it accordingly.
    console.error('An error occurred:', error.error.message);
  } else {
    // The backend returned an unsuccessful response code.
    // The response body may contain clues as to what went wrong,
    console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
  }
  // return an observable with a user-facing error message
  alert('Ovirt API not working. Please refresh page or try later.')
  return throwError('Something bad happened. Please try again later.');
} 

deleteNotification(formdata:any) {
  return this.http.post<any>(this.serverUrl + 'datatable-api/deleteNotification',formdata).pipe(
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
  alert('Communication not happened in-time.Please try later.')
  return throwError('Something bad happened. Please try again later.');
} 

}
