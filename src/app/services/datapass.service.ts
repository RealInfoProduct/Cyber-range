import { Injectable } from '@angular/core';
import { Subject,Observable } from 'rxjs';
 
@Injectable({
  providedIn: 'root'
})
export class DatapassService {
    private subject = new Subject<any>();
 
    sendData(message: any) {
        this.subject.next(message);
    }

    Loader(type: any) {
        var array = ['showloader',type]
        this.subject.next(array);
    }
 
    clearData() {
        this.subject.next();
    }
 
    getData(): Observable<any> {
        return this.subject.asObservable();
    }
}