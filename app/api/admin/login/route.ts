import { NextResponse } from "next/server";
import { loginAdmin } from "@/lib/admin/auth";
import { checkRateLimit } from "@/lib/security/rateLimit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!checkRateLimit(request, "admin-login", { limit: 10, windowMs: 60_000 })) {
    return NextResponse.redirect(new URL("/admin/login?error=rate-limit", request.url), 303);
  }

  const formData = await request.formData();
  const login = String(formData.get("login") ?? "");
  const password = String(formData.get("password") ?? "");
  const isLoggedIn = await loginAdmin(login, password);

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/admin/login?error=1", request.url), 303);
  }

  return NextResponse.redirect(new URL("/admin/prices", request.url), 303);
}
