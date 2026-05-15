import bcrypt from "bcryptjs";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const adminCookieName = "fanmir_admin_session";
const sessionMaxAgeSeconds = 60 * 60 * 8;

type AdminSessionPayload = {
  login: string;
};

function getAdminConfig() {
  const login = process.env.ADMIN_LOGIN;
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  const jwtSecret = process.env.ADMIN_JWT_SECRET;

  if (!login || !passwordHash || !jwtSecret) {
    return null;
  }

  return {
    jwtSecret,
    login,
    passwordHash,
  };
}

function getSecretKey(secret: string) {
  return new TextEncoder().encode(secret);
}

async function createAdminToken(payload: AdminSessionPayload, secret: string) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${sessionMaxAgeSeconds}s`)
    .sign(getSecretKey(secret));
}

async function verifyAdminToken(token: string) {
  const config = getAdminConfig();

  if (!config) {
    return false;
  }

  try {
    const { payload } = await jwtVerify(token, getSecretKey(config.jwtSecret));
    return payload.login === config.login;
  } catch {
    return false;
  }
}

function getCookieFromHeader(request: Request, name: string) {
  const cookieHeader = request.headers.get("cookie");

  if (!cookieHeader) {
    return null;
  }

  const cookiesList = cookieHeader.split(";").map((cookie) => cookie.trim());
  const cookie = cookiesList.find((item) => item.startsWith(`${name}=`));

  return cookie ? decodeURIComponent(cookie.slice(name.length + 1)) : null;
}

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

  return token ? verifyAdminToken(token) : false;
}

export async function requireAdminSession() {
  if (!(await hasAdminSession())) {
    redirect("/admin/login");
  }
}

export async function isAdminRequest(request: Request) {
  const token = getCookieFromHeader(request, adminCookieName);

  return token ? verifyAdminToken(token) : false;
}
