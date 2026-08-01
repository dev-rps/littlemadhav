"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const categories = [
  {
    name: "Devotees collection",
    slug: "devotees-collection",
    desc: "Divine Combos",
    imageUrl: "/products/devotees/img1.jpg",
  },
  {
    name: "Laddu Gopal Dresses",
    slug: "laddu-gopal-dresses",
    desc: "Luxe & Pastel Dresses",
    imageUrl: "/products/dresses/img1.jpg",
  },
  {
    name: "Festive Home Decor",
    slug: "festive-home-decor",
    desc: "Torans & Rangolis",
    imageUrl: "/products/decor/img1.jpg",
  },
  {
    name: "Festive Products",
    slug: "festive-products",
    desc: "Janmashtami & Diwali",
    imageUrl: "/products/festive/img1.jpg",
  },
  {
    name: "Jewellery & Accessories",
    slug: "jewellery-accessories",
    desc: "Bansuri & Ornaments",
    imageUrl: "/products/jewellery/img1.jpg",
  },
  {
    name: "Bandhanwal & Torans",
    slug: "torans-bandhanwal",
    desc: "Door Hangings",
    imageUrl: "/products/bandhanwal/img1.jpg",
  },
  {
    name: "Radha Rani Dresses",
    slug: "radha-rani-dresses",
    desc: "Divine Poshaak",
    imageUrl: "/products/radharani/img1.jpg",
  },
  {
    name: "Upcoming Festival",
    slug: "upcoming",
    desc: "Teej & Rakhi Special",
    imageUrl: "/products/upcoming/img1.jpg",
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

        {/* Circular Categories Grid with Real Photos */}
        <div
          style={{
            display: "grid",
            gap: "2rem 1.5rem",
            justifyItems: "center",
          }}
          className="grid-cols-2 sm:grid-cols-4 lg:grid-cols-4"
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
                  maxWidth: "160px",
                }}
                onMouseEnter={() => setHoveredSlug(cat.slug)}
                onMouseLeave={() => setHoveredSlug(null)}
              >
                {/* Gold ring circle with real categorised product photo */}
                <div
                  style={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    border: isHovered ? "3px solid var(--color-maroon)" : "2px solid var(--color-gold)",
                    padding: "4px",
                    backgroundColor: "var(--color-white)",
                    transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                    boxShadow: isHovered
                      ? "0 10px 25px rgba(102, 13, 25, 0.18)"
                      : "0 4px 14px rgba(102, 13, 25, 0.06)",
                    transform: isHovered ? "translateY(-6px) scale(1.03)" : "translateY(0)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Real Image Container */}
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      overflow: "hidden",
                      position: "relative",
                      backgroundColor: "#F4E8DB",
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
                    fontFamily: "var(--font-body)",
                    fontSize: "0.85rem",
                    color: isHovered ? "var(--color-maroon)" : "var(--color-black)",
                    margin: "0.85rem 0 0.15rem",
                    lineHeight: 1.25,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
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
                    fontSize: "0.75rem",
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
