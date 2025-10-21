import { NextResponse, type NextRequest } from "next/server";
import { auth0 } from "./lib/auth0";

const PUBLIC_PATHS = ["/", "/home"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Letting Auth0 handle special and public routes
  // if (PUBLIC_PATHS.includes(pathname) || pathname.startsWith("/auth")) {
  //   return auth0.middleware(request);
  // }

  // // For personalized protected pages
  // const session = (await auth0.getSession(request)) || {
  //   user: {
  //     sub: "asdasdasd",
  //   },
  // };

  // if (!session?.user) {
  //   return NextResponse.redirect(new URL("/auth/login", request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
