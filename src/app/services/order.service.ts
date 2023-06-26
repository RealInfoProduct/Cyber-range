import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  serverUrl = environment.baseUrl;
  
  constructor(private http: HttpClient) { }

  addToBasket(formdata:any) {
    return this.http.post<any>(this.serverUrl + 'order-api/add-to-basket',formdata).pipe(
      catchError(this.handleError)
    ); 
  }

  getBasket(formdata:any) {
    return this.http.post<any>(this.serverUrl + 'order-api/get-basket',formdata).pipe(
      catchError(this.handleError)
    ); 
  }

  getUserWallet() {
    return this.http.get(this.serverUrl + 'order-api/get-user-wallet');
  }

 deleteBasket(formdata:any) {
  return this.http.post<any>(this.serverUrl + 'order-api/delete-basket',formdata).pipe(
    catchError(this.handleError)
  ); 
} 

enrollNow(formdata:any) {
  return this.http.post<any>(this.serverUrl + 'order-api/enroll-now',formdata).pipe(
    catchError(this.handleError)
  ); 
}
  
generatePin() {
  return this.http.get(this.serverUrl + 'order-api/generate-pin');
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
