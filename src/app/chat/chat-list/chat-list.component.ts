import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup,  FormBuilder, FormArray, FormControl, Validators  } from '@angular/forms';
import { faFile, faCalculator, faGlobe, faUser, faUserTie, faUsers, faBook, faCog, faFileAlt, faCubes, faLifeRing, faAddressBook, faMicrophone, faCircle, faDotCircle, faStopCircle, faComments, faBars,faAngleRight, faAngleDown, faAngleDoubleRight, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { ChatService } from '../../services/chat.service';
import { DataShareService } from '../../services/utils/data-share.service';
import { ChatListResponse } from './../../interfaces/chat-list-response';
import { User } from './../../interfaces/user';
import { Team } from './../../interfaces/team';

import { Message } from './../../interfaces/message';
import { ToastrService } from 'ngx-toastr';
import { GroupMessage } from './../../interfaces/group-message';
import { MessagesResponse } from './../../interfaces/messages-response';

declare const hideshow:any;

import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.css']
})
export class ChatListComponent implements OnInit {
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
  loginGroupId:string;
	dashboard_url:string;	
  loading:boolean=false;
  team: boolean = false;
  userIds:string='';
  chatListUsers: User[] = [];
  site_Url:string;
  i:any='0';
	server_url:string;
  selectedUserId:any='';
  user_form: boolean = true;
  selectedTeamId:any='';
  messageLoading: boolean = false;
  cyber_user_id;any='';
  alloted_team:any=[];
  userName: any = '';
  teamId: any = '';
  selectedUsers: any = '';
  selectedTeams:any='';
  messages: any = '';
	userTyping: string = '';
  msgNotification:string='';
  timeout: any = null;
  public messageForm: FormGroup;
  @ViewChild('messageThread') private messageContainer: ElementRef;
  constructor(private formBuilder: FormBuilder, private ChatService: ChatService,private dataShareService: DataShareService , private LoginService:LoginService, private router: Router , private ToastrService: ToastrService) { 

    this.site_Url = this.LoginService.siteUrl;
		this.server_url = this.LoginService.getServerUrl();
    this.cyber_user_id =this.LoginService.getUserId();
  }

  ngOnInit(): void {
    
    // hideshow();
    this.userIds = this.dataShareService.getUserId();
    this.userName = this.dataShareService.getUserName();
    this.establishSocketConnection();
    console.log('checluser_id'+ this.userIds);
    // this.teamId = this.dataShareService.getTeamId();


    this.ChatService.getChatList(this.userIds).subscribe((chatListResponse: ChatListResponse) => {
     
			console.log('chatlist =' + JSON.stringify(chatListResponse.chatList));
			this.renderChatList(chatListResponse);
			
		});


    this.listenForMessages();

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
	  this.ChatService.getTeam(this.cyber_user_id).subscribe((response) => {
			this.alloted_team = response.teamDetails;

		// 
		this.alloted_team.forEach(element => {
     this.ChatService.joinRoom(element._id);
		  });
		// console.log('chatlist =' + JSON.stringify(chatListResponse.chatList));
		// this.renderChatList(chatListResponse);
		
	});
	
	
  this.listenForMessages();
  this.listenForTyping();
}

listenForTyping(): void {

	this.ChatService.receiveTyping().subscribe((socketResponse: Message) => {

		this.userTyping = '';
		if (this.selectedUser !== null && this.selectedUsers.id === socketResponse.fromUserId) {
			//console.log(socketResponse);
			this.userTyping = socketResponse.fromUserName;
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
  renderChatList(chatListResponse: ChatListResponse): void {
    console.log('render chatList');
      if (!chatListResponse.error) {
        console.log(JSON.stringify(chatListResponse));

        if (chatListResponse.singleUser) {
          if (this.chatListUsers.length > 0) {
            this.chatListUsers = this.chatListUsers.filter(function (obj: User) {
              return obj.id !== chatListResponse.chatList[0].id;
            });
          }
          /* Adding new online user into chat list array */
          
          this.chatListUsers = this.chatListUsers.concat(chatListResponse.chatList);
        } else if (chatListResponse.userDisconnected) {
          const loggedOutUser = this.chatListUsers.findIndex((obj: User) => obj.id === chatListResponse.userid);
          if (loggedOutUser >= 0) {
            this.chatListUsers[loggedOutUser].online = 'N';
          }
        } else {
          /* Updating entire chatlist if user logs in. */
          this.chatListUsers = chatListResponse.chatList;
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
    
    hideshow();
  }
  
  selectedUser(user: User): void {
  
    this.selectedUserId = user.id;
    // alert(user.id);
    
    this.dataShareService.changeSelectedUser(user);
    this.dataShareService.changeChatType('single');
  }
  
  selectedTeam(team){
    this.selectedTeamId = team._id;
    // alert(user.id);
  
    this.dataShareService.changeSelectedTeam(team);
    this.dataShareService.changeChatType('group');
    
    localStorage.setItem('team_id',team._id);
    
    
  }
  getMessages(toUserId: string) {

		this.messageLoading = true;
		this.ChatService.getMessages({ userId: this.userIds, toUserId: toUserId }).subscribe((response: MessagesResponse) => {
			this.messages = response.messages;

			this.messageLoading = false;
		});
		this.userTyping = '';
		this.msgNotification = '';
	}


	getGroupMessages(TeamId: string) {

		this.ChatService.getGroupMessages({ TeamId: TeamId }).subscribe((response: MessagesResponse) => {
			// console.log(JSON.stringify(response));

			this.messages = response.messages;

			this.messageLoading = false;
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
			if (this.selectedUsers !== null && this.selectedUsers.id === socketResponse.fromUserId) {
       
				if (socketResponse.message !== undefined) {
					this.messages = [...this.messages, socketResponse];
					this.scrollMessageContainer();
				}


			} else {
				if (socketResponse.message !== undefined) {
					//console.log('abcd',socketResponse.message)
					this.msgNotification = `New Message Received from ${socketResponse.fromUserName}`;
				}

			}
			this.userTyping = '';
		});
	}

	scrollMessageContainer(): void {
		if (this.messageContainer !== undefined) {
			try {
				setTimeout(() => {
					this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
				}, 100);
			} catch (error) {
				console.warn(error);
			}
		}
	}

	sendMessageAdmin(event) {
   
    console.log(this.i);
    this.i++;
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
				toUserId: this.selectedUsers.id,
				fromUserName: this.userName,
				chatType: 'single'
			});
		}
		// }
	}

	sendAndUpdateMessages(message: Message) {
   
		try {
			this.messageForm.disable();
			this.ChatService.sendMessage(message);
			this.messages = [...this.messages, message];
    
			console.log('single_mesage ' + JSON.stringify(this.messages));
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
				roomId: this.selectedTeams._id,
				chatType: 'group'
				// roomId:this.selectedTeam

			});
		}
		// }
	}

	sendAndUpdateGroupMessages(message: GroupMessage) {

		try {
			this.messageForm.disable();
			this.ChatService.sendGroupMessage(message);

			//this.messages = [...this.messages, message];
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

			// if (this.selectedUser !== null && this.selectedUser.id === socketResponse.fromUserId) {


			// }
			console.log('group msg', socketResponse);
			console.log(this.selectedUser);
			if (this.selectedTeam !== null) {

				// if(socketResponse.message !== undefined) 
				// 	{	

				this.messages = [...this.messages, socketResponse['data']];

				console.log(JSON.stringify(this.messages));
				if (socketResponse['data'].fromUserName != this.userName) {
					this.ToastrService.success(`New Message Received from ${socketResponse['data'].fromUserName} From ${this.selectedTeams.team_name} `, '', { closeButton: true, tapToDismiss: true });
					// this.msgNotification = `New Message Received from ${socketResponse['data'].fromUserName} From ${this.selectedTeam.team_name} `;
				}

				this.scrollMessageContainer();

				// }
				this.userTyping = '';
			}
			else {
				this.messages = [...this.messages, socketResponse['data']];
				this.msgNotification = `New Message Received from ${socketResponse['data'].fromUserName}`;
			}


		});
	}


	gorupMessageTyping(values): void {
		//console.log(values);
		this.ChatService.typeGroupMessage({
			fromUserId: this.userIds,
			fromUserName: this.userName,
		});

		clearTimeout(this.timeout);
		var $this = this;
		this.timeout = setTimeout(function () {
			$this.ChatService.stopGroupType({
				fromUserId: $this.userIds,
				fromUserName: $this.userName,
			})

		}, 5000);
	}

	MessageTyping(values): void {
		//console.log(values);
		this.ChatService.typeGroupMessage({
			fromUserId: this.userIds,
			fromUserName: this.userName,
		});

		clearTimeout(this.timeout);
		var $this = this;
		this.timeout = setTimeout(function () {
			$this.ChatService.stopGroupType({
				fromUserId: $this.userIds,
				fromUserName: $this.userName,
			})

		}, 5000);
	}
	listenForGroupTyping(): void {
		this.ChatService.receiveGroupTyping().subscribe((socketResponse: Message) => {
			this.userTyping = '';
			if (this.selectedUsers === 0 && this.userIds != socketResponse['data'].fromUserId) {
				console.log('typing', socketResponse);
				this.userTyping = socketResponse['data'].fromUserName;
			}
		});

		this.ChatService.receiveGroupTypingStop().subscribe((socketResponse: Message) => {
			this.userTyping = '';
			if (this.selectedUsers === 0 && this.userIds != socketResponse['data'].fromUserId) {
				//console.log(socketResponse);
				this.userTyping = '';
			}
		});
	}

}
