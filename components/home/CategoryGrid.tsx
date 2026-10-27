"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const categories = [
  {
    name: "Bandarwar & Toran",
    slug: "bandarwar-toran",
    desc: "Door Hangings",
    imageUrl: "/products/bandarwar-toran/p1-1.jpg",
    available: true,
  },
  {
    name: "Table Runner",
    slug: "table-runner",
    desc: "Festive Table Decor",
    imageUrl: "/products/table-runner/p1-1.jpg",
    available: true,
  },
  {
    name: "Karva Chauth Thaali",
    slug: "karva-chauth-thaali",
    desc: "Puja Thali Sets",
    imageUrl: "/products/karva-chauth-thaali/p1-1.jpeg",
    available: true,
  },
  {
    name: "Laddu Gopal Dresses",
    slug: "laddu-gopal-dresses",
    desc: "Luxe & Pastel Dresses",
    imageUrl: "/products/dresses/img1.jpg",
    available: false,
  },
  {
    name: "Jewellery & Accessories",
    slug: "jewellery-accessories",
    desc: "Bansuri & Ornaments",
    imageUrl: "/products/jewellery/img1.jpg",
    available: false,
  },
  {
    name: "Devotees Collection",
    slug: "devotees-collection",
    desc: "Divine Combos",
    imageUrl: "/products/devotees/img1.jpg",
    available: false,
  },
  {
    name: "Radha Rani Dresses",
    slug: "radha-rani-dresses",
    desc: "Divine Poshaak",
    imageUrl: "/products/radharani/img1.jpg",
    available: false,
  },
  {
    name: "Festive Home Decor",
    slug: "festive-home-decor",
    desc: "Torans & Rangolis",
    imageUrl: "/products/decor/img1.jpg",
    available: false,
  },
];

export default function CategoryGrid() {
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  return (
    <section style={{ padding: "4rem 0", backgroundColor: "var(--color-cream)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "var(--color-gold)", textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 700, marginBottom: "0.5rem" }}>
            Devotional &amp; Festive Collections
          </p>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.75rem, 4vw, 2.35rem)", color: "var(--color-maroon)", margin: 0, fontWeight: 700 }}>
            Shop by Category
          </h2>
        </div>

        <hr className="divider-gold" style={{ marginBottom: "3rem" }} />

        <div style={{ display: "grid", gap: "2rem 1.5rem", justifyItems: "center" }} className="grid-cols-2 sm:grid-cols-4 lg:grid-cols-4">
          {categories.map((cat) => {
            const isHovered = hoveredSlug === cat.slug;
            const isAvailable = cat.available;

            const circleContent = (
              <>
                <div
                  style={{
                    width: "120px", height: "120px", borderRadius: "50%",
                    border: isHovered && isAvailable ? "3px solid var(--color-maroon)" : isAvailable ? "2px solid var(--color-gold)" : "2px dashed rgba(186,172,157,0.5)",
                    padding: "4px", backgroundColor: "var(--color-white)",
                    transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                    boxShadow: isHovered && isAvailable ? "0 10px 25px rgba(102, 13, 25, 0.18)" : "0 4px 14px rgba(102, 13, 25, 0.06)",
                    transform: isHovered && isAvailable ? "translateY(-6px) scale(1.03)" : "translateY(0)",
                    position: "relative", overflow: "hidden",
                  }}
                >
                  <div style={{ width: "100%", height: "100%", borderRadius: "50%", overflow: "hidden", position: "relative", backgroundColor: "#F4E8DB" }}>
                    <Image
                      src={cat.imageUrl} alt={cat.name} fill sizes="120px"
                      style={{
                        objectFit: "cover", transition: "transform 0.5s ease",
                        transform: isHovered && isAvailable ? "scale(1.12)" : "scale(1)",
                        filter: isAvailable ? "none" : "grayscale(60%) opacity(0.7)",
                      }}
                    />
                  </div>
                  {!isAvailable && (
                    <div style={{
                      position: "absolute", bottom: "6px", left: "50%", transform: "translateX(-50%)",
                      backgroundColor: "rgba(102,13,25,0.9)", color: "#fff",
                      fontSize: "0.48rem", fontFamily: "var(--font-body)", fontWeight: 800,
                      letterSpacing: "0.1em", padding: "2px 7px", borderRadius: "9999px",
                      whiteSpace: "nowrap", textTransform: "uppercase",
                    }}>
                      Coming Soon
                    </div>
                  )}
                </div>

                <p style={{
                  fontFamily: "var(--font-body)", fontSize: "0.85rem",
                  color: isHovered && isAvailable ? "var(--color-maroon)" : isAvailable ? "var(--color-black)" : "var(--color-taupe)",
                  margin: "0.85rem 0 0.15rem", lineHeight: 1.25, fontWeight: 700,
                  textTransform: "uppercase", letterSpacing: "0.05em",
                  transition: "color 0.2s ease", textAlign: "center",
                }}>
                  {cat.name}
                </p>

                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: isAvailable ? "var(--color-muted)" : "rgba(186,172,157,0.7)", margin: 0, lineHeight: 1.3, textAlign: "center" }}>
                  {isAvailable ? cat.desc : "Coming Soon"}
                </p>
              </>
            );

            if (isAvailable) {
              return (
                <Link key={cat.slug} href={"/collections/" + cat.slug} id={"cat-card-" + cat.slug}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", textDecoration: "none", cursor: "pointer", width: "100%", maxWidth: "160px" }}
                  onMouseEnter={() => setHoveredSlug(cat.slug)} onMouseLeave={() => setHoveredSlug(null)}>
                  {circleContent}
                </Link>
              );
            }

            return (
              <div key={cat.slug} id={"cat-card-" + cat.slug}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", textDecoration: "none", cursor: "default", width: "100%", maxWidth: "160px", opacity: 0.75 }}
                onMouseEnter={() => setHoveredSlug(cat.slug)} onMouseLeave={() => setHoveredSlug(null)}>
                {circleContent}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}