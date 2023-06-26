import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { LoginService } from '../services/login.service';
import { Observable } from 'rxjs';

@Injectable()

export class AuthInterceptor implements HttpInterceptor {
  
    authToken:any;

    constructor(
        private LoginService: LoginService
        ) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
            this.authToken = this.LoginService.getLoginSessionId();
            if (this.authToken!=null) {
            req = req.clone({
                setHeaders:
                    { Authorization: this.authToken }
                }
            );
            }
        return next.handle(req);
    }
}
