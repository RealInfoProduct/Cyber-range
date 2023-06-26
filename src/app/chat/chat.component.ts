import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormGroup,  FormBuilder, FormArray, FormControl, Validators  } from '@angular/forms';
import { faFile, faCalculator, faGlobe, faUser, faUserTie, faUsers, faBook, faCog, faFileAlt, faCubes, faLifeRing, faAddressBook, faMicrophone, faCircle, faDotCircle, faStopCircle, faComments, faBars,faAngleRight, faAngleDown, faAngleDoubleRight, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { ChatService } from '../services/chat.service';
import { DataShareService } from '../services/utils/data-share.service';
import { ChatListResponse } from './..//interfaces/chat-list-response';
import { User } from './../interfaces/user';
import { Team } from './../interfaces/team';
import { Title } from '@angular/platform-browser';
import { Message } from './../interfaces/message';
import { ToastrService } from 'ngx-toastr';
import { GroupMessage } from './../interfaces/group-message';
import { MessagesResponse } from './../interfaces/messages-response';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { createAwait } from 'typescript';
declare const hideshow:any;
declare const showhide2:any;
declare const scrollpop:any;
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
	public now: Date = new Date();
	faBars = faBars;
	faGlobe = faGlobe;	
	faCalculator = faCalculator;
	faUserTie = faUserTie;
	faUser = faUser;
	faUsers = faUsers;
	faBook = faBook;
	faCog = faCog;
	faFileAlt = faFileAlt;
	faCubes = faCubes;
	faLifeRing = faLifeRing;
	faAddressBook = faAddressBook;
	faMicrophone = faMicrophone;  
	faCircle = faCircle;
	faDotCircle = faDotCircle;
	faStopCircle = faStopCircle;
	faComments = faComments;	
	faAngleRight = faAngleRight;
	faAngleDown = faAngleDown;
	faFile = faFile;
	faAngleDoubleRight = faAngleDoubleRight;
	faTimesCircle = faTimesCircle;
	hightlight_user:string='';
  loginGroupId:string;
	dashboard_url:string;	
  loading:boolean=false;
  team: boolean = false;
  userIds:string='';
  chatListUsers: User[] = [];
  site_Url:string;
  i:any='0';
  send_datetime:any='';
	server_url:string;
  selectedUserId:any='';
  user_form: boolean = true;
  selectedTeamId:any='';
  messageLoading: boolean = false;
  cyber_user_id;any='';
  comming_id:any='';
  alloted_team:any=[];
  userName: any = '';
  teamId: any = '';
  selectedUsers: any = '';
  selectedTeams:any='';
  messages: any = '';
	userTyping: string = '';
  msgNotification:string='';
  timeout: any = null;
  team_select:boolean=false;
  new_array:any='';
  total_user=[];
  selected_roomId:any='';
  total_msg_box:any ='';
  window_width:any='';
  mix_user:any=[];
  is_assign:boolean=true;
  list_status:boolean=false;
  public messageForm: FormGroup;
  @ViewChild('messageThread') private messageContainer: ElementRef;
  constructor(private formBuilder: FormBuilder,private dtchange: ChangeDetectorRef,private DatePipe:DatePipe,private title: Title, private ChatService: ChatService,private dataShareService: DataShareService , private LoginService:LoginService, private router: Router , private ToastrService: ToastrService) { 

    this.site_Url = this.LoginService.siteUrl;
		this.server_url = this.LoginService.getServerUrl();
    this.cyber_user_id =this.LoginService.getUserId();
  }

  ngOnInit(): void {
    
	this.window_width = window.innerWidth;
	this.total_msg_box = this.window_width/300;
	this.total_msg_box = Math.floor(this.total_msg_box) - 1;
    this.userIds = this.dataShareService.getUserId();
    this.userName = this.dataShareService.getUserName();
    this.establishSocketConnection();
   
    // this.teamId = this.dataShareService.getTeamId();

    hideshow();

	this.getTeam();
   	 	this.ChatService.getChatList(this.userIds).subscribe((chatListResponse: ChatListResponse) => {
     
		
			this.renderChatList(chatListResponse);
     		 showhide2();
	
			//  
		});
		
		
	
    this.messageForm = this.formBuilder.group({
			message: [null, [Validators.required]],
			// t_title: [null, [Validators.required,noWhitespaceValidator]],
			// d_desc: [null, [Validators.required,noWhitespaceValidator]],
		});
		this.dataShareService.selectedUser.subscribe((selectedUsers: User) => {

			if (selectedUsers !== null) {
				this.user_form = true;
				this.team = false;
				this.selectedUsers = selectedUsers;
				this.getMessages(this.selectedUsers.id);

			}
		});


		this.dataShareService.selectedTeam.subscribe((selectedTeam: Team) => {
			
			if (selectedTeam !== null) {
				this.user_form = false;
				this.team = true;
				this.selectedTeams = selectedTeam;

				this.getGroupMessages(this.selectedTeams._id);
			}

    
  });

		// this.userName = this.dataShareService.getUserName();
	  // console.log('user_id'+this.userIds)
	//   this.ChatService.getTeam(this.cyber_user_id).subscribe((response) => {
	// 		this.alloted_team = response.teamDetails;

	// 	// 
	// 	this.alloted_team.forEach(element => {
	// 		this.mix_user.push(element);
    //  this.ChatService.joinRoom(element._id);
	// 	  });
	// 	// console.log('chatlist =' + JSON.stringify(chatListResponse.chatList));
	// 	// this.renderChatList(chatListResponse);
		
	// });
	
	
  this.listenForMessages();
  this.listenForTyping();
  this.listenGroupMessages();
  this.listenteamMovement();
  this.listenforadduser();
  this.listenForRemoveTeam();
}

listenForRemoveTeam(){
	var $this =this;
	this.ChatService.receiveTeamRemove().subscribe((Response) => {

		 
		if(Response.action =='remove'){
			$this.mix_user.forEach(function (value, key) {

				if(value.team_id == Response.team_id){
					
				
					$this.mix_user.splice(key, 1);
					// this.ToastrService.error(`You Remove  From  ${socketResponse[0].team_name}  Team`, '', { closeButton: true, tapToDismiss: true });
	
	
				}
				
				
		
			});
			
			$this.total_user.forEach(function (value, key) {

				if(value.team_id == Response.team_id){
				
			
				$this.total_user.splice(key, 1);
				// this.ToastrService.error(`You Remove  From  ${socketResponse[0].team_name}  Team`, '', { closeButton: true, tapToDismiss: true });


			}
			
				
	
		});
		}
		else{
			if(this.loginGroupId !== '3'){
				this.ChatService.joinRoom(Response.team[0]._id);
				this.mix_user.push(Response.team[0]);
			}
			
		}

		
	});
}
listenForTyping(): void {

	this.ChatService.receiveTyping().subscribe((socketResponse: Message) => {

		this.userTyping = '';
		if (this.selectedUser !== null && this.selectedUsers.id === socketResponse.fromUserId) {
			//console.log(socketResponse);
			if(this.team_select == false){
				this.userTyping = socketResponse.fromUserName;

			}
			
		}
	});

	this.ChatService.receiveTypingStop().subscribe((socketResponse: Message) => {
		
		this.userTyping = '';
		if (this.selectedUser !== null && this.selectedUsers.id === socketResponse.fromUserId) {
			//console.log(socketResponse);
			this.userTyping = '';
		}
	});
}
listenforadduser(){
	this.ChatService.checkUser().subscribe((Response) => {
		// alert(JSON.stringify(Response.form_user_data));

		const loggedOutUser =	this.mix_user.findIndex((obj: User) => 
					
					obj['id'] === Response.form_user_data['0'].id);
		const toinddex ='0';
		if(loggedOutUser == -1){
			this.mix_user.push(Response.form_user_data['0']);
			
			const loggedOutUser =	this.mix_user.findIndex((obj: User) => 
					
					obj['id'] === Response.form_user_data['0'].id);
			
			this.arraymove(loggedOutUser,toinddex);
			
		}	
		
		console.log(JSON.stringify(this.mix_user));
	});
}
async establishSocketConnection() {
   
  try {
    if (this.userIds === '' || typeof this.userIds === 'undefined' || this.userIds === null) {
      this.router.navigate(['/']);
    } else {
      /* making socket connection by passing UserId. */
      await this.ChatService.connectSocket(this.userIds);
      // this.overlayDisplay = false;
    }
  } catch (error) {
    alert('Something went wrong');
  }
}
 async renderChatList(chatListResponse: ChatListResponse) {
	
      if (!chatListResponse.error) {
       

        if (chatListResponse.singleUser) {

          if (this.chatListUsers.length > 0) {
            this.chatListUsers = this.mix_user.filter(function (obj: User) {
				if(obj.id == chatListResponse.chatList[0].id){
					obj.online = 'Y';
				}
              return obj.id !== chatListResponse.chatList[0].id;
            });

          }
          /* Adding new online user into chat list array */
          
          this.chatListUsers = this.chatListUsers.concat(chatListResponse.chatList);
        } else if (chatListResponse.userDisconnected) {
			
          const loggedOutUser = this.mix_user.findIndex((obj: User) => obj.id === chatListResponse.userid);
		//  alert(this.chatListUsers[loggedOutUser].online);
		  if (loggedOutUser >= 0) {
            this.mix_user[loggedOutUser].online = 'N';
          }
        } else {
          /* Updating entire chatlist if user logs in. */
          this.chatListUsers = chatListResponse.chatList;
		  this.chatListUsers.forEach(element => {
			
			
			this.mix_user.push(element);


		  });
		 

        }
        this.loading = false;
      // } else {
      // 	alert(`Unable to load Chat list, Redirecting to Login.`);
      // 	this.chatService.removeLS()
      // 		.then(async (removedLs: boolean) => {
      // 			await this.router.navigate(['/']);
      // 			this.loading = false;
      // 		})
      // 		.catch(async (error: Error) => {
      // 			alert(' This App is Broken, we are working on it. try after some time.');
      // 			await this.router.navigate(['/']);
      // 			console.warn(error);
      // 			this.loading = false;
      // 		});
      // }
    }
    
    // hideshow();
  }
  
  selectedUser(user:any): void {
	  
	if(user.team_name){
		
		this.selectedTeam(user);
	}else{
	var user_exist=false;
	var user_length = this.total_user.length;
	this.title.setTitle('CyberRange');
	this.total_user.forEach(function (value, key) {

		if(value.id == user.id){
			user_exist=true;
		}
		

	});


	if(user_exist == false && user_length != this.total_msg_box){
		
		this.total_user.push(user);
		this.dtchange.detectChanges();
	
	}

	else if(user_exist == false && user_length  == this.total_msg_box){
			
		this.total_user.splice(0,1);
	
		this.total_user.splice(0, 0, user);

}


	  this.hightlight_user='';
	this.team_select=false;
    this.selectedUserId = user.id;
	this.selectedTeamId ='';
    // alert(user.id);
    
    this.dataShareService.changeSelectedUser(user);
    this.dataShareService.changeChatType('single');
}
  }


  listenteamMovement(){
	var $this = this;
	var is_assign = true;

	this.ChatService.receiveTeamMovement().subscribe((socketResponse) => {
		if(socketResponse[0].is_assign == true){
			this.ChatService.joinRoom(socketResponse[0]._id);
			$this.mix_user.push(socketResponse[0]);
			$this.alloted_team.push(socketResponse[0]);
			this.ToastrService.success(`You Added In  ${socketResponse[0].team_name} Team `, '', { closeButton: true, tapToDismiss: true });
		}
		else{
			this.mix_user.forEach(function (value, key) {

				if(value._id == socketResponse[0]._id){
					
					is_assign=false;
					$this.mix_user.splice(key, 1);

					$this.total_user.forEach(function (value, key) {
						if(value._id == socketResponse[0]._id){

							$this.total_user.splice(key, 1);
						}



					});
					$this.ToastrService.error(`You Remove  From  ${socketResponse[0].team_name}  Team`, '', { closeButton: true, tapToDismiss: true });

	
				}
				
				
		
			});
		}
		
		


	});
}
  getTeam(){

	this.ChatService.getTeam(this.cyber_user_id).subscribe((response) => {

		this.alloted_team = response.teamDetails;
		


	this.alloted_team.forEach(element => {
		this.ChatService.joinRoom(element._id);

		this.mix_user.push(element);
			

	  });


	  
	
	// this.renderChatList(chatListResponse);
	
});
}
  selectedTeam(team){
	  
	var team_exist=false;
	var user_length = this.total_user.length;
	this.total_user	.forEach(function (value, key) {
		
		if(value._id == team._id){
			team_exist=true;

		}


	});

	if(team_exist == false && user_length != this.total_msg_box){
		this.total_user.push(team);
	}

	
	else if(team_exist == false && user_length  == this.total_msg_box){
			
			this.total_user.splice(0,1);
		
			this.total_user.splice(0, 0, team);

	}
    this.selectedTeamId = team._id;
	this.team_select=true;
	this.hightlight_user='';
	// this.selectedUsers.id ='';
    // alert(user.id);
  
    this.dataShareService.changeSelectedTeam(team);
    this.dataShareService.changeChatType('group');
    
    localStorage.setItem('team_id',team._id);
    
    
  }

  setTime(time:any){

	var current_date = new Date();
	var send_time  = time;
	this.send_datetime =this.DatePipe.transform(time, 'MMM d, y, h:mm:ss a');
	// this.c_datetime =this.DatePipe.transform(current_date, 'yyyy-MM-dd hh:mm:ss');

	return this.send_datetime;

	// return Math.floor((Date.UTC(this.c_datetime.getFullYear(), this.c_datetime.getMonth(), this.c_datetime.getDate()) - Date.UTC(this.send_datetime.getFullYear(), this.send_datetime.getMonth(), this.send_datetime.getDate()) ) /(1000 * 60 * 60 * 24));
	// let remain = this.c_datetime - this.send_datetime;
	// return remain;
	//  return  new Date(time).getDate();
	 
	// let d2: Date = new Date();
    // let d1 = Date.parse(time); //time in milliseconds
    // var timeDiff = d2.getTime() - d1;
    // var diff = timeDiff / (1000 * 3600 * 24);
    // return Math.floor(diff);
  }
  getMessages(toUserId: string) {

		this.messageLoading = true;
		this.ChatService.getMessages({ userId: this.userIds, toUserId: toUserId }).subscribe((response: MessagesResponse) => {
			// this.messages = response.messages;
			var $this = this;

		this.total_user	.forEach(function (value, key) {

				
				 
				if (value.id === toUserId) {
					
						// value.messages  =  response.messages;
					value.messages = response.messages;
					
				}
				
			});
			this.messageLoading = false;
			this.scrollMessageContainer();
		});
		this.userTyping = '';
		this.msgNotification = '';
	}


	getGroupMessages(TeamId: string) {

		this.ChatService.getGroupMessages({ TeamId: TeamId }).subscribe((response: MessagesResponse) => {
			// console.log(JSON.stringify(response));

			// this.messages = response.messages;

			var $this = this;

			this.total_user.forEach(function (value, key) {

				
				 
				if (value._id === TeamId) {
					
						// value.messages  =  response.messages;
					value.messages = response.messages;
					
				}
				
			});

			this.messageLoading = false;
			this.scrollMessageContainer();
		});
		this.userTyping = '';
		this.msgNotification = '';
	}
	alignMessage(userId: string): boolean {
		if (this.userIds == userId) {
			return true;
		} else {
			return false
		}
	}

	 listenForMessages(): void {
  
		this.ChatService.receiveChatMessages().subscribe((socketResponse: Message) => {
			
			var $this = this;
				var is_user_show = false;
				this.title.setTitle(socketResponse.fromUserName + ' is Messaging You');
				this.total_user.forEach(function (value, key) {
		
					if(value.id == socketResponse.fromUserId){

					///	console.log(JSON.stringify(value.messages));
						//value.messages  =   [message];
						$this.total_user[key].messages.push(socketResponse);
						is_user_show =true
						
					}
				});
				this.scrollMessageContainer();

				if(is_user_show == false){

					this.title.setTitle(socketResponse.fromUserName + ' is Messaging You');
				
					const loggedOutUser =	this.mix_user.findIndex((obj: User) => 
					
					obj['id'] === socketResponse.fromUserId);

					
					const toinddex ='0';
					
					if(loggedOutUser != -1){
						this.arraymove(loggedOutUser,toinddex);
					}
					

					this.hightlight_user = socketResponse.fromUserId;
					this.ToastrService.success(`New Message Received From ${socketResponse.fromUserName} `, '', { closeButton: true, tapToDismiss: true });
					this.scrollMessageContainer();
				}

		// 	if (this.selectedUsers !== null && this.selectedUsers.id == socketResponse.fromUserId) {


		// 		if (socketResponse.message != undefined && this.team_select == false) {

					
		// 			this.messages = [...this.messages, socketResponse];
        // //   this.ToastrService.success(`New Message Received from ${socketResponse.fromUserName} `, '', { closeButton: true, tapToDismiss: true });
		// 			this.scrollMessageContainer();
		// 		}
		// 		else{
		// 			this.ToastrService.success(`New Message Received From ${socketResponse.fromUserName} `, '', { closeButton: true, tapToDismiss: true });
		// 			this.hightlight_user = socketResponse.fromUserId;
					
		// 			// const chatlist = this.chatListUsers;
		// 			// chatlist.filter(function(obj) {
		// 			// 	if(obj.id == socketResponse.toUserId){
							
		// 			// 	}
		// 			// });
					
		// 			this.scrollMessageContainer();
		// 		}


		// 	} else {

          
     
		// 		if (socketResponse.message !== undefined) {
        // //   this.messages = [...this.messages, socketResponse];
		// 		// this.scrollMessageContainer();		
		// 		this.ToastrService.success(`New Message Received from ${socketResponse.fromUserName}  `, '', { closeButton: true, tapToDismiss: true });
		// 			//console.log('abcd',socketResponse.message)
		// 			// this.msgNotification = `New Message Received from ${socketResponse.fromUserName}`;
		// 		}

		// 	}
			this.userTyping = '';
		});
	}
	arraymove(loggedOutUser,toinddex) {
		var element = this.mix_user[loggedOutUser];
		
		this.mix_user.splice(loggedOutUser,1);
		
		this.mix_user.splice(toinddex, 0, element);
		}

	scrollMessageContainer(): void {
		// console.log(JSON.stringify(this.messageContainer));
		// if (this.messageContainer !== undefined) {
			try {
				setTimeout(() => {
					 scrollpop();
					 
					// this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
				}, 100);
			} catch (error) {
				console.warn(error);
			}
		// }
	}

	sendMessage(event) {
 
  
		// if (event.keyCode === 13) {
		const message = this.messageForm.controls['message'].value.trim();
		if (message === '' || message === undefined || message === null) {
			alert(`Message can't be empty.`);
		} else if (this.userIds === '') {
			this.router.navigate(['/']);
		} else if (this.selectedUsers.id === '') {
			alert(`Select a user to chat.`);
		} else {
			this.sendAndUpdateMessages({
				fromUserId: this.userIds,
				message: (message).trim(),
				toUserId: this.selectedUserId,
				fromUserName: this.userName,
				chatType: 'single',
				time: new Date()
			});
		}
		// }
	}

	sendAndUpdateMessages(message: Message) {
   
		try {
			this.messageForm.disable();
			this.ChatService.sendMessage(message);

			// this.messages = [...this.messages, message];
			var $this = this;
			this.total_user.forEach(function (value, key) {
		
				if(value.id == message.toUserId){

				///	console.log(JSON.stringify(value.messages));
				$this.total_user[key].messages.push(message);
					
					
					
				}
			});
			this.messageForm.reset();
			this.messageForm.enable();
			this.scrollMessageContainer();
		} catch (error) {
			console.warn(error);
			alert(`Can't send your message`);
		}
	}



	sendMessageGroup(event) {


		// if (event.keyCode === 13) {

		const message = this.messageForm.controls['message'].value.trim();

		if (message === '' || message === undefined || message === null) {

			alert(`Message can't be empty.`);

		} else if (this.userIds === '') {
			this.router.navigate(['/']);
		} else if (this.selectedUsers.id === '') {
			alert(`Select a user to chat.`);
		} else {

			this.sendAndUpdateGroupMessages({
				fromUserId: this.userIds,
				message: (message).trim(),
				toUserId: this.selectedUsers.id,
				fromUserName: this.userName,
				roomId: this.selected_roomId,
				chatType: 'group',
				teamName:this.selectedTeams.team_name,
				time: new Date()
				// roomId:this.selectedTeam

			});
			
		}
		// }
	}

	sendAndUpdateGroupMessages(message: GroupMessage) {

		try {
			this.messageForm.disable();
			this.ChatService.sendGroupMessage(message);
			var $this = this;
			this.total_user.forEach(function (value, key) {
		
					if(value._id == message.roomId){

					///	console.log(JSON.stringify(value.messages));
						//value.messages  =   [message];
						$this.total_user[key].messages.push(message);
						
						
					}




					
					
			
			});

			//  this.messages = [...this.messages, message];
			this.messageForm.reset();
			this.messageForm.enable();
			this.scrollMessageContainer();
		} catch (error) {
			console.warn(error);
			alert(`Can't send your message`);
		}
	}


	listenGroupMessages(): void {
		
		this.ChatService.receiveGroupMessages().subscribe((socketResponse: GroupMessage) => {
			if(this.userIds != socketResponse['data'].fromUserId){
				var $this = this;
			var is_team_show = false;
			// if(this.selectedUserId  === )
			this.total_user.forEach(function (value, key) {
				
				if(value._id == socketResponse['data'].roomId){

					 $this.total_user[key].messages.push(socketResponse['data']);
					is_team_show =true

					
				}
			});
			this.scrollMessageContainer();
			
			if(is_team_show == false){
				this.hightlight_user = socketResponse['data'].roomId;
				this.alloted_team.forEach(function (value, key) {
					// console.log($this.total_user);
					// console.log(socketResponse);
					if(value._id == socketResponse['data'].roomId){
						const loggedOutUser =	$this.mix_user.findIndex((obj) => 
					
					obj['_id'] === socketResponse['data'].roomId);
					
				//	const	userarray = this.mix_user;	 
					const toinddex ='0';
					
					$this.arraymove(loggedOutUser,toinddex);

						$this.ToastrService.success(`New Message Received from ${socketResponse['data'].fromUserName} From ${socketResponse['data'].teamName} `, '', { closeButton: true, tapToDismiss: true });
					
					}

				});

			}
			// this.alloted_team.forEach(function (value, key) {
			// 	// console.log($this.total_user);
			// 	// console.log(socketResponse);
			// 	if(value._id == socketResponse['data'].roomId){

			// 		this.ToastrService.success(`New Message Received from ${socketResponse['data'].fromUserName} From ${socketResponse['data'].teamName} `, '', { closeButton: true, tapToDismiss: true });
				
			// 	}

			// });
			// if(is_team_show == false){
			// 			 this.ToastrService.success(`New Message Received from ${socketResponse['data'].fromUserName} From ${socketResponse['data'].teamName} `, '', { closeButton: true, tapToDismiss: true });
			// }
			}
			
		// if (this.selectedUser !== null && this.selectedUser.id === socketResponse.fromUserId) {

		

		// }
		
	
		// if (this.selectedTeamId !='' && socketResponse['data'].roomId == this.selected_roomId) {

			

		
			

		// 		this.messages = [...this.messages, socketResponse['data']];


			

		// 	this.scrollMessageContainer();


		// 	// }
		// 	this.userTyping = '';
		// }
		// else {

		//  if (socketResponse['data'].fromUserId != this.userIds) {

			
		// 	this.ToastrService.success(`New Message Received from ${socketResponse['data'].fromUserName} From ${socketResponse['data'].teamName} `, '', { closeButton: true, tapToDismiss: true });
		// 	}
			
		// 	// this.messages = [...this.messages, socketResponse['data']];
		// 	this.scrollMessageContainer();
		// 	// this.msgNotification = `New Message Received from ${socketResponse['data'].fromUserName}`;
		// }


	});
			
			


	
	}


	gorupMessageTyping(team): void {
		//console.log(values);
		this.selected_roomId = team._id;
		this.ChatService.typeGroupMessage({
			fromUserId: this.userIds,
			fromUserName: this.userName,
			roomId:this.selected_roomId
		});

		clearTimeout(this.timeout);
		var $this = this;
		this.timeout = setTimeout(function () {
			$this.ChatService.stopGroupType({
				fromUserId: $this.userIds,
				fromUserName: $this.userName,
				roomId:$this.selected_roomId
			})

		}, 5000);
	}

	MessageTyping(user): void {
   
		//console.log(values); 
		this.selectedUserId = user.id;
	
		this.ChatService.typeMessage({
			fromUserId: this.userIds,
			toUserId: this.selectedUserId,
			fromUserName: this.userName,
		});

		clearTimeout(this.timeout);
		var $this = this;
		this.timeout = setTimeout(function () {
			
			$this.ChatService.stopType({
				fromUserId: $this.userIds,
				fromUserName: $this.userName,
				toUserId: $this.selectedUsers.id,
			})

		}, 800);
	}
	listenForGroupTyping(): void {

		this.ChatService.receiveGroupTyping().subscribe((socketResponse: Message) => {
			this.userTyping = '';
			if (this.selectedUsers === 0 && this.userIds != socketResponse['data'].fromUserId) {
			
				this.userTyping = socketResponse['data'].fromUserName;
			}
		});

		this.ChatService.receiveGroupTypingStop().subscribe((socketResponse: Message) => {
			this.userTyping = '';
			if (this.selectedUsers === 0 && this.userIds != socketResponse['data'].fromUserId) {
			
				this.userTyping = '';
			}
		});
	}
	getuserBold(id:any){
	
		if(id == this.hightlight_user){
			return true;
		}
		else{
			false;
		}
	}

	removeUser(userid:any){
	 
		var $this = this;
	  this.total_user.forEach(function (value, key) {
  
		  
			  
			  if (value.id === userid) {
				  
				  $this.total_user.splice(key,1);
				  
  
			  }
	  
	  });
	}
	chat_list_display(status){
		if(status == false){
			this.list_status = true;
		
		}
		else{
		
			this.list_status =false;
			
		}
	}

}
