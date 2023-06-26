import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse,HttpHeaders  } from '@angular/common/http';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  serverUrl = environment.baseUrl;
  siteUrl = environment.siteUrl;
  accessurl=environment.accessUrl;
  group_id:string;
  result:any;
  message:any;
  session_array: Array<{session_id: string}> = []; 
  
  constructor(private http: HttpClient) {
   }
  
  verifyLogin(logindata:any) {
    return this.http.post<any>(this.serverUrl + 'login-api/login',logindata).pipe(
      catchError(this.handleError)
    );
  } 

  verifySessionId() {

    const formData = new FormData();
    formData.append('session_id', this.getLoginSessionId());

   // console.log(this.getLoginSessionId());
    return this.http.post<any>(this.serverUrl + 'login-api/verify-session', formData).pipe(
      catchError(this.handleError)
    );
  } 

  logoutEveryWhere(logindata:any) {
    return this.http.post<any>(this.serverUrl + 'login-api/logout_every',logindata).pipe(
      catchError(this.handleError)
    );
  }

    forgotPasswordRequest(logindata:any) {
    return this.http.post<any>(this.serverUrl + 'login-api/forgot_password',logindata).pipe(
      catchError(this.handleError)
    );
  }  

  verifyResetPasswdToken(formdata:any) {
    return this.http.post<any>(this.serverUrl + 'login-api/verify-reset-passwd-token',formdata).pipe(
      catchError(this.handleError)
    );
  }
  resetPasswordRequest(logindata:any) {
    return this.http.post<any>(this.serverUrl + 'login-api/reset_password',logindata).pipe(
      catchError(this.handleError)
    );
  } 
  

  setLoginSession(logindata:any) {
   
    sessionStorage.setItem('isLoggedIn', "true");
    sessionStorage.setItem('Group',logindata.group_id);
    sessionStorage.setItem('UserId',logindata.user_id);
    if(typeof(logindata.name) != 'undefined')
    {
      localStorage.setItem('Name',logindata.name);
    }
    if(typeof(logindata.session_id) != 'undefined')
    {
      localStorage.setItem('SessionId',logindata.session_id);
    }    
  } 
  
  setChatLoginSession(chatlogindata:any){
    localStorage.setItem('userid', chatlogindata.userId);
    localStorage.setItem('username', chatlogindata.username);
  }
  getLoginName()
  {
    return localStorage.getItem('Name');
  }
 
  getLoginGroup()
  {
    return sessionStorage.getItem('Group');
  }

  getDashboardUrl()
  {
     var gid = sessionStorage.getItem('Group');
     if(gid=='1')
     { 
        return '/dd-terminal/';
     }else if(gid=='2')
     { 
        return '/dd-instructor/';
     }
  }

  getSiteUrl()
  {
      return this.siteUrl;
  }

  getAceessUrl(){
    return this.accessurl;
  }

  getServerUrl() //data api url
  {
      return this.serverUrl;
  }
  
 
  getLoginSessionId()
  {
    return localStorage.getItem('SessionId');
  }
 
  getUserId()
  {
    return sessionStorage.getItem('UserId');
  }

  isAdminLogin()
  {
    this.group_id = sessionStorage.getItem('Group');
    if(this.group_id=='1')
    {
       return true;
    }else
    {
      return false;
    }
  }

  isInstructorLogin()
  {
    this.group_id = sessionStorage.getItem('Group');
    if(this.group_id=='2')
    {
       return true;
    }else
    {
      return false;
    }
  }

  isUserLogin()
  {
    this.group_id = sessionStorage.getItem('Group');
    if(this.group_id=='3')
    {
       return true;
    }else
    {
      return false;
    }
  }

  setflashMessage(msg:any)
  {
    sessionStorage.setItem('message',msg);
  } 

  getflashMessage()
  {
    this.message =  sessionStorage.getItem('message');
    if(this.message!=null)
    {
      sessionStorage.removeItem('message'); 
      return JSON.parse(this.message);
    }else
    {
      return false;
    }
  } 

  logOut()
  {
    sessionStorage.removeItem('isLoggedIn');    
    sessionStorage.removeItem('Group');    
    sessionStorage.removeItem('UserId');    
    localStorage.removeItem('Name');
    localStorage.removeItem('SessionId');    
    sessionStorage.clear();
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
