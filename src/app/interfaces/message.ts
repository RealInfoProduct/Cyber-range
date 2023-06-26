export interface Message {
	fromUserId: string;
	message: string;
	toUserId: string;
	fromUserName?: string;
	chatType:string;
	time?:any;
}
