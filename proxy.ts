import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth/session";

const publicPaths = ["/login", "/forgot-password", "/reset-password", "/api/auth/login", "/api/health", "/api/ready"];

function isPublic(pathname: string) {
  return publicPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`)) || pathname.startsWith("/_next") || pathname === "/favicon.ico";
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (isPublic(pathname)) return NextResponse.next();
  const isProtectedPage = pathname.startsWith("/dashboard") || pathname.startsWith("/customers") || pathname.startsWith("/quotes") || pathname.startsWith("/referrals") || pathname.startsWith("/policies") || pathname.startsWith("/renewals") || pathname.startsWith("/statements") || pathname.startsWith("/documents") || pathname.startsWith("/admin");
  const isProtectedApi = pathname.startsWith("/api") && !pathname.startsWith("/api/auth");
  if (!isProtectedPage && !isProtectedApi) return NextResponse.next();
  const session = request.cookies.get(SESSION_COOKIE)?.value;
  if (!session) {
    if (isProtectedApi) return NextResponse.json({ error: "UNAUTHENTICATED" }, { status: 401 });
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
