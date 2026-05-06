import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import prisma from "@/lib/prisma";
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
      imagePath: {
        not: null,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!latestImport?.imagePath) {
    return NextResponse.json(
      {
        error: "Картинка прайса не найдена",
      },
      {
        status: 404,
      }
    );
  }

  const image = await readFile(latestImport.imagePath);

  return new NextResponse(image, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=300",
    },
  });
}