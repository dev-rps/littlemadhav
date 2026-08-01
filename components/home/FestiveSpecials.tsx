"use client";
import { useState, useEffect } from "react";
import ProductCard, { ProductCardData } from "@/components/product/ProductCard";
import QuickViewModal from "@/components/product/QuickViewModal";

export default function FestiveSpecials() {
  const [activeTab, setActiveTab] = useState<"all" | "laddu-gopal-dresses" | "festive-home-decor" | "festive-products" | "jewellery-accessories">("all");
  const [products, setProducts] = useState<ProductCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<ProductCardData | null>(null);

  useEffect(() => {
    setLoading(true);
    const categoryQuery = activeTab === "all" ? "" : `&category=${activeTab}`;
    fetch(`/api/products?limit=6${categoryQuery}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products ?? []);
        setLoading(false);
      })
      .catch(() => {
        setProducts([]);
        setLoading(false);
      });
  }, [activeTab]);

  return (
    <section style={{ padding: "4rem 0", backgroundColor: "var(--color-cream)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.8rem",
              color: "var(--color-gold)",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              fontWeight: 700,
              marginBottom: "0.5rem",
            }}
          >
            Curated Devotional Edits
          </p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              color: "var(--color-maroon)",
              margin: 0,
              fontWeight: 700,
            }}
          >
            Season&apos;s Festive Specials
          </h2>
        </div>

        {/* Tab Pills */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "0.6rem",
            marginBottom: "2.5rem",
            flexWrap: "wrap",
          }}
        >
          {(["all", "laddu-gopal-dresses", "festive-home-decor", "festive-products", "jewellery-accessories"] as const).map((tab) => {
            const isActive = activeTab === tab;
            const label = tab === "all"
              ? "All Specials"
              : tab === "laddu-gopal-dresses"
              ? "Laddu Gopal Dresses"
              : tab === "festive-home-decor"
              ? "Festive Home Decor"
              : tab === "festive-products"
              ? "Festive Products"
              : "Jewellery & Accessories";
            return (
              <button
                key={tab}
                id={`festive-tab-${tab}`}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: "0.6rem 1.25rem",
                  borderRadius: "9999px",
                  border: isActive ? "2px solid var(--color-maroon)" : "1.5px solid var(--color-gold-light)",
                  backgroundColor: isActive ? "var(--color-maroon)" : "transparent",
                  color: isActive ? "var(--color-white)" : "var(--color-maroon)",
                  fontFamily: "var(--font-body)",
                  fontWeight: 700,
                  fontSize: "0.82rem",
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Product Grid (2 per row on mobile, 3 per row on desktop, max-w-5xl for compact elegant desktop cards) */}
        {loading ? (
          <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3.5 sm:gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton" style={{ aspectRatio: "1/1", borderRadius: "8px" }} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <p style={{ textAlign: "center", color: "var(--color-muted)", fontFamily: "var(--font-body)", padding: "3rem 0" }}>
            No products found for this category.
          </p>
        ) : (
          <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3.5 sm:gap-6">
            {products.slice(0, 6).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={setQuickViewProduct}
              />
            ))}
          </div>
        )}

        {/* Quick View Modal */}
        {quickViewProduct && (
          <QuickViewModal
            product={quickViewProduct}
            onClose={() => setQuickViewProduct(null)}
          />
        )}
      </div>
    </section>
  );
}
