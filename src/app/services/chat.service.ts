import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import * as Rx from 'rxjs/Rx';
import { ChatListResponse } from './../interfaces/chat-list-response';
import { MessageRequest } from './../interfaces/message-request';
import { GroupMessageRequest } from './../interfaces/groupmessage-request';
import { MessagesResponse } from './../interfaces/messages-response';
import { MessageSocketEvent } from './../interfaces/message-socket-event';
import io, { ManagerOptions } from 'socket.io-client';
import { AuthRequest } from './../interfaces/auth-request';
import { Auth } from './../interfaces/auth';
import { Message } from './../interfaces/message';
import { GroupMessage } from './../interfaces/group-message';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ChatService {

  private BASE_URL = environment.socketUrl;
	private socket; 

	private httpOptions = {
		headers: new HttpHeaders({
			'Content-Type': 'application/json',
		})
	};
  constructor(
		private http: HttpClient,
		public router: Router
	) { }

//   connectSocket(userId: string): void {
//     console.log('connect');
//     this.socket = io(this.BASE_URL);
// }

connectSocket(userId: string): void {

  //console.log('connect');

  const IOOptions: Partial<ManagerOptions> ={
    query: {
      userId: `${userId}`
    }
  }

 this.socket = io(this.BASE_URL, IOOptions);


}

joinRoom(users) : void{

  this.socket.emit('join-room', users);
}

typeMessage(message): void {
  
  this.socket.emit('typing-message', message);
}

sendMessage(message:any): void {
 


  this.socket.emit('add-message', message);
}
typeGroupMessage(message): void {
  this.socket.emit('group-typing-message', message);
}


checkuserExits(data):void{
  this.socket.emit('check-user-exits', data);
}

receiveGroupMessages(): Observable<GroupMessage> {
 
  return new Observable(observer => {
    this.socket.on('group-message-response', (data) => {
    
      observer.next(data);
    });

    return () => {
      this.socket.disconnect();
    };
  });
}

receiveGroupTypingStop(): Observable<Message> {
  return new Observable(observer => {
    this.socket.on('stop-group-typing-response', (data) => {
      observer.next(data);
    });

    return () => {
      this.socket.disconnect();
    };
  });
}

receiveGroupTyping(): Observable<Message> {
  return new Observable(observer => {
    this.socket.on('group-typing-response', (data) => {
      observer.next(data);
    });

    return () => {
      this.socket.disconnect();
    };
  });
}
stopGroupType(message): void {
  this.socket.emit('group-stop-typing', message);
}


receiveTeamMovement(): Observable<any>{

  return new Observable(observer => {
    this.socket.on('team-response', (data:any) => {
     
      observer.next(data);
    });

    return () => {
      this.socket.disconnect();
    };
  });
}

checkUser(): Observable<any>{

  return new Observable(observer => {
    this.socket.on('check-user-response', (data:any) => {
     
      observer.next(data);
    });

    return () => {
      this.socket.disconnect();
    };
  });
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

receiveChatMessages(): Observable<Message> {
  return new Observable(observer => {
    this.socket.on('add-message-response', (data) => {
      observer.next(data);
    });

    return () => {
      this.socket.disconnect();
    };
  });
}

  getChatList(userId: string = null  ): Observable<ChatListResponse> {
   
  if (userId !== null) {
    this.socket.emit('chat-list', { userId: userId});

    return new Observable(observer => {
      this.socket.on('chat-list-response', (data: ChatListResponse) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
  }
  

}
receiveTyping(): Observable<Message> {
  return new Observable(observer => {
    this.socket.on('add-typing-response', (data) => {
      observer.next(data);
    });

    return () => {
      this.socket.disconnect();
    };
  });
}

stopType(message): void {

  this.socket.emit('stop-typing', message);
}

receiveTypingStop(): Observable<Message> {
  return new Observable(observer => {
    this.socket.on('stop-typing-response', (data) => {
      observer.next(data);
    });

    return () => {
      this.socket.disconnect();
    };
  });
}

getMessages(params: MessageRequest): Observable<MessagesResponse> {
  return this.http.post(`${this.BASE_URL}getMessages`, JSON.stringify(params), this.httpOptions).pipe(
    map(
      (response: MessagesResponse) => {
        return response;
      },
      (error) => {
        throw error;
      }
    )
  );
}

getGroupMessages(params: GroupMessageRequest): Observable<MessagesResponse> {


  return this.http.post(`${this.BASE_URL}getGroupMessages`, JSON.stringify(params), this.httpOptions).pipe(
    map(
      (response: MessagesResponse) => {
        
        return response;
      },
      (error) => {
        throw error;
      }
    )
  );
}

login(params: AuthRequest): Observable<Auth> {
  return this.http.post(`${this.BASE_URL}login`, JSON.stringify(params), this.httpOptions).pipe(
    map(
      (response: Auth) => {
        return response;
      },
      (error) => {
        throw error;
      }
    )
  );
}

addTeam(params: AuthRequest) {
  this.socket.emit('add-team', params);
  // return this.http.post(`${this.BASE_URL}addTeam`, JSON.stringify(params), this.httpOptions).pipe(
  //   map(
  //     (response: Auth) => {
  //       return response;
  //     },
  //     (error) => {
  //       throw error;
  //     }
  //   )
  // );
}

deleteTeam(params: AuthRequest){

        this.socket.emit('delete-team', params);
  
  // return this.http.post(`${this.BASE_URL}deleteTeam`, JSON.stringify(params), this.httpOptions).pipe(
  //   map(
  //     (response: Auth) => {
  //       return response;
  //     },
  //     (error) => {
  //       throw error;
  //     }
  //   )
  // );
}

deleteUser(params:any){

  return this.http.post(`${this.BASE_URL}deleteUser`, JSON.stringify(params), this.httpOptions).pipe(
    map(
      (response) => {
        

        return response;
      },
      (error) => {
        throw error;
      }
    )
  );

}
receiveTeamRemove(): Observable<any>{

  return new Observable(observer => {
    this.socket.on('remove-team-response', (data:any) => {
     
      observer.next(data);
    });

    return () => {
      this.socket.disconnect();
    };
  });
}
updateTeam(params): Observable<Auth> {
 
  return this.http.post(`${this.BASE_URL}updateTeam`, JSON.stringify(params), this.httpOptions).pipe(
    map(
      (response: Auth) => {
        this.socket.emit('team-movement', params);

        return response;
      },
      (error) => {
        throw error;
      }
    )
  );
}

logout(userId: { userId: string}): Observable<Auth> {

  this.socket.emit('logout', userId);
  return new Observable(observer => {
    this.socket.on('logout-response', (data: Auth) => {
      observer.next(data);
    });
    return () => {
      this.socket.disconnect();
    };
  });
}

sendGroupMessage(message): void {

  this.socket.emit('add-group-message', message);
}

searchUser(data): void {

  this.socket.emit('search-users', data);

}

searchResponse() {

  return new Observable(observer => {
    this.socket.on('search-response', (data) => {
      observer.next(data);
    });

    return () => {
      this.socket.disconnect();
    };
  });
}

// getTeam(userId) {
 
//   return this.http.post(`${this.BASE_URL}getTeam`, { userId: `${userId}` } , this.httpOptions).pipe(
//     map(
//       (response) => {
//         return response;
//       },
//       (error) => {
//         throw error;
//       }
//     )
//   )
 
// }
getTeam(userId) {

  return this.http.post<any>(this.BASE_URL + 'getTeam',{ userId: `${userId}` }).pipe(
     
  );  
}
removeLS(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    try {
      localStorage.removeItem('userid');
      localStorage.removeItem('username');
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
}
  register(params: AuthRequest): Observable<Auth> {
   //console.log('result= '+JSON.stringify(params));
    return this.http.post(`${this.BASE_URL}register`, JSON.stringify(params), this.httpOptions).pipe(
      map(
        (response: Auth) => {
          return response;
        },
        (error) => {
          throw error;
        }
      )
    );
  }


  updateProfile(params: AuthRequest): Observable<Auth> {
  
     return this.http.post(`${this.BASE_URL}updateProfile`, JSON.stringify(params), this.httpOptions).pipe(
       map(
         (response: Auth) => {
           return response;
         },
         (error) => {
           throw error;
         }
       )
     );
   }

}
