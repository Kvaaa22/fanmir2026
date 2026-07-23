import { NextResponse } from "next/server";

export function relativeRedirect(
  location: `/${string}`,
  status = 307,
) {
  return new NextResponse(null, {
    status,
    headers: {
      Location: location,
    },
  });
}

function getPublicOrigin(request: Request) {
  const configuredSiteUrl = process.env.SITE_URL?.trim();

  if (configuredSiteUrl) {
    try {
      return new URL(configuredSiteUrl).origin;
    } catch {
      // Fall back to trusted proxy headers or the request URL.
    }
  }

  const forwardedHost = request.headers
    .get("x-forwarded-host")
    ?.split(",")[0]
    ?.trim();
  const requestHost = request.headers.get("host")?.trim();
  const host = forwardedHost || requestHost;
  const forwardedProtocol = request.headers
    .get("x-forwarded-proto")
    ?.split(",")[0]
    ?.trim()
    .toLowerCase();
  const protocol =
    forwardedProtocol === "http" || forwardedProtocol === "https"
      ? forwardedProtocol
      : new URL(request.url).protocol.replace(":", "");

  if (host) {
    try {
      const proxyOrigin = new URL(`${protocol}://${host}`);

      if (
        !proxyOrigin.username &&
        !proxyOrigin.password &&
        proxyOrigin.pathname === "/"
      ) {
        return proxyOrigin.origin;
      }
    } catch {
      // Fall back to the URL parsed by Next.js.
    }
  }

  return new URL(request.url).origin;
}

export function requestRedirect(
  request: Request,
  location: `/${string}`,
  status = 307,
) {
  return NextResponse.redirect(
    new URL(location, getPublicOrigin(request)),
    status,
  );
}
