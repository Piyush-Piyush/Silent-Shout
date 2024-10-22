"use client";

import { SessionProvider } from "next-auth/react";

export default function AuthProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	return <SessionProvider>{children}</SessionProvider>;
}

/*

The AuthProvider you created is a context provider component that wraps your application in Next.js and manages user authentication using NextAuth. It's based on SessionProvider from the next-auth/react package and is responsible for providing authentication-related information (like the user's session) to the entire component tree.


SessionProvider: This component from NextAuth is used to share session data (such as whether a user is logged in or not, and the details of the current session) across your entire application. It internally manages session data, handles session state, and provides functions to sign in and sign out.

children: This refers to any React components that are wrapped inside your AuthProvider. By wrapping these components, you're ensuring they can all access authentication-related context (like session data).




What will it do?

Provide Authentication Context: When you wrap your app with this AuthProvider, all the components nested inside will have access to session information via hooks like useSession() from next-auth/react. This allows components to determine if a user is authenticated, get user details, and trigger sign-in/sign-out functionality.

*/
