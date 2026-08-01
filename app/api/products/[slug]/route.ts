import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        images: { orderBy: { order: "asc" } },
        variants: true,
        category: true,
        reviews: { orderBy: { createdAt: "desc" } },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        {
          status: 404,
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        }
      );
    }

    const avgRating = product.reviews.length
      ? product.reviews.reduce((s: number, r: any) => s + r.rating, 0) / product.reviews.length
      : 4.5;

    return NextResponse.json(
      { ...product, avgRating },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error) {
    console.error("Product detail API error:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}
