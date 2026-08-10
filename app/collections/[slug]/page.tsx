"use client";
import { useState, useEffect, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { SlidersHorizontal, X } from "lucide-react";
import ProductCard, { ProductCardData } from "@/components/product/ProductCard";
import QuickViewModal from "@/components/product/QuickViewModal";

const categoryLabels: Record<string, string> = {
  "devotees-collection": "Devotees Collection",
  "laddu-gopal-dresses": "Laddu Gopal Dresses",
  "luxe-dresses": "Luxe Dresses",
  "soft-pastel-dresses": "Soft Pastel Dresses",
  "summer-collection": "Summer Collection",
  "woollen-dresses": "Woollen Dresses",
  "summer-bedding-set": "Summer Bedding Set",
  "woollen-bedding-set": "Woollen Bedding Set",
  "festive-home-decor": "Festive Home Decor",
  "torans-bandhanwal": "Torans / Bandhanwal",
  "decorative-rangoli": "Decorative Rangoli",
  "shubh-labh": "Shubh Labh",
  "pooja-thali-cover": "Pooja Thali Cover",
  "festive-products": "Festive Products",
  janmashtami: "Janmashtami",
  rakhi: "Rakhi",
  "karwa-chauth": "Karwa Chauth",
  navratri: "Navratri",
  diwali: "Diwali",
  "jewellery-accessories": "Jewellery & Accessories",
  hairs: "Hairs",
  earrings: "Earrings",
  kangan: "Kangan",
  "necklace-haar": "Necklace / Haar",
  bansuri: "Bansuri",
  "kamar-band": "Kamar Band",
  "attar-ittar": "Attar / Ittar",
  bathtub: "Bathtub",
  "new-arrivals": "New Arrivals",
  sale: "Sale",
  all: "All Products",
};

const subcategoryMap: Record<string, { label: string; slug: string }[]> = {
  "laddu-gopal-dresses": [
    { label: "Luxe Dresses", slug: "luxe-dresses" },
    { label: "Soft Pastel Dresses", slug: "soft-pastel-dresses" },
    { label: "Summer Collection", slug: "summer-collection" },
    { label: "Woollen Dresses", slug: "woollen-dresses" },
    { label: "Summer Bedding Set", slug: "summer-bedding-set" },
    { label: "Woollen Bedding Set", slug: "woollen-bedding-set" },
  ],
  "festive-home-decor": [
    { label: "Torans / Bandhanwal", slug: "torans-bandhanwal" },
    { label: "Decorative Rangoli", slug: "decorative-rangoli" },
    { label: "Shubh Labh", slug: "shubh-labh" },
    { label: "Pooja Thali Cover", slug: "pooja-thali-cover" },
  ],
  "festive-products": [
    { label: "Janmashtami", slug: "janmashtami" },
    { label: "Rakhi", slug: "rakhi" },
    { label: "Karwa Chauth", slug: "karwa-chauth" },
    { label: "Navratri", slug: "navratri" },
    { label: "Diwali", slug: "diwali" },
  ],
  "jewellery-accessories": [
    { label: "Hairs", slug: "hairs" },
    { label: "Earrings", slug: "earrings" },
    { label: "Kangan", slug: "kangan" },
    { label: "Necklace / Haar", slug: "necklace-haar" },
    { label: "Bansuri", slug: "bansuri" },
    { label: "Kamar Band", slug: "kamar-band" },
    { label: "Attar / Ittar", slug: "attar-ittar" },
    { label: "Bathtub", slug: "bathtub" },
  ],
};

function getParentCategorySlug(slug: string): string {
  for (const [parent, subcats] of Object.entries(subcategoryMap)) {
    if (parent === slug) return parent;
    if (subcats.some((sub) => sub.slug === slug)) return parent;
  }
  return slug;
}

const sortOptions = [
  { value: "latest", label: "Latest" },
  { value: "popular", label: "Most Popular" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

function CollectionLoading() {
  return (
    <div style={{ minHeight: "80vh", backgroundColor: "var(--color-cream)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
        <div className="skeleton" style={{ width: 48, height: 48, borderRadius: "50%" }} />
        <div style={{ fontFamily: "var(--font-body)", color: "var(--color-muted)" }}>Loading collection...</div>
      </div>
    </div>
  );
}

export default function CollectionPage() {
  return (
    <Suspense fallback={<CollectionLoading />}>
      <CollectionPageContent />
    </Suspense>
  );
}

function CollectionPageContent() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug || "all";
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<ProductCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("latest");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [quickViewProduct, setQuickViewProduct] = useState<ProductCardData | null>(null);

  useEffect(() => {
    let active = true;

    const loadProducts = async () => {
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
        
        if (active) {
          setProducts(data.products ?? []);
          setTotal(data.pagination?.total ?? 0);
        }
      } catch {
        if (active) {
          setProducts([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      active = false;
    };
  }, [slug, sort, page, priceRange]);

  const parentSlug = getParentCategorySlug(slug);
  const activeSubcats = subcategoryMap[parentSlug] || [];
  const title = categoryLabels[slug] ?? slug;

  return (
    <div style={{ minHeight: "80vh", backgroundColor: "var(--color-cream)" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "var(--color-cream-alt)", borderBottom: "1px solid rgba(186,172,157,0.3)", padding: "0.75rem 0" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "var(--color-taupe)", display: "flex", gap: "0.375rem", alignItems: "center" }} aria-label="Breadcrumb">
            <Link href="/" style={{ color: "var(--color-taupe)", textDecoration: "none" }}>Home</Link>
            <span>/</span>
            {parentSlug !== slug && (
              <>
                <Link href={`/collections/${parentSlug}`} style={{ color: "var(--color-taupe)", textDecoration: "none" }}>
                  {categoryLabels[parentSlug] || parentSlug}
                </Link>
                <span>/</span>
              </>
            )}
            <span style={{ color: "var(--color-maroon)", fontWeight: 600 }}>{title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem", flexWrap: "wrap", gap: "0.75rem" }}>
          <div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.5rem, 4vw, 2.25rem)", color: "var(--color-maroon)", margin: 0, fontWeight: 700 }}>
              {title}
            </h1>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "var(--color-muted)", margin: "0.25rem 0 0" }}>
              {loading ? "Loading..." : `${total} products`}
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            {/* Filters toggle */}
            <button
              id="collection-filter-btn"
              onClick={() => setShowFilters(!showFilters)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.5rem 1rem",
                border: showFilters ? "2px solid var(--color-maroon)" : "1.5px solid var(--color-gold)",
                borderRadius: "9999px",
                backgroundColor: showFilters ? "var(--color-maroon)" : "transparent",
                color: showFilters ? "var(--color-white)" : "var(--color-maroon)",
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                fontSize: "0.85rem",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              aria-label={showFilters ? "Hide filters" : "Show filters"}
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
                border: "1.5px solid rgba(186,172,157,0.3)",
                borderRadius: "14px",
                backgroundColor: "var(--color-white)",
                color: "var(--color-body)",
                fontFamily: "var(--font-body)",
                fontSize: "0.85rem",
                cursor: "pointer",
                outline: "none",
              }}
              aria-label="Sort products"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Subcategory Filter Chips Bar */}
        {activeSubcats.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              overflowX: "auto",
              paddingBottom: "0.75rem",
              marginBottom: "1rem",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            className="no-scrollbar"
          >
            <Link
              href={`/collections/${parentSlug}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                whiteSpace: "nowrap",
                padding: "0.4rem 0.85rem",
                borderRadius: "9999px",
                border: slug === parentSlug ? "1.5px solid var(--color-maroon)" : "1px solid rgba(205,151,3,0.3)",
                backgroundColor: slug === parentSlug ? "var(--color-maroon)" : "#FFFFFF",
                color: slug === parentSlug ? "#FFFFFF" : "var(--color-maroon)",
                fontFamily: "var(--font-body)",
                fontWeight: slug === parentSlug ? 700 : 500,
                fontSize: "0.82rem",
                textDecoration: "none",
                transition: "all 0.15s ease",
                boxShadow: slug === parentSlug ? "0 2px 8px rgba(102,13,25,0.15)" : "none",
              }}
            >
              All {categoryLabels[parentSlug] || "Items"}
            </Link>
            {activeSubcats.map((sub) => {
              const isActive = slug === sub.slug;
              return (
                <Link
                  key={sub.slug}
                  href={`/collections/${sub.slug}`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    whiteSpace: "nowrap",
                    padding: "0.4rem 0.85rem",
                    borderRadius: "9999px",
                    border: isActive ? "1.5px solid var(--color-maroon)" : "1px solid rgba(205,151,3,0.3)",
                    backgroundColor: isActive ? "var(--color-maroon)" : "#FFFFFF",
                    color: isActive ? "#FFFFFF" : "var(--color-maroon)",
                    fontFamily: "var(--font-body)",
                    fontWeight: isActive ? 700 : 500,
                    fontSize: "0.82rem",
                    textDecoration: "none",
                    transition: "all 0.15s ease",
                    boxShadow: isActive ? "0 2px 8px rgba(102,13,25,0.15)" : "none",
                  }}
                >
                  {sub.label}
                </Link>
              );
            })}
          </div>
        )}

        <hr className="divider-gold" style={{ marginBottom: "1.5rem" }} />

        <div style={{ display: "grid", gridTemplateColumns: showFilters ? "240px 1fr" : "1fr", gap: "1.5rem" }} className={showFilters ? "!grid-cols-1 lg:!grid-cols-[240px_1fr]" : ""}>
          {/* Sidebar Filters */}
          {showFilters && (
            <aside
              style={{
                backgroundColor: "var(--color-cream-alt)",
                borderRadius: "18px",
                border: "1px solid rgba(186,172,157,0.3)",
                padding: "1.25rem",
                height: "fit-content",
              }}
              className="lg:sticky lg:top-20"
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                <h3 style={{ fontFamily: "var(--font-display)", color: "var(--color-maroon)", fontSize: "1rem", margin: 0, fontWeight: 700 }}>Filters</h3>
                <button onClick={() => setShowFilters(false)} style={{ backgroundColor: "transparent", border: "none", cursor: "pointer", color: "var(--color-taupe)" }} aria-label="Close filters">
                  <X size={18} />
                </button>
              </div>

              {/* Price Range */}
              <div style={{ marginBottom: "1.25rem" }}>
                <p style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "0.85rem", color: "var(--color-body)", marginBottom: "0.5rem" }}>Price Range</p>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  {[[0, 299], [299, 599], [599, 999], [999, 2000]].map(([min, max]) => (
                    <button
                      key={`${min}-${max}`}
                      onClick={() => setPriceRange([min, max])}
                      style={{
                        padding: "0.3rem 0.75rem",
                        border: priceRange[0] === min && priceRange[1] === max ? "1.5px solid var(--color-maroon)" : "1px solid var(--color-taupe)",
                        borderRadius: "9999px",
                        backgroundColor: priceRange[0] === min && priceRange[1] === max ? "var(--color-blush)" : "var(--color-white)",
                        color: priceRange[0] === min && priceRange[1] === max ? "var(--color-maroon)" : "var(--color-muted)",
                        fontSize: "0.78rem",
                        fontFamily: "var(--font-body)",
                        cursor: "pointer",
                        fontWeight: priceRange[0] === min && priceRange[1] === max ? 700 : 400,
                        transition: "all 0.15s",
                      }}
                    >
                      ₹{min}–{max === 2000 ? "2000+" : max}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Quick Links */}
              <div>
                <p style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "0.85rem", color: "var(--color-body)", marginBottom: "0.5rem" }}>Category</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                  {Object.entries(categoryLabels).map(([catSlug, catLabel]) => (
                    <Link
                      key={catSlug}
                      href={`/collections/${catSlug}`}
                      style={{
                        padding: "0.375rem 0.5rem",
                        borderRadius: "0.5rem",
                        fontFamily: "var(--font-body)",
                        fontSize: "0.82rem",
                        color: slug === catSlug ? "var(--color-maroon)" : "var(--color-body)",
                        fontWeight: slug === catSlug ? 700 : 400,
                        textDecoration: "none",
                        backgroundColor: slug === catSlug ? "var(--color-blush)" : "transparent",
                        transition: "all 0.15s",
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
                  marginTop: "1.25rem",
                  width: "100%",
                  padding: "0.55rem",
                  border: "1px solid var(--color-taupe)",
                  borderRadius: "9999px",
                  backgroundColor: "transparent",
                  color: "var(--color-muted)",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.8rem",
                  cursor: "pointer",
                  fontWeight: 600,
                  transition: "all 0.2s",
                }}
              >
                Clear Filters
              </button>
            </aside>
          )}

          {/* Product Grid */}
          <div>
            {loading ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="skeleton" style={{ aspectRatio: "1/1", borderRadius: "8px" }} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div style={{ textAlign: "center", padding: "4rem 0" }}>
                <p style={{ fontFamily: "var(--font-body)", color: "var(--color-muted)", fontSize: "1rem" }}>No products found for this filter.</p>
                <Link href="/collections/all" style={{ color: "var(--color-maroon)", fontFamily: "var(--font-body)", fontWeight: 600, marginTop: "0.75rem", display: "inline-block", textDecoration: "none" }}>
                  View all products →
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} onQuickView={setQuickViewProduct} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {total > 12 && (
              <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginTop: "2rem", flexWrap: "wrap" }}>
                {[...Array(Math.ceil(total / 12))].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "0.5rem",
                      border: page === i + 1 ? "none" : "1px solid var(--color-gold-light)",
                      backgroundColor: page === i + 1 ? "var(--color-maroon)" : "transparent",
                      color: page === i + 1 ? "var(--color-white)" : "var(--color-muted)",
                      fontFamily: "var(--font-body)",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    aria-label={`Page ${i + 1}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
}
