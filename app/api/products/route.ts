import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
      const catLower = category.toLowerCase();

      // Subcategories under Laddu Gopal Dresses
      if (
        catLower === "luxe-dresses" ||
        catLower === "soft-pastel-dresses" ||
        catLower === "summer-collection" ||
        catLower === "woollen-dresses" ||
        catLower === "summer-bedding-set" ||
        catLower === "woollen-bedding-set" ||
        catLower === "radha-rani-dresses"
      ) {
        where.OR = [
          { category: { slug: "laddu-gopal-dresses" } },
          { tags: { contains: catLower.replace("-dresses", "") } },
          { name: { contains: catLower.replace("-", " ") } }
        ];
      }
      // Subcategories under Festive Home Decor
      else if (
        catLower === "torans-bandhanwal" ||
        catLower === "decorative-rangoli" ||
        catLower === "shubh-labh" ||
        catLower === "pooja-thali-cover"
      ) {
        where.OR = [
          { category: { slug: "festive-home-decor" } },
          { tags: { contains: catLower.split("-")[0] } },
          { name: { contains: catLower.split("-")[0] } }
        ];
      }
      // Subcategories under Festive Products
      else if (
        catLower === "janmashtami" ||
        catLower === "rakhi" ||
        catLower === "karwa-chauth" ||
        catLower === "navratri" ||
        catLower === "diwali"
      ) {
        where.OR = [
          { category: { slug: "festive-products" } },
          { tags: { contains: catLower } },
          { name: { contains: catLower } }
        ];
      }
      // Subcategories under Jewellery & Accessories
      else if (
        catLower === "hairs" ||
        catLower === "earrings" ||
        catLower === "kangan" ||
        catLower === "necklace-haar" ||
        catLower === "bansuri" ||
        catLower === "kamar-band" ||
        catLower === "attar-ittar" ||
        catLower === "bathtub" ||
        catLower === "pooja-thali-cover-accessory"
      ) {
        where.OR = [
          { category: { slug: "jewellery-accessories" } },
          { tags: { contains: catLower } },
          { name: { contains: catLower.replace("-", " ") } }
        ];
      }
      else if (catLower === "budget") {
        where.price = { lte: 299 };
      }
      else {
        // Direct category slug OR loose matching
        where.OR = [
          { category: { slug: category } },
          { category: { name: { contains: category.replace("-", " ") } } },
          { tags: { contains: category } }
        ];
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

    // Fallback: If 0 products found for specific subcategory query, return all products from parent category
    let finalProducts = products;
    let finalTotal = total;

    if (products.length === 0 && category && category !== "all") {
      const parentSlug = getParentCategorySlug(category);
      if (parentSlug) {
        const fallbackWhere = { category: { slug: parentSlug } };
        const [fallbackProducts, fallbackTotal] = await Promise.all([
          prisma.product.findMany({
            where: fallbackWhere,
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
          prisma.product.count({ where: fallbackWhere }),
        ]);
        finalProducts = fallbackProducts;
        finalTotal = fallbackTotal;
      } else {
        finalProducts = [];
        finalTotal = 0;
      }
    }

    const enriched = finalProducts.map((p: any) => ({
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
      images: p.images.map((i: any) => ({ url: i.url, alt: i.alt })),
      variants: p.variants.map((v: any) => ({ name: v.name, value: v.value, priceAdj: v.priceAdj })),
      averageRating: p.reviews.length
        ? p.reviews.reduce((s: number, r: any) => s + r.rating, 0) / p.reviews.length
        : 4.5,
      reviewCount: p.reviews.length || 8,
      category: p.category,
    }));

    return NextResponse.json(
      {
        products: enriched,
        pagination: { page, limit, total: finalTotal, totalPages: Math.ceil(finalTotal / limit) },
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error) {
    console.error("Products API error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

function getParentCategorySlug(category: string): string | null {
  const catLower = category.toLowerCase();

  // Subcategories under Laddu Gopal Dresses
  if (
    catLower === "luxe-dresses" ||
    catLower === "soft-pastel-dresses" ||
    catLower === "summer-collection" ||
    catLower === "woollen-dresses" ||
    catLower === "summer-bedding-set" ||
    catLower === "woollen-bedding-set" ||
    catLower === "radha-rani-dresses"
  ) {
    return "laddu-gopal-dresses";
  }

  // Subcategories under Festive Home Decor
  if (
    catLower === "torans-bandhanwal" ||
    catLower === "decorative-rangoli" ||
    catLower === "shubh-labh" ||
    catLower === "pooja-thali-cover"
  ) {
    return "festive-home-decor";
  }

  // Subcategories under Festive Products
  if (
    catLower === "janmashtami" ||
    catLower === "rakhi" ||
    catLower === "karwa-chauth" ||
    catLower === "navratri" ||
    catLower === "diwali"
  ) {
    return "festive-products";
  }

  // Subcategories under Jewellery & Accessories
  if (
    catLower === "hairs" ||
    catLower === "earrings" ||
    catLower === "kangan" ||
    catLower === "necklace-haar" ||
    catLower === "bansuri" ||
    catLower === "kamar-band" ||
    catLower === "attar-ittar" ||
    catLower === "bathtub" ||
    catLower === "pooja-thali-cover-accessory"
  ) {
    return "jewellery-accessories";
  }

  // Direct main categories slug check
  if (
    catLower === "devotees-collection" ||
    catLower === "laddu-gopal-dresses" ||
    catLower === "festive-home-decor" ||
    catLower === "festive-products" ||
    catLower === "jewellery-accessories"
  ) {
    return catLower;
  }

  return null;
}
