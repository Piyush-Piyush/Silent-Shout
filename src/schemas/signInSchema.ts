import { z } from "zod";

export const signInSchema = z.object({
	identifier: z.string(), // we could have also named it as email/username, but naming it as identifier is more of a professional approach .
	password: z.string(),
});
    