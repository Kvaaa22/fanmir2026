import { NextResponse } from "next/server";

export function relativeRedirect(location: `/${string}`, status = 307) {
  return new NextResponse(null, {
    status,
    headers: {
      Location: location,
    },
  });
}
