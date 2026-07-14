import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define the paths you want to protect
const protectedRoutes = ["/", "/create"];
const authRoutes = ["/sign-in", "/sign-up"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Check if the route needs protecting or is an auth route
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (!isProtectedRoute && !isAuthRoute) {
    return NextResponse.next();
  }

  // 2. Fetch the session from your Express backend via your proxy route
  // We point to "localhost" or your "vercel domain" dynamically using request.nextUrl.origin
  const sessionResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/get-session`, {
    credentials: "include",
    headers: {
      // CRITICAL: We must forward the cookies from the incoming request 
      // so the backend can verify the session_token
      cookie: request.headers.get("cookie") || "",
    },
  });

  const session = await sessionResponse.json();
  const isAuthenticated = !!session;

  // 3. Redirect rules
  if (isProtectedRoute && !isAuthenticated) {
    // If trying to access a private page while logged out -> redirect to /login
    const loginUrl = new URL("/sign-in", request.url);
    // Optional: Keep track of where they were trying to go
    loginUrl.searchParams.set("callbackUrl", pathname); 
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && isAuthenticated) {
    // If trying to access /login while already logged in -> redirect to /dashboard
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// 4. Configure the middleware to only run on page routes (ignoring static files/APIs)
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (except /api/auth in case you want to bypass it, but usually best to ignore api)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico|api).*)",
  ],
};




// import { NextRequest, NextResponse } from "next/server";

// export async function proxy(request: NextRequest) {
//   //   const response = await fetch(
//   //   "http://localhost:5000/api/auth/get-session",
//   //   {
//   //     headers: {
//   //       cookie: request.headers.get("cookie") || "",
//   //     },
//   //   }
//   // ); `${process.env.NEXT_PUBLIC_API_URL}/api/vehicle/create`

//   const response2 = await fetch(
//     `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/get-session`,
//     {
//       credentials: "include",
//       headers: {
//         cookie: request.headers.get("cookie") || "",
//       },
//     }
//   ); 

//   const sessionData = await response2.json();

// // http://localhost:5000/api/auth/session
// // better-auth.session_data
// // better-auth.session_token
//   // const session = request.cookies.get("better-auth.session_token");

//   if (!sessionData || !sessionData.user) {
//     return NextResponse.redirect(new URL("/sign-in", request.url));
//   }

//   return NextResponse.next();

//     // const role = await getUserRole(session?.user?.id ?? "");
//     // const role: string = "admin";

//     // if(!session) {
//     //     return NextResponse.redirect(new URL("/sign-in", request.url));
//     // }

//     // Fetch the role from DB
// //   const role = await getUserRole(session.user.id);

//   // Restrict access to /vehicle
// //   if (request.nextUrl.pathname.startsWith("/vehicle") && role !== "admin") {
// //     return NextResponse.redirect(new URL("/", request.url));
// //   }


//     // return NextResponse.next();
// }

// export const config = {
// //   matcher: ["/"], // Specify the routes the middleware applies to
//   matcher: ["/"], // Specify the routes the middleware applies to
// };