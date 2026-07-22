"use client";
import { useState, useEffect } from "react";
import ProductCard, { ProductCardData } from "@/components/product/ProductCard";

export default function FestiveSpecials() {
  const [activeTab, setActiveTab] = useState<"all" | "rakhi" | "jhumka" | "combos">("all");
  const [products, setProducts] = useState<ProductCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const categoryQuery = activeTab === "all" ? "" : `&category=${activeTab}`;
    fetch(`/api/products?limit=8${categoryQuery}`)
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
    <section style={{ padding: "4rem 0", backgroundColor: "#FCFBF7" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <p
            style={{
              fontFamily: "var(--font-body, Jost, sans-serif)",
              fontSize: "0.85rem",
              color: "#C5A059",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              fontWeight: 600,
              marginBottom: "0.5rem",
            }}
          >
            Curated Devotional Edits
          </p>
          <h2
            style={{
              fontFamily: "var(--font-display, Cinzel, serif)",
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              color: "#8C6239",
              margin: 0,
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
            gap: "0.75rem",
            marginBottom: "2.5rem",
            flexWrap: "wrap",
          }}
        >
          {(["all", "rakhi", "jhumka", "combos"] as const).map((tab) => {
            const isActive = activeTab === tab;
            const label = tab === "all" ? "All Specials" : tab === "combos" ? "Combos & Hampers" : tab.charAt(0).toUpperCase() + tab.slice(1);
            return (
              <button
                key={tab}
                id={`festive-tab-${tab}`}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: "0.625rem 1.5rem",
                  borderRadius: "9999px",
                  border: isActive ? "1.5px solid #8C6239" : "1.5px solid #C5A059",
                  backgroundColor: isActive ? "#8C6239" : "transparent",
                  color: isActive ? "#FCFBF7" : "#8C6239",
                  fontFamily: "var(--font-body, Jost, sans-serif)",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Product Grid */}
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem" }} className="sm:grid-cols-3 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{ borderRadius: "1rem", backgroundColor: "#F2EFE8", aspectRatio: "3/4", animation: "pulse-soft 2s ease-in-out infinite" }} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <p style={{ textAlign: "center", color: "#888", fontFamily: "var(--font-body)", padding: "3rem 0" }}>
            No products found for this category.
          </p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem" }} className="sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
