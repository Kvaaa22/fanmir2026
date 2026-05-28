import { NextResponse, type NextRequest } from "next/server";
import { adminCookieName, verifyAdminToken } from "@/lib/admin/session";
import { relativeRedirect } from "@/lib/http/relativeRedirect";

const adminLoginPagePath = "/admin/login";
const adminLoginApiPath = "/api/admin/login";

function isPublicAdminPath(pathname: string) {
  return pathname === adminLoginPagePath || pathname === adminLoginApiPath;
}

function isAdminPagePath(pathname: string) {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

function shouldRedirectToLogin(request: NextRequest) {
  return (
    isAdminPagePath(request.nextUrl.pathname) &&
    (request.method === "GET" || request.method === "HEAD")
  );
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (isPublicAdminPath(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(adminCookieName)?.value;
  const isAuthenticated = await verifyAdminToken(token);

  if (isAuthenticated) {
    return NextResponse.next();
  }

  if (shouldRedirectToLogin(request)) {
    return relativeRedirect(request, adminLoginPagePath);
  }

  return NextResponse.json(
    { error: "Требуется вход в админку" },
    { status: 401 },
  );
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
