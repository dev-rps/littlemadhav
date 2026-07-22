import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const sale = searchParams.get("sale");
    const newArrivals = searchParams.get("new");
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "12");
    const sort = searchParams.get("sort") ?? "latest";
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const q = searchParams.get("q") || searchParams.get("search");

    const where: Record<string, any> = {};

    if (q) {
      where.OR = [
        { name: { contains: q } },
        { description: { contains: q } },
        { tags: { contains: q } },
        { category: { name: { contains: q } } }
      ];
    }

    if (category) {
      if (category === "kids-rakhi") {
        where.category = { slug: "rakhi" };
        where.tags = { contains: "kids" };
      } else if (category === "designer-rakhi") {
        where.category = { slug: "rakhi" };
        where.tags = { contains: "designer" };
      } else if (category === "bhaiya-bhabhi-set") {
        where.category = { slug: "rakhi" };
        where.tags = { contains: "bhaiya-bhabhi" };
      } else if (category === "lumba-rakhi") {
        where.category = { slug: "rakhi" };
        where.tags = { contains: "lumba" };
      } else if (category === "oxidised-jhumka") {
        where.category = { slug: "jhumka" };
        where.tags = { contains: "oxidised" };
      } else if (category === "kundan-jhumka") {
        where.category = { slug: "jhumka" };
        where.tags = { contains: "kundan" };
      } else if (category === "pearl-jhumka") {
        where.category = { slug: "jhumka" };
        where.tags = { contains: "pearl" };
      } else if (category === "terracotta-jhumka") {
        where.category = { slug: "jhumka" };
        where.tags = { contains: "terracotta" };
      } else if (category === "wedding") {
        where.tags = { contains: "wedding" };
      } else if (category === "budget") {
        where.price = { lte: 299 };
      } else {
        where.category = { slug: category };
      }
    }
    if (featured === "true") where.isFeatured = true;
    if (sale === "true") where.isSale = true;
    if (newArrivals === "true") where.isNewArrival = true;
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) (where.price as Record<string, number>).gte = parseFloat(minPrice);
      if (maxPrice) (where.price as Record<string, number>).lte = parseFloat(maxPrice);
    }

    const orderBy =
      sort === "price_asc"
        ? { price: "asc" as const }
        : sort === "price_desc"
        ? { price: "desc" as const }
        : sort === "popular"
        ? { createdAt: "asc" as const }
        : { createdAt: "desc" as const };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          images: { orderBy: { order: "asc" }, take: 2 },
          variants: true,
          category: { select: { name: true } },
          reviews: { select: { rating: true } },
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    const enriched = products.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      price: p.price,
      mrp: p.mrp,
      isSale: p.isSale,
      isNewArrival: p.isNewArrival,
      stock: p.stock,
      material: p.material,
      occasion: p.occasion,
      tags: p.tags,
      images: p.images.map((i) => ({ url: i.url, alt: i.alt })),
      variants: p.variants.map((v) => ({ name: v.name, value: v.value, priceAdj: v.priceAdj })),
      averageRating: p.reviews.length
        ? p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length
        : 4.5,
      reviewCount: p.reviews.length || 8,
      category: p.category,
    }));

    return NextResponse.json({
      products: enriched,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Products API error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
