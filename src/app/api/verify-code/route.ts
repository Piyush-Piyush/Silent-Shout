import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
// import { z } from "zod";
// import { verifySchema } from "@/schemas/verifySchema";

export async function POST(request: Request) {
	await dbConnect();

	try {
		const { username, code } = await request.json();

		// TIPS : however here we are not using but whenever getting value through url , then use  `decodeURIComponent(username)`  to get the data in proper format.
        
		const user = await UserModel.findOne({
			username,
		});

		if (!user) {
			return Response.json(
				{
					success: false,
					message: "User not found.",
				},
				{ status: 400 }
			);
		}

		const isCodeValid = user.verifyCode === code;
		const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();
		if (isCodeValid && isCodeNotExpired) {
			user.isVerified = true;
			await user.save();
			return Response.json(
				{
					success: true,
					message: "Account verified successfully",
				},
				{ status: 200 }
			);
		} else if (!isCodeValid) {
			return Response.json(
				{
					success: false,
					message: "Invalid verification code.",
				},
				{ status: 400 }
			);
		} else {
			return Response.json(
				{
					success: false,
					message: "Verification code has expired, please signup agian.",
				},
				{ status: 400 }
			);
		}
	} catch (error) {
		console.error("Error while verifying user ", error);
		return Response.json(
			{
				success: false,
				message: "Error while verifying user.",
			},
			{ status: 500 }
		);
	}
}
