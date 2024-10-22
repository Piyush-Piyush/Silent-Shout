import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificatioinEmail(
	email: string,
	username: string,
	verifyCode: string
): Promise<ApiResponse> {
	try {
		const { data, error } = await resend.emails.send({
			from: "Acme <onboarding@resend.dev>",
			to: email,
			subject: "SilentShout message | Verification code",
			react: VerificationEmail({ username, otp: verifyCode }),
		});
		return {
			success: true,
			message: "verification email sent successfully.",
		};
	} catch (emailError) {
		console.log("Error while sending verification email", emailError);
		return { success: false, message: "failed to send verification email" };
	}
}
