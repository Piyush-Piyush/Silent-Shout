import { sendVerificatioinEmail } from "@/helper/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
	await dbConnect();
	try {
		const { username, email, password } = await request.json(); // NOTE : remember to use await for request.json

		const existingUserVerifiedByUsername = await UserModel.findOne({
			username,
			isVerified: true, // These two will be treated as and condition.
		});
		if (existingUserVerifiedByUsername) {
			return Response.json(
				{ success: false, message: "Username is already taken." },
				{ status: 400 }
			);
		}

		const existingUserByEmail = await UserModel.findOne({ email });

		const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

		if (existingUserByEmail) {
			// if already verified , then return "user already existed"
			if (existingUserByEmail.isVerified) {
				return Response.json(
					{
						success: false,
						message: "user already exists with this email.",
					},
					{ status: 400 }
				);
			} else {
				const hashedPassword = await bcrypt.hash(password, 10);
				existingUserByEmail.password = hashedPassword;
				existingUserByEmail.verifyCode = verifyCode;
				existingUserByEmail.verifyCodeExpiry = new Date(
					Date.now() + 3600000
				);
				await existingUserByEmail.save();
			}
			// if not verified
		} else {
			const hashedPassword = await bcrypt.hash(password, 10); // 10 rounds of encryption
			const expiryDate = new Date();
			expiryDate.setHours(expiryDate.getHours() + 1);
			const newUser = new UserModel({
				username,
				email,
				password: hashedPassword,
				verifyCode,
				verifyCodeExpiry: expiryDate,
				isVerified: false,
				isAccepetingMessages: true,
				messages: [],
			});
			await newUser.save();
		}

		// send verification email
		const sendVerificationEmailResponse = await sendVerificatioinEmail(
			email,
			username,
			verifyCode
		);
		if (!sendVerificationEmailResponse.success) {
			return Response.json(
				{ success: false, message: sendVerificationEmailResponse.message },
				{ status: 500 }
			);
		}
		return Response.json(
			{
				success: true,
				message: "User registered successfully. Please verify your email.",
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error registering user", error);
		return Response.json(
			{
				success: false,
				message: "Error registering user",
			},
			{ status: 500 }
		);
	}
}
