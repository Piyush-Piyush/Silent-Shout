import { z } from "zod";

export const usernameValidation = z
	.string()
	.min(3, "Username must be atleast 3 characters.")
	.max(20, "Username, must be no more than 20 characters")
	.regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special character");

// yaha pe direct z.string() and other properties direct check kiye, kyuki in usernameValidation their only one character that is user name.

// however in case of signUpvalidation there will will several data so we have to create objects.

export const signUpSchema = z.object({
	username: usernameValidation,
	email: z.string().email({ message: "Invalid email" }),
	password: z
		.string()
		.min(6, { message: "password must be atleast 6 characters." }),
});
