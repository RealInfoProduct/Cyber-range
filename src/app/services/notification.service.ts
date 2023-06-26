import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as Rx from 'rxjs/Rx';
import io, { ManagerOptions } from 'socket.io-client';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private BASE_URL = environment.socketUrl;
	private socket; 
	
	constructor() {
    this.connectSocket('');
   }

  connectSocket(allot_id:any): void {
   const IOOptions: Partial<ManagerOptions> ={
    transports: ["polling"]
  }
  this.socket = io(this.BASE_URL,IOOptions);
}

disconnect(): Observable<any> {
  return new Observable(observer => {
    this.socket.on('notification-response', (data:any) => {
      observer.next(data);
    });
    return () => {
      this.socket.disconnect();
    };
  });
}

joinRoom(allot_id:any) : void{
  this.socket.emit('exercise-room', allot_id);
}

sendMessage(message:any) {
  this.socket.emit('notification', message);
}

receiveMessages(): Observable<any> {
  return new Observable(observer => {
    this.socket.on('notification-response', (data:any) => {
      observer.next(data);
    });

    return () => {
      this.socket.disconnect();
    };
  });
}
}
