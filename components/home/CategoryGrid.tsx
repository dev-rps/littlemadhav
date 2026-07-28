"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const categories = [
  {
    name: "Devotees collection",
    slug: "devotees-collection",
    imageUrl: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&q=80",
    desc: "Divine Combos",
  },
  {
    name: "Laddu Gopal Dresses",
    slug: "laddu-gopal-dresses",
    imageUrl: "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=400&q=80",
    desc: "Luxe & Pastel Dresses",
  },
  {
    name: "Festive Home Decor",
    slug: "festive-home-decor",
    imageUrl: "https://images.unsplash.com/photo-1587467512961-120760940315?w=400&q=80",
    desc: "Torans & Rangolis",
  },
  {
    name: "Festive Products",
    slug: "festive-products",
    imageUrl: "https://images.unsplash.com/photo-1627130942770-e78c9d5b8f4e?w=400&q=80",
    desc: "Janmashtami & Diwali",
  },
  {
    name: "Jewellery & Accessories",
    slug: "jewellery-accessories",
    imageUrl: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=400&q=80",
    desc: "Bansuri & Ornaments",
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
              fontFamily: "var(--font-body, Lato, sans-serif)",
              fontSize: "0.8rem",
              color: "var(--color-gold-dark)",
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
              fontFamily: "var(--font-display, Lato, sans-serif)",
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
                    border: isHovered ? "2.5px solid var(--color-maroon)" : "1.5px solid var(--color-gold-light)",
                    padding: "4px",
                    backgroundColor: "var(--color-white)",
                    transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                    boxShadow: isHovered 
                      ? "var(--shadow-hover)" 
                      : "0 2px 10px rgba(102, 13, 25, 0.05)",
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
                      backgroundColor: "var(--color-cream-alt)",
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
                    fontFamily: "var(--font-display, Lato, sans-serif)",
                    fontSize: "0.95rem",
                    color: isHovered ? "var(--color-maroon)" : "var(--color-black)",
                    margin: "0.85rem 0 0.15rem",
                    lineHeight: 1.2,
                    fontWeight: 700,
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
                    fontFamily: "var(--font-body, Lato, sans-serif)",
                    fontSize: "0.75rem",
                    color: "var(--color-taupe)",
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
