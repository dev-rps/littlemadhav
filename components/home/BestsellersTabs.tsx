"use client";
import { useState } from "react";
import ProductCard, { ProductCardData } from "@/components/product/ProductCard";
import QuickViewModal from "@/components/product/QuickViewModal";

interface Props {
  initialProducts: ProductCardData[];
}

const TABS = [
  { label: "All Items", slug: "all" },
  { label: "Bandarwar & Toran", slug: "bandarwar-toran" },
  { label: "Table Runner", slug: "table-runner" },
  { label: "Karva Chauth Thaali", slug: "karva-chauth-thaali" },
];

export default function BestsellersTabs({ initialProducts }: Props) {
  const [activeSlug, setActiveSlug] = useState("all");
  const [quickViewProduct, setQuickViewProduct] = useState<ProductCardData | null>(null);

  const filteredProducts = activeSlug === "all"
    ? initialProducts
    : initialProducts.filter((p) => {
        const catName = (p.category?.name || "").toLowerCase();
        const slug = p.slug.toLowerCase();

        if (activeSlug === "bandarwar-toran") return catName.includes("bandarwar") || slug.includes("bandarwar") || slug.includes("toran");
        if (activeSlug === "table-runner") return catName.includes("runner") || slug.includes("runner");
        if (activeSlug === "karva-chauth-thaali") return catName.includes("karva") || slug.includes("karva") || slug.includes("thali");

        return true;
      });

  return (
    <div>
      {/* Category Tabs / Pills */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "0.6rem",
          flexWrap: "wrap",
          marginBottom: "2.5rem",
        }}
      >
        {TABS.map((tab) => {
          const isActive = activeSlug === tab.slug;
          return (
            <button
              key={tab.slug}
              onClick={() => setActiveSlug(tab.slug)}
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
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Grid of filtered products */}
      {filteredProducts.length === 0 ? (
        <p
          style={{
            textAlign: "center",
            color: "var(--color-muted)",
            fontFamily: "var(--font-body)",
            padding: "4rem 0",
          }}
        >
          No products found in this category.
        </p>
      ) : (
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3.5 sm:gap-6">
          {filteredProducts.map((product) => (
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
  );
}
