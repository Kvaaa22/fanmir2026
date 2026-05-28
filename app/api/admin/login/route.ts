import { loginAdmin } from "@/lib/admin/auth";
import { relativeRedirect } from "@/lib/http/relativeRedirect";
import { checkRateLimit } from "@/lib/security/rateLimit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!checkRateLimit(request, "admin-login", { limit: 10, windowMs: 60_000 })) {
    return relativeRedirect(request, "/admin/login?error=rate-limit", 303);
  }

  const formData = await request.formData().catch(() => null);

  if (!formData) {
    return relativeRedirect(request, "/admin/login?error=1", 303);
  }

  const login = String(formData.get("login") ?? "");
  const password = String(formData.get("password") ?? "");
  const isLoggedIn = await loginAdmin(login, password);

  if (!isLoggedIn) {
    return relativeRedirect(request, "/admin/login?error=1", 303);
  }

  return relativeRedirect(request, "/admin/prices", 303);
}
