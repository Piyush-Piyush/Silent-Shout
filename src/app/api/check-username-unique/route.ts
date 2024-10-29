import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

// we already have one signup schema , that is used to validate all the data received during signup process.

//however there is a need for anther schema that is solely responsible for the username, for faster response during filling signup form.

const UsernameQuerySchema = z.object({
	username: usernameValidation,
});

export async function GET(request: Request) {
	await dbConnect();

	//Eg. localhost:3000/api/current?username=hitesh?phone=android

	try {
		// VALIDATION OF USERNAME
		// STEP 1 : get the username from url as query parameter.
		const { searchParams } = new URL(request.url);
		const queryParam = {
			// NOTE : that this has been made as object, and the UsernameQuerySchema is also checking an object.
			username: searchParams.get("username"),
		};

		// STEP 2 : now we have extracted the user name form the query parameter and using UsernameQuerySchema , we will verify it.
		const result = UsernameQuerySchema.safeParse(queryParam);

		console.log(result); // TODO : remove this line.

		if (!result.success) {
			const usernameErrors = result.error.format().username?._errors || []; // result.error.format me se agar username hai to bas usi se related error chaiye.
			return Response.json(
				{
					success: false,
					message:
						usernameErrors?.length > 0
							? usernameErrors.join(", ")
							: "Invalid query parameter.",
				},
				{ status: 400 }
			);
		}

		const { username } = result.data;

		const existingVerifiedUser = await UserModel.findOne({
			username,
			isVerified: true,
		});

		if (existingVerifiedUser) {
			return Response.json(
				{
					success: false,
					message: "Username is already taken.",
				},
				{ status: 400 }
			);
		}

		return Response.json(
			{
				success: true,
				message: "Wohoo! Username is available.",
			},
			{ status: 400 }
		);
	} catch (error) {
		console.error("Error checking username", error);
		return Response.json(
			{
				success: false,
				message: "Error checking username.",
			},
			{ status: 500 }
		);
	}
}
