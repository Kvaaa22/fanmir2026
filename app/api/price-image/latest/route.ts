import { NextResponse } from "next/server";

export const runtime = "nodejs";

export function GET(request: Request) {
  const url = new URL(request.url);
  const pdfUrl = new URL("/api/price-pdf/latest", request.url);

  const source = url.searchParams.get("source");

  if (source) {
    pdfUrl.searchParams.set("source", source);
  }

  if (url.searchParams.get("download") === "1") {
    pdfUrl.searchParams.set("download", "1");
  }

  return NextResponse.redirect(pdfUrl);
}
