import { NextResponse, NextRequest } from "next/server";
// import type { NextRequest } from "next/server"; TODO
export { default } from "next-auth/middleware";

import { getToken } from "next-auth/jwt"; // helps to access  the content of jwt without having to handle jwt decryption/verification yourself.

// This function can be marked `async` if using `await` inside.
export async function middleware(request: NextRequest) {
	const token = await getToken({ req: request });

	const url = request.nextUrl; // get the current url

	if (
		token &&
		(url.pathname.startsWith("/sign-in") ||
			url.pathname.startsWith("/sign-up") ||
			url.pathname.startsWith("/verify") ||
			url.pathname.startsWith("/"))
	) {
		return NextResponse.redirect(new URL("/dashboard", request.url)); // why request.url is given  -> to keep the base of the current request URL
	}

	if (!token && url.pathname.startsWith("/dashboard")) {
		return NextResponse.redirect(new URL("/sign-in", request.url));
	}

	return NextResponse.next();
}

// Config specifies the routes where the middleware should run.
// Routes can be exact paths or dynamic segments with ":path" and wildcards.

export const config = {
	matcher: ["/", "/sign-in", "/sign-up", "/dashboard/:path", "/verify/:path*"],
};

/*

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

This code defines a middleware function, which intercepts requests before they reach their destination and applies some logic (e.g., redirection) based on certain conditions. Here's a detailed breakdown of the code:

1. Middleware Function Definition

export async function middleware(request: NextRequest) {

Purpose: This defines an asynchronous middleware function that receives a NextRequest object. This middleware will be run on any route that matches the configuration in your config.matcher.
request: This is the incoming HTTP request that the middleware will analyze and act upon.


2. Get the Token


const token = await getToken({ req: request });


Purpose: This line tries to retrieve a token (likely a session or authentication token) from the request using the getToken function, which is part of the NextAuth package.
If the token exists, it means the user is authenticated.
If the token is null or undefined, the user is likely unauthenticated.


3. Get the Current URL

const url = request.nextUrl;
Purpose: request.nextUrl returns the NextURL object representing the current URL of the request.
This is used to get information about the requested path, which will help decide where to redirect the user.


4. Redirection Logic

if (
  token &&
  (url.pathname.startsWith("/sign-in") ||
   url.pathname.startsWith("/sign-up") ||
   url.pathname.startsWith("/verify") ||
   url.pathname.startsWith("/"))
) {
  return NextResponse.redirect(new URL("/dashboard", request.url));
}


What it does:
First, it checks if a valid token exists (token is truthy), which indicates the user is authenticated.
Then, it checks if the current URL (from url.pathname) matches any of these paths:


/sign-in
/sign-up
/verify
/ (homepage)


Purpose:
If the user is authenticated (has a token) and is trying to access one of these routes (like signing in or signing up, or verifying their account), the middleware will redirect them to the /dashboard page. The assumption is that authenticated users shouldn't be able to access these pages because they should already be logged in and should be redirected to their dashboard.
Redirect:
The NextResponse.redirect function creates a redirect response. The new URL("/dashboard", request.url) constructs a new URL that points to the /dashboard page, keeping the base of the current request URL.



5. Fallback Redirect

return NextResponse.redirect(new URL("/home", request.url));
Purpose: If the previous condition fails (i.e., the user doesn't have a valid token or is trying to access another page), the middleware redirects the user to the /home page.
This likely means the user is unauthenticated or trying to access some other routes. So, they are redirected to a default page (/home).




Summary:
The middleware checks if the user is authenticated by retrieving a token.
If the user is authenticated and trying to access specific routes like /sign-in, /sign-up, /verify, or /, they are redirected to the /dashboard page because these pages are likely meant for unauthenticated users.
If the user is not authenticated or tries to access other routes, they are redirected to the /home page.
Example Scenario:
A user who is authenticated tries to access /sign-in: They will be redirected to /dashboard.
A user who is not authenticated tries to access any route: They will be redirected to /home.

*/
