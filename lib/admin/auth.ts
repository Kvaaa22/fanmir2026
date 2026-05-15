import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  adminCookieName,
  createAdminToken,
  getAdminTokenFromRequest,
  getAdminConfig,
  sessionMaxAgeSeconds,
  verifyAdminToken,
} from "@/lib/admin/session";

export async function loginAdmin(login: string, password: string) {
  const config = getAdminConfig();

  if (!config || login !== config.login) {
    return false;
  }

  const isPasswordValid = await bcrypt.compare(password, config.passwordHash);

  if (!isPasswordValid) {
    return false;
  }

  const cookieStore = await cookies();
  const token = await createAdminToken({ login }, config.jwtSecret);

  cookieStore.set(adminCookieName, token, {
    httpOnly: true,
    maxAge: sessionMaxAgeSeconds,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return true;
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.set(adminCookieName, "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function hasAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(adminCookieName)?.value;

  return verifyAdminToken(token);
}

export async function requireAdminSession() {
  if (!(await hasAdminSession())) {
    redirect("/admin/login");
  }
}

export async function isAdminRequest(request: Request) {
  return verifyAdminToken(getAdminTokenFromRequest(request));
}
