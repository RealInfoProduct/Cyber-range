import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanDeactivate, CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse,HttpHeaders  } from '@angular/common/http';

import { Router } from '@angular/router';
import { LoginService } from './services/login.service';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanDeactivate<unknown>, CanLoad {


  return_val:boolean;
  role:string = "";
  serverUrl = environment.baseUrl;

  constructor(private loginservice: LoginService,
              private router: Router,
              private http: HttpClient) {
   }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let url: string = state.url;
    return this.checkUserLogin(next, url);
  }
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }
  canDeactivate(
    component: unknown,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }

  async checkUserLogin(route: ActivatedRouteSnapshot, url: any): Promise<boolean> 
  {

      const formData = new FormData();
      var session_id = this.loginservice.getLoginSessionId();
    
      formData.append('session_id',session_id);
      var res = await this.http.post<any>(this.serverUrl + 'login-api/verify-session', formData).toPromise();
      if(res.return==true)
      {
          this.loginservice.setLoginSession(res.data);
          if(route.data.role=='CHECK')
          {
             return true;
          }if(route.data.role=='CHECK_LOGIN')
          {
             return true;
          }else if(res.data.group_id == '1')
          {
          this.role = 'ADMIN';
          }else if(res.data.group_id == '2')
          {
            this.role = 'INSTRUCTOR';
          }else if(res.data.group_id == '3')
          {
            this.role = 'USER';
          }
      }else
      {
        this.loginservice.logOut();

        if(route.data.role=='CHECK')
        {
          return true;
        }else if(route.data.role=='CHECK_LOGIN')
        {
          this.loginservice.logOut();
          this.router.navigate(['/login']);
          return false;
        }else
        {
          this.loginservice.logOut();
          this.router.navigate(['/login']);
          return false;
        }
      }
      if(route.data.role=='ADMIN' && this.role=='ADMIN')
      {
        return true;
      }else if(route.data.role=='INSTRUCTOR' && this.role=='INSTRUCTOR')
      {
        return true;
      }else if(route.data.role=='USER' && this.role=='USER')
      {
        return true;
      }
      this.router.navigate(['/login']);
      return false;
    }

}
