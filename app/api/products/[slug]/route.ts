import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const avgRating = product.reviews.length
      ? product.reviews.reduce((s: number, r: any) => s + r.rating, 0) / product.reviews.length
      : 4.5;

    return NextResponse.json({ ...product, avgRating });
  } catch (error) {
    console.error("Product detail API error:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}
