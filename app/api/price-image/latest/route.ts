import { relativeRedirect } from "@/lib/http/relativeRedirect";

export const runtime = "nodejs";

export function GET(request: Request) {
  const url = new URL(request.url);
  const pdfParams = new URLSearchParams();

  const source = url.searchParams.get("source");

  if (source) {
    pdfParams.set("source", source);
  }

  if (url.searchParams.get("download") === "1") {
    pdfParams.set("download", "1");
  }

  const query = pdfParams.toString();

  return relativeRedirect(
    `/api/price-pdf/latest${query ? `?${query}` : ""}`,
  );
}
