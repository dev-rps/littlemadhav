"use client";
import { useState } from "react";
import ProductCard, { ProductCardData } from "@/components/product/ProductCard";

interface Props {
  initialProducts: ProductCardData[];
}

const TABS = [
  { label: "All Items", slug: "all" },
  { label: "Rakhi Special", slug: "rakhi" },
  { label: "Jhumka", slug: "jhumka" },
  { label: "Combos", slug: "combos" },
  { label: "Gift Hampers", slug: "gifting" },
];

export default function BestsellersTabs({ initialProducts }: Props) {
  const [activeSlug, setActiveSlug] = useState("all");

  const filteredProducts = activeSlug === "all"
    ? initialProducts
    : initialProducts.filter((p) => {
        const catName = p.category?.name.toLowerCase() || "";
        const slug = p.slug.toLowerCase();
        return catName.includes(tabSlugToQuery(activeSlug)) || slug.includes(tabSlugToQuery(activeSlug));
      });

  function tabSlugToQuery(slug: string) {
    if (slug === "gifting") return "gift";
    return slug;
  }

  return (
    <div>
      {/* Category Tabs / Pills */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "0.75rem",
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
                padding: "0.625rem 1.25rem",
                borderRadius: "0.25rem",
                border: "1px solid #8C6239",
                backgroundColor: isActive ? "#8C6239" : "transparent",
                color: isActive ? "#FCFBF7" : "#8C6239",
                fontFamily: "var(--font-body, Jost, sans-serif)",
                fontWeight: 600,
                fontSize: "0.85rem",
                cursor: "pointer",
                transition: "all 0.2s ease",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
              onMouseOver={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(140, 98, 57, 0.05)";
                }
              }}
              onMouseOut={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                }
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
            color: "#888",
            fontFamily: "var(--font-body, Jost, sans-serif)",
            padding: "4rem 0",
          }}
        >
          No products found in this category.
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "1.25rem 1rem",
          }}
          className="sm:grid-cols-3 lg:grid-cols-4"
        >
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
