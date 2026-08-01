"use client";
import Link from "next/link";
import { useState } from "react";

const categories = [
  {
    name: "Devotees collection",
    slug: "devotees-collection",
    desc: "Divine Combos",
    icon: "🕉️",
    gradient: "linear-gradient(145deg, #FBD5CD 0%, #F4E8DB 100%)",
  },
  {
    name: "Laddu Gopal Dresses",
    slug: "laddu-gopal-dresses",
    desc: "Luxe & Pastel Dresses",
    icon: "👗",
    gradient: "linear-gradient(145deg, #FBF3E9 0%, #FBD5CD 100%)",
  },
  {
    name: "Festive Home Decor",
    slug: "festive-home-decor",
    desc: "Torans & Rangolis",
    icon: "🪔",
    gradient: "linear-gradient(145deg, #F4E8DB 0%, #FBF3E9 100%)",
  },
  {
    name: "Festive Products",
    slug: "festive-products",
    desc: "Janmashtami & Diwali",
    icon: "🎉",
    gradient: "linear-gradient(145deg, #FBD5CD 0%, #FBF3E9 100%)",
  },
  {
    name: "Jewellery & Accessories",
    slug: "jewellery-accessories",
    desc: "Bansuri & Ornaments",
    icon: "💎",
    gradient: "linear-gradient(145deg, #FBF3E9 0%, #F4E8DB 100%)",
  },
];

export default function CategoryGrid() {
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  return (
    <section style={{ padding: "4rem 0", backgroundColor: "var(--color-cream)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section header */}
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
            Devotional & Festive Collections
          </p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.75rem, 4vw, 2.35rem)",
              color: "var(--color-maroon)",
              margin: 0,
              fontWeight: 700,
            }}
          >
            Shop by Category
          </h2>
        </div>

        <hr className="divider-gold" style={{ marginBottom: "3rem" }} />

        {/* Circular Categories Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: "2rem",
            justifyItems: "center",
          }}
          className="!grid-cols-3 sm:!grid-cols-5"
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
                  width: "100%",
                  maxWidth: "140px",
                }}
                onMouseEnter={() => setHoveredSlug(cat.slug)}
                onMouseLeave={() => setHoveredSlug(null)}
              >
                {/* Gold ring circle with themed icon */}
                <div
                  style={{
                    width: "110px",
                    height: "110px",
                    borderRadius: "50%",
                    border: isHovered ? "2.5px solid var(--color-maroon)" : "2px solid var(--color-gold-light)",
                    padding: "4px",
                    backgroundColor: "var(--color-white)",
                    transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                    boxShadow: isHovered
                      ? "var(--shadow-hover)"
                      : "0 2px 10px rgba(102, 13, 25, 0.05)",
                    transform: isHovered ? "translateY(-6px) scale(1.02)" : "translateY(0)",
                  }}
                >
                  {/* Icon container */}
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      background: cat.gradient,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "2.5rem",
                      transition: "transform 0.5s ease",
                      transform: isHovered ? "scale(1.08)" : "scale(1)",
                    }}
                  >
                    {cat.icon}
                  </div>
                </div>

                {/* Category title */}
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.82rem",
                    color: isHovered ? "var(--color-maroon)" : "var(--color-body)",
                    margin: "0.75rem 0 0.15rem",
                    lineHeight: 1.2,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    transition: "color 0.2s ease",
                    textAlign: "center",
                  }}
                >
                  {cat.name}
                </p>

                {/* Description */}
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.72rem",
                    color: "var(--color-muted)",
                    margin: 0,
                    lineHeight: 1.3,
                    textAlign: "center",
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
