"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const categories = [
  {
    name: "Rakhi",
    slug: "rakhi",
    imageUrl: "https://images.unsplash.com/photo-1627130942770-e78c9d5b8f4e?w=400&q=80",
    desc: "Designer Sets",
  },
  {
    name: "Jhumka",
    slug: "jhumka",
    imageUrl: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=400&q=80",
    desc: "Kundan & Pearl",
  },
  {
    name: "Combos",
    slug: "combos",
    imageUrl: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&q=80",
    desc: "Gift Hampers",
  },
  {
    name: "Gifting",
    slug: "gifting",
    imageUrl: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=400&q=80",
    desc: "Festive Boxes",
  },
  {
    name: "Wedding Favors",
    slug: "wedding",
    imageUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80",
    desc: "Personalised",
  },
  {
    name: "Under ₹299",
    slug: "budget",
    imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&q=80",
    desc: "Best Deals",
  },
];

export default function CategoryGrid() {
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  return (
    <section style={{ padding: "4rem 0", backgroundColor: "#FCFBF7" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <p
            style={{
              fontFamily: "var(--font-body, Jost, sans-serif)",
              fontSize: "0.8rem",
              color: "#C5A059",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              fontWeight: 600,
              marginBottom: "0.5rem",
            }}
          >
            Devotional & Festive Collections
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
            Shop by Category
          </h2>
        </div>

        <hr className="divider-gold" style={{ marginBottom: "3rem" }} />

        {/* Circular Categories Grid */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "2.5rem 2rem",
          }}
        >
          {categories.map((cat) => {
            const isHovered = hoveredSlug === cat.slug;
            return (
              <Link
                key={cat.slug}
                href={`/collections/${cat.slug}`}
                id={`cat-card-${cat.slug}`}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textDecoration: "none",
                  cursor: "pointer",
                  width: "140px",
                }}
                onMouseEnter={() => setHoveredSlug(cat.slug)}
                onMouseLeave={() => setHoveredSlug(null)}
              >
                {/* Gold ring circle */}
                <div
                  style={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    border: isHovered ? "2.5px solid #8C6239" : "1.5px solid #C5A059",
                    padding: "4px",
                    backgroundColor: "#FFFDF9",
                    transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                    boxShadow: isHovered 
                      ? "0 8px 24px rgba(140, 98, 57, 0.18)" 
                      : "0 2px 10px rgba(140, 98, 57, 0.05)",
                    transform: isHovered ? "translateY(-4px)" : "translateY(0)",
                  }}
                >
                  {/* Image container */}
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      position: "relative",
                      overflow: "hidden",
                      backgroundColor: "#F2EFE8",
                    }}
                  >
                    <Image
                      src={cat.imageUrl}
                      alt={cat.name}
                      fill
                      sizes="120px"
                      style={{
                        objectFit: "cover",
                        transition: "transform 0.5s ease",
                        transform: isHovered ? "scale(1.12)" : "scale(1)",
                      }}
                    />
                  </div>
                </div>

                {/* Category title */}
                <p
                  style={{
                    fontFamily: "var(--font-display, Cinzel, serif)",
                    fontSize: "0.95rem",
                    color: isHovered ? "#8C6239" : "#2c2520",
                    margin: "0.85rem 0 0.15rem",
                    lineHeight: 1.2,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    transition: "color 0.2s ease",
                  }}
                >
                  {cat.name}
                </p>

                {/* Optional small description */}
                <p
                  style={{
                    fontFamily: "var(--font-body, Jost, sans-serif)",
                    fontSize: "0.75rem",
                    color: "#888",
                    margin: 0,
                    lineHeight: 1.2,
                  }}
                >
                  {cat.desc}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
