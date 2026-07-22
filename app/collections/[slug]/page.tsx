"use client";
import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { SlidersHorizontal, X } from "lucide-react";
import ProductCard, { ProductCardData } from "@/components/product/ProductCard";

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

const categoryLabels: Record<string, string> = {
  rakhi: "Rakhi Collection",
  jhumka: "Jhumka Collection",
  combos: "Combos & Hampers",
  gifting: "Gift Hampers",
  "new-arrivals": "New Arrivals",
  sale: "Sale",
  all: "All Products",
  "kids-rakhi": "Kids Rakhi Collection",
  "designer-rakhi": "Designer Rakhi Collection",
  "bhaiya-bhabhi-set": "Bhaiya-Bhabhi Rakhi Sets",
  "lumba-rakhi": "Lumba Rakhi Collection",
  "oxidised-jhumka": "Oxidised Jhumka Collection",
  "kundan-jhumka": "Kundan Jhumka Collection",
  "pearl-jhumka": "Pearl Jhumka Collection",
  "terracotta-jhumka": "Terracotta Jhumka Collection",
  wedding: "Wedding Favors & Gifts",
  budget: "Gifts Under ₹299",
};

const sortOptions = [
  { value: "latest", label: "Latest" },
  { value: "popular", label: "Most Popular" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

function CollectionLoading() {
  return (
    <div style={{ minHeight: "80vh", backgroundColor: "#FFF8F0", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontFamily: "var(--font-body)", color: "#888" }}>Loading collection...</div>
    </div>
  );
}

export default function CollectionPage({ params }: CollectionPageProps) {
  return (
    <Suspense fallback={<CollectionLoading />}>
      <CollectionPageContent params={params} />
    </Suspense>
  );
}

function CollectionPageContent({ params }: CollectionPageProps) {
  const [slug, setSlug] = useState<string>("all");
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<ProductCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("latest");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    params.then((p) => setSlug(p.slug));
  }, [params]);

  const fetchProducts = useCallback(async () => {
    if (!slug) return;
    setLoading(true);
    try {
      const qs = new URLSearchParams({
        sort,
        page: String(page),
        limit: "12",
      });
      // Map slug to API params
      if (slug === "sale") qs.set("sale", "true");
      else if (slug === "new-arrivals") qs.set("new", "true");
      else if (slug !== "all") qs.set("category", slug);
      if (priceRange[0] > 0) qs.set("minPrice", String(priceRange[0]));
      if (priceRange[1] < 2000) qs.set("maxPrice", String(priceRange[1]));

      const res = await fetch(`/api/products?${qs}`);
      const data = await res.json();
      setProducts(data.products ?? []);
      setTotal(data.pagination?.total ?? 0);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [slug, sort, page, priceRange]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const title = categoryLabels[slug] ?? slug;

  return (
    <div style={{ minHeight: "80vh", backgroundColor: "#FFF8F0" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "#FFFBF5", borderBottom: "1px solid #F0E0C0", padding: "0.75rem 0" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "#888", display: "flex", gap: "0.375rem", alignItems: "center" }}>
            <Link href="/" style={{ color: "#888", textDecoration: "none" }}>Home</Link>
            <span>/</span>
            <span style={{ color: "#8B1E3F", fontWeight: 600 }}>{title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.75rem" }}>
          <div>
            <h1 style={{ fontFamily: "var(--font-display, 'Yeseva One', serif)", fontSize: "clamp(1.5rem, 4vw, 2.25rem)", color: "#8B1E3F", margin: 0 }}>
              {title}
            </h1>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "#888", margin: "0.25rem 0 0" }}>
              {loading ? "Loading..." : `${total} products`}
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            {/* Filters toggle (mobile) */}
            <button
              id="collection-filter-btn"
              onClick={() => setShowFilters(!showFilters)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.5rem 1rem",
                border: "1.5px solid #D4A017",
                borderRadius: "0.5rem",
                backgroundColor: showFilters ? "#D4A017" : "transparent",
                color: showFilters ? "#1a0a0e" : "#D4A017",
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                fontSize: "0.85rem",
                cursor: "pointer",
              }}
            >
              <SlidersHorizontal size={16} />
              Filters
            </button>

            {/* Sort */}
            <select
              id="collection-sort"
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(1); }}
              style={{
                padding: "0.5rem 0.875rem",
                border: "1.5px solid #F0E0C0",
                borderRadius: "0.5rem",
                backgroundColor: "#FFFBF5",
                color: "#1a1a1a",
                fontFamily: "var(--font-body)",
                fontSize: "0.85rem",
                cursor: "pointer",
                outline: "none",
              }}
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        <hr className="divider-gold" style={{ marginBottom: "1.5rem" }} />

        <div style={{ display: "grid", gridTemplateColumns: showFilters ? "240px 1fr" : "1fr", gap: "1.5rem" }} className={showFilters ? "lg:grid-cols-[240px_1fr]" : ""}>
          {/* Sidebar Filters */}
          {showFilters && (
            <aside
              style={{
                backgroundColor: "#FFFBF5",
                borderRadius: "0.875rem",
                border: "1px solid #F0E0C0",
                padding: "1.25rem",
                height: "fit-content",
                position: "sticky",
                top: "5rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                <h3 style={{ fontFamily: "var(--font-display, 'Yeseva One', serif)", color: "#8B1E3F", fontSize: "1rem", margin: 0 }}>Filters</h3>
                <button onClick={() => setShowFilters(false)} style={{ backgroundColor: "transparent", border: "none", cursor: "pointer", color: "#aaa" }}>
                  <X size={18} />
                </button>
              </div>

              {/* Price Range */}
              <div style={{ marginBottom: "1.25rem" }}>
                <p style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.85rem", color: "#555", marginBottom: "0.5rem" }}>Price Range</p>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  {[[0, 299], [299, 599], [599, 999], [999, 2000]].map(([min, max]) => (
                    <button
                      key={`${min}-${max}`}
                      onClick={() => setPriceRange([min, max])}
                      style={{
                        padding: "0.3rem 0.75rem",
                        border: priceRange[0] === min && priceRange[1] === max ? "1.5px solid #8B1E3F" : "1px solid #E0D0C0",
                        borderRadius: "0.375rem",
                        backgroundColor: priceRange[0] === min && priceRange[1] === max ? "#FDF0F4" : "transparent",
                        color: priceRange[0] === min && priceRange[1] === max ? "#8B1E3F" : "#666",
                        fontSize: "0.78rem",
                        fontFamily: "var(--font-body)",
                        cursor: "pointer",
                      }}
                    >
                      ₹{min}–{max === 2000 ? "2000+" : max}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Quick Links */}
              <div>
                <p style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.85rem", color: "#555", marginBottom: "0.5rem" }}>Category</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                  {Object.entries(categoryLabels).map(([catSlug, catLabel]) => (
                    <Link
                      key={catSlug}
                      href={`/collections/${catSlug}`}
                      style={{
                        padding: "0.375rem 0.5rem",
                        borderRadius: "0.375rem",
                        fontFamily: "var(--font-body)",
                        fontSize: "0.82rem",
                        color: slug === catSlug ? "#8B1E3F" : "#555",
                        fontWeight: slug === catSlug ? 700 : 400,
                        textDecoration: "none",
                        backgroundColor: slug === catSlug ? "#FDF0F4" : "transparent",
                      }}
                    >
                      {catLabel}
                    </Link>
                  ))}
                </div>
              </div>

              <button
                onClick={() => { setPriceRange([0, 2000]); }}
                style={{
                  marginTop: "1rem",
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #F0E0C0",
                  borderRadius: "0.375rem",
                  backgroundColor: "transparent",
                  color: "#888",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.8rem",
                  cursor: "pointer",
                }}
              >
                Clear Filters
              </button>
            </aside>
          )}

          {/* Product Grid */}
          <div>
            {loading ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }} className="sm:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} style={{ borderRadius: "1rem", backgroundColor: "#F5EDE0", aspectRatio: "3/4" }} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div style={{ textAlign: "center", padding: "4rem 0" }}>
                <p style={{ fontFamily: "var(--font-body)", color: "#888", fontSize: "1rem" }}>No products found for this filter.</p>
                <Link href="/collections/all" style={{ color: "#8B1E3F", fontFamily: "var(--font-body)", fontWeight: 600, marginTop: "0.75rem", display: "inline-block" }}>
                  View all products →
                </Link>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }} className="sm:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {total > 12 && (
              <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginTop: "2rem" }}>
                {[...Array(Math.ceil(total / 12))].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "0.375rem",
                      border: page === i + 1 ? "none" : "1px solid #F0E0C0",
                      backgroundColor: page === i + 1 ? "#8B1E3F" : "transparent",
                      color: page === i + 1 ? "#FFF8F0" : "#555",
                      fontFamily: "var(--font-body)",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
