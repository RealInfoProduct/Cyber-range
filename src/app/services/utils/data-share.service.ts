import { Injectable } from '@angular/core';
import { User } from './../../interfaces/user';
import { Team } from './../../interfaces/team';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DataShareService {

  public userId: string = null;
	public teamId:string = null;
	public userName: string = null;
	public chatType: string = null;
	
	private user = new BehaviorSubject(null);

	private team = new BehaviorSubject(null);
	selectedUser: Observable<User> = this.user.asObservable();
	selectedTeam:Observable<Team> = this.team.asObservable();
	constructor() { }

	changeSelectedUser(message) {

		this.user.next(message);
	
	}

	chatTypeName(){
		return this.chatType;
	}
	changeSelectedTeam(message: Team) {
		
		this.team.next(message);
	}
	
	changeChatType(type){
		
		this.chatType = type;
	}
	getUserId(): string {
		

		
		// if (this.userId  === null) {
			
			this.userId = localStorage.getItem('userid');
    //   this.userId ="602377511cf7371eeca04b0e"
      
		// }
		return this.userId;
	}

	getUserName(): string {
		// if (this.userName === null) {
			 this.userName = localStorage.getItem('username');
   		//    this.userName ='abhishek123'
		// }
		return this.userName;
	}

	getTeamId() : string {
		if(this.teamId == null){
			this.teamId = localStorage.getItem('team_id');
			return this.teamId;
		}
	}

	
}
