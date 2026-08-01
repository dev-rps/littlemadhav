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
  title: "Mourika — Handcrafted Deity Dresses, Festive Decor & Shringar",
  description:
    "Shop beautiful handcrafted Bal Gopal dresses, festive home decor, and deity shringar accessories. Trusted by thousands. COD available. Free shipping above ₹499.",
};

function ProductsSkeleton() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", padding: "4rem 0" }}>
      {[...Array(4)].map((_, i) => (
        <div key={i} className="skeleton" style={{ aspectRatio: "4/5" }} />
      ))}
    </div>
  );
}

// Festival banner between sections
function FestivalBanner() {
  const festivalCards = [
    {
      icon: "🎀",
      title: "Raksha Bandhan Ready",
      desc: "Ships before the festival — guaranteed",
      cta: "Shop Rakhi",
      href: "/collections/rakhi",
      gradient: "linear-gradient(135deg, #660D19 0%, #8B1E3F 100%)",
    },
    {
      icon: "🪔",
      title: "Diwali Gifting",
      desc: "Festive home decor loved by everyone",
      cta: "Shop Decor",
      href: "/collections/festive-home-decor",
      gradient: "linear-gradient(135deg, #CD9703 0%, #D5AD36 100%)",
    },
    {
      icon: "💎",
      title: "Jewellery & Accessories",
      desc: "Elegant deity shringar for every occasion",
      cta: "Shop Jewellery",
      href: "/collections/jewellery-accessories",
      gradient: "linear-gradient(135deg, #357C49 0%, #4A9D5E 100%)",
    },
  ];

  return (
    <section style={{ padding: "3rem 0", backgroundColor: "var(--color-cream-alt)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(1, 1fr)",
            gap: "1rem",
          }}
          className="sm:grid-cols-3"
        >
          {festivalCards.map((item) => (
            <div
              key={item.title}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "1.5rem",
                background: item.gradient,
                borderRadius: "18px",
                transition: "all 0.3s ease",
                cursor: "pointer",
                minHeight: "120px",
              }}
            >
              <span style={{ fontSize: "2.5rem", flexShrink: 0, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}>{item.icon}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: "var(--font-display)", color: "#FFFFFF", fontSize: "1.05rem", margin: "0 0 0.25rem", fontWeight: 700 }}>
                  {item.title}
                </p>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "rgba(255,255,255,0.8)", margin: "0 0 0.6rem" }}>
                  {item.desc}
                </p>
                <Link
                  href={item.href}
                  style={{
                    fontFamily: "var(--font-body)",
                    fontWeight: 700,
                    fontSize: "0.78rem",
                    color: "#FFFFFF",
                    textDecoration: "none",
                    backgroundColor: "rgba(255,255,255,0.2)",
                    padding: "0.35rem 0.85rem",
                    borderRadius: "9999px",
                    border: "1px solid rgba(255,255,255,0.3)",
                    display: "inline-block",
                    transition: "all 0.2s",
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

      {/* 7. Instagram Strip */}
      <section style={{ padding: "3.5rem 0", backgroundColor: "var(--color-cream-alt)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "var(--color-gold)", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700 }}>
              @mourika
            </p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", color: "var(--color-maroon)", margin: "0.25rem 0 0" }}>
              Follow Our Journey on Instagram 📸
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem" }} className="sm:grid-cols-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                style={{
                  aspectRatio: "1",
                  background: i % 2 === 0
                    ? "linear-gradient(145deg, #FBD5CD, #F4E8DB)"
                    : "linear-gradient(145deg, #FBF3E9, #F4E8DB)",
                  borderRadius: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "2rem",
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                }}
              >
                {["🎀", "💎", "🪔", "🎁", "✨", "🌸"][i]}
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
            <a
              href="https://instagram.com/mourika"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
              style={{ display: "inline-block" }}
            >
              Follow @mourika →
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
