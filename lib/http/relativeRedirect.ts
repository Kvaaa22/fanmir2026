import { NextResponse } from "next/server";

export function relativeRedirect(
  request: Request,
  location: `/${string}`,
  status = 307,
) {
  return NextResponse.redirect(new URL(location, request.url), status);
}
