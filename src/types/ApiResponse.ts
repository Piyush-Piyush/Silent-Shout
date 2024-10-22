import { Message } from "@/model/user.model";

export interface ApiResponse {
	success: boolean;
	message: string;
	isAcceptingMessage?: boolean; // This is made optional because, in some cases like login or signup , this is not required.
	messages?: Array<Message>;
}
