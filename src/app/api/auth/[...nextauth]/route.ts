import NextAuth from "next-auth";
import { authOptions } from "./options";

const handler = NextAuth(authOptions); // function is returned , its reference is stored in "handler"

export { handler as GET, handler as POST };

//  the handler is exported as to handle both get and post request.

// this can also be written as following way :

/*
 
 export async function GET(req: Request) {
    return NextAuth(authOptions)(req); // Handle GET requests
  }
  
  export async function POST(req: Request) {
    return NextAuth(authOptions)(req); // Handle POST requests
  }


*/

/* 
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%


   What is this code doing ? 


This code is setting up an API route in Next.js to handle authentication using NextAuth, a popular authentication library for Next.js. 


authOptions is a named export from the ./options file.
Purpose: This object contains configuration settings for NextAuth, such as providers (e.g., credentials, Google, GitHub), callbacks, secret keys, and more. The authOptions define how authentication should be handled (which providers to use, session behavior, etc.).


NextAuth(authOptions): This initializes NextAuth with the configuration provided in authOptions. It sets up everything NextAuth needs based on the options, such as authentication providers, session handling, and any custom logic you defined in the options.

handler: The result of calling NextAuth(authOptions) is a function (or "handler") that can be used to handle incoming API requests for authentication. This function takes care of all authentication logic—handling login, logout, session, token, etc. */
