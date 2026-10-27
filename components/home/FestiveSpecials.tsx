"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import ProductCard, { ProductCardData } from "@/components/product/ProductCard";
import QuickViewModal from "@/components/product/QuickViewModal";

const TABS = [
  { id: "all" as const, label: "All Products" },
  { id: "bandarwar-toran" as const, label: "Bandarwar & Toran" },
  { id: "table-runner" as const, label: "Table Runner" },
  { id: "karva-chauth-thaali" as const, label: "Karva Chauth Thaali" },
];

type TabId = "all" | "bandarwar-toran" | "table-runner" | "karva-chauth-thaali";

export default function FestiveSpecials() {
  const [activeTab, setActiveTab] = useState<TabId>("all");
  const [products, setProducts] = useState<ProductCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<ProductCardData | null>(null);

  useEffect(() => {
    setLoading(true);
    const categoryQuery = activeTab === "all" ? "" : "&category=" + activeTab;
    fetch("/api/products?limit=6" + categoryQuery)
      .then((res) => res.json())
      .then((data) => { setProducts(data.products ?? []); setLoading(false); })
      .catch(() => { setProducts([]); setLoading(false); });
  }, [activeTab]);

  return (
    <section style={{ padding: "4rem 0", backgroundColor: "var(--color-cream)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "var(--color-gold)", textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 700, marginBottom: "0.5rem" }}>
            Curated Festive Edits
          </p>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", color: "var(--color-maroon)", margin: 0, fontWeight: 700 }}>
            Our New Arrivals
          </h2>
        </div>

        {/* Tab Pills */}
        <div style={{ display: "flex", justifyContent: "center", gap: "0.6rem", marginBottom: "2.5rem", flexWrap: "wrap" }}>
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={"festive-tab-" + tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: "0.6rem 1.25rem", borderRadius: "9999px",
                  border: isActive ? "2px solid var(--color-maroon)" : "1.5px solid var(--color-gold-light)",
                  backgroundColor: isActive ? "var(--color-maroon)" : "transparent",
                  color: isActive ? "var(--color-white)" : "var(--color-maroon)",
                  fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "0.82rem",
                  cursor: "pointer", transition: "all 0.25s ease",
                  textTransform: "uppercase", letterSpacing: "0.04em",
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3.5 sm:gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton" style={{ aspectRatio: "1/1", borderRadius: "8px" }} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
            <p style={{ fontFamily: "var(--font-body)", color: "var(--color-muted)", fontSize: "0.95rem", marginBottom: "1rem" }}>
              No products found in this category yet.
            </p>
            <Link href="/collections/all" style={{ color: "var(--color-maroon)", fontFamily: "var(--font-body)", fontWeight: 600, textDecoration: "none" }}>
              Browse all products →
            </Link>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3.5 sm:gap-6">
            {products.slice(0, 6).map((product) => (
              <ProductCard key={product.id} product={product} onQuickView={setQuickViewProduct} />
            ))}
          </div>
        )}

        {/* View All CTA */}
        {!loading && products.length > 0 && (
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <Link href="/collections/all" style={{ display: "inline-block", color: "var(--color-maroon)", fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "0.85rem", textDecoration: "none", borderBottom: "1.5px solid var(--color-gold-light)", paddingBottom: "0.1rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              View All Products →
            </Link>
          </div>
        )}

        {/* Quick View Modal */}
        {quickViewProduct && (
          <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
        )}
      </div>
    </section>
  );
}