import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";

// In the credentialProvider part ,  name is used for showing what text to show on actual page. Ex: we have used name: "Credentials" So page o/p will be :-  Sign in with Credentials.

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			id: "credentials",
			name: "Credentials",
			credentials: {
				// creates a kind of simple form for signIn purpose.
				email: { label: "Email", type: "text" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials: any): Promise<any> {
				// how to authorize
				await dbConnect();
				try {
					const user = await UserModel.findOne({
						$or: [
							{ email: credentials.identifier.email },
							{ username: credentials.identifier.username },
						],
					});
					if (!user) {
						throw new Error("User not found.");
					}
					if (!user.isVerified) {
						throw new Error("Please verify you account before login. ");
					}

					const isPasswordCorrect = await bcrypt.compare(
						credentials.password, // NOTE: we have not used identifier as password is directly available in credential.
						user.password
					);
					if (isPasswordCorrect) {
						return user;
					} else {
						throw new Error("Incorrect Password.");
					}
				} catch (error: any) {
					console.log(error);
					throw new Error(error);
				}
			},
		}),
	],
	callbacks: {
		// To avoid db calls , we modified the callback and added the user data to token and session before return the token or session.
		async jwt({ token, user }) {
			if (user) {
				token._id = user._id?.toString();
				token.isVerified = user.isVerified;
				token.isAcceptingMessage = user.isAcceptingMessage;
				token.username = user.username;
			}
			return token;
		},
		async session({ session, token }) {
			if (token) {
				session.user._id = token._id;
				session.user.isVerified = token.isVerified;
				session.user.isAcceptingMessage = token.isAcceptingMessage;
				session.user.username = token.username;
			}
			return session;
		},
	},
	pages: {
		signIn: "/sign-in", // By default nextjs, sign in ke liye /auth/signin... rehta hai, but hame chaiye tha ki direct .=/sign-in pe jaye isiliye overwrite kiye with the help of pages.
	},
	session: {
		strategy: "jwt",
	},
	secret: process.env.NEXTAUTH_SECRET,
};

// NOTE : whenever using jwt or redirect in callback in nextAuth, remember to return token in case of jwt and baseUrl in case of redirect.
