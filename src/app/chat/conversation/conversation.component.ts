import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { faDotCircle, faComments, faCaretUp, faTimesCircle, faPaperPlane, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { ChatService } from '../../services/chat.service';
import { DataShareService } from '../../services/utils/data-share.service';
import { User } from './../../interfaces/user';
import { Team } from './../../interfaces/team';
import { Message } from './../../interfaces/message';
import { ToastrService } from 'ngx-toastr';
import { GroupMessage } from './../../interfaces/group-message';
import { MessagesResponse } from './../../interfaces/messages-response';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
declare const hideshow: any;
@Component({
	selector: 'app-conversation',
	templateUrl: './conversation.component.html',
	styleUrls: ['./conversation.component.css']
})
export class ConversationComponent implements OnInit {
	faComments = faComments;
	faDotCircle = faDotCircle;
	faCaretUp = faCaretUp;
	faTimesCircle = faTimesCircle;
	faAngleDoubleRight = faAngleDoubleRight;
	server_url: string;
	selectedUser: any = '';
	userId: string = '';
	messages: any = '';
	userTyping: string = '';
	msgNotification: string = '';
	selectedTeam: any = '';
	team: boolean = false;
	user_form: boolean = true;
	userName: any = '';
	
	teamType: any = '';
	messageLoading: boolean = false;
	timeout: any = null;
	teamId: any = '';
	public messageForm: FormGroup;

	@ViewChild('messageThread') private messageContainer: ElementRef;
	constructor(private formBuilder: FormBuilder, private loginService: LoginService, private ChatService: ChatService, private router: Router, private dataShareService: DataShareService, private ToastrService: ToastrService) {
		this.server_url = this.loginService.getServerUrl();

	}

	ngOnInit(): void {

		this.userId = this.dataShareService.getUserId();

		this.teamId = this.dataShareService.getTeamId();


		this.userName = this.dataShareService.getUserName();


		this.listenForMessages();

		this.dataShareService.selectedUser.subscribe((selectedUser: User) => {
			
			if (selectedUser !== null) {
				this.user_form = true;
				this.team = false;
				this.selectedUser = selectedUser;
				this.getMessages(this.selectedUser.id);
			}
		});


		this.dataShareService.selectedTeam.subscribe((selectedTeam: Team) => {

			if (selectedTeam !== null) {
				this.user_form = false;
				this.team = true;
				this.selectedTeam = selectedTeam;

				this.getGroupMessages(this.selectedTeam._id);
			}
		});

		this.listenGroupMessages();

		this.listenForTyping();


		this.messageForm = this.formBuilder.group({
			message: [null, [Validators.required]],
			// t_title: [null, [Validators.required,noWhitespaceValidator]],
			// d_desc: [null, [Validators.required,noWhitespaceValidator]],
		});


	}
	messageTyping(values): void {
		//console.log(values);
		this.ChatService.typeMessage({
			fromUserId: this.userId,
			toUserId: this.selectedUser.id,
			fromUserName: this.userName,
		});
		this.msgNotification = '';




		clearTimeout(this.timeout);
		var $this = this;
		this.timeout = setTimeout(function () {
			$this.ChatService.stopType({
				fromUserId: $this.userId,
				toUserId: $this.selectedUser.id,
				fromUserName: $this.userName,
			})

		}, 5000);
	}

	listenForTyping(): void {

		this.ChatService.receiveTyping().subscribe((socketResponse: Message) => {

			this.userTyping = '';
			if (this.selectedUser !== null && this.selectedUser.id === socketResponse.fromUserId) {
				//console.log(socketResponse);
				this.userTyping = socketResponse.fromUserName;
			}
		});

		this.ChatService.receiveTypingStop().subscribe((socketResponse: Message) => {
			this.userTyping = '';
			if (this.selectedUser !== null && this.selectedUser.id === socketResponse.fromUserId) {
				//console.log(socketResponse);
				this.userTyping = '';
			}
		});
	}
	getMessages(toUserId: string) {

		this.messageLoading = true;
		this.ChatService.getMessages({ userId: this.userId, toUserId: toUserId }).subscribe((response: MessagesResponse) => {
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
		if (this.userId == userId) {
			return true;
		} else {
			return false
		}
	}

	listenForMessages(): void {
		this.ChatService.receiveChatMessages().subscribe((socketResponse: Message) => {
			if (this.selectedUser !== null) {

				if (socketResponse.message !== undefined) {
					console.log(JSON.stringify(socketResponse));
					this.messages = [...this.messages, socketResponse];
					this.scrollMessageContainer();
					this.ToastrService.success(`New Message Received from ${socketResponse.fromUserName} From ${this.selectedUser.f_name} `, '', { closeButton: true, tapToDismiss: true });
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

	sendMessage(event) {

		// if (event.keyCode === 13) {
		const message = this.messageForm.controls['message'].value.trim();
		if (message === '' || message === undefined || message === null) {
			alert(`Message can't be empty.`);
		} else if (this.userId === '') {
			this.router.navigate(['/']);
		} else if (this.selectedUser.id === '') {
			alert(`Select a user to chat.`);
		} else {
			this.sendAndUpdateMessages({
				fromUserId: this.userId,
				message: (message).trim(),
				toUserId: this.selectedUser.id,
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
			console.log('single_mesage ' + this.messages);
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

		} else if (this.userId === '') {
			this.router.navigate(['/']);
		} else if (this.selectedUser.id === '') {
			alert(`Select a user to chat.`);
		} else {

			this.sendAndUpdateGroupMessages({
				fromUserId: this.userId,
				message: (message).trim(),
				toUserId: this.selectedUser.id,
				fromUserName: this.userName,
				roomId: this.selectedTeam._id,
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
					this.ToastrService.success(`New Message Received from ${socketResponse['data'].fromUserName} From ${this.selectedTeam.team_name} `, '', { closeButton: true, tapToDismiss: true });
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
			fromUserId: this.userId,
			fromUserName: this.userName,
		});

		clearTimeout(this.timeout);
		var $this = this;
		this.timeout = setTimeout(function () {
			$this.ChatService.stopGroupType({
				fromUserId: $this.userId,
				fromUserName: $this.userName,
			})

		}, 5000);
	}

	listenForGroupTyping(): void {
		this.ChatService.receiveGroupTyping().subscribe((socketResponse: Message) => {
			this.userTyping = '';
			if (this.selectedUser === 0 && this.userId != socketResponse['data'].fromUserId) {
				console.log('typing', socketResponse);
				this.userTyping = socketResponse['data'].fromUserName;
			}
		});

		this.ChatService.receiveGroupTypingStop().subscribe((socketResponse: Message) => {
			this.userTyping = '';
			if (this.selectedUser === 0 && this.userId != socketResponse['data'].fromUserId) {
				//console.log(socketResponse);
				this.userTyping = '';
			}
		});
	}


}
