import NextAuth from "next-auth";

import authConfig from "./auth.config";
import { DEFAULT_LOGIN_DIRECT, apiAuthPrefix, authRoutes, publicRoutes } from "./routes";

const {auth} = NextAuth(authConfig)

// @ts-ignore
export default auth((req) => {
    const {nextUrl,cookies} = req;
    const isLoggedIn: boolean = !!req.auth;

    const isApiAuthRoute: boolean = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute: boolean = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute: boolean = authRoutes.includes(nextUrl.pathname);

    if(isApiAuthRoute) return null

    if(isAuthRoute) {
        if(isLoggedIn) {
            console.log("User is logged in",req.auth);
            return Response.redirect(new URL(DEFAULT_LOGIN_DIRECT, nextUrl))
        }

        return null
    }

    if(!isLoggedIn && !isPublicRoute) {
        return Response.redirect(new URL('/', nextUrl))
    }

    if (nextUrl.pathname.startsWith("/profile/env-files")) {
        const isVerified = cookies.get("isVerified")?.value === "true";
        if (!isVerified) {
            return Response.redirect(new URL("/profile/verify-otp", nextUrl)); 
        }
    }

    return null;
}) 

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
