export interface GroupMessage {
	fromUserId: string;
	message: string;
	toUserId: string;
	fromUserName?: string;
	chatType:string;
    roomId:string;
	teamName?:string;
	time?:any;

}