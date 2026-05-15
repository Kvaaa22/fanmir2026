import { createHmac, timingSafeEqual } from "crypto";
import { jwtVerify, SignJWT } from "jose";

export const adminCookieName = "fanmir_admin_session";
export const sessionMaxAgeSeconds = 60 * 60 * 8;

type AdminSessionPayload = {
  login: string;
};

export function getAdminConfig() {
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

export async function createAdminToken(
  payload: AdminSessionPayload,
  secret: string,
) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${sessionMaxAgeSeconds}s`)
    .sign(getSecretKey(secret));
}

export async function verifyAdminToken(token: string | null | undefined) {
  const config = getAdminConfig();

  if (!token || !config) {
    return false;
  }

  try {
    const { payload } = await jwtVerify(token, getSecretKey(config.jwtSecret));
    return payload.login === config.login;
  } catch {
    return false;
  }
}

export function getRequestCookie(request: Request, name: string) {
  const cookieHeader = request.headers.get("cookie");

  if (!cookieHeader) {
    return null;
  }

  const cookiesList = cookieHeader.split(";").map((cookie) => cookie.trim());
  const cookie = cookiesList.find((item) => item.startsWith(`${name}=`));

  return cookie ? decodeURIComponent(cookie.slice(name.length + 1)) : null;
}

export function getAdminTokenFromRequest(request: Request) {
  return getRequestCookie(request, adminCookieName);
}

export function createAdminCsrfToken(adminToken: string | null | undefined) {
  const config = getAdminConfig();

  if (!adminToken || !config) {
    return null;
  }

  return createHmac("sha256", config.jwtSecret)
    .update(`admin-upload:${adminToken}`)
    .digest("base64url");
}

export function verifyAdminCsrfToken(
  adminToken: string | null | undefined,
  csrfToken: string | null | undefined,
) {
  const expectedToken = createAdminCsrfToken(adminToken);

  if (!expectedToken || !csrfToken) {
    return false;
  }

  const expectedBuffer = Buffer.from(expectedToken);
  const actualBuffer = Buffer.from(csrfToken);

  return (
    expectedBuffer.length === actualBuffer.length &&
    timingSafeEqual(expectedBuffer, actualBuffer)
  );
}
