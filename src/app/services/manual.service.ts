import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse,HttpHeaders  } from '@angular/common/http';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManualService {
  serverUrl = environment.baseUrl;
  
  constructor(private http: HttpClient) { }

    insertmanual(formdata:any) {

     // return this.http.get(this.serverUrl + 'manual-api/add_manual');
     return this.http.post<any>(this.serverUrl + 'manual-api/add_manual',formdata).pipe(
      catchError(this.handleError)
    ); 
  } 
  topics_list(formdata:any) {
    return this.http.post<any>(this.serverUrl + 'manual-api/get_topics_list',formdata).pipe(
      catchError(this.handleError)
    ); 
    // return this.http.get(this.serverUrl + 'manual-api/get_topics_list/'+id);
  } 
  deletetopic(formdata:any){
    return this.http.post<any>(this.serverUrl + 'manual-api/delete_topic',formdata).pipe(
      catchError(this.handleError)
    ); 

     
    // return this.http.get(this.serverUrl + 'manual-api/delete_topic/'+id);
  }

  deleteContent(formdata:any){
    return this.http.post<any>(this.serverUrl + 'manual-api/delete_content',formdata).pipe(
      catchError(this.handleError)
    ); 

     
    // return this.http.get(this.serverUrl + 'manual-api/delete_topic/'+id);
  }

  
  editTopic(formdata:any){
    return this.http.post<any>(this.serverUrl + 'manual-api/update_manual',formdata).pipe(
      catchError(this.handleError)
    ); 
  } 

  // update_content(formdata:any){
  //   return this.http.post<any>(this.serverUrl + 'manual-api/update_content',formdata).pipe(
  //     catchError(this.handleError)
  //   ); 
  // } 

  
  get_manual(formdata:any){
    return this.http.post<any>(this.serverUrl + 'manual-api/get_manual',formdata).pipe(
      catchError(this.handleError)
    ); 
  }

  getcontent(formdata:any){
    return this.http.post<any>(this.serverUrl + 'manual-api/get_content',formdata).pipe(
      catchError(this.handleError)
    ); 
  }

  getTopicWithContent(formdata:any){
    return this.http.post<any>(this.serverUrl + 'manual-api/getTopic_With_Content',formdata).pipe(
      catchError(this.handleError)
    ); 
  }
  searchResult(formdata:any){
    return this.http.post<any>(this.serverUrl + 'manual-api/searchResult',formdata).pipe(
      catchError(this.handleError)
    ); 
  }
  
  insert_manual_content(formdata:any){
    return this.http.post<any>(this.serverUrl + 'manual-api/insert_content',formdata).pipe(
      catchError(this.handleError)
    ); 
  }
  
  get_manual_list(){
    return this.http.get(this.serverUrl + 'manual-api/get_manuals_list');
  }

  //end froned manual function 
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
