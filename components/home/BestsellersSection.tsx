import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCardData } from "@/components/product/ProductCard";
import BestsellersTabs from "./BestsellersTabs";

// Standalone query so TypeScript can infer the full return type (Prisma v7 compatible)
function queryFeaturedProducts() {
  return prisma.product.findMany({
    where: { isFeatured: true },
    include: {
      images: { orderBy: { order: "asc" } },
      variants: true,
      category: { select: { name: true } },
      reviews: { select: { rating: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 24,
  });
}

type FeaturedProduct = Awaited<ReturnType<typeof queryFeaturedProducts>>[number];

async function getFeaturedProducts(): Promise<ProductCardData[]> {
  try {
    const products = await queryFeaturedProducts();

    return products.map((p: FeaturedProduct) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      price: p.price,
      mrp: p.mrp,
      isSale: p.isSale,
      isNewArrival: p.isNewArrival,
      images: p.images.map((i: { url: string; alt: string | null }) => ({ url: i.url, alt: i.alt })),
      variants: p.variants.map((v: { name: string; value: string; priceAdj: number }) => ({ name: v.name, value: v.value, priceAdj: v.priceAdj })),
      averageRating: p.reviews.length
        ? p.reviews.reduce((s: number, r: { rating: number }) => s + r.rating, 0) / p.reviews.length
        : 4.5,
      reviewCount: p.reviews.length || 8,
      category: p.category ?? undefined,
    }));
  } catch {
    return [];
  }
}

export default async function BestsellersSection() {
  const products = await getFeaturedProducts();

  return (
    <section style={{ padding: "4.5rem 0", backgroundColor: "#FCFBF7" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: "0.75rem",
            flexWrap: "wrap",
            gap: "0.75rem",
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "var(--font-body, Jost, sans-serif)",
                fontSize: "0.8rem",
                color: "#C5A059",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                fontWeight: 600,
                margin: "0 0 0.4rem",
              }}
            >
              Curated Masterpieces
            </p>
            <h2
              style={{
                fontFamily: "var(--font-display, Cinzel, serif)",
                fontSize: "clamp(1.75rem, 4vw, 2.35rem)",
                color: "#8C6239",
                margin: 0,
                fontWeight: 500,
              }}
            >
              Season's Festive Specials
            </h2>
          </div>
          <Link
            href="/collections/all"
            style={{
              fontFamily: "var(--font-body, Jost, sans-serif)",
              fontWeight: 600,
              fontSize: "0.85rem",
              color: "#8C6239",
              textDecoration: "none",
              borderBottom: "1.5px solid #C5A059",
              paddingBottom: "0.1rem",
              whiteSpace: "nowrap",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            View All →
          </Link>
        </div>

        <hr className="divider-gold" style={{ marginBottom: "2.5rem" }} />

        {products.length === 0 ? (
          <p style={{ textAlign: "center", color: "#888", fontFamily: "var(--font-body, Jost, sans-serif)", padding: "3rem 0" }}>
            Products loading...
          </p>
        ) : (
          <BestsellersTabs initialProducts={products} />
        )}

        {/* CTA row */}
        <div style={{ textAlign: "center", marginTop: "3.5rem" }}>
          <Link
            href="/collections/all"
            id="bestsellers-view-all"
            className="inline-block border-2 border-maroon text-maroon hover:bg-maroon hover:text-cream transition-all duration-200"
            style={{
              padding: "0.75rem 2.25rem",
              borderRadius: "0.25rem",
              fontFamily: "var(--font-body, Jost, sans-serif)",
              fontWeight: 600,
              fontSize: "0.85rem",
              textDecoration: "none",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Explore Full Collection →
          </Link>
        </div>
      </div>
    </section>
  );
}
