import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { relativeRedirect } from "@/lib/http/relativeRedirect";
import { parsePriceSource, PRICE_SOURCE } from "@/lib/prices/priceSource";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const source =
    parsePriceSource(url.searchParams.get("source")) ?? PRICE_SOURCE.MAIN;

  const latestImport = await prisma.priceImport.findFirst({
    where: {
      source,
      status: "success",
      pdfPath: {
        not: null,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
    },
  });

  if (!latestImport) {
    return NextResponse.json(
      { error: "PDF прайса не найден" },
      { status: 404 }
    );
  }

  const fileParams = new URLSearchParams({
    id: latestImport.id.toString(),
    type: "pdf",
  });

  if (url.searchParams.get("download") === "1") {
    fileParams.set("download", "1");
  }

  return relativeRedirect(`/api/price-import-file?${fileParams.toString()}`);
}
