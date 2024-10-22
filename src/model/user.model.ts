import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
	content: string;
	createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
	content: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		required: true,
		default: Date.now,
	},
});

export interface User extends Document {
	username: string;
	email: string;
	password: string;
	verifyCode: string;
	verifyCodeExpiry: Date;
	isVerified: boolean;
	isAccepetingMessages: boolean;
	messages: Message[];
}

const UserSchema: Schema<User> = new Schema({
	username: {
		type: String,
		required: [true, "Username is required"],
		trim: true,
		unique: true,
	},
	email: {
		type: String,
		required: [true, "Email is required"],
		unique: true,
		match: [
			/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
			"Please use a valid email address.",
		],
	},
	password: {
		type: String,
		required: [true, "Password is required"],
	},
	verifyCode: {
		type: String,
		required: [true, "Verify Code is required"],
	},
	verifyCodeExpiry: {
		type: Date,
		required: [true, "verify code expiry is required"],
	},
	isVerified: {
		type: Boolean,
		default: false,
	},
	isAccepetingMessages: {
		type: Boolean,
		default: true,
	},
	messages: [MessageSchema],
});


// Since next.js runs on edge time , so it doesn't know if the application is booting for the first time, or has booted previously.
// Therefore, it is bit different while exporting the database model, we check if the model exists or not , if it exists then export that one or else if not then a new model is exported.
const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema);

export default UserModel;
