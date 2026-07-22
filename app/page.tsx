import type { Metadata } from "next";
import HeroCarousel from "@/components/home/HeroCarousel";
import TrustStrip from "@/components/home/TrustStrip";
import CategoryGrid from "@/components/home/CategoryGrid";
import BestsellersSection from "@/components/home/BestsellersSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import FestiveSpecials from "@/components/home/FestiveSpecials";
import Link from "next/link";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "RangRiwaaz — Handcrafted Rakhi, Jhumka & Festive Jewellery",
  description:
    "Shop beautiful handcrafted Rakhi, Jhumka earrings, and festive jewellery. Trusted by 10,000+ customers. COD available. Pan-India delivery. Free shipping above ₹499.",
};

function ProductsSkeleton() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", padding: "4rem 0" }}>
      {[...Array(4)].map((_, i) => (
        <div key={i} style={{ borderRadius: "1rem", backgroundColor: "#F5EDE0", aspectRatio: "3/4", animation: "pulse-soft 2s ease-in-out infinite" }} />
      ))}
    </div>
  );
}

// Festival banner between sections
function FestivalBanner() {
  return (
    <section
      style={{
        padding: "2.5rem 0",
        background: "linear-gradient(135deg, #FEF9EC, #FFF8F0)",
        borderTop: "1px solid #F0E0C0",
        borderBottom: "1px solid #F0E0C0",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(1, 1fr)",
            gap: "1rem",
          }}
          className="sm:grid-cols-3"
        >
          {[
            {
              icon: "🎀",
              title: "Raksha Bandhan Ready",
              desc: "Ships before the festival — guaranteed",
              cta: "Shop Rakhi",
              href: "/collections/rakhi",
              color: "#8B1E3F",
            },
            {
              icon: "🪔",
              title: "Diwali Gifting",
              desc: "Jewellery hampers loved by everyone",
              cta: "Shop Hampers",
              href: "/collections/gifting",
              color: "#D4A017",
            },
            {
              icon: "💃",
              title: "Navratri Collection",
              desc: "Bold, colorful jhumkas for garba night",
              cta: "Shop Jhumkas",
              href: "/collections/jhumka",
              color: "#E76F51",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="hover:border-gold hover:shadow-[0_4px_20px_rgba(212,160,23,0.12)] transition-all duration-300"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "1.25rem",
                backgroundColor: "#FFFBF5",
                borderRadius: "0.875rem",
                border: "1px solid #F0E0C0",
              }}
            >
              <span style={{ fontSize: "2.5rem", flexShrink: 0 }}>{item.icon}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: "var(--font-display, 'Yeseva One', serif)", color: item.color, fontSize: "1rem", margin: "0 0 0.2rem" }}>
                  {item.title}
                </p>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "#666", margin: "0 0 0.5rem" }}>
                  {item.desc}
                </p>
                <Link
                  href={item.href}
                  style={{
                    fontFamily: "var(--font-body)",
                    fontWeight: 600,
                    fontSize: "0.78rem",
                    color: item.color,
                    textDecoration: "none",
                    borderBottom: `1px solid ${item.color}`,
                    paddingBottom: "0.1rem",
                  }}
                >
                  {item.cta} →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      {/* 1. Hero */}
      <HeroCarousel />

      {/* 2. Trust Strip */}
      <TrustStrip />

      {/* 3. Category Grid */}
      <CategoryGrid />

      {/* 4. Festival Banner */}
      <FestivalBanner />

      {/* 4.5 Festive Specials */}
      <FestiveSpecials />

      {/* 5. Bestsellers (server component, fetches from DB) */}
      <Suspense fallback={<ProductsSkeleton />}>
        <BestsellersSection />
      </Suspense>

      {/* 6. Testimonials */}
      <TestimonialsSection />

      {/* 7. Instagram Strip Placeholder */}
      <section style={{ padding: "3.5rem 0", backgroundColor: "#FFFBF5" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "#D4A017", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 600 }}>
              @rangriwaaz
            </p>
            <h2 style={{ fontFamily: "var(--font-display, 'Yeseva One', serif)", fontSize: "1.75rem", color: "#8B1E3F", margin: "0.25rem 0 0" }}>
              Follow Our Journey on Instagram 📸
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem" }} className="sm:grid-cols-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="hover:opacity-80 transition-opacity duration-200"
                style={{
                  aspectRatio: "1",
                  backgroundColor: i % 2 === 0 ? "#F9D6E1" : "#FCF0C5",
                  borderRadius: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "2rem",
                  cursor: "pointer",
                }}
              >
                {["🎀", "💎", "🪔", "🎁", "✨", "🌸"][i]}
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "1.25rem" }}>
            <a
              href="https://instagram.com/rangriwaaz"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                padding: "0.625rem 1.5rem",
                border: "1.5px solid #8B1E3F",
                color: "#8B1E3F",
                borderRadius: "0.5rem",
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                fontSize: "0.875rem",
                textDecoration: "none",
                transition: "all 0.2s",
              }}
            >
              Follow @rangriwaaz →
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
