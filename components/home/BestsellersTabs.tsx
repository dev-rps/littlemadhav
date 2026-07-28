"use client";
import { useState } from "react";
import ProductCard, { ProductCardData } from "@/components/product/ProductCard";

interface Props {
  initialProducts: ProductCardData[];
}

const TABS = [
  { label: "All Items", slug: "all" },
  { label: "Laddu Gopal Dresses", slug: "laddu-gopal-dresses" },
  { label: "Festive Home Decor", slug: "festive-home-decor" },
  { label: "Festive Products", slug: "festive-products" },
  { label: "Jewellery & Accessories", slug: "jewellery-accessories" },
];

export default function BestsellersTabs({ initialProducts }: Props) {
  const [activeSlug, setActiveSlug] = useState("all");

  const filteredProducts = activeSlug === "all"
    ? initialProducts
    : initialProducts.filter((p) => {
        const catName = p.category?.name.toLowerCase() || "";
        const slug = p.slug.toLowerCase();

        let targetTerm = activeSlug;
        if (activeSlug === "laddu-gopal-dresses") targetTerm = "laddu gopal";
        else if (activeSlug === "festive-home-decor") targetTerm = "decor";
        else if (activeSlug === "festive-products") targetTerm = "festive";
        else if (activeSlug === "jewellery-accessories") targetTerm = "jewellery";
        else if (activeSlug === "devotees-collection") targetTerm = "devotees";

        return catName.includes(targetTerm) || slug.includes(targetTerm);
      });

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
                border: "1px solid var(--color-maroon)",
                backgroundColor: isActive ? "var(--color-maroon)" : "transparent",
                color: isActive ? "var(--color-white)" : "var(--color-maroon)",
                fontFamily: "var(--font-body, Lato, sans-serif)",
                fontWeight: 600,
                fontSize: "0.85rem",
                cursor: "pointer",
                transition: "all 0.2s ease",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
              onMouseOver={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(102, 13, 25, 0.05)";
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
