import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  //   const response = await fetch(
  //   "http://localhost:5000/api/auth/get-session",
  //   {
  //     headers: {
  //       cookie: request.headers.get("cookie") || "",
  //     },
  //   }
  // ); `${process.env.NEXT_PUBLIC_API_URL}/api/vehicle/create`

  const response2 = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/get-session`,
    {
      credentials: "include",
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    }
  ); 

  const sessionData = await response2.json();

// http://localhost:5000/api/auth/session
// better-auth.session_data
// better-auth.session_token
  // const session = request.cookies.get("better-auth.session_token");

  if (!sessionData || !sessionData.user) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();

    // const role = await getUserRole(session?.user?.id ?? "");
    // const role: string = "admin";

    // if(!session) {
    //     return NextResponse.redirect(new URL("/sign-in", request.url));
    // }

    // Fetch the role from DB
//   const role = await getUserRole(session.user.id);

  // Restrict access to /vehicle
//   if (request.nextUrl.pathname.startsWith("/vehicle") && role !== "admin") {
//     return NextResponse.redirect(new URL("/", request.url));
//   }


    // return NextResponse.next();
}

export const config = {
//   matcher: ["/"], // Specify the routes the middleware applies to
  matcher: ["/"], // Specify the routes the middleware applies to
};